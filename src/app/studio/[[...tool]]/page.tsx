"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";
import { dataset, isSanityConfigured } from "@/sanity/env";

/**
 * Sanity Studio, served from /studio.
 *
 * The Studio is a browser application, so it is mounted from a Client
 * Component and the surrounding route layout (`src/app/studio/layout.tsx`)
 * keeps it `noindex` and outside the church site's chrome.
 *
 * The editor cannot start without a project, and Sanity's own client throws a
 * hard error when one is missing. Rather than crash the route on a fresh
 * checkout, an unconfigured project gets a short setup screen.
 */
export default function StudioPage() {
  if (!isSanityConfigured) return <StudioSetupNotice />;
  return <NextStudio config={config} />;
}

function StudioSetupNotice() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-[#0a0a0a] px-6 py-16 text-white">
      <div className="w-full max-w-lg border border-white/10 bg-white/[0.03] p-8">
        <p className="text-[0.62rem] tracking-[0.32em] text-amber-200/70 uppercase">
          Citadel of Grace CMS
        </p>
        <h1 className="font-display mt-4 text-3xl font-light">Sanity Studio</h1>
        <p className="mt-4 text-sm leading-relaxed text-white/60">
          The editor is not connected to a Sanity project yet. Add the project ID and
          dataset to your environment, restart the server, then reload this page.
        </p>
        <pre className="mt-6 overflow-x-auto border border-white/10 bg-black/40 p-4 text-xs leading-relaxed text-white/70">
          {`NEXT_PUBLIC_SANITY_PROJECT_ID=<your-project-id>\nNEXT_PUBLIC_SANITY_DATASET=${dataset}`}
        </pre>
        <p className="mt-6 text-sm leading-relaxed text-white/60">
          No project yet?{" "}
          <a
            href="https://sanity.io/manage"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-200 underline underline-offset-4"
          >
            Create one at sanity.io/manage
          </a>
          . The website keeps running on its local content until then.
        </p>
      </div>
    </main>
  );
}
