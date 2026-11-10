import { defineQuery } from "next-sanity";

/**
 * Every GROQ query the site runs lives here.
 *
 * `defineQuery` is an identity function at runtime; it exists so editors get
 * GROQ syntax highlighting and, once `sanity typegen` output is generated, a
 * typed return value. Draft documents are filtered out explicitly so the same
 * queries are safe against any perspective.
 */

/** Fields shared by the list and detail sermon queries. */
const sermonFields = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  series,
  speaker,
  date,
  scripture,
  coverImage,
  audiomackEmbedUrl,
  youtubeId,
  audioUrl,
  featured,
  description
`;

/** Fields shared by the list and detail event queries. */
const eventFields = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  eventDate,
  endDate,
  venue,
  location,
  category,
  isMultiDay,
  dailySchedule,
  bannerImage,
  details
`;

/** All sermons, newest first. */
export const sermonsQuery = defineQuery(/* groq */ `
  *[_type == "sermon" && !(_id in path("drafts.**"))] | order(date desc) {
    ${sermonFields}
  }
`);

/** The newest `$limit` sermons. */
export const latestSermonsQuery = defineQuery(/* groq */ `
  *[_type == "sermon" && !(_id in path("drafts.**"))] | order(date desc)[0...$limit] {
    ${sermonFields}
  }
`);

/** A single sermon by its slug — `null` when nothing matches. */
export const sermonBySlugQuery = defineQuery(/* groq */ `
  *[_type == "sermon" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    ${sermonFields}
  }
`);

/** Every event, soonest first (past events included, so the archive stays complete). */
export const eventsQuery = defineQuery(/* groq */ `
  *[_type == "churchEvent" && !(_id in path("drafts.**"))] | order(eventDate asc) {
    ${eventFields}
  }
`);

/** Events that have not finished yet, soonest first. */
export const upcomingEventsQuery = defineQuery(/* groq */ `
  *[
    _type == "churchEvent" &&
    !(_id in path("drafts.**")) &&
    coalesce(endDate, eventDate) >= now()
  ] | order(eventDate asc)[0...$limit] {
    ${eventFields}
  }
`);

/** A single event by its slug — `null` when nothing matches. */
export const eventBySlugQuery = defineQuery(/* groq */ `
  *[_type == "churchEvent" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    ${eventFields}
  }
`);

/**
 * Blog and staff queries are ready for when those sections ship. Nothing on the
 * site renders them yet, so they cost nothing until they are wired up.
 */

const postFields = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  coverImage,
  publishedAt,
  "author": author->{ _id, name, role, photo },
  body
`;

export const latestPostsQuery = defineQuery(/* groq */ `
  *[_type == "blogPost" && !(_id in path("drafts.**")) && publishedAt <= now()] | order(publishedAt desc)[0...$limit] {
    ${postFields}
  }
`);

export const postBySlugQuery = defineQuery(/* groq */ `
  *[_type == "blogPost" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    ${postFields}
  }
`);

export const ministriesQuery = defineQuery(/* groq */ `
  *[_type == "ministry" && !(_id in path("drafts.**"))] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    summary,
    description,
    meetingTime,
    leader
  }
`);

export const staffProfilesQuery = defineQuery(/* groq */ `
  *[_type == "staffProfile" && !(_id in path("drafts.**"))] | order(order asc, name asc) {
    _id,
    name,
    "slug": slug.current,
    role,
    bio,
    photo,
    email,
    order
  }
`);
