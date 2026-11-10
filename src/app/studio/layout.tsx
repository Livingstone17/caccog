import type { Metadata, Viewport } from "next";

/**
 * Studio route layout.
 *
 * Kept apart from `(site)/layout.tsx`, so opening /studio gives editors the
 * full-screen Sanity UI with no church navigation, footer, custom cursor or
 * smooth scrolling. `noindex` stops search engines from listing the editor.
 */
export const metadata: Metadata = {
  title: "Studio",
  robots: { index: false, follow: false },
  referrer: "same-origin",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
