import type { ExpectCard, Faq, TimelineEntry } from "./types";

/**
 * About page copy. Doctrinal content (statement of faith) is intentionally
 * left as placeholders until church leadership supplies approved wording.
 */

export const visionMission = {
  vision: "[Vision statement — as approved by church leadership.]",
  mission: "[Mission statement — as approved by church leadership.]",
};

export const storyTimeline: TimelineEntry[] = [
  {
    year: "[Year]",
    title: "[Foundation — how the congregation began]",
    body: "[Story entry — to be supplied. Keep it factual: who, where, when.]",
  },
  {
    year: "[Year]",
    title: "[A season of growth]",
    body: "[Story entry — to be supplied.]",
  },
  {
    year: "[Year]",
    title: "[The present day]",
    body: "[Story entry — to be supplied.]",
  },
];

/**
 * Statement of faith — placeholder ONLY. Real content must be the church's
 * approved CAC doctrinal statement. Do not write doctrine here.
 */
export const statementOfFaith = [
  {
    title: "[Belief 1 — heading]",
    body: "[Approved doctrinal statement — to be supplied by leadership.]",
  },
  {
    title: "[Belief 2 — heading]",
    body: "[Approved doctrinal statement — to be supplied by leadership.]",
  },
  {
    title: "[Belief 3 — heading]",
    body: "[Approved doctrinal statement — to be supplied by leadership.]",
  },
  {
    title: "[Belief 4 — heading]",
    body: "[Approved doctrinal statement — to be supplied by leadership.]",
  },
];

/** Home "What to expect" cards — review copy, see CONTENT_TODO.md. */
export const expectCards: ExpectCard[] = [
  {
    title: "A warm welcome",
    body: "Come as you are. Someone at the door will help you find your way and settle in.",
  },
  {
    title: "Worship and the Word",
    body: "A service shaped by intense worship, prayer and a life-transforming message from the  Scripture.",
  },
  {
    title: "Room for everyone",
    body: "Families, first-timers and old friends — there is a place for you here.",
  },
];

/** Plan Your Visit FAQ — answers are placeholders awaiting leadership input. */
export const faqs: Faq[] = [
  {
    question: "What time does the service start?",
    answer: "Service starts 7am on Sundays",
  },
  {
    question: "What should I wear?",
    answer: "Put on any beffiting and modest dress",
  },
  {
    question: "Where do I park?",
    answer: "Our protocol unit are ever ready guide you on parking instructions",
  },
  {
    question: "Is there something for my children?",
    answer:
      "We believe in catching them young for the kingdom, so We have a conducive bible learning environment for kids",
  },
  {
    question: "How do I get there?",
    answer: " Use the map and 'Get directions' button above.",
  },
  {
    question: "How can I speak to someone before I come?",
    answer: "Our pastoral care unit is available to attend to you ",
  },
];

/** Small welcome statement used on Home. */
export const welcomeStatement =
  "Whether you have walked with God for years or you are simply curious, there is a place for you in this house. We would be honoured to welcome you.";
