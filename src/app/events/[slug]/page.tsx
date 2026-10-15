import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { AddToCalendarButton } from "@/components/events/add-to-calendar";
import { ShareBar } from "@/components/shared/share-bar";
import { getEventBySlug, getEvents } from "@/content/events";
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
  const event = getEventBySlug(slug);
  if (!event) return { title: "Event not found" };
  return pageMetadata(`/events/${event.slug}`, {
    title: event.title,
    description: event.description,
    openGraph: {
      title: event.title,
      description: event.description,
      type: "website",
    },
  });
}

export function generateStaticParams() {
  return getEvents().map((event) => ({ slug: event.slug }));
}

export default async function EventPage(props: PageProps<"/events/[slug]">) {
  const { slug } = await props.params;
  const event = getEventBySlug(slug);
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
        eyebrow={formatDate(event.startsAt)}
        title={event.title}
        intro={event.description}
      />

      <Section id="event" align="left">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
          <Reveal>
            <div className="surface p-7 md:p-9">
              <p className="eyebrow">When</p>
              <p className="font-display text-ember mt-3 text-2xl font-light">
                {formatEventRange(event.startsAt, event.endsAt)}
              </p>

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
