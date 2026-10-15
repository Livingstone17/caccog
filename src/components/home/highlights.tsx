import { expectCards } from "@/content/pages";
import { getFeaturedSermon } from "@/content/sermons";
import { getUpcomingEvents } from "@/content/events";
import { formatShortDate } from "@/lib/format";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { EventCard, SectionHeading } from "@/components/shared/cards";
import { YouTubeFacade } from "@/components/shared/youtube-facade";
import { isPlaceholder } from "@/lib/utils";

export function WhatToExpect() {
  return (
    <Section id="expect" className="bg-black">
      <SectionHeading
        eyebrow="First time here?"
        title="What to expect"
        href="/plan-your-visit"
        linkLabel="Plan your visit"
      />
      <ul className="grid gap-5 md:grid-cols-3">
        {expectCards.map((card, i) => (
          <Reveal
            as="li"
            key={card.title}
            delay={i * 0.1}
            className="group bg-charcoal/30 hover:border-orange/40 relative h-full overflow-hidden border border-white/10 p-8 transition-colors duration-700 before:absolute before:inset-0 before:bg-[radial-gradient(90%_70%_at_50%_0%,rgba(255,122,26,0.14),transparent_70%)] before:opacity-0 before:transition-opacity before:duration-700 hover:before:opacity-100 md:p-10"
          >
            <span className="font-display text-orange/70 relative text-4xl font-light">
              0{i + 1}
            </span>
            <h3 className="font-display relative mt-5 text-2xl font-normal text-white">
              {card.title}
            </h3>
            <p className="text-muted relative mt-3 text-sm leading-relaxed md:text-[0.95rem]">
              {card.body}
            </p>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}

export function LatestSermon() {
  const sermon = getFeaturedSermon();

  return (
    <Section id="latest-sermon" className="border-y border-black/8 bg-white">
      <SectionHeading
        eyebrow="Latest message"
        title="A word for this week"
        href="/sermons"
        linkLabel="All sermons"
        align="left"
        variant="light-bg"
      />
      <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
        <Reveal>
          <YouTubeFacade videoId={sermon.videoId} title={sermon.title} />
        </Reveal>

        <Reveal delay={0.12} className="flex h-full flex-col justify-center">
          <p className="text-orange flex flex-wrap items-center gap-3 text-xs tracking-[0.22em] uppercase">
            <time dateTime={sermon.date}>{formatShortDate(sermon.date)}</time>
            <span aria-hidden className="text-white/25">
              /
            </span>
            <span className="text-muted">{sermon.series}</span>
          </p>

          <h3 className="font-display mt-5 text-3xl leading-snug font-light text-white md:text-[2.5rem]">
            {isPlaceholder(sermon.title) ? (
              <span className="placeholder-chip">{sermon.title}</span>
            ) : (
              sermon.title
            )}
          </h3>

          <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-white/10 pt-6 text-sm">
            <div>
              <dt className="text-orange/80 text-[0.62rem] tracking-[0.28em] uppercase">
                Speaker
              </dt>
              <dd className="mt-1.5 text-white">{sermon.speaker}</dd>
            </div>
            <div>
              <dt className="text-orange/80 text-[0.62rem] tracking-[0.28em] uppercase">
                Scripture
              </dt>
              <dd className="mt-1.5 text-white">{sermon.scripture ?? "—"}</dd>
            </div>
          </dl>

          <p className="text-muted mt-6 max-w-lg text-sm leading-relaxed">
            {sermon.excerpt}
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <ButtonLink href={`/sermons/${sermon.slug}`}>Listen now</ButtonLink>
            <ButtonLink href="/sermons" variant="ghost">
              Browse archive
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

export function UpcomingEvents() {
  const events = getUpcomingEvents(3);

  return (
    <Section id="events">
      <SectionHeading
        eyebrow="Calendar"
        title="Upcoming events"
        href="/events"
        linkLabel="View all events"
      />
      <ul className="mx-auto max-w-4xl space-y-5">
        {events.map((event, i) => (
          <EventCard key={event.id} event={event} index={i} />
        ))}
      </ul>
    </Section>
  );
}
