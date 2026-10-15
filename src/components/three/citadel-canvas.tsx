"use client";

import { useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { useMotionPaused } from "@/lib/motion-preference";
import { Citadel, Backlight, GodRays, LightParticles, Clouds, CameraRig } from "./scene";
import { BloomLayer } from "./bloom";

/**
 * Rising Citadel — the signature 3D moment.
 * Client-only (never SSR'd); the hero shows a poster until this mounts.
 */
export default function CitadilCanvas({ bloom }: { bloom: boolean }) {
  const [dpr, setDpr] = useState(1.5);
  const [offscreen, setOffscreen] = useState(false);
  const [userPaused] = useMotionPaused();
  const [bloomAllowed, setBloomAllowed] = useState(bloom);
  const [declined, setDeclined] = useState(false);

  // Pause rendering when the canvas is off-screen or the tab is hidden.
  useEffect(() => {
    const host = document.getElementById("hero-canvas");
    if (!host) return;

    let onScreen = true;
    let tabVisible = !document.hidden;
    const update = () => setOffscreen(!onScreen || !tabVisible);

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        update();
      },
      { threshold: 0.01 },
    );
    io.observe(host);

    const onVisibility = () => {
      tabVisible = !document.hidden;
      update();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const paused = offscreen || userPaused;
  const frameloop = useMemo(() => (paused ? "never" : "always"), [paused]);

  return (
    <div className="absolute inset-0" aria-hidden>
      <Canvas
        dpr={dpr}
        frameloop={frameloop}
        camera={{ position: [0, 3, 26], fov: 40, near: 0.1, far: 220 }}
        gl={{
          antialias: dpr > 1,
          powerPreference: "high-performance",
          alpha: false,
          stencil: false,
        }}
        onCreated={({ gl }) => gl.setClearColor("#0a0a0a", 1)}
      >
        <PerformanceMonitor
          bounds={() => [45, 60]}
          onDecline={() => {
            setDeclined(true);
            setDpr(1);
            setBloomAllowed(false);
          }}
          onIncline={() => {
            if (!declined) setDpr(1.5);
          }}
        />
        <fog attach="fog" args={["#0a0a0a", 30, 130]} />
        <ambientLight intensity={0.55} color="#2a2a2a" />
        <directionalLight position={[0, 18, -26]} intensity={1.7} color="#ffb36b" />
        <pointLight
          position={[0, 9, -18]}
          intensity={90}
          distance={90}
          decay={2}
          color="#ff8c2e"
        />
        <directionalLight position={[6, 8, 24]} intensity={0.22} color="#909090" />

        <CameraRig />
        <Backlight />
        <GodRays />
        <Citadel />
        <Clouds />
        <LightParticles />

        {bloomAllowed && <BloomLayer />}
      </Canvas>
    </div>
  );
}
