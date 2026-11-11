import type { QueryParams } from "@sanity/client";
import { getSanityClient } from "./client";
import { isSanityConfigured } from "./env";

/**
 * Cache tags used by the on-demand revalidation webhook (`/api/revalidate`).
 * One tag per document type, so publishing a sermon does not invalidate the
 * events cache and vice versa.
 */
export const SANITY_TAGS = {
  sermon: "sermon",
  churchEvent: "churchEvent",
  blogPost: "blogPost",
  staffProfile: "staffProfile",
  ministry: "ministry",
  siteSettings: "siteSettings",
} as const;

export type SanityTag = (typeof SANITY_TAGS)[keyof typeof SANITY_TAGS];

interface SanityFetchOptions {
  query: string;
  params?: QueryParams;
  tags: SanityTag[];
}

/**
 * Run a GROQ query through Next's data cache and tag the result.
 *
 * Returns `null` when Sanity is not configured or the request fails; callers
 * fall back to the local placeholder content so a CMS outage (or a missing
 * project) never takes the website down.
 */
export async function sanityFetch<T>({
  query,
  params,
  tags,
}: SanityFetchOptions): Promise<T | null> {
  if (!isSanityConfigured) return null;

  try {
    return await getSanityClient().fetch<T>(query, params ?? {}, {
      next: { tags },
    });
  } catch (error) {
    console.error("[sanity] query failed:", error);
    return null;
  }
}
