"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const POLL_MS = 60_000;

/**
 * Pulsing "live now" dot for the navigation.
 *
 * It reads `/api/live` (cached for 30s server-side) on mount and every minute
 * while the tab is visible, so the badge appears without a redeploy and stops
 * polling when nobody is looking. Nothing renders while the church is off air,
 * and the pulse is disabled for visitors who ask for reduced motion.
 */
export function LiveBadge({ className }: { className?: string }) {
  const [live, setLive] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;

    async function check() {
      try {
        const response = await fetch("/api/live", { cache: "no-store" });
        if (response.ok) {
          const body = (await response.json()) as { live?: boolean };
          if (!cancelled) setLive(body.live === true);
        }
      } catch {
        // Offline or the endpoint is unavailable — keep the last known state.
      }
      if (!cancelled) timer = window.setTimeout(check, POLL_MS);
    }

    function onVisibilityChange() {
      window.clearTimeout(timer);
      if (document.visibilityState === "visible") void check();
    }

    void check();
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  if (!live) return null;

  return (
    <span className={cn("ml-1.5 inline-flex items-center gap-1.5 align-middle", className)}>
      <span className="relative flex size-2">
        {!reduce && (
          <span
            className="absolute inline-flex size-full animate-ping rounded-full bg-red-500 opacity-70"
            aria-hidden
          />
        )}
        <span
          className="relative inline-flex size-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.9)]"
          aria-hidden
        />
      </span>
      <span className="sr-only">Live now</span>
    </span>
  );
}
