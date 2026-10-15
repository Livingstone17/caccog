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
}

export interface ChurchEvent {
  id: string;
  slug: string;
  title: string;
  description: string;
  /** ISO 8601 with timezone offset, e.g. 2026-11-08T17:00:00+01:00 */
  startsAt: string;
  endsAt?: string;
  venue: string;
  location?: string;
  imageAlt?: string;
}

export interface Leader {
  id: string;
  name: string;
  role: string;
  bio: string;
  photoUrl: string | null;
}

export interface Ministry {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string;
  meetingTime: string;
  leader: string;
}

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
