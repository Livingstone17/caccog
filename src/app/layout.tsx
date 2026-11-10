import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { siteSettings } from "@/content/site";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteSettings.name} — ${siteSettings.denomination}`,
    template: `%s · ${siteSettings.name}`,
  },
  description: `${siteSettings.name} is a ${siteSettings.denomination} congregation in ${siteSettings.city}. Find service times, plan your visit, watch live, and give online.`,
  keywords: [
    "Citadel of Grace",
    "Christ Apostolic Church",
    "CAC",
    "church",
    siteSettings.city,
  ],
  openGraph: {
    type: "website",
    siteName: siteSettings.name,
    locale: "en_GB",
    url: siteUrl,
    title: `${siteSettings.name} — ${siteSettings.denomination}`,
    description: siteSettings.welcomeLine,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteSettings.name} — ${siteSettings.denomination}`,
    description: siteSettings.welcomeLine,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

/**
 * Root layout — document shell only.
 *
 * The public site's chrome lives in `(site)/layout.tsx` so the Sanity Studio
 * at /studio (which is not inside that route group) renders without the church
 * navigation, footer, custom cursor or smooth-scroll layer.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
