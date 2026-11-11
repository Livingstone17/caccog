import { isSanityConfigured } from "@/sanity/env";
import { SANITY_TAGS, sanityFetch } from "@/sanity/fetch";

/**
 * "Is the church streaming right now?"
 *
 * Two sources, in this order:
 *
 * 1. Facebook Graph API — only when FACEBOOK_PAGE_ACCESS_TOKEN is set. There is
 *    no public endpoint for this: `/{page}/live_videos` needs a Page access
 *    token with `pages_read_engagement`, so with nothing but the page name
 *    there is no way to ask Facebook automatically.
 * 2. The `isLive` toggle in Sanity → Site settings. Works today, needs no
 *    token, and is the switch the media team flips when a stream starts/ends.
 */
export interface LiveStatus {
  live: boolean;
  source: "facebook" | "editorial" | "none";
  checkedAt: string;
}

/** True/false from Facebook, or null when the token is missing or the call fails. */
async function facebookIsLive(): Promise<boolean | null> {
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  if (!token) return null;

  const page = process.env.FACEBOOK_PAGE_ID ?? "me";
  const url = new URL(`https://graph.facebook.com/v21.0/${page}/live_videos`);
  url.searchParams.set("fields", "id,status");
  url.searchParams.set("limit", "5");
  url.searchParams.set("access_token", token);

  try {
    const response = await fetch(url, {
      // Facebook flips this within seconds; 30s is fresh enough for a badge and
      // keeps us far below any rate limit.
      next: { revalidate: 30 },
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) return null;

    const body = (await response.json()) as { data?: { status?: string }[] };
    return (body.data ?? []).some((video) => video.status === "LIVE");
  } catch {
    // Network error, timeout or an expired token: fall back to the toggle.
    return null;
  }
}

/** The Studio toggle, or null when Sanity is unconfigured/unreachable. */
async function editorialIsLive(): Promise<boolean | null> {
  if (!isSanityConfigured) return null;

  const flag = await sanityFetch<boolean | null>({
    query: `*[_type == "siteSettings"][0].isLive`,
    tags: [SANITY_TAGS.siteSettings],
  });

  return typeof flag === "boolean" ? flag : null;
}

export async function getLiveStatus(): Promise<LiveStatus> {
  const fromFacebook = await facebookIsLive();
  if (fromFacebook !== null) {
    return { live: fromFacebook, source: "facebook", checkedAt: new Date().toISOString() };
  }

  const fromEditor = await editorialIsLive();
  if (fromEditor !== null) {
    return { live: fromEditor, source: "editorial", checkedAt: new Date().toISOString() };
  }

  return { live: false, source: "none", checkedAt: new Date().toISOString() };
}
