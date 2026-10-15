#!/usr/bin/env node
/**
 * Bundle budget report (§5 of the spec).
 *
 * Next 16 + Turbopack no longer print per-route JS sizes (and don't emit
 * app-build-manifest.json), so we parse the prerendered HTML in
 * `.next/server/app/**` for `<script src>` and stylesheet links — the exact
 * set a browser loads before hydration. Lazily-imported chunks (the 3D scene)
 * are fetched after capability detection, so they're reported separately.
 *
 * Budget: initial JS excluding the 3D chunk <= 250 KB gzip.
 *
 * Usage: pnpm build && node scripts/measure-bundle.mjs
 */
import { createReadStream, promises as fs } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { createGzip } from "node:zlib";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const nextDir = join(root, ".next");
const chunksDir = join(nextDir, "static", "chunks");
const BUDGET = 250 * 1024; // 250 KB gzip
const kb = (n) => `${(n / 1024).toFixed(1)} KB`;

async function walk(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true }).catch(() => [])) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

async function gzipOf(file) {
  const gz = createReadStream(file).pipe(createGzip({ level: 9 }));
  const chunks = [];
  for await (const chunk of gz) chunks.push(chunk);
  return Buffer.concat(chunks).length;
}

const sizeCache = new Map();
async function sizeOf(relFromNext) {
  if (sizeCache.has(relFromNext)) return sizeCache.get(relFromNext);
  const full = join(nextDir, relFromNext);
  let result = null;
  try {
    const raw = (await fs.stat(full)).size;
    result = { raw, gz: relFromNext.endsWith(".js") ? await gzipOf(full) : raw };
  } catch {
    result = null;
  }
  sizeCache.set(relFromNext, result);
  return result;
}

// ── 1. Collect initial assets per route from prerendered HTML ───────────────
const htmlFiles = (await walk(join(nextDir, "server", "app"))).filter((f) =>
  f.endsWith(".html"),
);

const routeRows = [];
const initialAssets = new Set();

for (const file of htmlFiles) {
  const html = await fs.readFile(file, "utf8");
  const route = relative(join(nextDir, "server", "app"), file).replace(/\.html$/, "");
  const assets = new Set();

  // Only count scripts a MODERN browser actually downloads. Next marks the
  // legacy core-js polyfill bundle with noModule, which every browser we
  // target (Chrome 100+, Safari 15+, Firefox 100+) ignores entirely.
  for (const m of html.matchAll(/<script([^>]*)src="(\/_next\/[^"]+\.js)"([^>]*)>/g)) {
    const attrs = `${m[1]}${m[3]}`;
    if (/noModule/i.test(attrs)) continue;
    assets.add(m[2].replace(/^\/_next\//, ""));
  }
  for (const m of html.matchAll(
    /<link[^>]+rel="stylesheet"[^>]+href="(\/_next\/[^"]+)"/g,
  )) {
    assets.add(m[1].replace(/^\/_next\//, ""));
  }
  for (const m of html.matchAll(
    /<link[^>]+as="script"[^>]+href="(\/_next\/[^"]+\.js)"/g,
  )) {
    assets.add(m[1].replace(/^\/_next\//, ""));
  }

  let gz = 0;
  let raw = 0;
  let jsGz = 0;
  let cssRaw = 0;
  for (const asset of assets) {
    initialAssets.add(asset);
    const s = await sizeOf(asset);
    if (!s) continue;
    raw += s.raw;
    gz += s.gz;
    if (asset.endsWith(".js")) jsGz += s.gz;
    else cssRaw += s.raw;
  }
  routeRows.push({
    route: "/" + route.replace(/\/index$/, ""),
    gz,
    jsGz,
    raw,
    cssRaw,
    count: assets.size,
  });
}

// Dedupe: each route appears once (index.html / route.html).
const byRoute = new Map();
for (const row of routeRows) if (!byRoute.has(row.route)) byRoute.set(row.route, row);
const rows = [...byRoute.values()].sort((a, b) => b.gz - a.gz);

// ── 2. Lazy chunks (not referenced by any prerendered HTML) ─────────────────
const allChunks = await walk(chunksDir);
const lazy = [];
for (const full of allChunks) {
  const rel = relative(nextDir, full);
  if (!rel.endsWith(".js") || initialAssets.has(rel)) continue;
  const s = await sizeOf(rel);
  if (!s) continue;
  // Identify the 3D scene by content, not filename — Turbopack hashes names.
  const head = await fs.readFile(full, "utf8").then((t) => t.slice(0, 200_000));
  const three = /WebGLRenderer|THREE\.|react-three|postprocessing/i.test(head);
  lazy.push({ rel, ...s, three });
}
const threeLazy = lazy.filter((c) => c.three);
const otherLazy = lazy.filter((c) => !c.three);
const sum = (list, key) => list.reduce((a, b) => a + (b[key] ?? 0), 0);

// ── 3. Report ───────────────────────────────────────────────────────────────
console.log("Bundle size report — initial JS per route (gzip)");
console.log("─".repeat(74));
for (const row of rows) {
  console.log(
    `  JS ${kb(row.jsGz).padStart(9)}  total ${kb(row.gz).padStart(9)}  ${row.route}`,
  );
}

const worstJs = [...rows].sort((a, b) => b.jsGz - a.jsGz)[0];
const home = byRoute.get("/") ?? rows.find((r) => r.route === "/");

console.log("─".repeat(74));
console.log(`  Worst initial JS: ${worstJs.route} — ${kb(worstJs.jsGz)} gz`);
if (home) console.log(`  Home initial JS:  ${kb(home.jsGz)} gz (CSS ${kb(home.cssRaw)})`);
console.log(
  `  3D lazy chunks:    ${kb(sum(threeLazy, "gz"))} gz across ${threeLazy.length} files (outside budget)`,
);
console.log(
  `  Other lazy chunks: ${kb(sum(otherLazy, "gz"))} gz across ${otherLazy.length} files`,
);

const ok = worstJs.jsGz <= BUDGET;
console.log("─".repeat(74));
console.log(
  `  Budget 250 KB gz (initial JS): ${ok ? "PASS" : "FAIL"} — worst ${kb(worstJs.jsGz)}`,
);
process.exit(ok ? 0 : 2);
