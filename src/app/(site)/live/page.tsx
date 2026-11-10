import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { LivePlayer } from "@/components/live/live-player";
import { siteSettings } from "@/content/site";
import { isPlaceholder } from "@/lib/utils";

export const metadata: Metadata = pageMetadata("/live", {
  title: "Watch Live",
  description:
    "Join Citadel of Grace online — watch the live service, see stream times, and give or request prayer while you watch.",
});

export default function LivePage() {
  return (
    <>
      <PageHeader
        eyebrow="Worship with us"
        title="Watch live"
        intro="Wherever you are, you can join the service. The stream begins at the times below — arrive a few minutes early and settle in."
      />

      {/* Player */}
      <Section id="stream" align="left">
        <Reveal>
          <LivePlayer />
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-muted mt-6 max-w-2xl text-sm leading-relaxed">
            {isPlaceholder(siteSettings.livestream.scheduleNote) ? (
              <span className="placeholder-chip">
                {siteSettings.livestream.scheduleNote}
              </span>
            ) : (
              siteSettings.livestream.scheduleNote
            )}
          </p>
        </Reveal>
      </Section>

      {/* Service times */}
      <Section
        id="times"
        className="bg-charcoal/25 border-t border-white/8"
        align="left"
        eyebrow="Schedule"
        title="When we gather"
      >
        <ul className="max-w-3xl divide-y divide-white/10 border-y border-white/10">
          {siteSettings.serviceTimes.map((t) => (
            <li key={t.id} className="flex items-center justify-between gap-4 py-5">
              <div>
                <p className="font-display text-xl font-normal text-white">{t.label}</p>
                <p className="text-muted mt-1 text-sm">{t.day}</p>
              </div>
              <span
                className={
                  isPlaceholder(t.time) ? "placeholder-chip" : "text-ember text-lg"
                }
              >
                {t.time}
              </span>
            </li>
          ))}
        </ul>
        <p className="text-muted mt-6 max-w-2xl text-sm leading-relaxed">
          Times are shown in your local timezone once confirmed.{" "}
          <a
            href="/plan-your-visit"
            className="text-orange hover:text-ember decoration-orange/40 underline underline-offset-2 transition-colors"
          >
            Plan your visit
          </a>{" "}
          if you would rather join us in person.
        </p>
      </Section>

      {/* While you watch */}
      <Section
        id="engage"
        className="border-t border-white/8"
        eyebrow="While you watch"
        title="Stay connected"
      >
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          <Reveal className="bg-charcoal/30 flex flex-col items-start border border-white/10 p-8">
            <p className="eyebrow">Prayer</p>
            <h3 className="font-display mt-4 text-2xl leading-snug font-light text-white">
              Need prayer?
            </h3>
            <p className="text-muted mt-3 text-sm leading-relaxed">
              Share your request and our team will stand with you — during the service or
              any time through the week.
            </p>
            <div className="mt-6">
              <ButtonLink href="/contact" variant="ghost">
                Send a prayer request
              </ButtonLink>
            </div>
          </Reveal>
          <Reveal
            delay={0.1}
            className="bg-charcoal/30 flex flex-col items-start border border-white/10 p-8"
          >
            <p className="eyebrow">Generosity</p>
            <h3 className="font-display mt-4 text-2xl leading-snug font-light text-white">
              Give while you watch
            </h3>
            <p className="text-muted mt-3 text-sm leading-relaxed">
              Support the work of the church with a one-time gift or recurring giving,
              processed securely by Paystack.
            </p>
            <div className="mt-6">
              <ButtonLink href="/give">Give now</ButtonLink>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
