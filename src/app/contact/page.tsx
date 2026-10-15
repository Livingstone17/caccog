import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { ContactForm } from "@/components/contact/contact-form";
import { siteSettings } from "@/content/site";
import { isPlaceholder } from "@/lib/utils";

export const metadata: Metadata = pageMetadata("/contact", {
  title: "Contact & Prayer",
  description:
    "Contact Citadel of Grace or send a private prayer request — we will get back to you and stand with you in prayer.",
});

export default function ContactPage() {
  const whatsappHref = isPlaceholder(siteSettings.whatsappNumber)
    ? null
    : `https://wa.me/${siteSettings.whatsappNumber.replace(/[^0-9]/g, "")}`;
  const emailHref = isPlaceholder(siteSettings.email)
    ? null
    : `mailto:${siteSettings.email}`;

  return (
    <>
      <PageHeader
        eyebrow="We'd love to hear from you"
        title="Contact & prayer"
        intro="Send a message, request prayer, or reach the church office directly."
      />

      <Section id="contact" align="left">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col gap-6">
            <div className="surface p-7">
              <p className="eyebrow">Reach us directly</p>
              <ul className="mt-5 space-y-5 text-sm">
                <li>
                  <span className="text-orange/80 block text-[0.6rem] tracking-[0.28em] uppercase">
                    Phone
                  </span>
                  {isPlaceholder(siteSettings.phone) ? (
                    <span className="placeholder-chip mt-1.5 inline-block">
                      {siteSettings.phone}
                    </span>
                  ) : (
                    <a
                      href={`tel:${siteSettings.phone}`}
                      className="hover:text-ember mt-1.5 block text-white transition-colors duration-500"
                    >
                      {siteSettings.phone}
                    </a>
                  )}
                </li>
                <li>
                  <span className="text-orange/80 block text-[0.6rem] tracking-[0.28em] uppercase">
                    Email
                  </span>
                  {emailHref ? (
                    <a
                      href={emailHref}
                      className="hover:text-ember mt-1.5 block text-white transition-colors duration-500"
                    >
                      {siteSettings.email}
                    </a>
                  ) : (
                    <span className="placeholder-chip mt-1.5 inline-block">
                      {siteSettings.email}
                    </span>
                  )}
                </li>
                <li>
                  <span className="text-orange/80 block text-[0.6rem] tracking-[0.28em] uppercase">
                    WhatsApp
                  </span>
                  {whatsappHref ? (
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-ember mt-1.5 block text-white transition-colors duration-500"
                    >
                      Chat with us
                    </a>
                  ) : (
                    <span className="placeholder-chip mt-1.5 inline-block">
                      {siteSettings.whatsappNumber}
                    </span>
                  )}
                </li>
                <li>
                  <span className="text-orange/80 block text-[0.6rem] tracking-[0.28em] uppercase">
                    Address
                  </span>
                  <span className="text-muted mt-1.5 block not-italic">
                    {siteSettings.address.line1}
                    <br />
                    {siteSettings.address.city}, {siteSettings.address.state}
                  </span>
                </li>
              </ul>
            </div>

            <div className="border-orange/30 bg-orange/5 border p-7">
              <p className="eyebrow">In an emergency?</p>
              <p className="text-muted mt-3 text-sm leading-relaxed">
                For urgent pastoral care, please call the church phone number above rather
                than using this form — it is checked regularly but not in real time.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
