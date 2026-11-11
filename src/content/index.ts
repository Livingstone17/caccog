import { cache } from "react";
import { getEvents } from "./events";
import { dedupeBySlug } from "./mappers";
import { getLeaders, getMinistries, ourLeaders } from "./ministries";
import { getAudioMessagesAsSermons, getSermons } from "./sermons";
import type { ChurchEvent, Leader, Sermon } from "./types";
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
 * The local content in `src/content` is both the fallback and the seed: the
 * loaders below merge CMS documents on top of it instead of replacing it, so a
 * missing dataset, a CMS outage or a document the media team has not migrated
 * yet never removes an item from the site.
 *
 * CMS items are placed first, which makes them win the slug de-duplication, and
 * every fetch is guarded so a failing query degrades to local content.
 */

/** Load the CMS module only when a project is configured. */
async function cms() {
  if (!isSanityConfigured) return null;
  return import("@/lib/sanity");
}

/** All sermons: CMS + local entries + Audiomack archive, newest first. */
export const loadSermons = cache(async (): Promise<Sermon[]> => {
  const api = await cms();

  let cmsSermons: Sermon[] = [];
  if (api) {
    try {
      cmsSermons = await api.sanityGetSermons();
    } catch (error) {
      console.error("[content] Sanity sermons unavailable, using local archive:", error);
    }
  }

  const merged = dedupeBySlug([
    ...cmsSermons,
    ...getSermons(),
    ...getAudioMessagesAsSermons(),
  ]);

  return merged.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
});

/** The newest sermon — what the home page and sermons page feature. */
export const loadFeaturedSermon = cache(async (): Promise<Sermon | undefined> => {
  const sermons = await loadSermons();
  return sermons[0];
});

/** A single sermon by slug, resolved against every source. */
export const loadSermonBySlug = cache(
  async (slug: string): Promise<Sermon | undefined> => {
    const sermons = await loadSermons();
    return sermons.find((sermon) => sermon.slug === slug);
  },
);

/** Distinct series names across the merged archive. */
export const loadSermonSeries = cache(async (): Promise<string[]> => {
  const sermons = await loadSermons();
  return [...new Set(sermons.map((sermon) => sermon.series).filter(Boolean))];
});

/** Distinct speakers across the merged archive. */
export const loadSermonSpeakers = cache(async (): Promise<string[]> => {
  const sermons = await loadSermons();
  return [...new Set(sermons.map((sermon) => sermon.speaker).filter(Boolean))];
});

/** Every event: CMS + local entries, soonest first. */
export const loadEvents = cache(async (): Promise<ChurchEvent[]> => {
  const api = await cms();

  let cmsEvents: ChurchEvent[] = [];
  if (api) {
    try {
      cmsEvents = await api.sanityGetEvents();
    } catch (error) {
      console.error("[content] Sanity events unavailable, using local events:", error);
    }
  }

  const merged = dedupeBySlug([...cmsEvents, ...getEvents()]);

  return merged.sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  );
});

/** Events that have not finished yet, soonest first. */
export const loadUpcomingEvents = cache(
  async (limit = 3): Promise<ChurchEvent[]> => {
    const now = Date.now();
    const events = await loadEvents();

    return events
      .filter((event) => new Date(event.endsAt ?? event.startsAt).getTime() >= now)
      .slice(0, limit);
  },
);

/** A single event by slug, resolved against every source. */
export const loadEventBySlug = cache(
  async (slug: string): Promise<ChurchEvent | undefined> => {
    const events = await loadEvents();
    return events.find((event) => event.slug === slug);
  },
);

export const loadLeaders = cache(async (): Promise<Leader[]> => {
  const api = await cms();
  let sanityLeaders: Leader[] = [];

  // 1. Fetch from Sanity if the CMS is configured and available
  if (api) {
    try {
      sanityLeaders = await api.sanityGetLeaders();
    } catch (error) {
      console.error("[content] Sanity leaders unavailable, using local team:", error);
    }
  }
  // 2. Keep every local leader whose name is not already in the CMS
  const uniqueJsonLeaders = ourLeaders.filter(
    (jsonLeader) =>
      !sanityLeaders.some((sanityLeader) => sanityLeader.name === jsonLeader.name),
  );
  // 3. Combine them: local team first, then the CMS staff profiles
  return [...uniqueJsonLeaders, ...sanityLeaders];
});

export const loadMinistries = cache(async () => {
  const api = await cms();
  if (api) {
    try {
      const data = await api.sanityGetMinistries();
      if (data.length > 0) return data;
    } catch (error) {
      console.error("[content] Sanity ministries unavailable, using local list:", error);
    }
  }
  return getMinistries();
});
