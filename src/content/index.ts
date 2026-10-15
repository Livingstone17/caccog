import { getEvents, getEventBySlug, getUpcomingEvents } from "./events";
import { getLeaders } from "./ministries";
import { getMinistries, getMinistryBySlug } from "./ministries";
import {
  getFeaturedSermon,
  getSermonBySlug,
  getSermons,
  getSermonSeries,
  getSermonSpeakers,
} from "./sermons";

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
export {
  getEvents,
  getEventBySlug,
  getUpcomingEvents,
  getSermons,
  getSermonBySlug,
  getFeaturedSermon,
  getSermonSeries,
  getSermonSpeakers,
  getLeaders,
  getMinistries,
  getMinistryBySlug,
};

/**
 * Content access layer.
 *
 * Phase 1 runs entirely on the local placeholder content in `src/content/`.
 * When SANITY_PROJECT_ID is configured, queries are served from Sanity
 * instead (see `sanity/` schemas and src/lib/sanity.ts), with automatic
 * fallback to local content if the CMS is unreachable — the site never breaks
 * because of a CMS outage.
 */
const sanityConfigured = Boolean(process.env.SANITY_PROJECT_ID);

export async function loadSermons() {
  if (sanityConfigured) {
    try {
      const { sanityGetSermons } = await import("@/lib/sanity");
      const data = await sanityGetSermons();
      if (data.length > 0) return data;
    } catch {
      /* fall through to local content */
    }
  }
  return getSermons();
}

export async function loadEvents() {
  if (sanityConfigured) {
    try {
      const { sanityGetEvents } = await import("@/lib/sanity");
      const data = await sanityGetEvents();
      if (data.length > 0) return data;
    } catch {
      /* fall through to local content */
    }
  }
  return getEvents();
}

export async function loadLeaders() {
  if (sanityConfigured) {
    try {
      const { sanityGetLeaders } = await import("@/lib/sanity");
      const data = await sanityGetLeaders();
      if (data.length > 0) return data;
    } catch {
      /* fall through to local content */
    }
  }
  return getLeaders();
}

export async function loadMinistries() {
  if (sanityConfigured) {
    try {
      const { sanityGetMinistries } = await import("@/lib/sanity");
      const data = await sanityGetMinistries();
      if (data.length > 0) return data;
    } catch {
      /* fall through to local content */
    }
  }
  return getMinistries();
}
