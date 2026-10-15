"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { useMotionPaused } from "@/lib/motion-preference";

/**
 * Lenis smooth scrolling, self-driven with requestAnimationFrame.
 * Skipped entirely for prefers-reduced-motion or when the user pauses
 * animation via the global toggle. Drives native window scroll, so Next.js
 * App Router navigation keeps working normally.
 *
 * (This used to ride on the GSAP ticker; it now self-drives so we can drop
 * GSAP — a ~44 KB gzip saving on every route.)
 */
export function SmoothScroll() {
  const pathname = usePathname();
  const [paused] = useMotionPaused();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || paused) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    let raf = 0;
    const tick = (time: number) => {
      lenis.raf(time * 1000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [paused]);

  useEffect(() => {
    // Ensure each navigation starts at the top even with smooth scroll active.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || paused) return;
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, paused]);

  return null;
}
