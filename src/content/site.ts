import type { BankDetails, GivingPreset, ServiceTime } from "./types";

/** Confirmed church coordinates — 6.616859° N, 3.301371° E. */
const coords = { lat: 6.616859, lng: 3.301371 } as const;
const latLng = `${coords.lat},${coords.lng}`;

/**
 * Site-wide settings.
 *
 * Every value wrapped in square brackets is a PLACEHOLDER that must be
 * confirmed with church leadership before launch — see CONTENT_TODO.md.
 * Nothing here has been invented.
 */
export const siteSettings = {
  name: "Citadel of Grace",
  fullName: "Christ Apostolic Church, Citadel of Grace",
  shortName: "CAC, Citadel of Grace",
  denomination: "Christ Apostolic Church (CAC)",
  /** Proposed welcome line — see CONTENT_TODO.md tagline options. */
  tagline: "",
  /** Used when no hero line is supplied: one-line welcome. */
  welcomeLine:
    "Raising Christians in the market place in the order of Daniel and Esther through practical teaching",

  city: "Lagos, Nigeria",

  address: {
    line1: "1, Jolaosho street",
    line2: "",
    city: "Alagbado",
    state: "Lagos",
    country: "Nigeria",
    postalCode: "",
  },

  /** Two numbers, spaced so the line can wrap on narrow screens. */
  phone: "+234 703 528 2112, +234 806 896 4853",
  whatsappNumber: "+2348068964853",
  email: "Caccog222000@gmail.com",

  /** Coordinates used to build the map embed and directions links below. */
  geo: coords,
  /** Google Maps embed, centred on the church (output=embed = no API key). */
  mapEmbedUrl: `https://www.google.com/maps?q=${latLng}&z=17&output=embed`,
  /** Maps "Get directions" deep link to the church pin. */
  directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${latLng}`,

  socials: {
    facebook: "https://www.facebook.com/Caccog",
    youtube: "https://www.youtube.com/@CacCog",
    instagram: "", // [LINK to supply]
    /** Channel handle confirmed as "CacCog"; channels need an invite link. */
    whatsappChannel: "", // [INVITE LINK to supply]
  },

  /**
   * Live streaming — powers the /live page.
   *
   * The Facebook page below is the confirmed "Watch live" destination. Set
   * `youtubeLiveId` to a channel ID (starts with "UC") or the live video ID
   * and the /live page embeds the stream directly (click-to-load, no
   * third-party request until the visitor presses play). Everything in
   * square brackets is pending — see CONTENT_TODO.md.
   */
  livestream: {
    /** YouTube channel ID ("UC…") or live video ID. Null = not yet supplied. */
    youtubeLiveId: null as string | null,
    /** External watch link shown while no embed is configured. */
    watchUrl: "https://web.facebook.com/citadelofgrace.cac",
    /** Label for the external watch button — change together with watchUrl. */
    watchLabel: "Watch on Facebook",
    /** Streaming schedule note shown under the player. */
    scheduleNote:
      "[Streaming schedule — e.g. every Sunday service streams live — to confirm]",
  },

  serviceTimes: [
    {
      id: "sunday-worship",
      label: "Sunday Worship Service",
      day: "Sunday",
      time: "7:00am-9:00am",
      note: "English Service",
    },
    {
      id: "sunday-worship-yoruba",
      label: "Sunday Worship Service",
      day: "Sunday",
      time: "10:00am-12:00pm",
      note: "Yoruba Service",
    },
    {
      id: "midweek",
      label: "Midweek service - Bible Study",
      day: "Monday",
      time: "6:00pm-7:00pm",
    },
    {
      id: "thursday-service",
      label: "Thursday service - Business Class Meeting",
      day: "Thursday",
      time: "8:00am-10:00am",
    },
  ] satisfies ServiceTime[],

  giving: {
    bank: {
      accountName: "CAC Citadel of Grace",
      accountNumber: "4110078626",
      bank: "Fidelity Bank",
    } satisfies BankDetails,
    presets: [
      { label: "₦1,000", amountKobo: 100_000 },
      { label: "₦5,000", amountKobo: 500_000 },
      { label: "₦10,000", amountKobo: 1_000_000 },
      { label: "₦25,000", amountKobo: 2_500_000 },
    ] satisfies GivingPreset[],
  },

  legal: {
    privacyEffectiveDate: "[Date to confirm]",
  },
} as const;

export type SiteSettings = typeof siteSettings;

export const NAV_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/plan-your-visit", label: "Plan Your Visit" },
  { href: "/live", label: "Live" },
  { href: "/sermons", label: "Sermons" },
  { href: "/events", label: "Events" },
  { href: "/ministries", label: "Ministries" },
  { href: "/contact", label: "Contact" },
] as const;
