import type { ExpectCard, Faq, TimelineEntry } from "./types";

/**
 * About page copy. Doctrinal content (statement of faith) is intentionally
 * left as placeholders until church leadership supplies approved wording.
 */

export const visionMission = {
  vision: "Raising Christians in the market place in the order of Daniel and Esther through practical teachings",
  mission: `To preach the Gospel of Jesus Christ to all people
To raise disciples through sound biblical teaching.
To promote a lifestyle of holiness, prayer and righteousness.
To create an atmosphere for spiritual , financial , marital growth and divine encounters.
To build strong families and a loving Christian community.
To reach out to our community through evangelism and acts of love.`,
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
    title: "The Gospel and the Mission of the Church",
    body: "We believe in the supreme authority and transforming power of the Gospel of Jesus Christ. We are dedicated to spreading this message of salvation, trusting that it is the primary means by which God reconciles humanity to Himself and initiates spiritual renewal.",
  },
  {
    title: "Marketplace Ministry and Kingdom Representation",
    body: "We believe that a believer's calling extends beyond the church building. Following the biblical examples of Daniel and Deborah, we affirm that God equips His people to be excellent kingdom representatives, bringing godly influence, integrity, and leadership into the secular marketplace.",
  },
  {
    title: "Divine Purpose and Spiritual Destiny",
    body: "We believe that God has a unique and specific purpose for every individual. We are committed to teaching and mentoring believers, particularly the younger generation, to discover, embrace, and walk in the fullness of their God-given destiny.",
  },
  {
    title: "Mind Transformation and Holistic Excellence",
    body: "We believe in the necessity of mind transformation through the truth of the Word of God. We teach that renewing our thoughts and aligning them with biblical principles is essential for achieving spiritual maturity, godly character, and excellence in all areas of life.",
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

/** Giving FAQ — how transfers are described, confirmed and receipted. */
export const givingFaqs: Faq[] = [
  {
    question: "What should I put as the transfer description?",
    answer:
      "Your name and the purpose of the gift — for example “Ada Obi tithe” or “Ada Obi building fund”. That is how the finance team knows whose gift it is and what it was for.",
  },
  {
    question: "How do I confirm a transfer I have made?",
    answer:
      "Send a screenshot or photo of your receipt to the church office on WhatsApp or by email, with your name and the purpose of the gift. Both links are in the bank transfer panel above.",
  },
  {
    question: "Will I get a receipt?",
    answer:
      "Yes. Once your transfer is confirmed, the office issues a receipt to the email address or WhatsApp number you sent the proof from.",
  },
  {
    question: "Can I give by card, or set up recurring giving?",
    answer:
      "Not yet — online card giving and monthly plans are still being set up. Until then you can transfer each month from your bank app, or set a standing order to the church account with your bank.",
  },
  {
    question: "How do I know these account details are genuine?",
    answer:
      "These are the church's published account details. If any message ever gives you different details, do not send money — call the church office on the number on our contact page and confirm first.",
  },
];

/** Small welcome statement used on Home. */
export const welcomeStatement =
  "Welcome to our church family. We are a dynamic teaching ministry dedicated to spreading the gospel and equipping believers to become excellent kingdom representatives in the marketplace, following the examples of Daniel and Deborah. Driven by a passion to help young men and women step into the fullness of God’s purpose, we regularly hold conferences, seminars, and workshops focused on mind transformation and excellence in all areas of life."