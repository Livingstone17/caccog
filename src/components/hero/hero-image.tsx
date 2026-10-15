"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import church from "@/app/cathedral.jpg"

/**
 * The hero photograph: a wide interior shot of the sanctuary with light
 * streaming through stained glass. Rendered with next/image at `priority`
 * so it's the LCP element, with a tiny blurDataURL for an instant placeholder.
 *
 * On scroll the image drifts gently upward (parallax) and darkens slightly
 * so the headline below can take over. Reduced motion skips both.
 */
export function HeroImage() {
    const reduce = useReducedMotion();
    const { scrollY } = useScroll();
    const [range, setRange] = useState<[number, number]>([0, 1]);

    useEffect(() => {
        const hero = document.getElementById("hero");
        if (!hero) return;

        const measure = () => {
            const top = hero.getBoundingClientRect().top + window.scrollY;
            setRange([top, top + hero.offsetHeight]);
        };
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, []);

    const progress = useTransform(scrollY, range, [0, 1], { clamp: true });
    const y = useTransform(progress, (v) => (reduce ? "0%" : `${v * 12}%`));
    const scale = useTransform(progress, (v) => (reduce ? 1 : 1 + v * 0.08));
    const overlayOpacity = useTransform(progress, (v) => 0.35 + v * 0.35);

    return (
        <div className="absolute inset-0 overflow-hidden bg-[#1a1208]" aria-hidden>
            {/* The photograph — parallax layer */}
            <motion.div
                style={{ y, scale }}
                className="absolute inset-0 h-[115%] w-full will-change-transform"
            >
                <Image
                    src={church}
                    alt="church front"
                    fill
                    priority
                    sizes="100vw"
                    quality={85}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AJVAH//Z"
                    className="object-cover object-center"
                />
            </motion.div>

            {/* Warm color grade — pushes the image toward amber/sepia regardless of source */}
            <div
                className="pointer-events-none absolute inset-0 mix-blend-soft-light"
                style={{
                    background:
                        "linear-gradient(180deg, rgba(255,214,140,0.25) 0%, rgba(255,180,100,0.15) 50%, rgba(60,30,10,0.4) 100%)",
                }}
            />

            {/* Light-bloom highlight — simulates the hot spot where sun hits */}
            <div className="animate-glow-pulse pointer-events-none absolute inset-x-0 top-0 h-[70%] bg-[radial-gradient(50%_55%_at_50%_28%,rgba(255,224,160,0.28),transparent_70%)]" />

            {/* Darkening overlay — strengthens as you scroll for text legibility */}
            <motion.div
                style={{ opacity: overlayOpacity }}
                className="pointer-events-none absolute inset-0 bg-[#1a1208]"
            />

            {/* Vignette for text contrast */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(130%_95%_at_50%_45%,transparent_30%,rgba(20,12,6,0.55)_100%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#1a1208]/70 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#1a1208] via-[#1a1208]/75 to-transparent" />
        </div>
    );
}