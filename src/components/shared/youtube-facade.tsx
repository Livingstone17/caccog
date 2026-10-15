"use client";

import { useState } from "react";
import Image from "next/image";
import { cn, isPlaceholder } from "@/lib/utils";

interface YouTubeFacadeProps {
  videoId: string | null;
  title: string;
  className?: string;
}

/**
 * Click-to-load YouTube facade: no third-party request until the visitor
 * presses play. When no video has been supplied yet it renders an honest
 * "pending" panel instead of a broken embed.
 */
export function YouTubeFacade({ videoId, title, className }: YouTubeFacadeProps) {
  const [playing, setPlaying] = useState(false);

  if (!videoId || isPlaceholder(videoId)) {
    return (
      <div
        className={cn(
          "border-orange/35 bg-charcoal/60 relative flex aspect-video w-full flex-col items-center justify-center overflow-hidden rounded-none border border-dashed",
          className,
        )}
      >
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,rgba(255,122,26,0.12),transparent_70%)]" />
        <span className="eyebrow relative">Video pending</span>
        <p className="text-muted relative mt-3 max-w-xs px-6 text-center text-sm">
          The recording will appear here once the media team supplies the YouTube link.
        </p>
      </div>
    );
  }

  const thumb = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  if (playing) {
    return (
      <div
        className={cn("relative aspect-video w-full overflow-hidden bg-black", className)}
      >
        <iframe
          className="absolute inset-0 size-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className={cn(
        "group bg-charcoal relative aspect-video w-full overflow-hidden text-left",
        className,
      )}
      aria-label={`Play video: ${title}`}
    >
      <Image
        src={thumb}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 60vw"
        className="object-cover opacity-80 transition-opacity duration-700 group-hover:opacity-95"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
      <span className="border-orange/70 group-hover:border-orange group-hover:bg-orange/90 absolute top-1/2 left-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-black/60 backdrop-blur-sm transition-[background-color,border-color] duration-500">
        <svg
          viewBox="0 0 24 24"
          className="text-ember ml-1 size-6 group-hover:text-black"
          fill="currentColor"
          aria-hidden
        >
          <path d="M8 5.5v13l11-6.5L8 5.5Z" />
        </svg>
      </span>
      <span className="absolute inset-x-5 bottom-4 flex items-center gap-3 text-xs tracking-[0.24em] text-white/85 uppercase">
        <span className="h-px flex-1 bg-white/30" />
        Watch message
      </span>
    </button>
  );
}
