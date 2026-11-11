import type { StaticImageData } from "next/image";

export type Leader = {
  id: string;
  name: string;
  role: string;
  bio: string;
  photoUrl?: string | StaticImageData | null; // <--- UPDATE THIS LINE
};

export interface ServiceTime {
  id: string;
  label: string;
  day: string;
  time: string;
  note?: string;
}

export interface Sermon {
  id: string;
  slug: string;
  title: string;
  series: string;
  speaker: string;
  date: string; // ISO yyyy-mm-dd
  scripture?: string;
  excerpt: string;
  /** YouTube video ID. Null = not yet supplied (renders a pending state). */
  videoId: string | null;
  /** Optional downloadable audio URL. */
  audioUrl: string | null;
  featured?: boolean;
  /** Sanity cover image, already sized for the page backdrop. */
  coverImageUrl?: string | null;
  /** Audiomack embed URL managed in the CMS (`audiomackEmbedUrl`). */
  audiomackEmbedUrl?: string | null;
  /**
   * Audiomack song id for archive recordings. With no `videoId`, this is what
   * the embed player builds its URL from.
   */
  audiomackId?: string | null;
}

export interface AudioMessage {
  /** Audiomack song id — used by the official embed and the track page. */
  id: string;
  /** Title exactly as published on Audiomack. */
  title: string;
  /** ISO yyyy-mm-dd release date reported by Audiomack. */
  date: string;
  /** Length exactly as Audiomack prints it, e.g. "1:21:34". */
  duration: string;
  /** Credit exactly as Audiomack publishes it, e.g. "PST. SAM BABATOPE". */
  credit: string;
}

export type ChurchEvent = {
  id: string;
  slug: string;
  title: string;
  description: string;
  /** ISO 8601 with timezone offset, e.g. 2026-11-08T17:00:00+01:00 */
  startsAt: string;
  endsAt: string;
  /** Set for events running across several days (e.g. a fasting period). */
  isMultiDay?: boolean;
  /** Free-text note for each day of a multi-day event. */
  dailySchedule?: string;
  venue: string;
  location: string;
  category?: string;
  /** Sanity banner image, already sized for the event page. */
  bannerImageUrl?: string | null;
};

// export interface Leader {
//   id: string;
//   name: string;
//   role: string;
//   bio: string;
//   photoUrl: string | null;
// }

// export interface Ministry {
//   id: string;
//   slug: string;
//   name: string;
//   summary: string;
//   description: string;
//   meetingTime: string;
//   leader: string;
// }

export type Ministry = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string;
  meetingTime: string | null;
  leader: string | null;
};

export interface Faq {
  question: string;
  answer: string;
}

export interface ExpectCard {
  title: string;
  body: string;
}

export interface BankDetails {
  accountName: string;
  accountNumber: string;
  bank: string;
}

export interface GivingPreset {
  label: string;
  /** Amount in kobo (NGN × 100) */
  amountKobo: number;
}

export type GivingPurpose = "tithe" | "offering" | "building" | "missions" | "other";

export interface TimelineEntry {
  year: string;
  title: string;
  body: string;
}
