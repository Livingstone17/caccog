"use client";

import { useState } from "react";
import Image from "next/image";
import { siteSettings } from "@/content/site";
import { cn, isPlaceholder } from "@/lib/utils";

const live = siteSettings.livestream;

function isChannelId(id: string) {
  return id.startsWith("UC");
}

function embedUrl(id: string) {
  if (isChannelId(id)) {
    return `https://www.youtube-nocookie.com/embed/live_stream?channel=${id}&autoplay=1&rel=0&modestbranding=1`;
  }
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
}

/**
 * Livestream player for the /live page.
 *
 * Click-to-load: no third-party request until the visitor presses play
 * (same privacy posture as the sermon facades). While no YouTube live ID
 * has been supplied it renders the confirmed external watch link plus an
 * honest "pending" panel — never a broken embed.
 */
export function LivePlayer({ className }: { className?: string }) {
  const [playing, setPlaying] = useState(false);
  const rawId = live.youtubeLiveId;
  const id = rawId && !isPlaceholder(rawId) ? rawId : null;

  if (playing && id) {
    return (
      <div
        className={cn("relative aspect-video w-full overflow-hidden bg-black", className)}
      >
        <iframe
          className="absolute inset-0 size-full"
          src={embedUrl(id)}
          title={`Live service — ${siteSettings.name}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  if (!id) {
    return (
      <div
        className={cn(
          "border-orange/35 bg-charcoal/60 relative flex aspect-video w-full flex-col items-center justify-center overflow-hidden border border-dashed",
          className,
        )}
      >
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,rgba(255,122,26,0.12),transparent_70%)]" />
        <span className="eyebrow relative">Stream pending</span>
        <p className="text-muted relative mt-3 max-w-sm px-6 text-center text-sm leading-relaxed">
          The live player will appear here once the media team supplies the YouTube live
          channel or video ID. Until then, join us on the channel below.
        </p>
        {live.watchUrl && !isPlaceholder(live.watchUrl) && (
          <a
            href={live.watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border-orange/60 bg-orange hover:bg-orange-bright hover:border-orange-bright mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border px-7 py-3 text-[0.8rem] font-medium tracking-[0.22em] text-black uppercase transition-[background-color,border-color] duration-500"
          >
            {live.watchLabel}
            <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden>
              <path d="M14 5h5v5h-2V8.4l-5.3 5.3-1.4-1.4L15.6 7H14V5Z" />
              <path d="M6 7h4v2H8v8h8v-2h2v4H6V7Z" />
            </svg>
          </a>
        )}
      </div>
    );
  }

  const thumb = isChannelId(id) ? null : `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className={cn(
        "group bg-charcoal relative aspect-video w-full overflow-hidden text-left",
        className,
      )}
      aria-label={`Join the live service — ${siteSettings.name}`}
    >
      {thumb ? (
        <Image
          src={thumb}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover opacity-80 transition-opacity duration-700 group-hover:opacity-95"
        />
      ) : (
        <span
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(60% 60% at 50% 40%, rgba(255,122,26,0.16), transparent 70%)",
          }}
        />
      )}
      <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
      <span className="border-orange/70 absolute top-5 left-5 rounded-full border bg-black/60 px-3 py-1 text-[0.62rem] font-medium tracking-[0.3em] text-white/85 uppercase backdrop-blur-sm">
        Live stream
      </span>
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
        Join the service
      </span>
    </button>
  );
}
