"use client";

import { useState } from "react";
import Image from "next/image";
import { siteSettings } from "@/content/site";
import { audioMessages, audiomack } from "@/content/audiomack";
import { AudioPlayer } from "@/components/sermons/audio-player";
import { ButtonLink } from "@/components/ui/button";
import { cn, isPlaceholder } from "@/lib/utils";

const live = siteSettings.livestream;
const latestAudio = audioMessages[0];

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
 * (same privacy posture as the sermon facades). While no YouTube live ID has
 * been supplied the page still has something to listen to — the newest
 * recording from the church's Audiomack account.
 */
export function LivePlayer({
  onAir = false,
  className,
}: {
  /** True while `/api/live` reports the church is streaming. */
  onAir?: boolean;
  className?: string;
}) {
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

  // On air with no embeddable stream configured — send people to the stream.
  if (onAir && !id) {
    return (
      <div
        className={cn(
          "border-red-500/40 bg-charcoal/60 relative overflow-hidden border p-8 md:p-12",
          className,
        )}
      >
        <span
          className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(239,68,68,0.16),transparent_70%)]"
          aria-hidden
        />
        <div className="relative">
          <p className="flex items-center gap-3 text-[0.62rem] tracking-[0.28em] text-red-400 uppercase">
            <span className="relative flex size-2">
              <span
                className="absolute inline-flex size-full animate-ping rounded-full bg-red-500 opacity-70 motion-reduce:hidden"
                aria-hidden
              />
              <span
                className="relative inline-flex size-2 rounded-full bg-red-500"
                aria-hidden
              />
            </span>
            On air now
          </p>
          <h2 className="font-display mt-5 text-3xl leading-snug font-light text-white md:text-4xl">
            We&apos;re live right now
          </h2>
          <p className="text-muted mt-4 max-w-md text-sm leading-relaxed">
            The service is streaming on our Facebook page. Join the congregation from
            wherever you are — the recording is usually posted afterwards.
          </p>
          {live.watchUrl && !isPlaceholder(live.watchUrl) && (
            <div className="mt-8">
              <ButtonLink href={live.watchUrl} external>
                {live.watchLabel}
              </ButtonLink>
            </div>
          )}
        </div>
      </div>
    );
  }

  // No stream configured — play the latest recording instead of an empty panel.
  if (!id) {
    return (
      <div className={cn("grid gap-10 lg:grid-cols-2 lg:gap-14", className)}>
        <AudioPlayer
          message={latestAudio}
          handle={audiomack.handle}
          profileUrl={audiomack.profileUrl}
          eyebrow="Latest recording"
        />

        <div className="flex flex-col justify-center">
          <p className="eyebrow">Off air</p>
          <h2 className="font-display mt-4 text-3xl leading-snug font-light text-white md:text-4xl">
            No live stream right now
          </h2>
          <p className="text-muted mt-4 max-w-md text-sm leading-relaxed">
            The stream will appear here whenever we go live. Until then, listen to the
            latest message from our archive — every recording is hosted on Audiomack.
          </p>
          {live.watchUrl && !isPlaceholder(live.watchUrl) && (
            <div className="mt-8">
              <ButtonLink href={live.watchUrl} variant="ghost" external>
                {live.watchLabel}
              </ButtonLink>
            </div>
          )}
        </div>
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
