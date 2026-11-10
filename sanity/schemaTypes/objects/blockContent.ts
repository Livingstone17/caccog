import { defineArrayMember, defineType } from "sanity";

/**
 * Rich text used by sermon descriptions, event details, bios and post bodies.
 * Rendered on the site with `@portabletext/react` if a section ever needs the
 * full formatting; list pages derive plain text from it.
 */
export const blockContent = defineType({
  name: "blockContent",
  title: "Content",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              { name: "href", type: "url", title: "URL" },
              {
                name: "openInNewTab",
                type: "boolean",
                title: "Open in a new tab",
                initialValue: false,
              },
            ],
          },
        ],
      },
    }),
  ],
});
