import { cache } from "react";
import { getEventBySlug, getEvents, getUpcomingEvents } from "./events";
import { getLeaders, getMinistries } from "./ministries";
import { getSermonBySlug, getSermons } from "./sermons";
import type { ChurchEvent, Sermon } from "./types";
import { isSanityConfigured } from "@/sanity/env";

export { siteSettings, NAV_LINKS } from "./site";
export * from "./types";
export {
  visionMission,
  storyTimeline,
  statementOfFaith,
  expectCards,
  faqs,
  welcomeStatement,
} from "./pages";
export { getEventBySlug, getEvents, getUpcomingEvents } from "./events";
export { getSermonBySlug, getSermons } from "./sermons";
export { getLeaders, getMinistries, getMinistryBySlug } from "./ministries";

/**
 * Content access layer.
 *
 * Pages call the `load*` functions below. When SANITY_PROJECT_ID /
 * NEXT_PUBLIC_SANITY_PROJECT_ID is configured they are served from Sanity
 * (see `src/sanity/` and `src/lib/sanity.ts`); otherwise — or if the CMS is
 * unreachable, or a collection is still empty — they fall back to the local
 * placeholder content in `src/content/` so the site never breaks.
 *
 * `cache()` dedupes every read within a single request, so `generateMetadata`
 * and the page component share one query.
 */

/** Load the CMS module only when a project is configured. */
async function cms() {
  if (!isSanityConfigured) return null;
  return import("@/lib/sanity");
}

/** All sermons, newest first. */
export const loadSermons = cache(async (): Promise<Sermon[]> => {
  const api = await cms();
  if (api) {
    const data = await api.sanityGetSermons();
    if (data.length > 0) return data;
  }
  return getSermons();
});

/** The newest sermon — what the home page and sermons page feature. */
export const loadFeaturedSermon = cache(async (): Promise<Sermon | undefined> => {
  const sermons = await loadSermons();
  return sermons[0];
});

/** A single sermon by slug. */
export const loadSermonBySlug = cache(
  async (slug: string): Promise<Sermon | undefined> => {
    const api = await cms();
    if (api) {
      const article = await api.sanityGetSermonBySlug(slug);
      if (article) return article;
    }
    return getSermonBySlug(slug);
  },
);

/** Distinct series names across the archive. */
export const loadSermonSeries = cache(async (): Promise<string[]> => {
  const sermons = await loadSermons();
  return [...new Set(sermons.map((sermon) => sermon.series))];
});

/** Distinct speakers across the archive. */
export const loadSermonSpeakers = cache(async (): Promise<string[]> => {
  const sermons = await loadSermons();
  return [...new Set(sermons.map((sermon) => sermon.speaker))];
});

/** Every event, soonest first. */
export const loadEvents = cache(async (): Promise<ChurchEvent[]> => {
  const api = await cms();
  if (api) {
    const data = await api.sanityGetEvents();
    if (data.length > 0) return data;
  }
  return getEvents();
});

/** Events that have not finished yet, soonest first. */
export const loadUpcomingEvents = cache(async (limit = 3): Promise<ChurchEvent[]> => {
  const api = await cms();
  if (api) {
    const data = await api.sanityGetUpcomingEvents(limit);
    if (data.length > 0) return data;
  }
  return getUpcomingEvents(limit);
});

/** A single event by slug. */
export const loadEventBySlug = cache(
  async (slug: string): Promise<ChurchEvent | undefined> => {
    const api = await cms();
    if (api) {
      const event = await api.sanityGetEventBySlug(slug);
      if (event) return event;
    }
    return getEventBySlug(slug);
  },
);

export const loadLeaders = cache(async () => {
  const api = await cms();
  if (api) {
    const data = await api.sanityGetLeaders();
    if (data.length > 0) return data;
  }
  return getLeaders();
});

export const loadMinistries = cache(async () => {
  const api = await cms();
  if (api) {
    const data = await api.sanityGetMinistries();
    if (data.length > 0) return data;
  }
  return getMinistries();
});
