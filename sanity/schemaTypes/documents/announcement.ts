import { defineField, defineType } from "sanity";

export const announcement = defineType({
  name: "announcement",
  title: "Announcement",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "body", title: "Body", type: "blockContent" }),
    defineField({
      name: "publishedAt",
      title: "Publish date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "pinned",
      title: "Pin to the top of the site",
      type: "boolean",
      initialValue: false,
    }),
    defineField({ name: "expiresAt", title: "Hide after (optional)", type: "datetime" }),
  ],
  preview: { select: { title: "title", subtitle: "publishedAt" } },
});
