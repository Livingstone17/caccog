import { timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { SANITY_TAGS, type SanityTag } from "@/sanity/fetch";

/**
 * On-demand revalidation webhook for Sanity.
 *
 * In Sanity: Project settings → API → Webhooks → Create webhook
 *   URL:     https://<your-domain>/api/revalidate
 *   Triggers: Create, Update, Delete
 *   Filter:  _type in ["sermon", "churchEvent", "blogPost", "staffProfile", "ministry", "siteSettings"]
 *   Projection: {"_type": _type, "slug": slug.current}
 *   HTTP headers: Authorization: Bearer $SANITY_REVALIDATE_SECRET
 *
 * The shared secret lives in SANITY_REVALIDATE_SECRET. Nothing here writes to
 * Sanity — it only clears this site's cache, so no write token is involved.
 */
export const runtime = "nodejs";

/** Cache tags and page paths to clear for each document type. */
const ROUTES: Record<string, { tags: SanityTag[]; paths: string[]; detail?: string }> = {
  sermon: {
    tags: [SANITY_TAGS.sermon],
    paths: ["/", "/sermons", "/sitemap.xml"],
    detail: "/sermons",
  },
  churchEvent: {
    tags: [SANITY_TAGS.churchEvent],
    paths: ["/", "/events", "/sitemap.xml"],
    detail: "/events",
  },
  blogPost: {
    tags: [SANITY_TAGS.blogPost],
    paths: ["/sitemap.xml"],
  },
  staffProfile: {
    tags: [SANITY_TAGS.staffProfile],
    paths: ["/about", "/sitemap.xml"],
  },
  ministry: {
    tags: [SANITY_TAGS.ministry],
    paths: ["/", "/ministries", "/sitemap.xml"],
  },
  siteSettings: {
    // Flipping the "church is live" toggle must show up in the nav at once.
    tags: [SANITY_TAGS.siteSettings],
    paths: ["/", "/live"],
  },
};

/** Constant-time comparison so the secret cannot be guessed by timing. */
function isAuthorized(request: Request): boolean {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return false;

  const header = request.headers.get("authorization") ?? "";
  const token = header.replace(/^Bearer\s+/i, "");
  const provided = Buffer.from(token);
  const expected = Buffer.from(secret);

  return provided.length === expected.length && timingSafeEqual(provided, expected);
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ message: "Invalid signature" }, { status: 401 });
  }

  let payload: { _type?: string; slug?: string | { current?: string } } = {};
  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return Response.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const type = payload._type;
  const routes = type ? ROUTES[type] : undefined;
  if (!type || !routes) {
    return Response.json(
      { message: `No revalidation route for document type "${type ?? "unknown"}"` },
      { status: 400 },
    );
  }

  // `expire: 0` = the next request waits for fresh content instead of being
  // served the stale copy, which is what "publish and it appears" means here.
  for (const tag of routes.tags) revalidateTag(tag, { expire: 0 });
  for (const path of routes.paths) revalidatePath(path);

  const slug = typeof payload.slug === "string" ? payload.slug : payload.slug?.current;
  if (slug && routes.detail) revalidatePath(`${routes.detail}/${slug}`);

  return Response.json({
    revalidated: true,
    type,
    tags: routes.tags,
    paths: routes.paths,
  });
}
