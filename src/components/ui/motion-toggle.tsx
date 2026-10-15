"use client";

import { useEffect, useState } from "react";
import { useMotionPaused } from "@/lib/motion-preference";

/**
 * Visible "Pause animation" control (WCAG 2.2 AA). Sits bottom-left, above
 * the footer, and pauses CSS animations, smooth scrolling and the 3D render
 * loop without hiding any content. Choice persists across visits.
 */
export function MotionToggle() {
  const [paused, setPaused] = useMotionPaused();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Render nothing until the server-known state has been reconciled, so the
  // label never flashes the wrong verb.
  if (!mounted) return null;

  return (
    <button
      type="button"
      onClick={() => setPaused(!paused)}
      aria-pressed={paused}
      className="bg-surface text-muted focus-visible:outline-orange fixed bottom-4 left-4 z-50 inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-medium shadow-lg backdrop-blur transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <span aria-hidden className="text-orange leading-none">
        {paused ? "▶" : "❚❚"}
      </span>
      {paused ? "Play animation" : "Pause animation"}
    </button>
  );
}
