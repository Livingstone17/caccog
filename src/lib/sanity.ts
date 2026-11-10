import type { SanityImageSource } from "@sanity/image-url";
import type { ChurchEvent, Leader, Ministry, Sermon } from "@/content/types";
import { SANITY_TAGS, sanityFetch } from "@/sanity/fetch";
import { imageUrl } from "@/sanity/image";
import {
  eventBySlugQuery,
  eventsQuery,
  ministriesQuery,
  sermonBySlugQuery,
  sermonsQuery,
  staffProfilesQuery,
  upcomingEventsQuery,
} from "@/sanity/queries";

/**
 * Maps Sanity documents onto the site's content types (see
 * `src/content/types.ts`). Queries live in `src/sanity/queries.ts`; the
 * fallback to local placeholder content happens one layer up in
 * `src/content/index.ts`.
 *
 * Every query returns `null` when the CMS is not configured or unreachable, so
 * nothing here throws into a page render.
 */

interface PortableTextBlock {
  children?: { text?: string }[];
}

function blocksToText(blocks: PortableTextBlock[] | undefined): string {
  if (!blocks) return "";
  return blocks
    .map((block) => block.children?.map((child) => child.text ?? "").join("") ?? "")
    .join(" ")
    .trim();
}

interface RawSermon {
  _id: string;
  title?: string;
  slug?: string | null;
  series?: string;
  speaker?: string;
  date?: string;
  scripture?: string;
  description?: PortableTextBlock[];
  coverImage?: SanityImageSource;
  audiomackEmbedUrl?: string;
  youtubeId?: string;
  audioUrl?: string;
  featured?: boolean;
}

function mapSermon(row: RawSermon): Sermon {
  return {
    id: row._id,
    slug: row.slug ?? row._id,
    title: row.title ?? "[Untitled sermon]",
    series: row.series ?? "[Series]",
    speaker: row.speaker ?? "[Speaker]",
    date: row.date ?? new Date().toISOString().slice(0, 10),
    scripture: row.scripture,
    excerpt: blocksToText(row.description) || "[Excerpt to be supplied.]",
    videoId: row.youtubeId ?? null,
    audioUrl: row.audioUrl ?? null,
    featured: row.featured,
    coverImageUrl: imageUrl(row.coverImage, { width: 1600, height: 900 }),
    audiomackEmbedUrl: row.audiomackEmbedUrl ?? null,
  };
}

/** All sermons, newest first. */
export async function sanityGetSermons(): Promise<Sermon[]> {
  const rows = await sanityFetch<RawSermon[]>({
    query: sermonsQuery,
    tags: [SANITY_TAGS.sermon],
  });
  return (rows ?? []).map(mapSermon);
}

/** A single sermon by slug, or null when it does not exist. */
export async function sanityGetSermonBySlug(slug: string): Promise<Sermon | null> {
  const row = await sanityFetch<RawSermon | null>({
    query: sermonBySlugQuery,
    params: { slug },
    tags: [SANITY_TAGS.sermon],
  });
  return row ? mapSermon(row) : null;
}

interface RawEvent {
  _id: string;
  title?: string;
  slug?: string | null;
  eventDate?: string;
  endDate?: string;
  venue?: string;
  location?: string;
  category?: string;
  isMultiDay?: boolean;
  dailySchedule?: string;
  details?: PortableTextBlock[];
  bannerImage?: SanityImageSource;
}

function mapEvent(row: RawEvent): ChurchEvent {
  const startsAt = row.eventDate ?? new Date().toISOString();
  return {
    id: row._id,
    slug: row.slug ?? row._id,
    title: row.title ?? "[Untitled event]",
    description: blocksToText(row.details) || "[Details to be supplied.]",
    startsAt,
    endsAt: row.endDate ?? startsAt,
    isMultiDay: row.isMultiDay,
    dailySchedule: row.dailySchedule,
    venue: row.venue ?? "[Venue]",
    location: row.location ?? "",
    category: row.category,
    bannerImageUrl: imageUrl(row.bannerImage, { width: 1600, height: 900 }),
  };
}

/** Every event, soonest first. */
export async function sanityGetEvents(): Promise<ChurchEvent[]> {
  const rows = await sanityFetch<RawEvent[]>({
    query: eventsQuery,
    tags: [SANITY_TAGS.churchEvent],
  });
  return (rows ?? []).map(mapEvent);
}

/** Events that have not finished yet, soonest first. */
export async function sanityGetUpcomingEvents(limit = 3): Promise<ChurchEvent[]> {
  const rows = await sanityFetch<RawEvent[]>({
    query: upcomingEventsQuery,
    params: { limit },
    tags: [SANITY_TAGS.churchEvent],
  });
  return (rows ?? []).map(mapEvent);
}

/** A single event by slug, or null when it does not exist. */
export async function sanityGetEventBySlug(slug: string): Promise<ChurchEvent | null> {
  const row = await sanityFetch<RawEvent | null>({
    query: eventBySlugQuery,
    params: { slug },
    tags: [SANITY_TAGS.churchEvent],
  });
  return row ? mapEvent(row) : null;
}

interface RawStaffProfile {
  _id: string;
  name?: string;
  role?: string;
  bio?: PortableTextBlock[];
  photo?: SanityImageSource;
}

export async function sanityGetLeaders(): Promise<Leader[]> {
  const rows = await sanityFetch<RawStaffProfile[]>({
    query: staffProfilesQuery,
    tags: [SANITY_TAGS.staffProfile],
  });
  return (rows ?? []).map((row) => ({
    id: row._id,
    name: row.name ?? "[Leader name]",
    role: row.role ?? "[Role]",
    bio: blocksToText(row.bio) || "[Short bio — to be supplied.]",
    photoUrl: imageUrl(row.photo, { width: 800, height: 1000, quality: 85 }),
  }));
}

interface RawMinistry {
  _id: string;
  name?: string;
  slug?: string | null;
  summary?: string;
  description?: PortableTextBlock[];
  meetingTime?: string;
  leader?: string;
}

export async function sanityGetMinistries(): Promise<Ministry[]> {
  const rows = await sanityFetch<RawMinistry[]>({
    query: ministriesQuery,
    tags: [SANITY_TAGS.ministry],
  });
  return (rows ?? []).map((row) => ({
    id: row._id,
    slug: row.slug ?? row._id,
    name: row.name ?? "[Ministry]",
    summary: row.summary ?? "[One-line summary]",
    description: blocksToText(row.description) || "[Description to be supplied.]",
    meetingTime: row.meetingTime ?? null,
    leader: row.leader ?? null,
  }));
}
