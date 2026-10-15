"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { detectCapability, type DeviceCapability } from "@/lib/capability";

const CitadelCanvas = dynamic(() => import("@/components/three/citadel-canvas"), {
  ssr: false,
  loading: () => null,
});

/**
 * Decides (client-side, after hydration) whether this device gets the
 * immersive 3D hero, and lazy-loads the canvas only then. The poster
 * background is painted immediately either way, so there is never a blank
 * hero and no layout shift.
 */
export function HeroCanvas() {
  const [capability, setCapability] = useState<DeviceCapability | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setCapability(detectCapability()));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!capability?.immersive) return;
    let cancelled = false;

    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    // Two-stage deferral so the 3D work lands OUTSIDE Lighthouse's
    // time-to-interactive window (and outside a mid-range phone's first
    // interaction), not just after first paint:
    //   1. wait for the window `load` event (all LCP candidates painted);
    //   2. then wait for idle, with a hard timeout.
    const start = () => {
      if (w.requestIdleCallback) {
        const id = w.requestIdleCallback(
          () => {
            if (!cancelled) setReady(true);
          },
          { timeout: 2000 },
        );
        return () => w.cancelIdleCallback?.(id);
      }
      const id = window.setTimeout(() => {
        if (!cancelled) setReady(true);
      }, 500);
      return () => window.clearTimeout(id);
    };

    let cancelIdle: (() => void) | undefined;
    const onLoad = () => {
      cancelIdle = start();
    };

    if (document.readyState === "complete") {
      cancelIdle = start();
    } else {
      window.addEventListener("load", onLoad, { once: true });
    }

    return () => {
      cancelled = true;
      cancelIdle?.();
      window.removeEventListener("load", onLoad);
    };
  }, [capability]);

  if (!capability?.immersive) return null;

  return (
    <div
      id="hero-canvas"
      className="absolute inset-0 transition-opacity duration-1000"
      style={{ opacity: ready ? 1 : 0 }}
    >
      <CitadelCanvas bloom={capability.bloom} />
    </div>
  );
}
