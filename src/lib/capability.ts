"use client";

export interface DeviceCapability {
  /** Run the WebGL scene */
  webgl: boolean;
  /** Allow the subtle bloom pass */
  bloom: boolean;
  /** Use the tall sticky scroll choreography (vs. static hero) */
  immersive: boolean;
}

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl") ?? null;
    return Boolean(gl);
  } catch {
    return false;
  }
}

/**
 * Decides how the hero should render on THIS device.
 *
 * Static/CSS hero when: reduced motion, Save-Data, no WebGL, low memory or
 * few cores (mid-range Android). Bloom only on genuinely capable hardware.
 */
export function detectCapability(): DeviceCapability {
  if (typeof window === "undefined") {
    return { webgl: false, bloom: false, immersive: false };
  }

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  const saveData = nav.connection?.saveData === true;
  const memory = nav.deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 8;
  const webgl = hasWebGL();

  const lowEnd = memory <= 2 || cores <= 3;

  const immersive = webgl && !reduce && !saveData && !lowEnd;
  const bloom =
    immersive && window.innerWidth >= 1024 && memory >= 4 && cores >= 4 && !saveData;

  return { webgl, bloom, immersive };
}
