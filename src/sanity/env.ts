/**
 * Sanity configuration read from the environment.
 *
 * The `NEXT_PUBLIC_` variables are the ones the Studio (which runs in the
 * browser) needs. The older server-side `SANITY_*` names are still honoured so
 * existing deployments keep working. Values are read statically on purpose:
 * Next only inlines `process.env.NEXT_PUBLIC_*` into client bundles when it can
 * see the full name at build time.
 */
export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || "";

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || "production";

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ||
  process.env.SANITY_API_VERSION ||
  "2026-01-01";

/**
 * When no project is configured the site serves the local placeholder content
 * in `src/content/` and every Sanity read is skipped. That keeps `pnpm dev`
 * and `pnpm build` working before the CMS exists.
 */
export const isSanityConfigured = Boolean(projectId);
