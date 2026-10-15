"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn, isPlaceholder } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Distance of the rise, in px */
  y?: number;
  as?: "div" | "section" | "li" | "article" | "span";
}

/** Soft reveal: fade + 12–24px rise, long eased duration. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 20,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={cn(className)}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}

interface SplitHeadlineProps {
  text: string;
  id?: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
  delay?: number;
  /** Reveal word by word (default) or line by line */
  mode?: "word" | "line";
}

/**
 * Headline that reveals word-by-word (or line-by-line) as it enters view.
 * Placeholder brackets render italic so pending content reads honestly.
 */
export function SplitHeadline({
  text,
  id,
  className,
  as = "h2",
  delay = 0,
  mode = "word",
}: SplitHeadlineProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  const units = mode === "line" ? text.split("\n") : text.split(" ");

  return (
    <Tag id={id} className={cn(className)} aria-label={text}>
      {units.map((unit, i) => (
        <motion.span
          key={`${unit}-${i}`}
          className={cn(
            "inline-block",
            mode === "line" ? "block" : "mr-[0.28em]",
            isPlaceholder(unit) && "text-ember/80 italic",
          )}
          aria-hidden
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: "0.35em" }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8% 0px" }}
          transition={{
            duration: 1,
            delay: delay + i * (mode === "line" ? 0.14 : 0.07),
            ease: EASE,
          }}
        >
          {unit}
        </motion.span>
      ))}
    </Tag>
  );
}

/** Renders text; bracketed placeholders get the honest placeholder style. */
export function Text({ children, className }: { children: string; className?: string }) {
  if (isPlaceholder(children)) {
    return <span className={cn("placeholder-chip", className)}>{children}</span>;
  }
  return <span className={className}>{children}</span>;
}
