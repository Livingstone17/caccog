import type { BankDetails, GivingPreset, ServiceTime } from "./types";

/**
 * Site-wide settings.
 *
 * Every value wrapped in square brackets is a PLACEHOLDER that must be
 * confirmed with church leadership before launch — see CONTENT_TODO.md.
 * Nothing here has been invented.
 */
export const siteSettings = {
  name: "Citadel of Grace",
  fullName: "Citadel of Grace, Christ Apostolic Church (CAC)",
  shortName: "Citadel of Grace",
  denomination: "Christ Apostolic Church (CAC)",
  /** Proposed welcome line — see CONTENT_TODO.md tagline options. */
  tagline: "",
  /** Used when no hero line is supplied: one-line welcome. */
  welcomeLine:
    "Raising Christians in the market place in the order of Daniel and Esther through practical teaching",

  city: "Lagos, Nigeria",

  address: {
    line1: "3",
    line2: "Mao Junction",
    city: "Alagbado",
    state: "Lagos",
    country: "Nigeria",
    postalCode: "",
  },

  phone: "+234 8162345676",
  whatsappNumber: "+234 8162345676",
  email: "caccog@gmail.com",

  /**
   * Google Maps embed URL (output=embed) — paste the confirmed address embed
   * here. While empty, a designed placeholder panel is shown instead.
   */
  mapEmbedUrl: "",
  /** Maps "Get directions" deep link — set with the confirmed address. */
  directionsUrl: "",

  socials: {
    facebook: "https://web.facebook.com/citadelofgrace.cac",
    youtube: "", // [LINK to supply]
    instagram: "", // [LINK to supply]
    whatsappChannel: "", // [LINK to supply]
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
      time: "7am & 9am",
      note: "English and Yoruba Services",
    },
    {
      id: "midweek",
      label: "Midweek service - Bible Study",
      day: "Wednessday",
      time: "5pm",
    },
  ] satisfies ServiceTime[],

  giving: {
    bank: {
      accountName: "[Account name]",
      accountNumber: "[Account number]",
      bank: "[Bank name]",
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
  { href: "/about", label: "About" },
  { href: "/plan-your-visit", label: "Plan Your Visit" },
  { href: "/live", label: "Live" },
  { href: "/sermons", label: "Sermons" },
  { href: "/events", label: "Events" },
  { href: "/ministries", label: "Ministries" },
  { href: "/contact", label: "Contact" },
] as const;
