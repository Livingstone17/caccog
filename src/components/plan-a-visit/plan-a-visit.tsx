"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import auditorium from "@/app/cog-audi.jpg";

/**
 * About page hero.
 *
 * A single tall viewport anchored by a photograph of the congregation (people
 * worshipping, hands raised, the sanctuary in use). Gentle scroll parallax,
 * warm color grade, and a copy card that overlaps the following section so
 * the transition into Vision & Mission feels composed, not stacked.
 */
export function PlanAVisit() {
    const reduce = useReducedMotion();
    const { scrollY } = useScroll();
    const [range, setRange] = useState<[number, number]>([0, 1]);

    useEffect(() => {
        const el = document.getElementById("about-hero");
        if (!el) return;

        const measure = () => {
            const top = el.getBoundingClientRect().top + window.scrollY;
            setRange([top, top + el.offsetHeight]);
        };
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, []);

    const progress = useTransform(scrollY, range, [0, 1], { clamp: true });
    const imageY = useTransform(progress, (v) => (reduce ? "0%" : `${v * 15}%`));
    const imageScale = useTransform(progress, (v) => (reduce ? 1 : 1 + v * 0.06));
    const copyY = useTransform(progress, (v) => (reduce ? "0%" : `${v * -20}%`));
    const copyOpacity = useTransform(progress, (v) => (reduce ? 1 : 1 - v * 0.6));

    return (
        <section
            id="about-hero"
            className="relative h-[82svh] min-h-[560px] w-full overflow-hidden bg-[#1a1208]"
            aria-label="About Citadel of Grace"
        >
            {/* Photograph — parallax */}
            <motion.div
                style={{ y: imageY, scale: imageScale }}
                className="absolute inset-0 h-[115%] w-full will-change-transform"
                aria-hidden
            >
                <Image
                    src={auditorium}
                    alt="Citadel of Grace Auditorium"
                    fill
                    priority
                    sizes="100vw"
                    quality={85}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AJVAH//Z"
                    className="object-cover object-center"
                />
            </motion.div>

            {/* Warm color grade — unifies any source photo into the amber palette */}
            <div
                className="pointer-events-none absolute inset-0 mix-blend-soft-light"
                style={{
                    background:
                        "linear-gradient(180deg, rgba(255,214,140,0.22) 0%, rgba(255,180,100,0.12) 55%, rgba(40,20,8,0.5) 100%)",
                }}
                aria-hidden
            />

            {/* Base darken — stronger at bottom-left where the copy sits */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        "linear-gradient(100deg, rgba(20,12,6,0.78) 0%, rgba(20,12,6,0.45) 45%, rgba(20,12,6,0.25) 100%)",
                }}
                aria-hidden
            />

            {/* Soft vignette + edge gradients */}
            <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(130%_95%_at_50%_45%,transparent_35%,rgba(20,12,6,0.55)_100%)]"
                aria-hidden
            />
            <div
                className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#1a1208]/80 to-transparent"
                aria-hidden
            />
            <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#1a1208] via-[#1a1208]/70 to-transparent"
                aria-hidden
            />

            {/* Copy — bottom-left, large, confident */}
            <motion.div
                style={{ y: copyY, opacity: copyOpacity }}
                className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-6 pb-20 md:pb-24"
            >
                <div className="max-w-3xl">
                    <p className="animate-hero-rise delay-hero-0 flex items-center gap-4 text-[0.62rem] font-medium tracking-[0.42em] text-amber-100/90 uppercase sm:text-[0.7rem]">
                        <span className="h-px w-10 bg-amber-200/50" />
                        Come Feel the warmth and love of the Lord
                    </p>

                    <h1 className="animate-hero-rise delay-hero-1 mt-6 text-[clamp(2.4rem,7vw,5rem)] leading-[1.02] font-light tracking-tight text-amber-50 drop-shadow-[0_4px_30px_rgba(26,18,8,0.9)]">
                        A house of grace,{" "}
                        <span className="font-display text-amber-200/95 italic">
                            a citadel of faith
                        </span>
                    </h1>
                </div>
            </motion.div>
        </section>
    );
}