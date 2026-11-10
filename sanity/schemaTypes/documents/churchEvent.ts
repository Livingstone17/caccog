import { defineField, defineType } from "sanity";

/**
 * A church event or service. Upcoming events appear on /events, the home page
 * "Upcoming events" block and the footer "Next up" line.
 */
export const churchEvent = defineType({
  name: "churchEvent",
  title: "Event",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "The page address, e.g. /events/rehoboth-fasting-and-prayer",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "eventDate",
      title: "Starts",
      type: "datetime",
      description:
        "Include the timezone (Lagos is +01:00) so the site shows the right time.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "endDate",
      title: "Ends",
      type: "datetime",
      description:
        "Leave empty for a single-moment event; set it for services and multi-day fasts.",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description:
        "Address line shown on the event page, e.g. 1, Jolaosho street, Alagbado, Lagos",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "venue",
      title: "Venue name",
      type: "string",
      description: "Defaults to the church auditorium when left empty.",
    }),
    defineField({
      name: "bannerImage",
      title: "Banner image",
      type: "image",
      description: "Wide image shown at the top of the event page (16:9 works best).",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
          description: "Describes the image for screen readers.",
        }),
      ],
    }),
    defineField({
      name: "details",
      title: "Details",
      type: "blockContent",
      description:
        "What the event is about — shown on the event page and in search results.",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      description: "Optional label, e.g. Fasting & Prayer, Special Service.",
    }),
    defineField({
      name: "isMultiDay",
      title: "Runs across several days",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "dailySchedule",
      title: "Daily schedule",
      type: "string",
      description: "For multi-day events only, e.g. Daily fasting 6:00 AM – 6:00 PM.",
      hidden: ({ document }) => !document?.isMultiDay,
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "eventDate", media: "bannerImage" },
    prepare({ title, subtitle, media }) {
      return { title: title ?? "Untitled event", subtitle, media };
    },
  },
  orderings: [
    {
      title: "Start date, soonest",
      name: "eventDateAsc",
      by: [{ field: "eventDate", direction: "asc" }],
    },
  ],
});
