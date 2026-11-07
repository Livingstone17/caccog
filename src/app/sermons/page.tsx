import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { YouTubeFacade } from "@/components/shared/youtube-facade";
import { SermonExplorer } from "@/components/sermons/explorer";
import {
  getFeaturedSermon,
  getSermonSeries,
  getSermonSpeakers,
  getSermons,
} from "@/content/sermons";
import { formatShortDate } from "@/lib/format";
import { isPlaceholder } from "@/lib/utils";
import sermonsImage from "@/app/preaching2.jpg";

export const metadata: Metadata = pageMetadata("/sermons", {
  title: "Sermons",
  description:
    "Watch and listen to messages from Citadel of Grace — search the archive by series, speaker, scripture and date.",
});

export default async function SermonsPage() {
  const sermons = getSermons();
  const featured = getFeaturedSermon();

  return (
    <>
      <PageHeader
        eyebrow="The Word"
        title="Sermons"
        intro="Messages of faith, hope and practical life — search by series, speaker or scripture."
        image={sermonsImage.src}
        imagePosition="50% 20%"
      />

      {!featured ? (
        <Section
          id="sermons-unavailable"
          align="center"
          className="bg-charcoal/25 border-t border-white/8"
        >
          <Reveal>
            <div className="border-orange/35 relative mx-auto max-w-2xl overflow-hidden border border-dashed p-10 text-center md:p-14">
              <div
                className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,rgba(255,122,26,0.12),transparent_70%)]"
                aria-hidden
              />
              <h2 className="font-display relative text-3xl leading-snug font-light text-white md:text-4xl">
                Sermons are not available at the moment
              </h2>
              <p className="text-muted relative mx-auto mt-4 max-w-md text-sm leading-relaxed md:text-base">
                You will be notified when new sermons are uploaded. In the meantime, you
                are welcome to worship with us any Sunday.
              </p>
              <div className="relative mt-8 flex justify-center">
                <ButtonLink href="/plan-your-visit" variant="ghost">
                  Plan your visit
                </ButtonLink>
              </div>
            </div>
          </Reveal>
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
            <SermonExplorer
              sermons={sermons}
              series={getSermonSeries()}
              speakers={getSermonSpeakers()}
            />
          </Section>
        </>
      )}
    </>
  );
}
