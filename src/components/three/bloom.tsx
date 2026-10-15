"use client";

import { EffectComposer, Bloom } from "@react-three/postprocessing";

/**
 * Subtle bloom — rendered ONLY on capable devices (decided in the hero
 * loader). Kept off on mobile and low-end hardware to protect frame rate.
 */
export function BloomLayer() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        mipmapBlur
        intensity={0.75}
        radius={0.72}
        luminanceThreshold={0.7}
        luminanceSmoothing={0.22}
      />
    </EffectComposer>
  );
}
