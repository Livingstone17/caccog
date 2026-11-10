import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { YouTubeFacade } from "@/components/shared/youtube-facade";
import { ShareBar } from "@/components/shared/share-bar";
import { getSermonBySlug, getSermons } from "@/content/sermons";
import { formatDate } from "@/lib/format";
import { sermonJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";
import { isPlaceholder } from "@/lib/utils";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";

export async function generateMetadata(
  props: PageProps<"/sermons/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const sermon = getSermonBySlug(slug);
  if (!sermon) return { title: "Sermon not found" };
  return pageMetadata(`/sermons/${sermon.slug}`, {
    title: sermon.title,
    description: sermon.excerpt,
    openGraph: {
      title: sermon.title,
      description: sermon.excerpt,
      type: "article",
      publishedTime: sermon.date,
    },
  });
}

export function generateStaticParams() {
  return getSermons().map((sermon) => ({ slug: sermon.slug }));
}

export default async function SermonPage(props: PageProps<"/sermons/[slug]">) {
  const { slug } = await props.params;
  const sermon = getSermonBySlug(slug);
  if (!sermon) notFound();

  const shareUrl = `${siteUrl}/sermons/${sermon.slug}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sermonJsonLd(sermon)) }}
      />
      <PageHeader
        eyebrow={[sermon.series, sermon.speaker].filter(Boolean).join(" · ")}
        title={sermon.title}
        intro={sermon.excerpt}
      />

      <Section id="message" align="left">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
          <Reveal>
            <YouTubeFacade videoId={sermon.videoId} title={sermon.title} />
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col">
            <dl className="divide-y divide-white/10 border-y border-white/10">
              <div className="flex items-baseline justify-between gap-4 py-4">
                <dt className="text-orange/80 text-[0.62rem] tracking-[0.28em] uppercase">
                  Date
                </dt>
                <dd className="text-sm text-white">
                  <time dateTime={sermon.date}>{formatDate(sermon.date)}</time>
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-4">
                <dt className="text-orange/80 text-[0.62rem] tracking-[0.28em] uppercase">
                  Speaker
                </dt>
                <dd className="text-sm text-white">{sermon.speaker}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-4">
                <dt className="text-orange/80 text-[0.62rem] tracking-[0.28em] uppercase">
                  Series
                </dt>
                <dd className="text-sm text-white">{sermon.series}</dd>
              </div>
              {sermon.scripture && (
                <div className="flex items-baseline justify-between gap-4 py-4">
                  <dt className="text-orange/80 text-[0.62rem] tracking-[0.28em] uppercase">
                    Scripture
                  </dt>
                  <dd className="text-sm text-white italic">{sermon.scripture}</dd>
                </div>
              )}
            </dl>

            <div className="mt-7 flex flex-wrap gap-3">
              {sermon.audioUrl ? (
                <ButtonLink href={sermon.audioUrl} external>
                  Download audio
                </ButtonLink>
              ) : (
                <span className="inline-flex min-h-12 items-center rounded-full border border-dashed border-white/25 px-7 text-[0.8rem] tracking-[0.22em] text-white/50 uppercase">
                  Audio — pending upload
                </span>
              )}
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">
              <ShareBar url={shareUrl} title={sermon.title} />
            </div>

            <div className="mt-8">
              <Link
                href="/sermons"
                className="group text-orange hover:text-ember inline-flex items-center gap-3 text-[0.7rem] tracking-[0.3em] uppercase transition-colors duration-500"
              >
                <span
                  className="transition-transform duration-500 group-hover:-translate-x-1.5"
                  aria-hidden
                >
                  ←
                </span>
                All sermons
              </Link>
            </div>
          </Reveal>
        </div>

        {isPlaceholder(sermon.title) && (
          <p className="mx-auto mt-14 max-w-2xl border-t border-white/10 pt-6 text-center text-xs leading-relaxed text-white/45">
            Sample entry — replace with real sermon metadata (title, speaker, series,
            scripture, YouTube link) before launch.
          </p>
        )}
      </Section>
    </>
  );
}
