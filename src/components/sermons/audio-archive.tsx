"use client";

import { useRef, useState } from "react";
import type { AudioMessage } from "@/content/types";
import { formatShortDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { AudioPlayer } from "./audio-player";

interface AudioArchiveProps {
  messages: AudioMessage[];
  /** Audiomack account that hosts the recordings. */
  handle: string;
  /** Audiomack account page, used for the "open on Audiomack" fallback. */
  profileUrl: string;
  className?: string;
}

/**
 * Sermon audio lives on Audiomack, so playback uses Audiomack's official embed.
 * Nothing is requested from Audiomack until the visitor presses play — the same
 * click-to-load rule the YouTube facade follows.
 */
export function AudioArchive({
  messages,
  handle,
  profileUrl,
  className,
}: AudioArchiveProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const active = messages.find((message) => message.id === activeId) ?? null;
  const latest = messages[0];

  if (!latest) return null;

  /**
   * On narrow screens the player sits above the list, so selecting a message
   * would otherwise change something that is off-screen. Bring it into view.
   */
  function select(id: string) {
    setActiveId(id);
    if (window.matchMedia("(max-width: 1023px)").matches) {
      requestAnimationFrame(() => {
        playerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  return (
    <div className={cn("grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-14", className)}>
      <div ref={playerRef} className="scroll-mt-24">
        <AudioPlayer
          key={active?.id ?? latest.id}
          message={active ?? latest}
          handle={handle}
          profileUrl={profileUrl}
          eyebrow="Latest audio"
          autoLoad={Boolean(active)}
          autoplay={Boolean(active)}
        />
      </div>

      <ul className="divide-y divide-white/10 border-y border-white/10">
        {messages.map((message) => {
          const isActive = message.id === activeId;
          return (
            <li key={message.id}>
              <button
                type="button"
                onClick={() => select(message.id)}
                aria-pressed={isActive}
                className={cn(
                  "group flex w-full items-center gap-4 py-4 text-left transition-colors duration-300",
                  isActive ? "text-orange" : "hover:text-orange text-white",
                )}
              >
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
                    isActive
                      ? "border-orange bg-orange/15"
                      : "group-hover:border-orange/60 border-white/25",
                  )}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="ml-0.5 size-3.5"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M8 5.5v13l11-6.5L8 5.5Z" />
                  </svg>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm leading-snug md:text-[0.95rem]">
                    {message.title}
                  </span>
                  <span className="text-muted mt-1 flex flex-wrap gap-x-2 text-[0.62rem] tracking-[0.2em] uppercase">
                    <span>Feat. {message.credit}</span>
                    <time dateTime={message.date} className="whitespace-nowrap">
                      {formatShortDate(message.date)}
                    </time>
                  </span>
                </span>
                <span className="shrink-0 text-xs text-white/45 tabular-nums">
                  {message.duration}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
