import { createClient, type SanityClient } from "@sanity/client";
import type { ChurchEvent, Leader, Ministry, Sermon } from "@/content/types";

/**
 * Sanity access layer (see /sanity for schemas and the Studio config).
 * All functions throw on failure — callers in src/content fall back to local
 * placeholder content so the site keeps rendering.
 */

let client: SanityClient | null = null;

export function sanityClient(): SanityClient {
  if (client) return client;
  const projectId = process.env.SANITY_PROJECT_ID;
  if (!projectId) throw new Error("SANITY_PROJECT_ID not configured");
  client = createClient({
    projectId,
    dataset: process.env.SANITY_DATASET ?? "production",
    apiVersion: process.env.SANITY_API_VERSION ?? "2026-01-01",
    useCdn: true,
  });
  return client;
}

interface PortableTextBlock {
  children?: { text?: string }[];
}

function blocksToText(blocks: PortableTextBlock[] | undefined): string {
  if (!blocks) return "";
  return blocks
    .map((block) => block.children?.map((c) => c.text ?? "").join("") ?? "")
    .join(" ")
    .trim();
}

interface RawSermon {
  _id: string;
  slug?: { current?: string };
  title?: string;
  series?: string;
  speaker?: string;
  date?: string;
  scripture?: string;
  excerpt?: PortableTextBlock[];
  youtubeId?: string;
  audioUrl?: string;
  featured?: boolean;
}

export async function sanityGetSermons(): Promise<Sermon[]> {
  const query = `*[_type == "sermon" && !(_id in path("drafts.**"))] | order(date desc) {
    _id, slug, title, series, speaker, date, scripture, excerpt, youtubeId, audioUrl, featured
  }`;
  const rows = await sanityClient().fetch<RawSermon[]>(query);
  return rows.map((row) => ({
    id: row._id,
    slug: row.slug?.current ?? row._id,
    title: row.title ?? "[Untitled sermon]",
    series: row.series ?? "[Series]",
    speaker: row.speaker ?? "[Speaker]",
    date: row.date ?? new Date().toISOString().slice(0, 10),
    scripture: row.scripture,
    excerpt: blocksToText(row.excerpt) || "[Excerpt to be supplied.]",
    videoId: row.youtubeId ?? null,
    audioUrl: row.audioUrl ?? null,
    featured: row.featured,
  }));
}

interface RawEvent {
  _id: string;
  slug?: { current?: string };
  title?: string;
  description?: PortableTextBlock[];
  startsAt?: string;
  endsAt?: string;
  venue?: string;
  location?: string;
}

export async function sanityGetEvents(): Promise<ChurchEvent[]> {
  const query = `*[_type == "churchEvent" && !(_id in path("drafts.**"))] | order(startsAt asc) {
    _id, slug, title, description, startsAt, endsAt, venue, location
  }`;
  const rows = await sanityClient().fetch<RawEvent[]>(query);
  return rows.map((row) => ({
    id: row._id,
    slug: row.slug?.current ?? row._id,
    title: row.title ?? "[Untitled event]",
    description: blocksToText(row.description),
    startsAt: row.startsAt ?? new Date().toISOString(),
    endsAt: row.endsAt,
    venue: row.venue ?? "[Venue]",
    location: row.location,
  }));
}

interface RawLeader {
  _id: string;
  name?: string;
  role?: string;
  bio?: PortableTextBlock[];
  photoUrl?: string;
}

export async function sanityGetLeaders(): Promise<Leader[]> {
  const query = `*[_type == "leader" && !(_id in path("drafts.**"))] | order(_createdAt asc) {
    _id, name, role, bio, photoUrl
  }`;
  const rows = await sanityClient().fetch<RawLeader[]>(query);
  return rows.map((row) => ({
    id: row._id,
    name: row.name ?? "[Leader name]",
    role: row.role ?? "[Role]",
    bio: blocksToText(row.bio) || "[Short bio — to be supplied.]",
    photoUrl: row.photoUrl ?? null,
  }));
}

interface RawMinistry {
  _id: string;
  slug?: { current?: string };
  name?: string;
  summary?: string;
  description?: PortableTextBlock[];
  meetingTime?: string;
  leader?: string;
}

export async function sanityGetMinistries(): Promise<Ministry[]> {
  const query = `*[_type == "ministry" && !(_id in path("drafts.**"))] | order(name asc) {
    _id, slug, name, summary, description, meetingTime, leader
  }`;
  const rows = await sanityClient().fetch<RawMinistry[]>(query);
  return rows.map((row) => ({
    id: row._id,
    slug: row.slug?.current ?? row._id,
    name: row.name ?? "[Ministry]",
    summary: row.summary ?? "[One-line summary]",
    description: blocksToText(row.description) || "[Description to be supplied.]",
    meetingTime: row.meetingTime ?? "[Meeting time to confirm]",
    leader: row.leader ?? "[Leader name]",
  }));
}
