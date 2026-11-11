"use client";

import { useEffect, useState } from "react";

interface ShareBarProps {
  url: string;
  title: string;
}

/** Turns a site-relative path into the full URL a visitor can share. */
function absoluteUrl(url: string) {
  if (/^https?:\/\//i.test(url)) return url;
  if (typeof window === "undefined") return url;
  return new URL(url, window.location.origin).toString();
}

/**
 * Clipboard API is unavailable on insecure origins (plain http on a LAN
 * address, some in-app browsers), so fall back to the legacy selection trick.
 */
async function writeToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.top = "-1000px";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  area.setSelectionRange(0, text.length);

  const copied = document.execCommand("copy");
  document.body.removeChild(area);

  if (!copied) throw new Error("Copy command was rejected");
}

export function ShareBar({ url, title }: ShareBarProps) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState(url);

  /**
   * The server cannot know the deployment's domain (NEXT_PUBLIC_SITE_URL may be
   * unset), so the address is resolved against the browser origin after mount.
   */
  useEffect(() => {
    setShareUrl(absoluteUrl(url));
  }, [url]);

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const copy = async () => {
    try {
      await writeToClipboard(absoluteUrl(url));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  const networks = [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-orange text-[0.62rem] tracking-[0.28em] uppercase">
        Share
      </span>
      {networks.map((n) => (
        <a
          key={n.label}
          href={n.href}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:border-orange/50 hover:text-ember inline-flex min-h-10 items-center rounded-full border border-white/15 px-4 text-xs tracking-[0.16em] text-white/75 uppercase transition-colors duration-500"
        >
          {n.label}
        </a>
      ))}
      <button
        type="button"
        onClick={copy}
        className="border-orange/40 text-orange hover:bg-orange/10 hover:text-ember inline-flex min-h-10 items-center rounded-full border px-4 text-xs tracking-[0.16em] uppercase transition-colors duration-500"
      >
        {copied ? "Link copied" : "Copy link"}
      </button>
    </div>
  );
}
