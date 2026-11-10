import { announcement } from "./documents/announcement";
import { blogPost } from "./documents/blogPost";
import { churchEvent } from "./documents/churchEvent";
import { ministry } from "./documents/ministry";
import { sermon } from "./documents/sermon";
import { siteSettings } from "./documents/siteSettings";
import { staffProfile } from "./documents/staffProfile";
import { blockContent } from "./objects/blockContent";

/**
 * The complete schema registry. Adding a content type is two lines: a file in
 * `documents/` (or `objects/` for reusable fields) and an entry below.
 */
export const schemaTypes = [
  // Documents
  sermon,
  churchEvent,
  blogPost,
  staffProfile,
  ministry,
  announcement,
  siteSettings,

  // Objects
  blockContent,
];

export {
  sermon,
  churchEvent,
  blogPost,
  staffProfile,
  ministry,
  announcement,
  siteSettings,
  blockContent,
};
