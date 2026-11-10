import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { YouTubeFacade } from "@/components/shared/youtube-facade";
import { AudioArchive } from "@/components/sermons/audio-archive";
import { SermonExplorer } from "@/components/sermons/explorer";
import { audioMessages, audiomack } from "@/content/audiomack";
import { loadSermonSeries, loadSermonSpeakers, loadSermons } from "@/content";
import { formatShortDate } from "@/lib/format";
import { isPlaceholder } from "@/lib/utils";
import sermonsImage from "@/app/preaching2.jpg";

export const metadata: Metadata = pageMetadata("/sermons", {
  title: "Sermons",
  description:
    "Listen to full recordings of messages from Citadel of Grace — sermon audio from our services, free to stream.",
});

export default async function SermonsPage() {
  const [sermons, series, speakers] = await Promise.all([
    loadSermons(),
    loadSermonSeries(),
    loadSermonSpeakers(),
  ]);
  const featured = sermons[0];

  return (
    <>
      <PageHeader
        eyebrow="The Word"
        title="Sermons"
        intro="Messages of faith, hope and practical life — recorded in full from our services, free to listen to any time."
        image={sermonsImage.src}
        imagePosition="50% 20%"
      />

      {!featured ? (
        <Section
          id="listen"
          align="left"
          className="bg-charcoal/25 border-t border-white/8"
          eyebrow="Audio messages"
          title="Listen to recent messages"
          intro="Full recordings from our services, hosted on Audiomack. Choose a message to listen right here, or open the account for the rest of the archive."
        >
          <AudioArchive
            messages={audioMessages}
            handle={audiomack.handle}
            profileUrl={audiomack.profileUrl}
          />
          <div className="mt-10">
            <ButtonLink href={audiomack.profileUrl} variant="ghost" external>
              Open on Audiomack
            </ButtonLink>
          </div>
        </Section>
      ) : (
        <>
          {/* Featured */}
          <Section id="featured" align="left">
            <Reveal className="mb-6 flex flex-wrap items-center gap-4">
              <span className="eyebrow">Latest message</span>
              <span className="bg-orange/30 h-px flex-1" aria-hidden />
            </Reveal>
            <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
              <Reveal>
                <YouTubeFacade videoId={featured.videoId} title={featured.title} />
              </Reveal>
              <Reveal delay={0.1}>
                <p className="text-orange text-xs tracking-[0.22em] uppercase">
                  <time dateTime={featured.date}>{formatShortDate(featured.date)}</time>
                  {" · "}
                  {featured.series}
                </p>
                <h2 className="font-display mt-4 text-3xl leading-snug font-light text-white md:text-4xl">
                  {isPlaceholder(featured.title) ? (
                    <span className="placeholder-chip">{featured.title}</span>
                  ) : (
                    featured.title
                  )}
                </h2>
                <p className="text-muted mt-4 text-sm leading-relaxed">
                  {featured.excerpt}
                </p>
                <div className="mt-7">
                  <ButtonLink href={`/sermons/${featured.slug}`}>
                    Message details
                  </ButtonLink>
                </div>
              </Reveal>
            </div>
          </Section>

          {/* Archive */}
          <Section
            id="archive"
            className="bg-charcoal/25 border-t border-white/8"
            align="left"
            eyebrow="Archive"
            title="All messages"
          >
            <SermonExplorer sermons={sermons} series={series} speakers={speakers} />
          </Section>
        </>
      )}
    </>
  );
}
