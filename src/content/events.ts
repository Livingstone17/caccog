import type { ChurchEvent } from "./types";

/**
 * Sample upcoming events — all titles/venues are placeholders.
 * Dates are illustrative only and must be replaced (CONTENT_TODO.md).
 */
export const events: ChurchEvent[] = [
  {
    id: "e-01",
    slug: "event-name-01",
    title: "[Event name — 01]",
    description:
      "[Event description — to be supplied. Include what guests should know before they arrive.]",
    startsAt: "2026-11-01T17:00:00+01:00",
    endsAt: "2026-11-01T19:30:00+01:00",
    venue: "[Venue name]",
    location: "[Venue address, City]",
  },
  {
    id: "e-02",
    slug: "event-name-02",
    title: "[Event name — 02]",
    description:
      "[Event description — to be supplied. Include what guests should know before they arrive.]",
    startsAt: "2026-11-15T10:00:00+01:00",
    endsAt: "2026-11-15T13:00:00+01:00",
    venue: "[Venue name]",
    location: "[Venue address, City]",
  },
  {
    id: "e-03",
    slug: "event-name-03",
    title: "[Event name — 03]",
    description:
      "[Event description — to be supplied. Include what guests should know before they arrive.]",
    startsAt: "2026-12-06T17:00:00+01:00",
    endsAt: "2026-12-06T20:00:00+01:00",
    venue: "[Venue name]",
    location: "[Venue address, City]",
  },
];

export function getUpcomingEvents(limit = 3): ChurchEvent[] {
  const now = Date.now();
  return [...events]
    .filter((e) => new Date(e.endsAt ?? e.startsAt).getTime() >= now)
    .sort((a, b) => (a.startsAt > b.startsAt ? 1 : -1))
    .slice(0, limit);
}

export function getEvents(): ChurchEvent[] {
  return [...events].sort((a, b) => (a.startsAt > b.startsAt ? 1 : -1));
}

export function getEventBySlug(slug: string): ChurchEvent | undefined {
  return events.find((e) => e.slug === slug);
}
