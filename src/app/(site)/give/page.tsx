import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { givingFaqs } from "@/content/pages";
import { BankTransfer } from "@/components/give/give-form";
import { OnlineGivingSoon } from "@/components/give/online-giving-soon";

export const metadata: Metadata = pageMetadata("/give", {
  title: "Give",
  description:
    "Support the ministry of Citadel of Grace by bank transfer — account details for your tithe, offering or gift to the building fund.",
});

export default function GivePage() {
  return (
    <>
      <PageHeader
        eyebrow="Generosity"
        title="Give"
        intro="Thank you for sowing into the work of the gospel. Give directly by bank transfer to the church account."
      />

      <Section id="give" align="left">
        <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr] lg:gap-8">
          <Reveal>
            <OnlineGivingSoon />
          </Reveal>
          <Reveal delay={0.1}>
            <BankTransfer />
          </Reveal>
        </div>

        <Reveal delay={0.15} className="mt-14 border-t border-white/10 pt-10">
          <div className="mx-auto max-w-3xl">
            <p className="eyebrow">Giving questions</p>
            <h2 className="font-display mt-4 text-3xl leading-tight font-light text-white md:text-4xl">
              Before you send
            </h2>
            <p className="text-muted mt-3 max-w-prose text-sm leading-relaxed md:text-base">
              The short answers people ask for most often about giving by transfer.
            </p>
            <FaqAccordion items={givingFaqs} className="mt-8" />
          </div>
        </Reveal>

        <Reveal delay={0.2} className="mt-14 border-t border-white/10 pt-8">
          <div className="text-muted grid gap-6 text-sm leading-relaxed md:grid-cols-3">
            <div>
              <p className="text-orange text-[0.62rem] tracking-[0.28em] uppercase">
                Straight to the church
              </p>
              <p className="mt-2">
                Transfers go directly to the church account. This website never collects or
                stores card details.
              </p>
            </div>
            <div>
              <p className="text-orange text-[0.62rem] tracking-[0.28em] uppercase">
                Label your gift
              </p>
              <p className="mt-2">
                Use your name and the purpose — tithe, offering or building fund — as the
                transfer description so the finance team can record it against you.
              </p>
            </div>
            <div>
              <p className="text-orange text-[0.62rem] tracking-[0.28em] uppercase">
                Questions?
              </p>
              <p className="mt-2">
                If anything about giving is unclear, reach the church office via the
                contact page and we will gladly help.
              </p>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
