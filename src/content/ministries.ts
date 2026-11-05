// import type { Leader, Ministry } from "./types";

// /** Names and bios are placeholders — supply real leaders (CONTENT_TODO.md). */
// export const leaders: Leader[] = [
//   {
//     id: "l-01",
//     name: "[Pastor name]",
//     role: "Senior Pastor",
//     bio: "[Short bio — to be supplied: calling, leadership of the congregation, contact for pastoral care.]",
//     photoUrl: null,
//   },
//   {
//     id: "l-02",
//     name: "[Minister name]",
//     role: "[Role to confirm]",
//     bio: "[Short bio — to be supplied.]",
//     photoUrl: null,
//   },
//   {
//     id: "l-03",
//     name: "[Ministry leader name]",
//     role: "[Role to confirm]",
//     bio: "[Short bio — to be supplied.]",
//     photoUrl: null,
//   },
//   {
//     id: "l-04",
//     name: "[Department head name]",
//     role: "[Role to confirm]",
//     bio: "[Short bio — to be supplied.]",
//     photoUrl: null,
//   },
// ];

// export function getLeaders(): Leader[] {
//   return leaders;
// }

// /**
//  * Departments listed in the PRD (choir, youth, women, men, children, ushers,
//  * media) — flagged [CONFIRM] there. Meeting times and leaders are placeholders.
//  */

// export const ministries: Ministry[] = [
//   {
//     id: "m-01",
//     slug: "choir",
//     name: "Choir",
//     summary: "[One-line summary of the choir ministry.]",
//     description:
//       "[Ministry description — to be supplied: who it is for, what they do, how to join.]",
//     meetingTime: "[Meeting time to confirm]",
//     leader: "[Leader name]",
//   },
//   {
//     id: "m-02",
//     slug: "youth",
//     name: "Youth",
//     summary: "[One-line summary of the youth ministry.]",
//     description:
//       "[Ministry description — to be supplied: who it is for, what they do, how to join.]",
//     meetingTime: "[Meeting time to confirm]",
//     leader: "[Leader name]",
//   },
//   {
//     id: "m-03",
//     slug: "women",
//     name: "Women",
//     summary: "[One-line summary of the women's ministry.]",
//     description:
//       "[Ministry description — to be supplied: who it is for, what they do, how to join.]",
//     meetingTime: "[Meeting time to confirm]",
//     leader: "[Leader name]",
//   },
//   {
//     id: "m-04",
//     slug: "men",
//     name: "Men",
//     summary: "[One-line summary of the men's ministry.]",
//     description:
//       "[Ministry description — to be supplied: who it is for, what they do, how to join.]",
//     meetingTime: "[Meeting time to confirm]",
//     leader: "[Leader name]",
//   },
//   {
//     id: "m-05",
//     slug: "children",
//     name: "Children",
//     summary: "[One-line summary of the children's ministry.]",
//     description:
//       "[Ministry description — to be supplied: who it is for, what they do, how to join.]",
//     meetingTime: "[Meeting time to confirm]",
//     leader: "[Leader name]",
//   },
//   {
//     id: "m-06",
//     slug: "ushers",
//     name: "Ushers",
//     summary: "[One-line summary of the ushering ministry.]",
//     description:
//       "[Ministry description — to be supplied: who it is for, what they do, how to join.]",
//     meetingTime: "[Meeting time to confirm]",
//     leader: "[Leader name]",
//   },
//   {
//     id: "m-07",
//     slug: "media",
//     name: "Media",
//     summary: "[One-line summary of the media team: sound, cameras, stream.]",
//     description:
//       "[Ministry description — to be supplied: who it is for, what they do, how to join.]",
//     meetingTime: "[Meeting time to confirm]",
//     leader: "[Leader name]",
//   },
// ];

// export function getMinistries(): Ministry[] {
//   return ministries;
// }

// export function getMinistryBySlug(slug: string): Ministry | undefined {
//   return ministries.find((m) => m.slug === slug);
// }




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
 * Church ministries & departments.
 * meetingTime / leader may be null when not yet assigned.
 */
export const ministries: Ministry[] = [
  {
    id: "m-01",
    slug: "choir",
    name: "Choir Department",
    summary:
      "Glorifying God through songs that communicate the message of Christ and create an atmosphere of worship.",
    description:
      "Our ministry seeks to glorify God through songs that communicate the message of Christ and create an atmosphere of worship.",
    meetingTime: "4:30 PM to 7:30 PM on Saturday",
    leader: "Mr Tobi Amusan",
  },
  {
    id: "m-02",
    slug: "youth",
    name: "Youth Ministry",
    summary:
      "Raising 360-degree youth who are balanced spiritually, emotionally, financially and socially through Biblical teaching.",
    description:
      "We are committed to raising a 360 degree youth who is balanced spiritually, emotionally, financially and socially through Biblical teachings.",
    meetingTime: null,
    leader: null,
  },
  {
    id: "m-03",
    slug: "media",
    name: "Media Ministry",
    summary:
      "Capturing and sharing church life through photography, videography, livestreaming, graphics and digital platforms.",
    description:
      "We are committed to capturing and sharing the activities, programs and special moments of the church through photography, videography, contents, livestreaming, graphics design and other digital platforms.",
    meetingTime: null,
    leader: "Mr Opeyemi Michael",
  },
  {
    id: "m-04",
    slug: "administration",
    name: "Administrative Department",
    summary:
      "Coordinating and managing the administrative affairs of the church for smooth, effective operations.",
    description:
      "We are responsible for coordinating and managing the administrative affairs of the church to ensure smooth and effective operations.",
    meetingTime: "Sunday 1:00 PM",
    leader: "Mrs Debbie Opeyemi",
  },
  {
    id: "m-05",
    slug: "ushers",
    name: "Ushers Ministry",
    summary:
      "Ensuring orderliness and a peaceful, comfortable worship experience for everyone who comes into God's presence.",
    description:
      "We are dedicated to ensure orderliness, peaceful and comfortable worship experience for everyone who comes into God's presence.",
    meetingTime: "5:00 PM to 6:00 PM on Friday",
    leader: null,
  },
  {
    id: "m-06",
    slug: "greeters",
    name: "Greeters Ministry",
    summary:
      "Creating a warm, welcoming and friendly atmosphere for everyone who visits the church.",
    description:
      "We are committed to ensure warm welcoming and friendly atmosphere for everyone who visits our church.",
    meetingTime: null,
    leader: null,
  },
  {
    id: "m-07",
    slug: "children",
    name: "Children Ministry",
    summary:
      "Raising children in a Godly manner through Biblical teaching and guidance.",
    description:
      "We are committed to raising the children in a Godly manner, through Biblical teachings and guidance.",
    meetingTime: null,
    leader: null,
  },
  {
    id: "m-08",
    slug: "men",
    name: "Men Ministry",
    summary:
      "Raising godly men and husbands who are spiritually mature, responsible and grounded in the word of God.",
    description:
      "We are committed to raise godly men and husbands, who are spiritually matured, responsible and grounded by the word of God.",
    meetingTime: null,
    leader: null,
  },
  {
    id: "m-09",
    slug: "women",
    name: "Women Ministry",
    summary:
      "Raising godly, sound women, wives and mothers who are purpose-driven and committed to God's call.",
    description:
      "We are committed to raise a Godly, sound women, wife, and mothers who are purpose driven and committed to fulfill God's purpose for their lives.",
    meetingTime: null,
    leader: null,
  },
  {
    id: "m-10",
    slug: "sunday-school",
    name: "Sunday School Ministry",
    summary:
      "Teaching, nurturing and equipping believers with a solid understanding of God's word.",
    description:
      "We are committed to teaching, nurturing and equipping believers with a solid understanding of God's word.",
    meetingTime: "6:00 PM to 7:30 PM on Saturday",
    leader: "Pst Mrs Busayo Babatope",
  },
];

export function getMinistries(): Ministry[] {
  return ministries;
}

export function getMinistryBySlug(slug: string): Ministry | undefined {
  return ministries.find((m) => m.slug === slug);
}