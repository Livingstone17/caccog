import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { NAV_LINKS, siteSettings } from "@/content/site";
import { getUpcomingEvents } from "@/content/events";
import { NewsletterForm } from "@/components/site/newsletter-form";
import { isPlaceholder } from "@/lib/utils";

function SocialIcon({ label }: { label: "facebook" | "youtube" | "instagram" }) {
  const href = siteSettings.socials[label];
  if (!href) return null;

  const paths: Record<typeof label, ReactNode> = {
    facebook: (
      <path d="M13.5 9H15.5V6H13.5C11.8 6 11 7.1 11 8.7V10H9V13H11V20H14V13H16L16.5 10H14V9.2C14 9.1 14.1 9 14.3 9H15.5H13.5Z" />
    ),
    youtube: (
      <path d="M21.6 7.2C21.4 6.5 20.9 6 20.2 5.8C18.9 5.5 12 5.5 12 5.5C12 5.5 5.1 5.5 3.8 5.8C3.1 6 2.6 6.5 2.4 7.2C2.1 8.5 2.1 12 2.1 12C2.1 12 2.1 15.5 2.4 16.8C2.6 17.5 3.1 18 3.8 18.2C5.1 18.5 12 18.5 12 18.5C12 18.5 18.9 18.5 20.2 18.2C20.9 18 21.4 17.5 21.6 16.8C21.9 15.5 21.9 12 21.9 12C21.9 12 21.9 8.5 21.6 7.2ZM9.9 15.1V8.9L15.2 12L9.9 15.1Z" />
    ),
    instagram: (
      <path d="M12 8.2C10.5 8.2 9.2 9.4 9.2 11C9.2 12.5 10.5 13.8 12 13.8C13.5 13.8 14.8 12.5 14.8 11C14.8 9.4 13.5 8.2 12 8.2ZM8.1 11C8.1 8.8 9.9 7 12 7C14.1 7 15.9 8.8 15.9 11C15.9 13.1 14.1 15 12 15C9.9 15 8.1 13.1 8.1 11ZM17 6.9C17 7.5 16.5 8 15.9 8C15.3 8 14.9 7.5 14.9 6.9C14.9 6.3 15.3 5.9 15.9 5.9C16.5 5.9 17 6.3 17 6.9ZM19.9 8C19.8 6.9 19.6 6 18.9 5.3C18.2 4.6 17.3 4.4 16.2 4.3C15.1 4.2 11.9 4.2 10.8 4.3C9.7 4.4 8.8 4.6 8.1 5.3C7.4 6 7.2 6.9 7.1 8C7 9.1 7 12.9 7.1 14C7.2 15.1 7.4 16 8.1 16.7C8.8 17.4 9.7 17.6 10.8 17.7C11.9 17.8 15.1 17.8 16.2 17.7C17.3 17.6 18.2 17.4 18.9 16.7C19.6 16 19.8 15.1 19.9 14C20 12.9 20 9.1 19.9 8ZM18.8 15.2C18.6 15.7 18.2 16.1 17.7 16.3C17 16.6 15.2 16.5 12 16.5C8.8 16.5 7 16.6 6.3 16.3C5.8 16.1 5.4 15.7 5.2 15.2C4.9 14.5 5 12.7 5 9.5C5 6.3 4.9 4.5 5.2 3.8C5.4 3.3 5.8 2.9 6.3 2.7C7 2.4 8.8 2.5 12 2.5C15.2 2.5 17 2.4 17.7 2.7C18.2 2.9 18.6 3.3 18.8 3.8C19.1 4.5 19 6.3 19 9.5C19 12.7 19.1 14.5 18.8 15.2Z" />
    ),
  };

  const names: Record<typeof label, string> = {
    facebook: "Facebook",
    youtube: "YouTube",
    instagram: "Instagram",
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={names[label]}
      className="hover:border-orange/60 hover:text-orange flex size-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors duration-500"
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
        {paths[label]}
      </svg>
    </a>
  );
}

export function Footer() {
  const upcoming = getUpcomingEvents(2);

  return (
    <footer className="grain bg-charcoal/40 relative border-t border-white/10">
      <div className="container-page grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-4">
          <Image
            src="/logo.png"
            alt="Citadel of Grace — Christ Apostolic Church (CAC)"
            width={1080}
            height={438}
            sizes="(max-width: 768px) 260px, 300px"
            className="h-auto w-32 md:w-52"
          />
          <p className="text-muted mt-6 max-w-xs text-sm leading-relaxed">
            {siteSettings.welcomeLine}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <SocialIcon label="facebook" />
            <SocialIcon label="youtube" />
            <SocialIcon label="instagram" />
          </div>
          <div className="mt-8">
            <NewsletterForm />
          </div>
        </div>

        <nav aria-label="Footer" className="md:col-span-3">
          <p className="eyebrow mb-5">Explore</p>
          <ul className="text-muted space-y-3 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="hover:text-ember transition-colors duration-500"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/give"
                className="text-orange hover:text-ember transition-colors duration-500"
              >
                Give
              </Link>
            </li>
          </ul>
        </nav>

        <div className="md:col-span-2">
          <p className="eyebrow mb-5">Services</p>
          <ul className="text-muted space-y-4 text-sm">
            {siteSettings.serviceTimes.map((t) => (
              <li key={t.id}>
                <span className="block text-white">{t.day}</span>
                <span className={isPlaceholder(t.time) ? "placeholder-chip" : undefined}>
                  {t.time}
                </span>
                <span className="mt-1 block text-xs text-white/50">{t.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <p className="eyebrow mb-5">Find us</p>
          <address className="text-muted space-y-4 text-sm not-italic">
            <span className="block">
              {siteSettings.address.line1}
              <br />
              {siteSettings.address.city}, {siteSettings.address.state}
              <br />
              {siteSettings.address.country}
            </span>
            <span className="block">
              <span
                className={
                  isPlaceholder(siteSettings.phone) ? "placeholder-chip" : undefined
                }
              >
                {siteSettings.phone}
              </span>
            </span>
            <span className="block text-white/60">
              {upcoming.length > 0 && (
                <>
                  Next up: <span className="placeholder-chip">{upcoming[0].title}</span>
                </>
              )}
            </span>
          </address>
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/45 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteSettings.fullName}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-white/80">
              Privacy
            </Link>
            <span className="text-orange/60">Built with grace</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
