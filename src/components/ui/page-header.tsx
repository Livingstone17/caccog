import Image from "next/image";
import { Reveal, SplitHeadline } from "./reveal";

/**
 * Interior page masthead.
 *
 * Two modes:
 *   • **Default (CSS-only):** warm charcoal gradient, faint gothic-arch
 *     watermark, soft overhead light — dignified and fast.
 *   • **With `image`:** a photographic backdrop with a warm overlay so the
 *     type stays legible. Use for pages that benefit from visual storytelling
 *     (e.g. Ministries, Sermons, Plan Your Visit).
 *
 * The bottom edge fades into the page background instead of a hard border,
 * so the transition into the first content section feels composed.
 */
export function PageHeader({
  eyebrow,
  title,
  intro,
  image,
  imagePosition = "50% 50%",
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  /** Path relative to /public — e.g. "/images/pages/ministries.jpg" */
  image?: string;
  imagePosition?: string;
}) {
  const hasImage = Boolean(image);

  return (
    <header className="relative overflow-hidden pt-28 pb-14 sm:pt-32 sm:pb-20 md:pt-44 md:pb-28">
      {/* ── Background layers ─────────────────────────────── */}

      {/* Warm charcoal base */}
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,#1a1208_0%,#231810_55%,#1a1208_100%)]"
        aria-hidden
      />

      {/* Photo backdrop (optional) */}
      {hasImage && (
        <div className="absolute inset-0" aria-hidden>
          <Image
            src={image!}
            alt=""
            fill
            sizes="100vw"
            quality={75}
            className="object-cover"
            style={{ objectPosition: imagePosition }}
          />
          {/* Darken + warm-grade so any photo unifies with the palette */}
          <div className="absolute inset-0 bg-[#1a1208]/65" />
          <div
            className="absolute inset-0 mix-blend-soft-light"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,214,140,0.18) 0%, rgba(40,20,8,0.35) 100%)",
            }}
          />
        </div>
      )}

      {/* Overhead "window light" — soft amber glow from above */}
      <div
        className="absolute inset-x-0 top-0 h-[75%] bg-[radial-gradient(50%_60%_at_50%_-5%,rgba(255,200,120,0.14),transparent_72%)]"
        aria-hidden
      />

      {/* Gothic arch watermark — 4 % opacity, more felt than seen */}
      {!hasImage && (
        <svg
          viewBox="0 0 200 300"
          className="pointer-events-none absolute top-1/2 left-1/2 h-[130%] w-auto -translate-x-1/2 -translate-y-[54%] text-amber-200/[0.04]"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.6"
          aria-hidden
        >
          {/* Pointed arch */}
          <path d="M 30 300 L 30 120 Q 30 20 100 20 Q 170 20 170 120 L 170 300" />
          {/* Mullion + transom */}
          <line x1="100" y1="20" x2="100" y2="300" />
          <line x1="30" y1="155" x2="170" y2="155" />
        </svg>
      )}

      {/* Faint grain for depth (CSS-only, no extra request) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
        aria-hidden
      />

      {/* Bottom fade into the page body */}
      <div
        className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#1a1208] to-transparent"
        aria-hidden
      />

      {/* ── Content ───────────────────────────────────────── */}

      <div className="container-page relative z-10 text-center">
        <Reveal>
          <div className="flex flex-col items-center gap-4">
            {/* Ornamental divider — the "diamond" motif */}
            <div className="flex items-center gap-3" aria-hidden>
              <span className="h-px w-8 bg-amber-200/30" />
              <span className="size-1.5 rotate-45 bg-amber-200/40" />
              <span className="h-px w-8 bg-amber-200/30" />
            </div>

            <p className="text-[0.62rem] font-medium tracking-[0.42em] text-amber-200/80 uppercase sm:text-[0.68rem]">
              {eyebrow}
            </p>
          </div>
        </Reveal>

        <SplitHeadline
          as="h1"
          text={title}
          delay={0.12}
          className="font-display mx-auto mt-6 max-w-3xl text-[clamp(2.1rem,6vw,4.5rem)] leading-[1.08] font-light tracking-tight text-amber-50 sm:mt-7"
        />

        {intro && (
          <Reveal delay={0.35}>
            <p className="mx-auto mt-5 max-w-2xl text-[0.95rem] leading-relaxed font-light text-amber-50/65 sm:mt-7 sm:text-base md:text-lg">
              {intro}
            </p>
          </Reveal>
        )}
      </div>
    </header>
  );
}