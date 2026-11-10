import { defineField, defineType } from "sanity";

export const ministry = defineType({
  name: "ministry",
  title: "Ministry",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "summary", title: "One-line summary", type: "text", rows: 2 }),
    defineField({ name: "description", title: "Description", type: "blockContent" }),
    defineField({ name: "meetingTime", title: "Meeting time", type: "string" }),
    defineField({ name: "leader", title: "Leader", type: "string" }),
  ],
  preview: { select: { title: "name", subtitle: "meetingTime" } },
});
