import type { Leader, Ministry } from "./types";

/** Names and bios are placeholders — supply real leaders (CONTENT_TODO.md). */
export const leaders: Leader[] = [
  {
    id: "l-01",
    name: "[Pastor name]",
    role: "Senior Pastor",
    bio: "[Short bio — to be supplied: calling, leadership of the congregation, contact for pastoral care.]",
    photoUrl: null,
  },
  {
    id: "l-02",
    name: "[Minister name]",
    role: "[Role to confirm]",
    bio: "[Short bio — to be supplied.]",
    photoUrl: null,
  },
  {
    id: "l-03",
    name: "[Ministry leader name]",
    role: "[Role to confirm]",
    bio: "[Short bio — to be supplied.]",
    photoUrl: null,
  },
  {
    id: "l-04",
    name: "[Department head name]",
    role: "[Role to confirm]",
    bio: "[Short bio — to be supplied.]",
    photoUrl: null,
  },
];

export function getLeaders(): Leader[] {
  return leaders;
}

/**
 * Departments listed in the PRD (choir, youth, women, men, children, ushers,
 * media) — flagged [CONFIRM] there. Meeting times and leaders are placeholders.
 */
export const ministries: Ministry[] = [
  {
    id: "m-01",
    slug: "choir",
    name: "Choir",
    summary: "[One-line summary of the choir ministry.]",
    description:
      "[Ministry description — to be supplied: who it is for, what they do, how to join.]",
    meetingTime: "[Meeting time to confirm]",
    leader: "[Leader name]",
  },
  {
    id: "m-02",
    slug: "youth",
    name: "Youth",
    summary: "[One-line summary of the youth ministry.]",
    description:
      "[Ministry description — to be supplied: who it is for, what they do, how to join.]",
    meetingTime: "[Meeting time to confirm]",
    leader: "[Leader name]",
  },
  {
    id: "m-03",
    slug: "women",
    name: "Women",
    summary: "[One-line summary of the women's ministry.]",
    description:
      "[Ministry description — to be supplied: who it is for, what they do, how to join.]",
    meetingTime: "[Meeting time to confirm]",
    leader: "[Leader name]",
  },
  {
    id: "m-04",
    slug: "men",
    name: "Men",
    summary: "[One-line summary of the men's ministry.]",
    description:
      "[Ministry description — to be supplied: who it is for, what they do, how to join.]",
    meetingTime: "[Meeting time to confirm]",
    leader: "[Leader name]",
  },
  {
    id: "m-05",
    slug: "children",
    name: "Children",
    summary: "[One-line summary of the children's ministry.]",
    description:
      "[Ministry description — to be supplied: who it is for, what they do, how to join.]",
    meetingTime: "[Meeting time to confirm]",
    leader: "[Leader name]",
  },
  {
    id: "m-06",
    slug: "ushers",
    name: "Ushers",
    summary: "[One-line summary of the ushering ministry.]",
    description:
      "[Ministry description — to be supplied: who it is for, what they do, how to join.]",
    meetingTime: "[Meeting time to confirm]",
    leader: "[Leader name]",
  },
  {
    id: "m-07",
    slug: "media",
    name: "Media",
    summary: "[One-line summary of the media team: sound, cameras, stream.]",
    description:
      "[Ministry description — to be supplied: who it is for, what they do, how to join.]",
    meetingTime: "[Meeting time to confirm]",
    leader: "[Leader name]",
  },
];

export function getMinistries(): Ministry[] {
  return ministries;
}

export function getMinistryBySlug(slug: string): Ministry | undefined {
  return ministries.find((m) => m.slug === slug);
}
