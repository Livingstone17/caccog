import type { AudioMessage, Sermon } from "./types";

/** Series label given to every recording that only exists on Audiomack. */
export const AUDIOMACK_SERIES = "Audiomack Archive";

/**
 * Converts an Audiomack recording into the site's `Sermon` shape, so the
 * sermons page can list CMS sermons and Audiomack recordings together.
 *
 * `audiomackId` is what the embed player uses to build its URL; `videoId` stays
 * null because there is no YouTube recording for these messages.
 */
export function audioMessageToSermon(message: AudioMessage): Sermon {
  return {
    id: message.id,
    slug: `audiomack-${message.id}`,
    title: message.title,
    series: AUDIOMACK_SERIES,
    speaker: message.credit,
    date: message.date,
    excerpt: `Audio message by ${message.credit} — duration ${message.duration}.`,
    videoId: null,
    audioUrl: null,
    audiomackId: message.id,
  };
}

export function audioMessagesToSermons(messages: AudioMessage[]): Sermon[] {
  return messages.map(audioMessageToSermon);
}

/**
 * Drops items whose slug was already seen. Order decides the winner, so pass
 * the authoritative source first (CMS before local fallbacks).
 */
export function dedupeBySlug<T extends { slug: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.slug)) return false;
    seen.add(item.slug);
    return true;
  });
}
