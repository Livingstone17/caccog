import Link from "next/link";
import { visionMission } from "@/content/pages";
import { loadMinistries } from "@/content";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/shared/cards";
import { isPlaceholder } from "@/lib/utils";

export function VisionQuote() {
  return (
    <section
      aria-label="Vision"
      className="relative overflow-hidden border-y border-white/10 bg-[linear-gradient(180deg,#161616_0%,#101010_100%)]"
    >
      <div
        className="absolute inset-0 bg-[radial-gradient(50%_80%_at_50%_120%,rgba(255,122,26,0.18),transparent_70%)]"
        aria-hidden
      />
      <div className="container-page relative py-24 text-center md:py-32">
        <Reveal>
          <p className="eyebrow">Our vision</p>
        </Reveal>
        <Reveal delay={0.1}>
          <blockquote className="mx-auto mt-8 max-w-3xl">
            <span
              className="font-display text-orange/50 mx-auto block text-6xl leading-none"
              aria-hidden
            >
              “
            </span>
            <p className="font-display text-ember -mt-3 text-3xl leading-[1.35] font-light italic md:text-[2.4rem]">
              {isPlaceholder(visionMission.vision) ? (
                <span className="placeholder-chip">{visionMission.vision}</span>
              ) : (
                visionMission.vision
              )}
            </p>
          </blockquote>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="text-muted mx-auto mt-8 max-w-2xl text-sm leading-relaxed">
            <span className="eyebrow mr-2 inline">Mission</span>
            {visionMission.mission}
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="mt-10">
            <ButtonLink href="/about" variant="ghost">
              Our story &amp; beliefs
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export async function MinistriesPreview() {
  const ministries = (await loadMinistries()).slice(0, 6);

  return (
    <Section id="ministries-preview" className="bg-white">
      <SectionHeading
        eyebrow="Get involved"
        title="Ministries & departments"
        href="/ministries"
        linkLabel="Explore all"
        variant="light-bg"
      />
      <ul className="flex flex-wrap justify-center gap-3">
        {ministries.map((m, i) => (
          <Reveal as="li" key={m.id} delay={i * 0.06}>
            <Link
              href={`/ministries/${m.slug}`}
              className="hover:border-orange/60 hover:bg-orange/5 hover:text-ember border-orange/45 inline-flex min-h-12 items-center gap-3 rounded-full border px-6 py-3 text-sm text-black/85 transition-[border-color,color,background-color] duration-500"
            >
              <span className="bg-orange/70 size-1 rounded-full" aria-hidden />
              {m.name}
            </Link>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}

export function GiveBand() {
  return (
    <section
      aria-label="Give"
      className="border-orange/20 relative overflow-hidden border-y bg-white"
    >
      <div
        className="absolute top-1/2 -left-24 size-[480px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,179,107,0.16),transparent_65%)]"
        aria-hidden
      />
      <div
        className="absolute top-0 -right-24 size-[380px] rounded-full bg-[radial-gradient(circle,rgba(255,122,26,0.14),transparent_65%)]"
        aria-hidden
      />
      <div className="container-page relative flex flex-col items-center gap-8 py-20 text-center md:py-24">
        <Reveal>
          <p className="eyebrow">Generosity</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="font-display max-w-2xl text-4xl leading-tight font-light text-black md:text-5xl">
            Give securely, online or by transfer
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="text-muted max-w-xl text-sm leading-relaxed md:text-base">
            Support the work of the church with a one-time gift or recurring giving.
            Payments are processed securely by Paystack — your card details never touch
            our servers.
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/give">Give now</ButtonLink>
            <ButtonLink href="/give#bank-transfer" variant="secondary">
              Bank transfer details
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function PrayerTeaser() {
  return (
    <Section id="prayer">
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <Reveal>
          <p className="eyebrow">We&apos;re here for you</p>
          <h2 className="font-display mt-6 text-4xl leading-tight font-light text-white md:text-5xl">
            Need prayer?
          </h2>
          <p className="text-muted mt-5 max-w-md text-sm leading-relaxed md:text-base">
            Whatever you are carrying, you don&apos;t have to carry it alone. Share your
            request with us and our team will stand with you in prayer.
          </p>
        </Reveal>
        <Reveal delay={0.12} className="flex flex-col gap-4 sm:flex-row md:justify-end">
          <ButtonLink href="/contact">Send a prayer request</ButtonLink>
          <ButtonLink href="/contact" variant="ghost">
            Contact us
          </ButtonLink>
        </Reveal>
      </div>
    </Section>
  );
}
