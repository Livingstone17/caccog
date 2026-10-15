// import { HeroCanvas } from "./hero-canvas";
// import { HeroCopy } from "./hero-copy";
// import { HeroPoster } from "./hero-poster";

// /**
//  * The Rising Citadel hero.
//  *
//  * A 200svh section with a sticky viewport: the poster paints instantly, the
//  * 3D scene lazy-loads after first paint on capable devices, and on scroll the
//  * camera ascends through clouds while this copy cross-fades into Welcome.
//  * On devices without WebGL / with reduced motion the poster IS the hero.
//  */
// export function Hero() {
//   return (
//     <section
//       id="hero"
//       className="relative h-[200svh]"
//       aria-label="Welcome to Citadel of Grace"
//     >
//       <div className="sticky top-0 h-[100svh] overflow-hidden">
//         <HeroPoster />
//         <HeroCanvas />
//         <HeroCopy />
//       </div>
//     </section>
//   );
// }


import { HeroCopy } from "./hero-copy";
import { HeroImage } from "./hero-image";

/**
 * Sanctuary hero.
 *
 * A 200svh section with a sticky viewport. A single cinematic photograph of
 * the sanctuary carries the atmosphere; subtle scroll-linked parallax and a
 * cross-fade of the copy into the Welcome section handle the motion. No
 * WebGL, no capability branching — the image is the hero on every device.
 */
export function Hero() {
  return (
    <section
      id="hero"
      className="relative h-[200svh]"
      aria-label="Welcome to Citadel of Grace Church"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <HeroImage />
        <HeroCopy />
      </div>
    </section>
  );
}