import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { AddToCalendarButton } from "@/components/events/add-to-calendar";
import { ShareBar } from "@/components/shared/share-bar";
import { loadEventBySlug, loadEvents } from "@/content";
import { siteSettings } from "@/content/site";
import { formatDate, formatEventRange } from "@/lib/format";
import { eventJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";
import { isPlaceholder } from "@/lib/utils";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";

export async function generateMetadata(
  props: PageProps<"/events/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const event = await loadEventBySlug(slug);
  if (!event) return { title: "Event not found" };
  return pageMetadata(`/events/${event.slug}`, {
    title: event.title,
    description: event.description,
    openGraph: {
      title: event.title,
      description: event.description,
      type: "website",
      images: event.bannerImageUrl ? [{ url: event.bannerImageUrl }] : undefined,
    },
  });
}

export async function generateStaticParams() {
  const events = await loadEvents();
  return events.map((event) => ({ slug: event.slug }));
}

export default async function EventPage(props: PageProps<"/events/[slug]">) {
  const { slug } = await props.params;
  const event = await loadEventBySlug(slug);
  if (!event) notFound();

  const hasDirections = Boolean(siteSettings.directionsUrl);
  const shareUrl = `${siteUrl}/events/${event.slug}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd(event)) }}
      />
      <PageHeader
        eyebrow={
          event.isMultiDay
            ? formatEventRange(event.startsAt, event.endsAt)
            : formatDate(event.startsAt)
        }
        title={event.title}
        intro={event.description}
      />

      <Section id="event" align="left">
        {event.bannerImageUrl ? (
          <Reveal className="mx-auto mb-12 max-w-5xl">
            <div className="relative aspect-[16/9] overflow-hidden border border-white/10">
              <Image
                src={event.bannerImageUrl}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                quality={80}
                className="object-cover"
              />
            </div>
          </Reveal>
        ) : null}

        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
          <Reveal>
            <div className="surface p-7 md:p-9">
              <p className="eyebrow">When</p>
              <p className="font-display text-ember mt-3 text-2xl font-light">
                {formatEventRange(event.startsAt, event.endsAt)}
              </p>
              {event.isMultiDay ? (
                <span className="text-orange/80 border-orange/40 mt-2 inline-block border px-2 py-0.5 text-[0.6rem] tracking-[0.2em] uppercase">
                  Multi-day
                </span>
              ) : null}
              {event.dailySchedule ? (
                <p className="text-muted mt-3 text-sm leading-relaxed">
                  <span className="text-orange/80">Daily schedule: </span>
                  {isPlaceholder(event.dailySchedule) ? (
                    <span className="placeholder-chip">{event.dailySchedule}</span>
                  ) : (
                    event.dailySchedule
                  )}
                </p>
              ) : null}

              <p className="eyebrow mt-8">Where</p>
              <p className="font-display mt-3 text-2xl font-light text-white">
                {isPlaceholder(event.venue) ? (
                  <span className="placeholder-chip">{event.venue}</span>
                ) : (
                  event.venue
                )}
              </p>
              <p className="text-muted mt-2 text-sm">
                {event.location ?? siteSettings.city}
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <AddToCalendarButton event={event} />
                {hasDirections ? (
                  <ButtonLink href={siteSettings.directionsUrl} variant="ghost" external>
                    Get directions
                  </ButtonLink>
                ) : (
                  <span className="inline-flex min-h-12 cursor-not-allowed items-center rounded-full border border-dashed border-white/25 px-7 text-[0.8rem] tracking-[0.22em] text-white/50 uppercase">
                    Directions — pending address
                  </span>
                )}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col gap-8">
            <div>
              <p className="eyebrow">About this event</p>
              <p className="text-muted mt-4 text-sm leading-relaxed md:text-base">
                {event.description}
              </p>
            </div>

            <div className="border-t border-white/10 pt-6">
              <ShareBar url={shareUrl} title={event.title} />
            </div>

            <div>
              <ButtonLink href="/events" variant="ghost">
                All events
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
