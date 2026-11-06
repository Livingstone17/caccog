"use client";

import { useState } from "react";
import { siteSettings } from "@/content/site";
import { isPlaceholder } from "@/lib/utils";

const frameClass =
  "bg-charcoal/40 relative aspect-[16/10] w-full overflow-hidden border border-white/10";

/**
 * Click-to-load Google Maps panel: no third-party request until the visitor
 * opens the map, which is what the privacy page promises (same pattern as the
 * YouTube facade).
 */
export function MapPanel() {
  const [open, setOpen] = useState(false);
  const mapUrl = siteSettings.mapEmbedUrl;
  const hasMap = Boolean(mapUrl) && !isPlaceholder(mapUrl);

  if (!hasMap) {
    return (
      <div className={`${frameClass} border-orange/35 border-dashed`}>
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_45%,rgba(255,122,26,0.1),transparent_70%)]" />
        <div className="relative flex h-full items-center justify-center px-8 text-center">
          <div>
            <p className="eyebrow">Map pending</p>
            <p className="text-muted mt-3 max-w-sm text-sm leading-relaxed">
              The Google map will appear here once the confirmed address is supplied.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (open) {
    return (
      <div className={frameClass}>
        <iframe
          src={mapUrl}
          title={`Map showing the location of ${siteSettings.name}`}
          className="absolute inset-0 size-full contrast-[1.05] grayscale-[0.25]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className={`${frameClass} group block text-left`}
      aria-label={`Open the map for ${siteSettings.name}`}
    >
      <span
        className="absolute inset-0 opacity-[0.18]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(60% 60% at 50% 50%, black, transparent 80%)",
        }}
      />
      <span className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_45%,rgba(255,122,26,0.12),transparent_70%)]" />
      <span className="relative flex h-full flex-col items-center justify-center px-8 text-center">
        <span className="border-orange/70 group-hover:border-orange group-hover:bg-orange/90 flex size-14 items-center justify-center rounded-full border bg-black/50 transition-[background-color,border-color] duration-500">
          <svg
            viewBox="0 0 24 24"
            className="text-ember group-hover:text-black size-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden
          >
            <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
        </span>
        <span className="font-display mt-5 text-xl font-normal text-white">
          {siteSettings.name}
        </span>
        <span className="text-muted mt-1 text-sm">
          {siteSettings.address.line1}, {siteSettings.address.city}
        </span>
        <span className="text-orange mt-5 text-[0.68rem] tracking-[0.24em] uppercase">
          Open the map
        </span>
      </span>
    </button>
  );
}
