"use client";

import { useState } from "react";

interface ShareBarProps {
  url: string;
  title: string;
}

export function ShareBar({ url, title }: ShareBarProps) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
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
