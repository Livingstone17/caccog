/**
 * Generates web assets from brand/logo-master.jpg (the church's official
 * lockup, black background JPEG):
 *
 *   public/logo.png          full lockup, black background flood-filled to
 *                            transparent (so it sits on any dark surface)
 *   public/seal.png          square crop of the CAC seal, transparent
 *   public/seal-maskable.png seal centered on #0a0a0a for PWA install icons
 *   src/app/icon.png         favicon (Next metadata route)
 *   src/app/apple-icon.png   180×180 touch icon
 *
 * Run: pnpm logo:assets
 */
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "brand/logo-master.jpg");
const BG = { r: 10, g: 10, b: 10 }; // --color-black

/** BFS from every border pixel, clearing near-black connected to the edge. */
function floodFillTransparent(data, width, height) {
  const isDark = (i) => data[i] < 40 && data[i + 1] < 40 && data[i + 2] < 40;
  const visited = new Uint8Array(width * height);
  const stack = [];
  const push = (p) => {
    if (visited[p]) return;
    visited[p] = 1;
    if (isDark(p * 4)) stack.push(p);
  };
  for (let x = 0; x < width; x++) {
    push(x);
    push((height - 1) * width + x);
  }
  for (let y = 0; y < height; y++) {
    push(y * width);
    push(y * width + width - 1);
  }
  while (stack.length) {
    const p = stack.pop();
    data[p * 4 + 3] = 0;
    const x = p % width;
    const y = (p / width) | 0;
    if (x > 0) push(p - 1);
    if (x < width - 1) push(p + 1);
    if (y > 0) push(p - width);
    if (y < height - 1) push(p + width);
  }
}

async function main() {
  const publicDir = path.join(ROOT, "public");
  const appDir = path.join(ROOT, "src/app");
  await mkdir(publicDir, { recursive: true });
  await mkdir(appDir, { recursive: true });

  // 1. Full lockup → transparent PNG
  const { data, info } = await sharp(SRC)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  floodFillTransparent(data, info.width, info.height);
  const lockup = sharp(data, { raw: info });
  await lockup
    .clone()
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, "logo.png"));

  // 2. Square seal crop: the circle spans the full source height on the
  //    left; mask to the circle so the adjacent pill doesn't bleed in.
  const side = info.height;
  const cx = Math.round(side * 0.505);
  const cy = side / 2;
  const r = side / 2 - 2;
  const circleMask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${side}" height="${side}"><circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff"/></svg>`,
  );
  const seal = lockup
    .clone()
    .extract({ left: 0, top: 0, width: side, height: side })
    .composite([{ input: circleMask, blend: "dest-in" }])
    .resize(512, 512, { fit: "contain", background: { ...BG, alpha: 0 } });
  await seal
    .clone()
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, "seal.png"));

  // 3. Maskable icon: seal at ~70% on solid brand black. Built from the
  //    written seal.png (reusing sharp inputs across clones is unreliable).
  const sealPng = await readFile(path.join(publicDir, "seal.png"));
  await sharp(sealPng)
    .resize(360, 360, { fit: "contain", background: { ...BG, alpha: 1 } })
    .extend({
      top: 76,
      bottom: 76,
      left: 76,
      right: 76,
      background: { ...BG, alpha: 1 },
    })
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, "seal-maskable.png"));

  // 4. Metadata-route icons
  await sharp(sealPng)
    .resize(512, 512)
    .png({ compressionLevel: 9 })
    .toFile(path.join(appDir, "icon.png"));
  await sharp(sealPng)
    .resize(180, 180)
    .png({ compressionLevel: 9 })
    .toFile(path.join(appDir, "apple-icon.png"));

  console.log("logo assets written");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
