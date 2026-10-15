// "use client";

// import { useEffect, useState } from "react";
// import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
// import { ButtonLink } from "@/components/ui/button";
// import { siteSettings } from "@/content/site";
// import { useMotionPaused } from "@/lib/motion-preference";
// import { isPlaceholder } from "@/lib/utils";

// const service = siteSettings.serviceTimes[0];

// /**
//  * Hero overlay: staggered intro reveal + scroll-scrubbed cross-fade into the
//  * Welcome section.
//  *
//  * The cross-fade runs from the top of the hero to 42% of its height scrolled
//  * away (the old GSAP ScrollTrigger `top top → 42% top` range). Measured from
//  * the DOM so the sticky/200svh layout is the single source of truth, and
//  * skipped entirely under reduced motion.
//  */
// export function HeroCopy() {
//   const reduce = useReducedMotion();
//   const [paused] = useMotionPaused();
//   const { scrollY } = useScroll();
//   const [range, setRange] = useState<[number, number]>([0, 1]);

//   useEffect(() => {
//     const hero = document.getElementById("hero");
//     if (!hero) return;

//     const measure = () => {
//       const top = hero.getBoundingClientRect().top + window.scrollY;
//       setRange([top, top + hero.offsetHeight * 0.42]);
//     };
//     measure();
//     window.addEventListener("resize", measure);
//     return () => window.removeEventListener("resize", measure);
//   }, []);

//   const progress = useTransform(scrollY, range, [0, 1], { clamp: true });
//   const opacity = useTransform(progress, (v) => (reduce ? 1 : 1 - v));
//   const y = useTransform(progress, (v) => (reduce ? "0%" : `${v * -8}%`));

//   return (
//     <div className="absolute inset-0 flex items-center justify-center px-6">
//       <motion.div
//         style={{ opacity, y }}
//         className="pointer-events-none flex w-full max-w-3xl flex-col items-center text-center"
//       >
//         {/* Entrance is CSS-only (see globals.css animate-hero-rise): the
//             headline has to be painted at first render so LCP on Slow 4G
//             doesn't wait on hydration. Under reduced motion the global
//             prefers-reduced-motion rule collapses these to 0.01ms. */}
//         <p className="text-orange animate-hero-rise delay-hero-0 mb-6 flex items-center gap-4 text-[0.62rem] font-medium tracking-[0.42em] uppercase sm:text-[0.7rem]">
//           <span className="bg-orange/50 h-px w-8 sm:w-12" />
//           {siteSettings.denomination}
//           <span className="bg-orange/50 h-px w-8 sm:w-12" />
//         </p>

//         <h1 className="animate-hero-rise delay-hero-1 text-[clamp(3.2rem,13vw,7.5rem)] leading-[0.95] font-light tracking-tight text-white drop-shadow-[0_6px_40px_rgba(10,10,10,0.9)]">
//           Citadel <span className="text-ember italic">of Grace</span>
//         </h1>

//         <p className="animate-hero-rise delay-hero-2 mt-6 max-w-xl text-base leading-relaxed font-light text-white/85 drop-shadow-[0_2px_16px_rgba(10,10,10,0.9)] sm:text-lg">
//           {siteSettings.welcomeLine}
//         </p>

//         <p className="animate-hero-rise delay-hero-3 mt-7 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-white/80">
//           <span className="eyebrow text-orange">Next service</span>
//           <span className="h-3 w-px bg-white/25" aria-hidden />
//           <span>{service.day}</span>
//           <span aria-hidden className="text-orange/70">
//             ·
//           </span>
//           <span
//             className={
//               isPlaceholder(service.time) ? "placeholder-chip" : "text-ember font-medium"
//             }
//           >
//             {service.time}
//           </span>
//         </p>

//         <div className="animate-hero-rise delay-hero-4 pointer-events-auto mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
//           <ButtonLink href="/plan-your-visit" variant="primary">
//             Plan your visit
//           </ButtonLink>
//           <ButtonLink href="/live" variant="ghost">
//             Watch live
//           </ButtonLink>
//         </div>
//       </motion.div>

//       <motion.div
//         className="pointer-events-none absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: reduce ? 0 : 1.3, duration: 1 }}
//         aria-hidden
//       >
//         <span className="text-[0.58rem] tracking-[0.4em] text-white/50 uppercase">
//           Scroll
//         </span>
//         <span className="relative h-10 w-px overflow-hidden bg-white/15">
//           <motion.span
//             className="bg-orange absolute inset-x-0 top-0 h-4"
//             animate={reduce || paused ? {} : { y: [-16, 40] }}
//             transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
//           />
//         </span>
//       </motion.div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { MapPin } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { siteSettings } from "@/content/site";
import { useMotionPaused } from "@/lib/motion-preference";
import { isPlaceholder } from "@/lib/utils";

const service = siteSettings.serviceTimes[0];

export function HeroCopy() {
  const reduce = useReducedMotion();
  const [paused] = useMotionPaused();
  const { scrollY } = useScroll();
  const [range, setRange] = useState<[number, number]>([0, 1]);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;

    const measure = () => {
      const top = hero.getBoundingClientRect().top + window.scrollY;
      setRange([top, top + hero.offsetHeight * 0.42]);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const progress = useTransform(scrollY, range, [0, 1], { clamp: true });
  const opacity = useTransform(progress, (v) => (reduce ? 1 : 1 - v));
  const y = useTransform(progress, (v) => (reduce ? "0%" : `${v * -8}%`));

  return (
    <div className="absolute inset-0 flex items-center justify-center px-6">
      <motion.div
        style={{ opacity, y }}
        className="pointer-events-none flex w-full max-w-3xl flex-col items-center text-center"
      >
        <p className="animate-hero-rise delay-hero-0 mb-7 flex items-center gap-4 text-[0.62rem] font-medium tracking-[0.42em] text-amber-100/90 uppercase sm:text-[0.7rem]">
          <span className="h-px w-8 bg-amber-200/40 sm:w-12" />
          Welcome Home
          <span className="h-px w-8 bg-amber-200/40 sm:w-12" />
        </p>

        <h1 className="animate-hero-rise delay-hero-1 text-[clamp(3rem,12vw,7rem)] leading-[0.98] font-light tracking-tight text-amber-50 drop-shadow-[0_6px_40px_rgba(26,18,8,0.9)]">
          Citadel{" "}
          <span className="font-serif text-amber-200/95 italic">of Grace</span>
        </h1>

        <p className="animate-hero-rise delay-hero-2 mt-7 max-w-xl text-base leading-relaxed font-light text-amber-50/85 drop-shadow-[0_2px_16px_rgba(26,18,8,0.9)] sm:text-lg">
          Wherever you are on your journey of faith, there's a seat saved for you.
          Come as you are — you belong here.
        </p>

        <div className="animate-hero-rise delay-hero-3 mt-8 flex flex-col items-center gap-2 rounded-2xl border border-amber-200/15 bg-[#1a1208]/40 px-6 py-4 backdrop-blur-sm">
          <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm">
            <span className="text-[0.68rem] font-medium tracking-[0.28em] text-amber-200/80 uppercase">
              This Sunday
            </span>
            <span className="h-3 w-px bg-amber-200/20" aria-hidden />
            <span className="text-amber-50/90">{service.day}</span>
            <span aria-hidden className="text-amber-200/50">·</span>
            <span
              className={
                isPlaceholder(service.time)
                  ? "placeholder-chip"
                  : "font-medium text-amber-100"
              }
            >
              {service.time}
            </span>
          </p>
          {siteSettings.address && (
            <p className="flex items-center gap-1.5 text-xs text-amber-50/60">
              <MapPin className="h-3 w-3" aria-hidden />
              <span>{siteSettings.city}</span>
            </p>
          )}
        </div>

        <div className="animate-hero-rise delay-hero-4 pointer-events-auto mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <ButtonLink href="/plan-your-visit" variant="primary">
            I'm new here
          </ButtonLink>
          <ButtonLink href="/live" variant="ghost">
            Watch online
          </ButtonLink>
        </div>
      </motion.div>

      <motion.div
        className="pointer-events-none absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduce ? 0 : 1.3, duration: 1 }}
        aria-hidden
      >
        <span className="text-[0.58rem] tracking-[0.4em] text-amber-100/50 uppercase">
          Explore
        </span>
        <span className="relative h-10 w-px overflow-hidden bg-amber-100/15">
          <motion.span
            className="absolute inset-x-0 top-0 h-4 bg-amber-200/80"
            animate={reduce || paused ? {} : { y: [-16, 40] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </div>
  );
}