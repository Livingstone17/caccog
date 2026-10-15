"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function CopyButton({
  value,
  label = "Copy",
  className,
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : `Copy ${label}`}
      className={cn(
        "border-orange/40 text-orange hover:bg-orange/10 hover:text-ember inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-xs tracking-[0.18em] uppercase transition-colors duration-500",
        copied && "border-ember/60 text-ember",
        className,
      )}
    >
      {copied ? "Copied ✓" : label}
    </button>
  );
}
