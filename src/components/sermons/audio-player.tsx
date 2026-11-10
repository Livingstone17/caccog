"use client";

import { useState } from "react";
import type { AudioMessage } from "@/content/types";
import { formatShortDate } from "@/lib/format";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  message: AudioMessage;
  /** Audiomack account that hosts the recordings. */
  handle: string;
  /** Audiomack account page, used for the "open on Audiomack" fallback. */
  profileUrl: string;
  /** Small label above the play button. */
  eyebrow?: string;
  /** Start with the embed loaded — used once the visitor has picked a message. */
  autoLoad?: boolean;
  /**
   * Full Audiomack embed URL managed in the CMS (`audiomackEmbedUrl`). When
   * present it is used instead of the URL built from `handle` + `message.id`.
   */
  embedUrl?: string | null;
  className?: string;
}

/**
 * Audiomack's official embed, loaded only after the visitor asks for it — the
 * same click-to-load rule the YouTube facade follows, so no third-party request
 * is made while the page is idle.
 */
export function AudioPlayer({
  message,
  handle,
  profileUrl,
  eyebrow = "Audio message",
  autoLoad = false,
  embedUrl,
  className,
}: AudioPlayerProps) {
  const [loaded, setLoaded] = useState(autoLoad);
  const src = embedUrl ?? `https://audiomack.com/embed/song/${handle}/${message.id}`;
  const openUrl = embedUrl ?? `${profileUrl}/song/${message.id}`;

  if (loaded) {
    return (
      <div className={className}>
        <div className="border border-white/10 bg-black">
          <iframe
            src={src}
            title={`Listen: ${message.title}`}
            className="h-[240px] w-full border-0"
            scrolling="no"
            loading="lazy"
            allow="autoplay"
          />
        </div>
        <p className="text-muted mt-4 text-xs leading-relaxed">
          Playing {message.title}. Player not loading?{" "}
          <a
            href={openUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange hover:text-ember underline underline-offset-4 transition-colors duration-300"
          >
            Open it on Audiomack
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setLoaded(true)}
      className={cn(
        "group border-orange/35 bg-charcoal/60 hover:border-orange/60 relative flex w-full flex-col items-start justify-between gap-8 overflow-hidden border p-8 text-left transition-colors duration-500 md:min-h-[240px] md:p-10",
        className,
      )}
      aria-label={`Load the player for ${message.title}`}
    >
      <span
        className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,rgba(255,122,26,0.12),transparent_70%)]"
        aria-hidden
      />
      <span className="eyebrow relative">{eyebrow}</span>
      <span className="border-orange/70 group-hover:bg-orange/90 relative flex size-14 items-center justify-center rounded-full border bg-black/50 transition-colors duration-500">
        <svg
          viewBox="0 0 24 24"
          className="text-ember ml-1 size-5 group-hover:text-black"
          fill="currentColor"
          aria-hidden
        >
          <path d="M8 5.5v13l11-6.5L8 5.5Z" />
        </svg>
      </span>
      <span className="relative">
        <span className="font-display block text-2xl leading-snug font-light text-white">
          {message.title}
        </span>
        <span className="text-muted mt-2 block text-[0.62rem] tracking-[0.2em] uppercase">
          Tap to load the player · {formatShortDate(message.date)}
          {message.duration ? ` · ${message.duration}` : ""}
        </span>
      </span>
    </button>
  );
}
