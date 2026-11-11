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
      "When you give by bank transfer, we only learn what you choose to tell us — typically your name, the amount, the purpose of your gift, and the proof of transfer if you send it to the church office. We never ask for, see or store your card number, PIN or online banking password.",
      "When you subscribe to the newsletter, we store your email address only for the purpose of sending updates.",
    ],
  },
  {
    heading: "How we use your information",
    body: [
      "To reply to enquiries, to confirm your gift and issue a receipt when you ask for one, to send the newsletter you asked for, and to keep basic security records (such as rate limiting) that protect the site from abuse.",
      "We do not sell, rent or trade your personal information to anyone.",
    ],
  },
  {
    heading: "Third-party services",
    body: [
      "Payments: gifts are made by direct bank transfer through your own bank, whose policies cover that transaction. This website does not process payments or collect card details. If online card giving is added later, payment processing will be handled by Paystack under their own privacy policy.",
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
