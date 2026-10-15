import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { GiveForm, BankTransfer } from "@/components/give/give-form";

export const metadata: Metadata = pageMetadata("/give", {
  title: "Give",
  description:
    "Support the ministry of Citadel of Grace securely — give online with your card, transfer, or set up recurring giving.",
});

export default function GivePage() {
  return (
    <>
      <PageHeader
        eyebrow="Generosity"
        title="Give"
        intro="Thank you for sowing into the work of the gospel. Give securely online, or transfer directly to the church account."
      />

      <Section id="give" align="left">
        <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr] lg:gap-8">
          <Reveal>
            <GiveForm />
          </Reveal>
          <Reveal delay={0.1}>
            <BankTransfer />
          </Reveal>
        </div>

        <Reveal delay={0.15} className="mt-14 border-t border-white/10 pt-8">
          <div className="text-muted grid gap-6 text-sm leading-relaxed md:grid-cols-3">
            <div>
              <p className="text-orange text-[0.62rem] tracking-[0.28em] uppercase">
                Secure by design
              </p>
              <p className="mt-2">
                Payments are processed by Paystack. This website never sees or stores your
                card number.
              </p>
            </div>
            <div>
              <p className="text-orange text-[0.62rem] tracking-[0.28em] uppercase">
                Instant receipt
              </p>
              <p className="mt-2">
                A receipt is emailed to you the moment your giving is confirmed, and every
                transaction is verified server-side.
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
