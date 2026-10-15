"use client";

import type { ChurchEvent } from "@/content/types";
import { buildIcsForEvent } from "@/lib/ics";

export function downloadIcs(event: ChurchEvent) {
  const ics = buildIcsForEvent(event);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${event.slug}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** "Add to calendar" — downloads a standards-compliant .ics file. */
export function AddToCalendarButton({
  event,
  className,
}: {
  event: ChurchEvent;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => downloadIcs(event)}
      className={
        className ??
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/35 px-7 py-3 text-[0.8rem] font-medium tracking-[0.22em] text-white uppercase transition-colors duration-500 hover:border-white/70 hover:bg-white/5"
      }
    >
      Add to calendar
    </button>
  );
}
