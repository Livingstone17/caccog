import { Hero } from "@/components/hero/hero";
import { Welcome, ServiceStrip } from "@/components/home/welcome";
import { WhatToExpect, LatestSermon, UpcomingEvents } from "@/components/home/highlights";
import {
  VisionQuote,
  MinistriesPreview,
  GiveBand,
  PrayerTeaser,
} from "@/components/home/engagement";
import { churchJsonLd } from "@/lib/jsonld";

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(churchJsonLd()) }}
      />
      <Hero />
      <Welcome />
      <ServiceStrip />
      <WhatToExpect />
      <LatestSermon />
      <UpcomingEvents />
      <VisionQuote />
      <MinistriesPreview />
      <GiveBand />
      <PrayerTeaser />
    </>
  );
}
