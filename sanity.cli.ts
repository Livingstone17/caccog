import { defineCliConfig } from "sanity/cli";
import { dataset, projectId } from "./src/sanity/env";

/**
 * Used by the Sanity CLI (`pnpm exec sanity ...`), e.g. to deploy the Studio or
 * run `sanity dataset import`. The Studio itself is configured in
 * sanity.config.ts and served from /studio.
 */
export default defineCliConfig({
  api: { projectId, dataset },
});
