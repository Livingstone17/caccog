import type { Metadata } from "next";
import { siteSettings } from "@/content/site";

/**
 * Per-page metadata with a canonical URL always set (§6).
 *
 * Next resolves relative `alternates.canonical` values against `metadataBase`
 * from the root layout, so pages only pass their own path.
 */
export function pageMetadata(path: string, meta: Metadata = {}): Metadata {
  return {
    ...meta,
    alternates: {
      ...meta.alternates,
      canonical: path,
    },
    openGraph: {
      siteName: siteSettings.name,
      locale: "en_GB",
      ...meta.openGraph,
    },
    twitter: {
      card: "summary_large_image",
      ...meta.twitter,
    },
  };
}
