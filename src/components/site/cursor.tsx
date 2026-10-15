"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Desktop-only custom cursor: a small light dot that gently expands over
 * interactive elements. Disabled for touch input and reduced motion.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 320, damping: 32, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 320, damping: 32, mass: 0.6 });

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduce) return;

    const id = requestAnimationFrame(() => setEnabled(true));

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as HTMLElement | null;
      setActive(
        Boolean(target?.closest("a, button, [role='button'], input, textarea, select")),
      );
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("mousemove", onMove);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[90] hidden lg:block"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="border-ember/70 bg-ember/20 -translate-x-1/2 -translate-y-1/2 rounded-full border backdrop-blur-[2px]"
        animate={{
          width: active ? 44 : 8,
          height: active ? 44 : 8,
          opacity: active ? 0.9 : 0.7,
        }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.div>
  );
}
