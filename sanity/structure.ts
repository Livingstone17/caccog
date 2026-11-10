import type { StructureResolver } from "sanity/structure";

/**
 * The Studio sidebar. Editors see content in the order they publish it, with
 * site-wide settings pinned at the bottom as a single document.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Citadel of Grace")
    .items([
      S.documentTypeListItem("sermon").title("Sermons"),
      S.documentTypeListItem("churchEvent").title("Events"),
      S.documentTypeListItem("blogPost").title("Blog posts"),
      S.divider(),
      S.documentTypeListItem("staffProfile").title("Staff"),
      S.documentTypeListItem("ministry").title("Ministries"),
      S.documentTypeListItem("announcement").title("Announcements"),
      S.divider(),
      S.listItem()
        .title("Site settings")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
    ]);
