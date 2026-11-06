import type { ChurchEvent } from "./types";

/**
 * Sample upcoming events — all titles/venues are placeholders.
 * Dates are illustrative only and must be replaced (CONTENT_TODO.md).
 */

export const events: ChurchEvent[] = [
  {
    id: "e-01",
    slug: "event-name-01",
    title: "800 seaters capacity dedication",
    description: "Dedication of our new auditorium with 800 seaters capacity",
    startsAt: "2026-11-28T10:00:00+01:00",
    endsAt: "2026-11-28T12:00:00+01:00",
    venue: "CAC Citadel of Grace",
    location: "1, Jolaosho street, Alagbado, Lagos",
  },
  {
    id: "e-02",
    slug: "rehoboth-fasting-and-prayer-2026",
    title: "Rehoboth Fasting and Prayer",
    description:
      "22 days of intensive fasting and prayer for the church, families, and the nation.",
    startsAt: "2026-11-01T00:00:00+01:00",
    endsAt: "2026-11-22T23:59:59+01:00",
    isMultiDay: true,
    dailySchedule: "Daily Fasting (6:00 AM – 6:00 PM) • Evening Prayers: 6:00 PM daily",
    venue: "CAC Citadel of Grace",
    location: "1, Jolaosho street, Alagbado, Lagos",
    category: "Fasting & Prayer",
  },
  {
    id: "e-03",
    slug: "event-name-03",
    title: "Cross over service",
    description:
      "A special service to mark the end of the year and the beginning of the new year",
    startsAt: "2026-12-31T22:00:00+01:00",
    endsAt: "2027-01-01T02:00:00+01:00",
    venue: "CAC Citadel of Grace",
    location: "1, Jolaosho street, Alagbado, Lagos",
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
