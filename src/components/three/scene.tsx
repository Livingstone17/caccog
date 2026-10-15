"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

/* -------------------------------------------------------------------------- */
/* Shared, module-level GPU resources (created once, reused across mounts)     */
/* -------------------------------------------------------------------------- */

const bodyMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color("#141414"),
  roughness: 0.86,
  metalness: 0.14,
});

const edgeMaterial = new THREE.LineBasicMaterial({
  color: new THREE.Color("#ff7a1a"),
  transparent: true,
  opacity: 0.34,
});

const windowMaterial = new THREE.MeshBasicMaterial({
  color: new THREE.Color("#ffb36b"),
  transparent: true,
  opacity: 0.85,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

const G = {
  platform: new THREE.CylinderGeometry(6.4, 7.4, 1.6, 8),
  keep: new THREE.BoxGeometry(3.8, 9, 3.8),
  merlon: new THREE.BoxGeometry(0.55, 0.8, 0.55),
  tower: new THREE.CylinderGeometry(0.95, 1.15, 7, 8),
  roof: new THREE.ConeGeometry(1.5, 2.4, 8),
  spire: new THREE.ConeGeometry(1.1, 3.2, 6),
  window: new THREE.PlaneGeometry(0.34, 0.62),
  beam: new THREE.PlaneGeometry(1.4, 30).translate(0, 15, 0),
  backlight: new THREE.PlaneGeometry(52, 52),
};

const E = {
  platform: new THREE.EdgesGeometry(G.platform),
  keep: new THREE.EdgesGeometry(G.keep),
  tower: new THREE.EdgesGeometry(G.tower),
  roof: new THREE.EdgesGeometry(G.roof),
  spire: new THREE.EdgesGeometry(G.spire),
};

/* -------------------------------------------------------------------------- */
/* Fortified block: dark body + orange hairline edges                           */
/* -------------------------------------------------------------------------- */

function Fortified({
  geometry,
  edges,
  position = [0, 0, 0],
  rotation,
}: {
  geometry: THREE.BufferGeometry;
  edges?: THREE.BufferGeometry;
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={geometry} material={bodyMaterial} />
      {edges && <lineSegments geometry={edges} material={edgeMaterial} />}
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/* The citadel silhouette                                                      */
/* -------------------------------------------------------------------------- */

export function Citadel() {
  const merlons = useMemo(() => {
    const out: [number, number, number][] = [];
    const half = 1.9;
    for (let i = 0; i < 4; i++) {
      for (const offset of [-1.2, 0, 1.2]) {
        const side = i < 2 ? 1 : -1;
        const axis = i % 2;
        const x = axis === 0 ? offset : side * half;
        const z = axis === 0 ? side * half : offset;
        out.push([x, 11.4, z]);
      }
    }
    return out;
  }, []);

  const windows = useMemo(() => {
    const out: { pos: [number, number, number]; rot: [number, number, number] }[] = [];
    const faces: [number, number, number, number][] = [
      [0, 0, 1.95, 0],
      [0, 0, -1.95, Math.PI],
      [1.95, 0, 0, Math.PI / 2],
      [-1.95, 0, 0, -Math.PI / 2],
    ];
    for (const [fx, , fz, ry] of faces) {
      for (const y of [4.4, 6.6, 8.8]) {
        out.push({
          pos: [fx, y, fz],
          rot: [0, ry, 0],
        });
      }
    }
    return out;
  }, []);

  const towers: [number, number][] = [
    [3.9, 3.9],
    [-3.9, 3.9],
    [3.9, -3.9],
    [-3.9, -3.9],
  ];

  return (
    <group position={[0, -2, 0]}>
      <Fortified geometry={G.platform} edges={E.platform} position={[0, 0.8, 0]} />
      <Fortified geometry={G.keep} edges={E.keep} position={[0, 6.1, 0]} />
      <Fortified geometry={G.spire} edges={E.spire} position={[0, 12.3, 0]} />

      {merlons.map((pos, i) => (
        <mesh key={`m-${i}`} geometry={G.merlon} material={bodyMaterial} position={pos} />
      ))}

      {towers.map(([x, z], i) => (
        <group key={`t-${i}`}>
          <Fortified geometry={G.tower} edges={E.tower} position={[x, 5.1, z]} />
          <Fortified geometry={G.roof} edges={E.roof} position={[x, 9.9, z]} />
        </group>
      ))}

      {windows.map((w, i) => (
        <mesh
          key={`w-${i}`}
          geometry={G.window}
          material={windowMaterial}
          position={w.pos}
          rotation={w.rot}
        />
      ))}
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/* Warm backlight (the light behind the citadel)                               */
/* -------------------------------------------------------------------------- */

const backlightMaterial = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  uniforms: {
    uColorA: { value: new THREE.Color("#ffb36b") },
    uColorB: { value: new THREE.Color("#ff7a1a") },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    varying vec2 vUv;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    void main() {
      float d = distance(vUv, vec2(0.5, 0.42));
      float ember = pow(smoothstep(0.5, 0.0, d), 1.9);
      float core = pow(smoothstep(0.16, 0.0, d), 2.0);
      vec3 color = mix(uColorB, uColorA, ember);
      gl_FragColor = vec4(color, ember * 0.85 + core * 0.9);
    }
  `,
});

export function Backlight() {
  return (
    <mesh geometry={G.backlight} material={backlightMaterial} position={[0, 11, -34]} />
  );
}

/* -------------------------------------------------------------------------- */
/* Fake god-rays: additive tapered planes fanning out of the light             */
/* -------------------------------------------------------------------------- */

const beamMaterial = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: false,
  side: THREE.DoubleSide,
  blending: THREE.AdditiveBlending,
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color("#ffb36b") },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    varying vec2 vUv;
    uniform float uTime;
    uniform vec3 uColor;
    void main() {
      float along = pow(1.0 - vUv.y, 1.7);
      float across = smoothstep(0.0, 0.42, vUv.x) * smoothstep(1.0, 0.58, vUv.x);
      float shimmer = 0.82 + 0.18 * sin(uTime * 0.55 + vUv.y * 4.0);
      gl_FragColor = vec4(uColor, along * across * shimmer * 0.42);
    }
  `,
});

const BEAM_ANGLES = [-0.62, -0.38, -0.16, 0, 0.18, 0.4, 0.64];

export function GodRays() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    beamMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    if (group.current) {
      group.current.children.forEach((child, i) => {
        const base = BEAM_ANGLES[i] ?? 0;
        child.rotation.z = base + Math.sin(state.clock.elapsedTime * 0.18 + i) * 0.015;
      });
    }
  });

  return (
    <group ref={group} position={[0, 6.5, -26]}>
      {BEAM_ANGLES.map((angle, i) => (
        <mesh
          key={i}
          geometry={G.beam}
          material={beamMaterial}
          rotation={[0, 0, angle]}
          scale={[0.7 + (i % 3) * 0.35, 1, 1]}
        />
      ))}
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/* Drifting light particles (embers / dust in sunbeams)                        */
/* -------------------------------------------------------------------------- */

const PARTICLE_COUNT = 340;

/** Deterministic 32-bit PRNG so the particle field is stable across mounts. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const particleMaterial = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color("#ffb36b") },
  },
  vertexShader: /* glsl */ `
    uniform float uTime;
    attribute float aSpeed;
    attribute float aScale;
    attribute float aSeed;
    varying float vAlpha;
    void main() {
      vec3 p = position;
      float span = 34.0;
      p.y = mod(p.y + uTime * aSpeed, span) - 6.0;
      p.x += sin(uTime * 0.25 + aSeed * 6.283) * 0.7;
      vec4 mv = modelViewMatrix * vec4(p, 1.0);
      gl_PointSize = aScale * (72.0 / max(1.0, -mv.z));
      gl_Position = projectionMatrix * mv;
      vAlpha = smoothstep(-6.0, -2.0, p.y) * smoothstep(28.0, 20.0, p.y);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform vec3 uColor;
    varying float vAlpha;
    void main() {
      float d = length(gl_PointCoord - 0.5);
      float a = smoothstep(0.5, 0.05, d);
      gl_FragColor = vec4(uColor, a * vAlpha * 0.75);
    }
  `,
});

export function LightParticles() {
  const ref = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    // Deterministic PRNG (mulberry32) — a stable field on every mount,
    // without calling impure Math.random during render.
    const rand = mulberry32(0x51ade5);
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const speeds = new Float32Array(PARTICLE_COUNT);
    const scales = new Float32Array(PARTICLE_COUNT);
    const seeds = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (rand() - 0.5) * 44;
      positions[i * 3 + 1] = rand() * 34 - 6;
      positions[i * 3 + 2] = (rand() - 0.5) * 46;
      speeds[i] = 0.28 + rand() * 0.55;
      scales[i] = 1.1 + rand() * 2.6;
      seeds[i] = rand();
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
    geo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    return geo;
  }, []);

  // Per-mount geometry: free the buffers (and the typed arrays behind them)
  // when the scene unmounts.
  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state) => {
    particleMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.008;
  });

  return <points ref={ref} geometry={geometry} material={particleMaterial} />;
}

/* -------------------------------------------------------------------------- */
/* Soft clouds the camera rises through                                        */
/* -------------------------------------------------------------------------- */

function makeCloudTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, size, size);

  const blobs: [number, number, number][] = [
    [128, 140, 92],
    [86, 152, 62],
    [172, 150, 64],
    [128, 118, 58],
    [104, 168, 48],
    [156, 170, 46],
  ];
  for (const [x, y, r] of blobs) {
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, "rgba(255,255,255,0.85)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

const CLOUDS: {
  pos: [number, number, number];
  scale: [number, number];
  speed: number;
  opacity: number;
}[] = [
  { pos: [-13, 7.5, -8], scale: [30, 15], speed: 0.14, opacity: 0.22 },
  { pos: [12, 10.5, -12], scale: [34, 16], speed: -0.1, opacity: 0.2 },
  { pos: [-4, 14.5, -6], scale: [26, 12], speed: 0.08, opacity: 0.18 },
  { pos: [9, 17, -14], scale: [36, 17], speed: -0.12, opacity: 0.16 },
  { pos: [-10, 20, -10], scale: [30, 14], speed: 0.1, opacity: 0.14 },
];

export function Clouds() {
  const texture = useMemo(() => makeCloudTexture(), []);
  const group = useRef<THREE.Group>(null);

  // Each mount builds its own canvas texture — release it on unmount so
  // navigating away (and back) doesn't accumulate GPU memory. The module-level
  // geometries/materials above are deliberate singletons reused across mounts.
  useEffect(() => () => texture.dispose(), [texture]);

  useFrame((state) => {
    if (!group.current) return;
    group.current.children.forEach((child, i) => {
      const cloud = CLOUDS[i];
      if (!cloud) return;
      child.position.x =
        cloud.pos[0] + Math.sin(state.clock.elapsedTime * cloud.speed) * 2.4;
    });
  });

  return (
    <group ref={group}>
      {CLOUDS.map((cloud, i) => (
        <mesh key={i} position={cloud.pos} scale={[cloud.scale[0], cloud.scale[1], 1]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={texture}
            transparent
            opacity={cloud.opacity}
            depthWrite={false}
            color="#cfc4b8"
          />
        </mesh>
      ))}
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/* Camera rig: scroll-driven ascent + gentle parallax / auto-drift             */
/* -------------------------------------------------------------------------- */

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export function CameraRig() {
  const { camera, pointer } = useThree();
  const lookAt = useMemo(() => new THREE.Vector3(0, 6.5, 0), []);
  const desired = useMemo(() => new THREE.Vector3(0, 3, 26), []);

  useFrame((state, delta) => {
    const hero = document.getElementById("hero");
    let progress = 0;
    if (hero) {
      const total = hero.offsetHeight - window.innerHeight;
      if (total > 0) {
        progress = clamp01(-hero.getBoundingClientRect().top / total);
      }
    }
    const p = easeInOut(progress);

    const finePointer =
      typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

    const drift = finePointer ? 0 : Math.sin(state.clock.elapsedTime * 0.16) * 0.9;

    const parallaxX = finePointer ? pointer.x * 1.6 : drift;
    const parallaxY = finePointer ? pointer.y * 0.9 : 0;

    desired.set(
      parallaxX,
      THREE.MathUtils.lerp(3, 17.5, p) + parallaxY,
      THREE.MathUtils.lerp(26, 19, p),
    );

    const ease = 1 - Math.pow(0.0015, delta);
    camera.position.lerp(desired, ease);

    lookAt.set(0, THREE.MathUtils.lerp(6.5, 16, p), 0);
    camera.lookAt(lookAt);
  });

  return null;
}
