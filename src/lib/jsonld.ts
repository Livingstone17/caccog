import type { ChurchEvent, Sermon } from "@/content/types";
import { siteSettings } from "@/content/site";

const baseUrl = () => process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

function addressJsonLd() {
  const a = siteSettings.address;
  return {
    "@type": "PostalAddress",
    streetAddress: a.line1,
    addressLocality: a.city,
    addressRegion: a.state,
    postalCode: a.postalCode || undefined,
    addressCountry: a.country,
  };
}

function openingHoursJsonLd() {
  const dayMap: Record<string, string> = {
    Sunday: "Su",
    Monday: "Mo",
    Tuesday: "Tu",
    Wednesday: "We",
    Thursday: "Th",
    Friday: "Fr",
    Saturday: "Sa",
  };
  return siteSettings.serviceTimes
    .filter((t) => dayMap[t.day] && !/[[\]]/.test(t.time))
    .map((t) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${t.day}`,
      opens: t.time,
      closes: t.time,
    }));
}

/**
 * Organization structured data — the spec asks for Church, Organization and
 * Event separately. Organization is the broader entity (brand + sameAs +
 * contact point); Church is the Place-level sibling emitted on the home page.
 * Emitted site-wide from the root layout.
 */
export function organizationJsonLd() {
  const socials = Object.values(siteSettings.socials).filter(Boolean) as string[];
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl()}/#organization`,
    name: siteSettings.name,
    alternateName: siteSettings.fullName,
    url: baseUrl(),
    logo: `${baseUrl()}/logo.png`,
    description: `${siteSettings.name} — a ${siteSettings.denomination} congregation in ${siteSettings.city}.`,
    sameAs: socials.length ? socials : undefined,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Church office",
      email: siteSettings.email,
      telephone: siteSettings.phone,
    },
    address: addressJsonLd(),
  };
}

/** Church / Organization structured data for the home page. */
export function churchJsonLd() {
  const socials = Object.values(siteSettings.socials).filter(Boolean) as string[];
  return {
    "@context": "https://schema.org",
    "@type": "Church",
    "@id": `${baseUrl()}/#church`,
    name: siteSettings.name,
    alternateName: siteSettings.fullName,
    description: `${siteSettings.name} — a ${siteSettings.denomination} congregation in ${siteSettings.city}.`,
    url: baseUrl(),
    logo: `${baseUrl()}/logo.png`,
    address: addressJsonLd(),
    telephone: siteSettings.phone,
    email: siteSettings.email,
    sameAs: socials.length ? socials : undefined,
    makesOffer: {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Weekly worship services",
      },
    },
    potentialAction: {
      "@type": "DonateAction",
      target: `${baseUrl()}/give`,
      name: "Give online",
    },
    openingHoursSpecification: openingHoursJsonLd().length
      ? openingHoursJsonLd()
      : undefined,
  };
}

/** Event structured data for event detail pages. */
export function eventJsonLd(event: ChurchEvent) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: event.startsAt,
    endDate: event.endsAt ?? event.startsAt,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.venue,
      address: {
        "@type": "PostalAddress",
        streetAddress: event.location ?? siteSettings.address.line1,
        addressLocality: siteSettings.address.city,
        addressCountry: siteSettings.address.country,
      },
    },
    url: `${baseUrl()}/events/${event.slug}`,
    organizer: {
      "@type": "Organization",
      name: siteSettings.name,
      url: baseUrl(),
    },
  };
}

/** Sermon structured data (Article + VideoObject when a video exists). */
export function sermonJsonLd(sermon: Sermon) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: sermon.title,
    datePublished: sermon.date,
    description: sermon.excerpt,
    author: { "@type": "Person", name: sermon.speaker },
    publisher: { "@type": "Organization", name: siteSettings.name },
    mainEntityOfPage: `${baseUrl()}/sermons/${sermon.slug}`,
    video: sermon.videoId
      ? {
          "@type": "VideoObject",
          name: sermon.title,
          embedUrl: `https://www.youtube.com/embed/${sermon.videoId}`,
        }
      : undefined,
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${baseUrl()}${item.path}`,
    })),
  };
}
