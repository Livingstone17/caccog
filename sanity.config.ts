import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import {
  announcement,
  blockContent,
  churchEvent,
  leader,
  ministry,
  sermon,
  siteSettings,
} from "./sanity/schemaTypes";

/**
 * Sanity Studio — run with `pnpm studio` (http://localhost:3333).
 *
 * Requires a Sanity project:
 *   SANITY_STUDIO_PROJECT_ID=xxxx pnpm studio
 * The studio ships with a simple desk (Sermons, Events, Leadership,
 * Ministries, Announcements, Site settings) so non-technical staff can edit
 * without seeing document internals.
 */
export default defineConfig({
  name: "citadel-of-grace",
  title: "Citadel of Grace CMS",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? "",
  dataset: process.env.SANITY_STUDIO_DATASET ?? "production",
  plugins: [structureTool()],
  schema: {
    types: [
      sermon,
      churchEvent,
      leader,
      ministry,
      announcement,
      siteSettings,
      blockContent,
    ],
  },
});
