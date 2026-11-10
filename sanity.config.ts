import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";
import { dataset, projectId } from "./src/sanity/env";

/**
 * Sanity Studio configuration.
 *
 * The Studio is mounted inside the Next app at /studio (see
 * `src/app/studio/[[...tool]]/page.tsx`), so the same config powers both
 * `pnpm dev` and the deployed editor at https://<site>/studio.
 *
 * Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET (see
 * .env.example). With no project configured the Studio shows Sanity's
 * "connect a project" screen — the website itself keeps running on local
 * placeholder content.
 */
export default defineConfig({
  name: "citadel-of-grace",
  title: "Citadel of Grace CMS",
  basePath: "/studio",
  projectId,
  dataset,
  plugins: [structureTool({ structure })],
  schema: {
    types: schemaTypes,
  },
});
