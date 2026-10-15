#!/usr/bin/env node
/**
 * QA harness (§5, §8 of the spec).
 *
 * Requires a production server on QA_BASE (default http://localhost:3100):
 *   pnpm build && pnpm start --port 3100 &
 *   node scripts/qa.mjs
 *
 * Covers, in one pass:
 *   1. Lighthouse (mobile: 4x CPU + Slow 4G — Lighthouse's defaults) on the
 *      home page and every content page, checking the agreed score targets.
 *   2. Viewport screenshots at 360 / 768 / 1280 / 1920 px.
 *   3. prefers-reduced-motion: reduced — the static poster hero must render,
 *      no WebGL canvas may mount.
 *   4. WebGL disabled (via Chromium flag) — the static poster hero must render.
 *
 * Writes artefacts to .qa/ (gitignored).
 */
import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const outDir = join(root, ".qa");
const BASE = process.env.QA_BASE ?? "http://127.0.0.1:3100";

const CONTENT_ROUTES = [
  ["home", "/"],
  ["about", "/about"],
  ["plan-your-visit", "/plan-your-visit"],
  ["live", "/live"],
  ["sermons", "/sermons"],
  ["sermons-detail", "/sermons/sermon-title-01"],
  ["events", "/events"],
  ["events-detail", "/events/event-name-01"],
  ["ministries", "/ministries"],
  ["ministries-detail", "/ministries/children"],
  ["give", "/give"],
  ["contact", "/contact"],
  ["privacy", "/privacy"],
];

const VIEWPORTS = [
  ["360", 360, 780, 2],
  ["768", 768, 1024, 2],
  ["1280", 1280, 800, 1],
  ["1920", 1920, 1080, 1],
];

// Spec targets. Home is allowed 80+ because of the 3D hero.
const TARGETS = {
  home: { performance: 80, accessibility: 95, seo: 100, bestPractices: 95 },
  default: { performance: 90, accessibility: 95, seo: 100, bestPractices: 95 },
};

const failures = [];
const notes = [];

// Lighthouse 13 can raise an unhandled rejection (e.g. "Target closed") from
// an internal async path AFTER the awaited promise has settled. Without this
// guard Node kills the whole run on the first flake; the per-page retry in
// main() is what actually recovers.
process.on("unhandledRejection", (reason) => {
  const msg = reason instanceof Error ? reason.message : String(reason);
  notes.push(`suppressed unhandled rejection: ${msg.slice(0, 120)}`);
});

function log(msg) {
  process.stdout.write(`${msg}\n`);
}

async function waitForServer(url, timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { redirect: "manual" });
      if (res.status < 500) return true;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  return false;
}

/* ── 1. Lighthouse ─────────────────────────────────────────────────────── */
let chromePortSeq = 9400;

async function withChrome(fn, args = []) {
  const { chromium } = await import("playwright");
  const chromeBin = await chromium.executablePath();
  // Sequential ports (not random) so a leftover Chrome can't collide, and
  // we never reuse a port that a just-killed instance still holds.
  const port = chromePortSeq++;
  const chrome = spawn(
    chromeBin,
    [
      "--headless=new",
      "--no-sandbox",
      "--disable-dev-shm-usage",
      `--remote-debugging-port=${port}`,
      "--remote-debugging-address=127.0.0.1",
      "about:blank",
      ...args,
    ],
    { stdio: "ignore" },
  );
  try {
    const deadline = Date.now() + 20_000;
    for (;;) {
      try {
        const res = await fetch(`http://127.0.0.1:${port}/json/version`);
        if (res.ok) break;
      } catch {
        // not up yet
      }
      if (Date.now() > deadline) throw new Error(`Chromium never came up on ${port}`);
      await new Promise((r) => setTimeout(r, 250));
    }
    return await fn(port);
  } finally {
    chrome.kill("SIGKILL");
    // give the OS a beat to release the port before any reuse
    await new Promise((r) => setTimeout(r, 150));
  }
}

async function runLighthouse(url, wsPort) {
  const { default: lighthouse } = await import("lighthouse");

  const result = await lighthouse(url, {
    port: wsPort,
    output: "json",
    logLevel: "error",
    // Lighthouse mobile defaults ARE the spec's requirement:
    // simulated 4x CPU slowdown + Slow 4G.
    formFactor: "mobile",
    screenEmulation: { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75 },
    throttling: {
      rttMs: 150,
      throughputKbps: 1638.4,
      cpuSlowdownMultiplier: 4,
      requestOverheadMs: 150,
      simultaneousRequestLimit: 2,
    },
  });
  const lhr = result.lhr;
  return {
    performance: Math.round((lhr.categories.performance?.score ?? 0) * 100),
    accessibility: Math.round((lhr.categories.accessibility?.score ?? 0) * 100),
    seo: Math.round((lhr.categories.seo?.score ?? 0) * 100),
    bestPractices: Math.round((lhr.categories["best-practices"]?.score ?? 0) * 100),
    lcp: lhr.audits["largest-contentful-paint"]?.numericValue ?? null,
    cls: lhr.audits["cumulative-layout-shift"]?.numericValue ?? null,
    fcp: lhr.audits["first-contentful-paint"]?.numericValue ?? null,
    tbt: lhr.audits["total-blocking-time"]?.numericValue ?? null,
    // Only audits that belong to the accessibility category (the naive
    // "score < 1" filter also caught best-practice audits like source maps).
    a11yAudits: Object.values(lhr.categories.accessibility?.auditRefs ?? [])
      .map((ref) => lhr.audits[ref.id])
      .filter(
        (a) => a && a.score !== null && a.score < 1 && a.scoreDisplayMode === "binary",
      )
      .map((a) => ({
        id: a.id,
        title: a.title,
        nodes: (a.details?.items ?? []).slice(0, 4).map((it) => ({
          node:
            it.node?.explanation ??
            it.node?.selector ??
            (typeof it.node?.snippet === "string" ? it.node.snippet.slice(0, 200) : ""),
        })),
      })),
    // Top main-thread culprits so perf failures are actionable.
    bootup: (lhr.audits["bootup-time"]?.details?.items ?? [])
      .slice(0, 5)
      .map((it) => ({ url: (it.url ?? "").slice(-60), ms: Math.round(it.total ?? 0) })),
  };
}

/* ── 2. Screenshots ────────────────────────────────────────────────────── */
async function shootViewports() {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch({
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  try {
    for (const [label, width, height, dsf] of VIEWPORTS) {
      const ctx = await browser.newContext({
        viewport: { width, height },
        deviceScaleFactor: dsf,
      });
      const page = await ctx.newPage();
      for (const [name, path] of CONTENT_ROUTES) {
        await page.goto(`${BASE}${path}`, { waitUntil: "networkidle", timeout: 45_000 });
        // let entrance animations settle so screenshots are comparable
        await page.waitForTimeout(900);
        await page.screenshot({
          path: join(outDir, "screenshots", `${label}-${name}.png`),
          fullPage: false,
        });
      }
      await ctx.close();
      log(`  viewport ${label}px: ${CONTENT_ROUTES.length} screenshots`);
    }
  } finally {
    await browser.close();
  }
}

/* ── 3 & 4. Reduced motion + no-WebGL fallbacks ────────────────────────── */
async function checkFallbacks() {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch({
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  try {
    // 3. prefers-reduced-motion: reduce
    {
      const ctx = await browser.newContext({
        viewport: { width: 390, height: 844 },
        reducedMotion: "reduce",
      });
      const page = await ctx.newPage();
      await page.goto(`${BASE}/`, { waitUntil: "networkidle", timeout: 45_000 });
      await page.waitForTimeout(800);
      const canvasCount = await page.locator("canvas").count();
      const hasPoster = await page
        .locator("#hero")
        .count()
        .then((n) => n > 0);
      const h1 = await page.locator("h1").first().innerText();
      await page.screenshot({ path: join(outDir, "fallback-reduced-motion.png") });
      if (canvasCount > 0) {
        failures.push("reduced-motion: a <canvas> still mounted (3D should be skipped)");
      }
      if (!hasPoster || !h1.includes("Citadel")) {
        failures.push("reduced-motion: hero poster or headline missing");
      } else {
        log(`  reduced-motion: poster hero OK, h1="${h1.replace(/\s+/g, " ").trim()}"`);
      }
      // The pause toggle must exist and be operable. Under reduced motion it
      // correctly starts in the paused state, so it reads "Play animation".
      const toggle = page.locator("button", { hasText: /animation/i });
      if (!(await toggle.count())) {
        failures.push("reduced-motion: Pause/Play animation toggle not found");
      } else {
        const label = (await toggle.first().innerText()).trim();
        // With reduced motion we expect it to start paused.
        if (!/play animation/i.test(label)) {
          failures.push(
            `reduced-motion: toggle reads "${label}" but should start paused ("Play animation")`,
          );
        } else {
          log(
            `  Pause animation toggle: starts paused under reduced motion (label "${label}")`,
          );
        }
        await toggle.first().click();
        const running = await page.locator("html").getAttribute("data-motion");
        if (running !== "running") {
          failures.push("pause toggle: clicking Play did not set data-motion=running");
        } else {
          log("  Pause animation toggle: click Play sets data-motion=running OK");
        }
        const afterLabel = (await toggle.first().innerText()).trim();
        if (!/pause animation/i.test(afterLabel)) {
          failures.push(`pause toggle: label did not switch (still "${afterLabel}")`);
        }
        await toggle.first().click(); // back to paused for the screenshot
      }
      await ctx.close();
    }

    // 4. WebGL disabled — launch a fresh browser with WebGL blocked.
  } finally {
    await browser.close();
  }

  const noGl = await chromium.launch({
    args: [
      "--no-sandbox",
      "--disable-dev-shm-usage",
      // Headless Chromium's SwiftShader is the only GL here; disable both
      // backends so getContext("webgl") returns null, like an old phone.
      "--disable-webgl",
      "--disable-webgl2",
      "--disable-3d-apis",
    ],
  });
  try {
    const ctx = await noGl.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/`, { waitUntil: "networkidle", timeout: 45_000 });
    await page.waitForTimeout(1200);
    const canvasCount = await page.locator("canvas").count();
    const h1 = await page.locator("h1").first().innerText();
    await page.screenshot({ path: join(outDir, "fallback-no-webgl.png") });
    if (canvasCount > 0) {
      failures.push("no-WebGL: a <canvas> mounted despite WebGL being unavailable");
    }
    if (!h1.includes("Citadel")) {
      failures.push("no-WebGL: hero headline missing");
    } else {
      log(`  no-WebGL: static poster hero OK, h1="${h1.replace(/\s+/g, " ").trim()}"`);
    }
    await ctx.close();
  } finally {
    await noGl.close();
  }
}

/* ── main ──────────────────────────────────────────────────────────────── */
async function main() {
  await fs.mkdir(join(outDir, "screenshots"), { recursive: true });

  const up = await waitForServer(BASE);
  if (!up) {
    console.error(`No server at ${BASE}.\nRun: pnpm build && pnpm start --port 3100`);
    process.exit(1);
  }

  const CDP_PORT = Number(process.env.QA_CDP_PORT ?? 9222);
  void CDP_PORT;

  log(`QA against ${BASE}\n`);

  log("1. Lighthouse (mobile profile: 4x CPU + Slow 4G)");
  const lh = [];
  {
    for (const [name, path] of CONTENT_ROUTES) {
      // One fresh Chrome per page + one retry: a crashed browser then only
      // loses that page instead of aborting the whole run.
      let r = null;
      for (let attempt = 1; attempt <= 2 && !r; attempt++) {
        try {
          r = await withChrome((port) => runLighthouse(`${BASE}${path}`, port));
        } catch (err) {
          if (attempt === 2) {
            failures.push(`lighthouse ${name}: crashed — ${err.message}`);
            log(`  ${name.padEnd(18)} CRASH ${err.message}`);
          }
        }
      }
      if (!r) continue;
      lh.push([name, r]);
      const t = name === "home" ? TARGETS.home : TARGETS.default;
      const problems = [];
      if (r.performance < t.performance)
        problems.push(`perf ${r.performance}<${t.performance}`);
      if (r.accessibility < t.accessibility)
        problems.push(`a11y ${r.accessibility}<${t.accessibility}`);
      if (r.seo < t.seo) problems.push(`seo ${r.seo}<${t.seo}`);
      if (r.bestPractices < t.bestPractices)
        problems.push(`bp ${r.bestPractices}<${t.bestPractices}`);
      const lcp = r.lcp ? `${(r.lcp / 1000).toFixed(2)}s` : "n/a";
      const cls = r.cls !== null ? r.cls.toFixed(3) : "n/a";
      const flag = problems.length ? `  FAIL ${problems.join(", ")}` : "  ok";
      log(
        `  ${name.padEnd(18)} P${r.performance} A${r.accessibility} S${r.seo} BP${r.bestPractices}  LCP ${lcp} CLS ${cls}${flag}`,
      );
      if (problems.length) failures.push(`lighthouse ${name}: ${problems.join(", ")}`);
      if (r.lcp !== null && r.lcp > 2500) {
        notes.push(`${name}: LCP ${(r.lcp / 1000).toFixed(2)}s > 2.5s budget`);
      }
      if (r.cls !== null && r.cls > 0.05) {
        failures.push(`${name}: CLS ${r.cls.toFixed(3)} > 0.05 budget`);
      }
      for (const a of r.a11yAudits) {
        const where = a.nodes[0]?.node ?? "";
        notes.push(`${name}: a11y ${a.id} — ${where.slice(0, 120)}`);
      }
    }
  }

  await fs.writeFile(join(outDir, "lighthouse.json"), JSON.stringify(lh, null, 2));

  log("\n2. Viewport screenshots");
  await shootViewports();

  log("\n3. Fallback checks (reduced motion, no WebGL)");
  await checkFallbacks();

  log("\n──────────────────────────────────────────────");
  if (notes.length) {
    log("Notes:");
    for (const n of notes) log(`  · ${n}`);
  }
  if (failures.length) {
    log("FAILURES:");
    for (const f of failures) log(`  ✗ ${f}`);
    process.exit(2);
  }
  log("All QA checks passed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
