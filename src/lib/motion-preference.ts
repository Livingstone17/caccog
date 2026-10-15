"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Global "pause animation" preference (WCAG 2.2 §2.2.2 Pause, Stop, Hide).
 *
 * Three consumers, all optional:
 *  - CSS: we set `data-motion="paused"` on <html>, and globals.css pauses
 *    every animation/transitions under that selector.
 *  - JS: SmoothScroll stops Lenis, and the 3D canvas switches to
 *    frameloop="never" (see useMotionPaused in citadel-canvas).
 *  - Framer Motion reads it through this hook so entrance reveals still
 *    resolve (they must, or content would stay invisible) but looping
 *    animations don't run.
 *
 * The explicit user choice is stored in localStorage and wins over the OS
 * preference; the OS `prefers-reduced-motion` is the initial value otherwise.
 */

const STORAGE_KEY = "cog:motion";

let paused = false;
const listeners = new Set<(value: boolean) => void>();

function readInitial(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored !== null) return stored === "paused";
  } catch {
    // private mode / storage blocked — fall through to OS preference
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function apply(value: boolean) {
  paused = value;
  if (typeof document !== "undefined") {
    document.documentElement.dataset.motion = value ? "paused" : "running";
  }
  for (const listener of listeners) listener(value);
}

/** Set + persist the pause state. */
export function setMotionPaused(value: boolean) {
  apply(value);
  try {
    window.localStorage.setItem(STORAGE_KEY, value ? "paused" : "running");
  } catch {
    // ignore
  }
}

export function isMotionPaused() {
  return paused;
}

/** Subscribe to pause state. Returns [paused, setPaused]. */
export function useMotionPaused(): [boolean, (value: boolean) => void] {
  const [value, setValue] = useState(paused);

  // Seed from storage / OS preference once, on the client, before subscribing.
  // rAF-wrapped so the initial state is applied after the first paint rather
  // than as a cascading synchronous render (react-hooks v6 rule).
  useEffect(() => {
    let cancelled = false;
    const id = requestAnimationFrame(() => {
      if (cancelled) return;
      const initial = readInitial();
      if (initial !== paused) apply(initial);
      setValue(paused);
    });
    listeners.add(setValue);
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
      listeners.delete(setValue);
    };
  }, []);

  const set = useCallback((next: boolean) => setMotionPaused(next), []);
  return [value, set];
}

/** True when the user hasn't paused animation (drives looping animations). */
export function useMotionRunning(): boolean {
  const [pausedValue] = useMotionPaused();
  return !pausedValue;
}
