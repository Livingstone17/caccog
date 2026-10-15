import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { siteSettings } from "@/content/site";

export const metadata: Metadata = pageMetadata("/privacy", {
  title: "Privacy Policy",
  description:
    "How Citadel of Grace collects, uses and protects the information you share through this website.",
});

const sections: { heading: string; body: string[] }[] = [
  {
    heading: "Who we are",
    body: [
      `This website is operated by ${siteSettings.fullName}, a congregation of the Christ Apostolic Church, meeting in ${siteSettings.city}.`,
      "For any question about your data, please use the contact details at the bottom of this page.",
    ],
  },
  {
    heading: "Information you give us",
    body: [
      "When you send a message or prayer request, we receive the details you type — typically your name, email address and the content of your message. Prayer requests are treated with confidentiality and are shared only with those who need to see them in order to pray and follow up.",
      "When you give, we receive your name, email address, the amount and purpose of your gift, and the transaction reference from our payment processor. We never receive, store or see your card number — payments are handled entirely by Paystack on their own secure pages.",
      "When you subscribe to the newsletter, we store your email address only for the purpose of sending updates.",
    ],
  },
  {
    heading: "How we use your information",
    body: [
      "To reply to enquiries, to deliver giving receipts and confirmations, to send the newsletter you asked for, and to keep basic security records (such as rate limiting) that protect the site from abuse.",
      "We do not sell, rent or trade your personal information to anyone.",
    ],
  },
  {
    heading: "Third-party services",
    body: [
      "Payments: Paystack processes all card and bank transactions. Paystack's own privacy policy applies to the data collected during payment.",
      "Email: transactional and form emails are delivered through Resend (or Brevo).",
      "Content management: site content is managed through Sanity.",
      "Embedded media and maps: YouTube videos and Google Maps only load when you interact with them, and those services may set their own cookies under their policies.",
      "Social links: clicking a link to Facebook, YouTube or Instagram takes you to that platform, whose policies then apply.",
    ],
  },
  {
    heading: "Cookies",
    body: [
      "This website uses only the cookies strictly required to function (for example, security and session integrity). We do not run advertising or cross-site tracking cookies on this site.",
    ],
  },
  {
    heading: "How long we keep things",
    body: [
      "Form messages and giving records are retained only as long as needed for church administration and legal requirements, then deleted.",
    ],
  },
  {
    heading: "Your rights",
    body: [
      "You may ask us for a copy of the personal data we hold about you, ask us to correct it, or ask us to delete it where we are not legally required to keep it. Use the contact details below and we will respond promptly.",
    ],
  },
  {
    heading: "Changes to this policy",
    body: [
      "We may update this policy from time to time. The date shown above will be revised whenever it changes, and material changes will be announced from the pulpit or church channels.",
    ],
  },
];

export default function PrivacyPage() {
  const effective = siteSettings.legal.privacyEffectiveDate;

  return (
    <>
      <PageHeader
        eyebrow="Your data"
        title="Privacy policy"
        intro="A plain-language account of what this website collects, why, and the choices you have."
      />
      <Section id="privacy" align="left">
        <div className="mx-auto max-w-3xl">
          <p className="text-orange text-xs tracking-[0.24em] uppercase">
            Effective date: {effective}
          </p>

          <div className="mt-10 space-y-12">
            {sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-display text-2xl font-normal text-white md:text-3xl">
                  {section.heading}
                </h2>
                <div className="text-muted mt-4 space-y-4 text-sm leading-relaxed md:text-base">
                  {section.body.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
