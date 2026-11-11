import { createClient, type SanityClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "./env";

let cached: SanityClient | null = null;

/**
 * Read-only Sanity client (server-side only).
 *
 * Created lazily because `createClient` throws when no project ID is set —
 * importing this module must stay safe on a site that has not connected a CMS
 * yet (e.g. before `npm install` is even followed by setup).
 *
 * - `useCdn: false` — on-demand revalidation only helps if the read that
 *   follows a publish is fresh; the Sanity CDN can lag behind a mutation by
 *   about a minute.
 * - `SANITY_API_READ_TOKEN` is optional and never sent to the browser: this
 *   module is only imported by Server Components, route handlers and
 *   `src/lib/sanity.ts`. There is deliberately no write token anywhere.
 */
export function getSanityClient(): SanityClient {
  if (cached) return cached;

  if (!isSanityConfigured) {
    throw new Error(
      "Sanity is not configured — set NEXT_PUBLIC_SANITY_PROJECT_ID (see .env.example).",
    );
  }

  cached = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    perspective: "published",
    token: process.env.SANITY_API_READ_TOKEN,
  });

  return cached;
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false if you need immediate, uncached updates
});
