import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

interface SectionProps {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Align heading to the left instead of centered */
  align?: "center" | "left";
}

export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  className,
  align = "center",
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("relative py-20 md:py-28", className)}
      aria-labelledby={id && title ? `${id}-title` : undefined}
    >
      <div className="container-page">
        {eyebrow && (
          <Reveal>
            <p className={cn("eyebrow mb-5", align === "center" && "text-center")}>
              {eyebrow}
            </p>
          </Reveal>
        )}
        {title && (
          <Reveal>
            <div className={cn("mb-6", align === "center" ? "text-center" : "text-left")}>
              <h2
                id={id ? `${id}-title` : undefined}
                className="font-display text-4xl leading-tight font-light text-white md:text-5xl"
              >
                {title}
              </h2>
            </div>
          </Reveal>
        )}
        {intro && (
          <Reveal delay={0.1}>
            <div
              className={cn(
                "text-muted mx-auto max-w-2xl text-base leading-relaxed md:text-lg",
                align === "center" ? "text-center" : "mx-0 text-left",
              )}
            >
              {intro}
            </div>
          </Reveal>
        )}
        <div className={cn("mt-12", title === undefined && "mt-0")}>{children}</div>
      </div>
    </section>
  );
}

/** Orange hairline divider with a small diamond, used between sections. */
export function Divider({ className }: { className?: string }) {
  return (
    <div
      className={cn("mx-auto flex max-w-xs items-center gap-4 opacity-60", className)}
      aria-hidden
    >
      <span className="to-orange/50 h-px flex-1 bg-gradient-to-r from-transparent" />
      <span className="bg-orange size-1.5 rotate-45" />
      <span className="to-orange/50 h-px flex-1 bg-gradient-to-l from-transparent" />
    </div>
  );
}
