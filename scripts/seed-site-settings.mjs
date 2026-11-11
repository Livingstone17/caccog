#!/usr/bin/env node
/**
 * Creates the singleton `siteSettings` document so the Studio's "Church is live
 * now" toggle has somewhere to live.
 *
 * Needs a Sanity token with Editor permissions (sanity.io/manage → API → Tokens):
 *   .env → SANITY_API_WRITE_TOKEN=sk…
 *
 * Then: `pnpm seed:settings`
 *
 * Safe to run more than once — existing documents are left alone apart from
 * gaining an `isLive` flag if they predate it.
 */
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-01-01";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    [
      "Cannot seed site settings.",
      projectId ? null : "  • NEXT_PUBLIC_SANITY_PROJECT_ID is missing",
      token
        ? null
        : "  • SANITY_API_WRITE_TOKEN is missing (sanity.io/manage → API → Tokens → add a token with Editor rights)",
      "",
      "Alternatively create it by hand: /studio → Site settings → tick 'Church is live now' → Publish.",
    ]
      .filter(Boolean)
      .join("\n"),
  );
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

const existing = await client.getDocument("siteSettings");

if (existing) {
  await client.patch("siteSettings").setIfMissing({ isLive: false }).commit();
  console.log("siteSettings already exists — ensured the `isLive` flag is present.");
} else {
  await client.createIfNotExists({
    _id: "siteSettings",
    _type: "siteSettings",
    title: "Site settings",
    isLive: false,
  });
  console.log("Created siteSettings with isLive: false.");
}

console.log(`Done. Open /studio → Site settings (project ${projectId}, ${dataset}).`);
