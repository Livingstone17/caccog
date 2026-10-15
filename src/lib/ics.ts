import type { ChurchEvent } from "@/content/types";
import { siteSettings } from "@/content/site";

function escapeIcs(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function toIcsDate(iso: string): string {
  return new Date(iso)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

/** Builds a single-event .ics document (Add to calendar). */
export function buildIcsForEvent(event: ChurchEvent): string {
  const stamp = toIcsDate(new Date().toISOString());
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Citadel of Grace//Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.id}@citadel-of-grace`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${toIcsDate(event.startsAt)}`,
    event.endsAt ? `DTEND:${toIcsDate(event.endsAt)}` : null,
    `SUMMARY:${escapeIcs(event.title)}`,
    `DESCRIPTION:${escapeIcs(event.description)}`,
    `LOCATION:${escapeIcs(
      [event.venue, event.location, siteSettings.city].filter(Boolean).join(", "),
    )}`,
    `URL:${escapeIcs(`${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/events/${event.slug}`)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter((line): line is string => line !== null);

  return lines.join("\r\n");
}
