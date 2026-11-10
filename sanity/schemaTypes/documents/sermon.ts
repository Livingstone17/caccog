import { defineField, defineType } from "sanity";

/**
 * A preached message. Published sermons appear on /sermons (newest first), the
 * home page "Latest message" block and the sitemap.
 */
export const sermon = defineType({
  name: "sermon",
  title: "Sermon",
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
      description: "The page address, e.g. /sermons/sudden-change-day-5",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "speaker",
      title: "Speaker",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "date",
      title: "Date preached",
      type: "date",
      options: { dateFormat: "DD MMM YYYY" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      description: "Used as the page backdrop on the sermon page (16:9 works best).",
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
      name: "audiomackEmbedUrl",
      title: "Audiomack embed URL",
      type: "url",
      description:
        "On Audiomack choose Share → Embed and paste the src of the iframe, e.g. https://audiomack.com/embed/song/caccog222000/68a7725b39dc5",
      validation: (rule) =>
        rule.uri({ scheme: ["https"], allowRelative: false }).custom((value) => {
          if (!value) return true;
          return value.startsWith("https://audiomack.com/")
            ? true
            : "Use the Audiomack embed URL (https://audiomack.com/embed/…).";
        }),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "blockContent",
      description: "Shown as the intro and meta description on the sermon page.",
    }),

    /* ── Optional extras the site already supports ─────────────────────── */
    defineField({
      name: "series",
      title: "Series",
      type: "string",
      description: "Groups messages on the sermons archive.",
    }),
    defineField({
      name: "scripture",
      title: "Scripture reference",
      type: "string",
    }),
    defineField({
      name: "youtubeId",
      title: "YouTube video ID",
      type: "string",
      description:
        "The ID from the video URL: for https://youtu.be/ABC123xyz it is ABC123xyz. Leave empty to show the pending player.",
    }),
    defineField({
      name: "audioUrl",
      title: "Audio download URL",
      type: "url",
    }),
    defineField({
      name: "featured",
      title: "Feature on the home page",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "date", media: "coverImage" },
    prepare({ title, subtitle, media }) {
      return { title: title ?? "Untitled sermon", subtitle, media };
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
