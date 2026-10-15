import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { Reveal, Text } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { faqs } from "@/content/pages";
import { siteSettings } from "@/content/site";
import { isPlaceholder } from "@/lib/utils";

export const metadata: Metadata = pageMetadata("/plan-your-visit", {
  title: "Plan Your Visit",
  description:
    "Service times, location, what to expect and how to reach Citadel of Grace — everything a first-time guest needs for a confident visit.",
});

function MapPanel() {
  const hasMap = Boolean(siteSettings.mapEmbedUrl);

  if (!hasMap) {
    return (
      <div className="border-orange/35 bg-charcoal/50 relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden border border-dashed">
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_45%,rgba(255,122,26,0.1),transparent_70%)]" />
        <div className="relative px-8 text-center">
          <p className="eyebrow">Map pending</p>
          <p className="text-muted mt-3 max-w-sm text-sm leading-relaxed">
            Once the confirmed address is supplied, the Google map embeds here together
            with a live &ldquo;Get directions&rdquo; link.
          </p>
        </div>
        <div
          className="absolute inset-0 opacity-[0.18]"
          aria-hidden
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(60% 60% at 50% 50%, black, transparent 80%)",
          }}
        />
      </div>
    );
  }

  return (
    <div className="bg-charcoal/40 relative aspect-[16/10] w-full overflow-hidden border border-white/10">
      <iframe
        src={siteSettings.mapEmbedUrl}
        title={`Map showing the location of ${siteSettings.name}`}
        className="absolute inset-0 size-full contrast-[1.05] grayscale-[0.25]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}

function FaqAccordion() {
  return (
    <div className="mx-auto max-w-3xl divide-y divide-white/10 border-y border-white/10">
      {faqs.map((faq, i) => (
        <details key={i} className="group py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left text-base text-white md:text-lg [&::-webkit-details-marker]:hidden">
            <span className="font-display font-normal">{faq.question}</span>
            <span
              className="text-orange relative size-6 shrink-0 transition-transform duration-500 group-open:rotate-45"
              aria-hidden
            >
              <span className="absolute top-1/2 left-1/2 h-px w-3.5 -translate-x-1/2 -translate-y-1/2 bg-current" />
              <span className="absolute top-1/2 left-1/2 h-3.5 w-px -translate-x-1/2 -translate-y-1/2 bg-current" />
            </span>
          </summary>
          <p className="text-muted mt-4 max-w-2xl text-sm leading-relaxed md:text-base">
            {isPlaceholder(faq.answer) ? (
              <span className="placeholder-chip">{faq.answer}</span>
            ) : (
              faq.answer
            )}
          </p>
        </details>
      ))}
    </div>
  );
}

export default function PlanYourVisitPage() {
  const whatsappHref = isPlaceholder(siteSettings.whatsappNumber)
    ? null
    : `https://wa.me/${siteSettings.whatsappNumber.replace(/[^0-9]/g, "")}`;
  const hasDirections = Boolean(siteSettings.directionsUrl);

  return (
    <>
      <PageHeader
        eyebrow="First time?"
        title="Plan your visit"
        intro="Everything you need before you come: times, directions, what to wear, where to park and how to reach us."
      />

      {/* Times + map */}
      <Section id="visit" align="left">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="eyebrow">Service times</p>
            <ul className="mt-6 divide-y divide-white/10 border-y border-white/10">
              {siteSettings.serviceTimes.map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-4 py-5">
                  <div>
                    <p className="font-display text-xl font-normal text-white">
                      {t.label}
                    </p>
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

            <p className="eyebrow mt-10">Find us</p>
            <address className="mt-4 space-y-1 text-lg text-white not-italic">
              <span className="block">{siteSettings.address.line1}</span>
              <span className="text-muted block">{siteSettings.address.line2}</span>
              <span className="text-muted block">
                {siteSettings.address.city}, {siteSettings.address.state}
              </span>
              <span className="text-muted block">{siteSettings.address.country}</span>
            </address>

            <div className="mt-7 flex flex-wrap gap-3">
              {hasDirections ? (
                <ButtonLink href={siteSettings.directionsUrl} external>
                  Get directions
                </ButtonLink>
              ) : (
                <span className="border-orange/40 text-orange/70 inline-flex min-h-12 cursor-not-allowed items-center rounded-full border border-dashed px-7 text-[0.8rem] tracking-[0.22em] uppercase">
                  Get directions — pending address
                </span>
              )}
              {whatsappHref ? (
                <ButtonLink href={whatsappHref} variant="ghost" external>
                  Chat on WhatsApp
                </ButtonLink>
              ) : (
                <span className="inline-flex min-h-12 cursor-not-allowed items-center rounded-full border border-dashed border-white/25 px-7 text-[0.8rem] tracking-[0.22em] text-white/50 uppercase">
                  WhatsApp — number pending
                </span>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <MapPanel />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="bg-charcoal/30 border border-white/10 p-5">
                <p className="text-orange text-[0.62rem] tracking-[0.28em] uppercase">
                  Parking
                </p>
                <p className="text-muted mt-2 text-sm leading-relaxed">
                  <span className="placeholder-chip">Parking guidance — pending</span>
                </p>
              </div>
              <div className="bg-charcoal/30 border border-white/10 p-5">
                <p className="text-orange text-[0.62rem] tracking-[0.28em] uppercase">
                  Dress code
                </p>
                <p className="text-muted mt-2 text-sm leading-relaxed">
                  <span className="placeholder-chip">Dress note — pending</span>
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Local SEO — the city name is a pending placeholder; see CONTENT_TODO. */}
      <Section
        id="local"
        className="bg-charcoal/20 border-t border-white/8"
        eyebrow="In the neighbourhood"
        title={
          <>
            A church in <span className="placeholder-chip">[City, Country]</span>
          </>
        }
        align="left"
      >
        <Reveal className="max-w-3xl">
          <p className="text-muted text-base leading-relaxed md:text-lg">
            Citadel of Grace meets weekly in <Text>[City, Country]</Text>, warmly
            welcoming anyone looking for a Christ Apostolic Church congregation in the
            area. Whether you are new to the city, returning after a long time, or simply
            searching for a church community close to home, you are invited to join us
            this Sunday. Our doors open before every service, our ushers will help you
            find a seat, and there is space for you exactly as you are.
          </p>
          <p className="text-muted mt-5 text-base leading-relaxed md:text-lg">
            Looking for service times, directions or what to expect on your first visit?
            Everything you need is on this page — and if you still have a question,{" "}
            <Link
              href="/contact"
              className="text-orange hover:text-ember decoration-orange/40 underline underline-offset-2 transition-colors"
            >
              our team is glad to help
            </Link>
            .
          </p>
        </Reveal>
      </Section>

      {/* FAQ */}
      <Section
        id="faq"
        className="bg-charcoal/25 border-t border-white/8"
        eyebrow="Good to know"
        title="Questions from first-timers"
      >
        <FaqAccordion />
      </Section>

      {/* Contact strip */}
      <Section id="visit-contact">
        <Reveal className="flex flex-col items-center gap-6 text-center">
          <h2 className="font-display max-w-xl text-3xl font-light text-white md:text-4xl">
            Still have a question before you come?
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            <ButtonLink href="/contact">Contact us</ButtonLink>
            <ButtonLink href="/contact" variant="ghost">
              Request prayer
            </ButtonLink>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
