import { defineArrayMember, defineField, defineType } from "sanity";

export { blockContent } from "./blockContent";

export const sermon = defineType({
  name: "sermon",
  title: "Sermons",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "Slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "series",
      type: "string",
      title: "Series",
      description: "e.g. 'Foundations' — used for filtering on the site.",
    }),
    defineField({
      name: "speaker",
      type: "string",
      title: "Speaker",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "date",
      type: "date",
      title: "Date preached",
      options: { dateFormat: "DD MMM YYYY" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "scripture",
      type: "string",
      title: "Scripture reference",
    }),
    defineField({
      name: "excerpt",
      type: "blockContent",
      title: "Excerpt",
      description: "Short summary shown in lists and search results.",
    }),
    defineField({
      name: "youtubeId",
      type: "string",
      title: "YouTube video ID",
      description:
        "The ID from the YouTube URL, e.g. for https://youtu.be/ABC123xyz it is ABC123xyz.",
    }),
    defineField({
      name: "audioUrl",
      type: "url",
      title: "Audio download URL (optional)",
    }),
    defineField({
      name: "featured",
      type: "boolean",
      title: "Feature on the home page",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "date" },
    prepare({ title, subtitle }) {
      return { title: title ?? "Untitled sermon", subtitle };
    },
  },
  orderings: [
    {
      title: "Date, newest",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
});

export const churchEvent = defineType({
  name: "churchEvent",
  title: "Events",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "Slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      type: "blockContent",
      title: "Description",
    }),
    defineField({
      name: "startsAt",
      type: "datetime",
      title: "Starts",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "endsAt",
      type: "datetime",
      title: "Ends",
    }),
    defineField({
      name: "venue",
      type: "string",
      title: "Venue",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "location",
      type: "string",
      title: "Location / address line",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "startsAt" },
  },
  orderings: [
    {
      title: "Start date, soonest",
      name: "startsAtAsc",
      by: [{ field: "startsAt", direction: "asc" }],
    },
  ],
});

export const leader = defineType({
  name: "leader",
  title: "Leadership",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Name",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "role",
      type: "string",
      title: "Role",
      validation: (r) => r.required(),
    }),
    defineField({ name: "bio", type: "blockContent", title: "Short bio" }),
    defineField({
      name: "photo",
      type: "image",
      title: "Photo",
      options: { hotspot: true },
    }),
    defineField({ name: "photoUrl", type: "url", title: "Photo URL (optional)" }),
    defineField({
      name: "order",
      type: "number",
      title: "Display order",
      initialValue: 100,
    }),
  ],
  preview: { select: { title: "name", subtitle: "role" } },
});

export const ministry = defineType({
  name: "ministry",
  title: "Ministries",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Name",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "Slug",
      options: { source: "name" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "summary", type: "text", title: "One-line summary", rows: 2 }),
    defineField({ name: "description", type: "blockContent", title: "Description" }),
    defineField({ name: "meetingTime", type: "string", title: "Meeting time" }),
    defineField({ name: "leader", type: "string", title: "Leader" }),
  ],
  preview: { select: { title: "name", subtitle: "meetingTime" } },
});

export const announcement = defineType({
  name: "announcement",
  title: "Announcements",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      validation: (r) => r.required(),
    }),
    defineField({ name: "body", type: "blockContent", title: "Body" }),
    defineField({
      name: "publishedAt",
      type: "datetime",
      title: "Publish date",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "pinned",
      type: "boolean",
      title: "Pin to the top of the site",
      initialValue: false,
    }),
    defineField({
      name: "expiresAt",
      type: "datetime",
      title: "Hide after (optional)",
    }),
  ],
  preview: { select: { title: "title", subtitle: "publishedAt" } },
});

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Document title",
      description: "Only one settings document should exist.",
      initialValue: "Site settings",
    }),
    defineField({ name: "tagline", type: "string", title: "Tagline" }),
    defineField({
      name: "welcomeLine",
      type: "text",
      title: "Hero welcome line",
      rows: 2,
    }),
    defineField({
      name: "serviceTimes",
      type: "array",
      title: "Service times",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", type: "string", title: "Label" }),
            defineField({ name: "day", type: "string", title: "Day" }),
            defineField({ name: "time", type: "string", title: "Time" }),
            defineField({ name: "note", type: "string", title: "Note" }),
          ],
        }),
      ],
    }),
    defineField({ name: "phone", type: "string", title: "Phone" }),
    defineField({ name: "whatsapp", type: "string", title: "WhatsApp number" }),
    defineField({ name: "email", type: "email", title: "Email" }),
    defineField({
      name: "mapEmbedUrl",
      type: "url",
      title: "Google Maps embed URL",
      description: "Use the embed (output=embed) URL for the confirmed address.",
    }),
    defineField({
      name: "directionsUrl",
      type: "url",
      title: "Get directions URL",
    }),
    defineField({ name: "bankAccountName", type: "string", title: "Bank account name" }),
    defineField({
      name: "bankAccountNumber",
      type: "string",
      title: "Bank account number",
    }),
    defineField({ name: "bankName", type: "string", title: "Bank name" }),
    defineField({ name: "facebook", type: "url", title: "Facebook URL" }),
    defineField({ name: "youtube", type: "url", title: "YouTube URL" }),
    defineField({ name: "instagram", type: "url", title: "Instagram URL" }),
  ],
});
