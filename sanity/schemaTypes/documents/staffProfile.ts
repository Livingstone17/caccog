import { defineField, defineType } from "sanity";

/**
 * Pastors and staff. The About page reads these for its leadership section;
 * the same documents can be authored for blog posts when the blog ships.
 */
export const staffProfile = defineType({
  name: "staffProfile",
  title: "Staff profile",
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
      description: "Reserved for individual profile pages.",
      options: { source: "name", maxLength: 96 },
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      description: "e.g. Senior Pastor, Youth Pastor, Choir Director.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alternative text", type: "string" })],
    }),
    defineField({
      name: "bio",
      title: "Short bio",
      type: "blockContent",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "email",
      description: "Optional — only publish an address the staff member agrees to share.",
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      description: "Lower numbers appear first.",
      initialValue: 100,
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "photo" },
  },
});
