import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Site-wide copy that changes without a deploy. A single document is edited
 * from the pinned "Site settings" item in the Studio sidebar.
 */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Document title",
      type: "string",
      description: "Only one settings document should exist.",
      initialValue: "Site settings",
    }),
    defineField({ name: "tagline", title: "Tagline", type: "string" }),
    defineField({
      name: "welcomeLine",
      title: "Hero welcome line",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "serviceTimes",
      title: "Service times",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "serviceTime",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "day", title: "Day", type: "string" }),
            defineField({ name: "time", title: "Time", type: "string" }),
            defineField({ name: "note", title: "Note", type: "string" }),
          ],
          preview: { select: { title: "day", subtitle: "time" } },
        }),
      ],
    }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({ name: "whatsapp", title: "WhatsApp number", type: "string" }),
    defineField({ name: "email", title: "Email", type: "email" }),
    defineField({
      name: "mapEmbedUrl",
      title: "Google Maps embed URL",
      type: "url",
      description: "Use the embed (output=embed) URL for the confirmed address.",
    }),
    defineField({ name: "directionsUrl", title: "Get directions URL", type: "url" }),
    defineField({ name: "bankAccountName", title: "Bank account name", type: "string" }),
    defineField({
      name: "bankAccountNumber",
      title: "Bank account number",
      type: "string",
    }),
    defineField({ name: "bankName", title: "Bank name", type: "string" }),
    defineField({ name: "facebook", title: "Facebook URL", type: "url" }),
    defineField({ name: "youtube", title: "YouTube URL", type: "url" }),
    defineField({ name: "audiomack", title: "Audiomack URL", type: "url" }),
    defineField({ name: "instagram", title: "Instagram URL", type: "url" }),
    defineField({
      name: "isLive",
      title: "Church is live now",
      type: "boolean",
      description:
        "Switches on the pulsing Live dot in the site navigation. Turn it on when the service starts and off when the stream ends.",
      initialValue: false,
    }),
  ],
});
