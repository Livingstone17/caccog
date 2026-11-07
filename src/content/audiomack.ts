import type { AudioMessage } from "./types";

/**
 * Sermon recordings the church publishes on Audiomack.
 *
 * The account was confirmed by the media team: https://audiomack.com/caccog222000
 * Everything below is copied from that account (titles, release dates, lengths
 * and the "Feat." credit) — nothing is invented. Audiomack has no profile-wide
 * embed, so each message is embedded individually with Audiomack's official
 * player; when a new recording is uploaded, add its id here and it appears on
 * the sermons page.
 */
export const audiomack = {
  handle: "caccog222000",
  profileUrl: "https://audiomack.com/caccog222000",
} as const;

/** Newest first, in the order the account lists them. */
export const audioMessages: AudioMessage[] = [
  {
    id: "68a7725b39dc5",
    title: "SUDDEN CHANGE DAY 5",
    date: "2025-08-21",
    duration: "1:21:34",
    credit: "PST. SAM BABATOPE",
  },
  {
    id: "68a75f6e3b385",
    title: "SUDDEN CHANGE DAY 4",
    date: "2025-08-21",
    duration: "1:16:42",
    credit: "PST. SAM BABATOPE",
  },
  {
    id: "68737a614ba62",
    title: "WHY GOOD GIRLS MARRY BAD BOYS (VICE VERSA) PT 2",
    date: "2025-07-13",
    duration: "48:22",
    credit: "PST. SAM BABATOPE",
  },
  {
    id: "686a2fceee376",
    title: "WHY GOOD GIRLS MARRY BAD BOYS (VICE VERSA) PT 1",
    date: "2025-07-06",
    duration: "58:24",
    credit: "PST. SAM BABATOPE",
  },
];
