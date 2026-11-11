import { getLiveStatus } from "@/lib/live-status";

/**
 * Live badge feed for the navigation.
 *
 * `GET /api/live` → `{ live: boolean, source, checkedAt }`
 *
 * Cached for 30 seconds at the edge so a page full of visitors costs Sanity /
 * Facebook one check, while the badge still appears within half a minute of a
 * stream starting.
 */
export const runtime = "nodejs";
export const revalidate = 30;

export async function GET() {
  const status = await getLiveStatus();

  return Response.json(status, {
    headers: {
      "Cache-Control": "public, max-age=0, s-maxage=30, stale-while-revalidate=60",
    },
  });
}
