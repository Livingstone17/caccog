import type { Sermon } from "./types";

/**
 * Sample sermons — titles/speakers/series are placeholders to be replaced
 * from the church's media archive (CONTENT_TODO.md).
 * videoId is intentionally null until real YouTube links are supplied.
 */
export const sermons: Sermon[] = [
  {
    id: "s-01",
    slug: "sermon-title-01",
    title: "[Sermon title — 01]",
    series: "[Series name — A]",
    speaker: "[Pastor name]",
    date: "2026-10-11",
    scripture: "[Scripture reference]",
    excerpt: "[Short sermon excerpt — to be supplied from the message.]",
    videoId: null,
    audioUrl: null,
    featured: true,
  },
  {
    id: "s-02",
    slug: "sermon-title-02",
    title: "[Sermon title — 02]",
    series: "[Series name — A]",
    speaker: "[Pastor name]",
    date: "2026-10-04",
    scripture: "[Scripture reference]",
    excerpt: "[Short sermon excerpt — to be supplied from the message.]",
    videoId: null,
    audioUrl: null,
  },
  {
    id: "s-03",
    slug: "sermon-title-03",
    title: "[Sermon title — 03]",
    series: "[Series name — B]",
    speaker: "[Minister name]",
    date: "2026-09-27",
    scripture: "[Scripture reference]",
    excerpt: "[Short sermon excerpt — to be supplied from the message.]",
    videoId: null,
    audioUrl: null,
  },
  {
    id: "s-04",
    slug: "sermon-title-04",
    title: "[Sermon title — 04]",
    series: "[Series name — B]",
    speaker: "[Minister name]",
    date: "2026-09-20",
    scripture: "[Scripture reference]",
    excerpt: "[Short sermon excerpt — to be supplied from the message.]",
    videoId: null,
    audioUrl: null,
  },
  {
    id: "s-05",
    slug: "sermon-title-05",
    title: "[Sermon title — 05]",
    series: "[Series name — C]",
    speaker: "[Pastor name]",
    date: "2026-09-13",
    scripture: "[Scripture reference]",
    excerpt: "[Short sermon excerpt — to be supplied from the message.]",
    videoId: null,
    audioUrl: null,
  },
  {
    id: "s-06",
    slug: "sermon-title-06",
    title: "[Sermon title — 06]",
    series: "[Series name — C]",
    speaker: "[Minister name]",
    date: "2026-09-06",
    scripture: "[Scripture reference]",
    excerpt: "[Short sermon excerpt — to be supplied from the message.]",
    videoId: null,
    audioUrl: null,
  },
];

export function getSermons(): Sermon[] {
  return [...sermons].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getFeaturedSermon(): Sermon {
  return getSermons()[0];
}

export function getSermonBySlug(slug: string): Sermon | undefined {
  return sermons.find((s) => s.slug === slug);
}

export function getSermonSeries(): string[] {
  return [...new Set(sermons.map((s) => s.series))];
}

export function getSermonSpeakers(): string[] {
  return [...new Set(sermons.map((s) => s.speaker))];
}
