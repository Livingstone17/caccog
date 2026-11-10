# CONTENT_TODO — everything to confirm before launch

Every item marked **[CONFIRM]** in the PRD, plus every placeholder written into
the code, is listed here. Nothing in the site was invented — anything in
`[square brackets]` is a placeholder awaiting real church content.

**Search the codebase for `[` to find each placeholder in context.**
Content lives in `src/content/` (site, sermons, events, ministries, pages).

---

## 1. Identity and brand

| #   | Item                                                                                                                                                                                                      | Where                                                                                           | Status                                |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------- |
| 1   | Logo — a temporary typographic wordmark is used everywhere                                                                                                                                                | `src/app/layout.tsx`, nav, footer, OG image                                                     | **Need logo file (vector preferred)** |
| 2   | Brand colours — default palette in use: midnight `#0B1020`, indigo `#141B34`, ivory `#F6F1E7`, gold `#C9A24B`, glow `#F3E2B0`                                                                             | `src/app/globals.css` (`@theme`)                                                                | Confirm against logo                  |
| 3   | Tagline — hero currently reads _"You are welcome here"_. Options to choose from: **(A)** _"A sanctuary of light"_ · **(B)** _"Where grace meets glory"_ · **(C)** _"Rooted in grace, built as a citadel"_ | `siteSettings.tagline` in `src/content/site.ts`                                                 | **Pick one / supply your own**        |
| 4   | City and country                                                                                                                                                                                          | `siteSettings.city`, `address.*` in `src/content/site.ts` — also feeds SEO metadata and JSON-LD | **[CONFIRM]**                         |
| 5   | Domain name (`.org.ng` / `.com` etc.) and who owns it                                                                                                                                                     | `NEXT_PUBLIC_SITE_URL` env var                                                                  | **[CONFIRM]**                         |

## 2. Service times, address, contacts

| #   | Item                                                                                   | Where                         |
| --- | -------------------------------------------------------------------------------------- | ----------------------------- |
| 6   | Sunday service time(s) + any midweek service — currently `"[Time to confirm]"`         | `siteSettings.serviceTimes`   |
| 7   | Full street address (line 1, area, city, state, country)                               | `siteSettings.address`        |
| 8   | Google Maps **embed** URL for the confirmed address → fills the map on Plan Your Visit | `siteSettings.mapEmbedUrl`    |
| 9   | "Get directions" deep link (Google/Apple Maps URL)                                     | `siteSettings.directionsUrl`  |
| 10  | Church phone number                                                                    | `siteSettings.phone`          |
| 11  | WhatsApp number (click-to-chat)                                                        | `siteSettings.whatsappNumber` |
| 12  | Church email address                                                                   | `siteSettings.email`          |

Until these are supplied the site shows styled "pending" chips instead of
faking them — Plan Your Visit shows a designed map placeholder.

## 3. Social and streaming

| #   | Item                                                                                                                                                                                                                                                                                                                                                                                                                     | Where                                              | Status                                                 |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------- | ------------------------------------------------------ |
| 13  | Facebook                                                                                                                                                                                                                                                                                                                                                                                                                 | `siteSettings.socials.facebook`                    | ✅ Supplied: handle `Caccog`                           |
| 14  | YouTube channel URL                                                                                                                                                                                                                                                                                                                                                                                                      | `siteSettings.socials.youtube`                     | ✅ Supplied: handle `CacCog` — **confirm it resolves** |
| 15  | Instagram profile URL                                                                                                                                                                                                                                                                                                                                                                                                    | `siteSettings.socials.instagram`                   | **Needed**                                             |
| 16  | WhatsApp channel/link (optional) — handle supplied (`CacCog`), but channels are joined via an invite link, not a handle                                                                                                                                                                                                                                                                                                  | `siteSettings.socials.whatsappChannel`             | **Invite link needed**                                 |
| 17  | **Livestream setup** — "Watch live" now opens the `/live` page. Supply the YouTube live channel/video ID (`siteSettings.livestream.youtubeLiveId` — channel IDs start with "UC") to enable the embedded player; confirm the streaming schedule note and, if the stream lives elsewhere, the watch URL/label. Until an ID is set, `/live` plays the newest Audiomack recording instead of an empty "stream pending" panel | `siteSettings.livestream` in `src/content/site.ts` | **[CONFIRM]**                                          |

✅ **Audiomack** — the account confirmed by the media team (`audiomack.com/caccog222000`)
is linked in the footer icons and included in the structured data `sameAs` list.

## 4. People

| #   | Item                                                                                       | Where                                                              |
| --- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| 18  | Pastor's real name (placeholder `"[Pastor name]"`)                                         | `leaders` in `src/content/ministries.ts` (or Sanity `staffProfile` docs) |
| 19  | Roles for the other three leaders (`"[Role to confirm]"`)                                  | same                                                               |
| 20  | Short bios for each leader                                                                 | same                                                               |
| 21  | Portrait photos (with permission) — an elegant placeholder portrait renders until supplied | same (`photoUrl`)                                                  |

## 5. About page

| #   | Item                                                                                                                      | Where                                            |
| --- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| 22  | Vision statement                                                                                                          | `visionMission.vision` in `src/content/pages.ts` |
| 23  | Mission statement                                                                                                         | `visionMission.mission`                          |
| 24  | Story timeline (3 entries: year, heading, text)                                                                           | `storyTimeline`                                  |
| 25  | **Statement of faith — approved CAC doctrinal wording.** Only bracketed placeholders exist; no doctrine has been written. | `statementOfFaith`                               |

## 6. Sermons

| #   | Item                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Where                      |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| 26  | **Audio archive is live** — the four recordings on [Audiomack](https://audiomack.com/caccog222000) (`SUDDEN CHANGE DAY 4/5`, `WHY GOOD GIRLS MARRY BAD BOYS PT 1/2`) are listed with their real titles, release dates and lengths. **New uploads are not picked up automatically** (Audiomack's API needs a signed key) — add each recording's id to `audioMessages` after it goes up (the newest entry also fills the homepage "Latest message" section) | `src/content/audiomack.ts` |
| 27  | Confirm the preacher credit — Audiomack's "Feat." field reads `PST. SAM BABATOPE` on every recording; the site repeats it as published                                                                                                                                                                                                                                                                                                                    | same                       |
| 28  | Optional: create a playlist on the Audiomack account (`audiomack.com/<user>/playlist/<slug>`). One playlist embed would then cover the whole archive instead of one player per message                                                                                                                                                                                                                                                                    | Audiomack account          |
| 29  | Video sermons still unsupported beyond YouTube IDs (`videoId` is YouTube-only); a Facebook video needs a `platform` field plus a `FacebookFacade`. The sermon _documents_ (series, scripture, excerpts, detail pages) remain empty, so `/sermons` shows the audio archive instead of a notice                                                                                                                                                             | `src/content/sermons.ts`   |

Recordings play through Audiomack's own embed (click-to-load, no third-party
request until the visitor presses play), so audio is streamed and counted by
Audiomack rather than copied onto the site. Podcast-style direct MP3 hosting
would need the files supplied separately.

## 7. Events

| #   | Item                                                                     | Where                                                  |
| --- | ------------------------------------------------------------------------ | ------------------------------------------------------ |
| 30  | Real upcoming events: titles, descriptions, venue, address               | `src/content/events.ts` (or Sanity `churchEvent` docs) |
| 31  | **Sample dates (Nov–Dec 2026) are illustrative** — replace before launch | same                                                   |
| 32  | Event photos (optional; design works without them)                       | Sanity `bannerImage` field                             |

**Rehoboth fasting and prayer** runs 1–22 Nov 2026, so it is marked
`isMultiDay`; the calendar marks every day it spans, and its `dailySchedule`
fasting/prayer times show on the events list and the event page. Confirm those
times and the exact 1–22 Nov dates before launch.

## 8. Ministries

| #   | Item                                                                                                                                     | Where                                       |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| 33  | Confirm the ministry list — choir, youth, women, men, children, ushers, media are taken from the PRD **[CONFIRM]**; add/remove as needed | `ministries` in `src/content/ministries.ts` |
| 34  | One-line summaries and full descriptions for each                                                                                        | same                                        |
| 35  | Meeting days/times                                                                                                                       | same (`meetingTime`)                        |
| 36  | Ministry leaders' names                                                                                                                  | same (`leader`)                             |

## 9. Giving

| #   | Item                                                                                                       | Where                                                               |
| --- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| 37  | Bank account name, number, bank                                                                            | `siteSettings.giving.bank`                                          |
| 38  | Paystack **secret** key (server only)                                                                      | `PAYSTACK_SECRET_KEY` in `.env`                                     |
| 39  | Paystack **public** key                                                                                    | `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`                                   |
| 40  | Paystack plan code — enables the "Monthly (recurring)" option                                              | `NEXT_PUBLIC_PAYSTACK_PLAN_ID`                                      |
| 41  | Confirm preset amounts (₦1k/5k/10k/25k) and min/max limits                                                 | `siteSettings.giving.presets`, `src/app/api/give/initiate/route.ts` |
| 42  | Configure the webhook in Paystack dashboard → `https://<domain>/api/give/webhook` (event `charge.success`) | —                                                                   |
| 43  | Verify a **business** (not individual) Paystack account so NGN payouts settle                              | Paystack dashboard                                                  |

> Until keys exist, the Give form returns a clear "being set up" message and
> points people to bank transfer — launch-ready behaviour either way.

## 10. Email and forms

| #   | Item                                                                                                                 | Where                            |
| --- | -------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| 44  | Resend API key + verified sending domain                                                                             | `RESEND_API_KEY`, `EMAIL_FROM`   |
| 45  | Inbox that receives contact/prayer requests                                                                          | `CONTACT_INBOX_EMAIL`            |
| 46  | Reply-to address for giving receipts                                                                                 | `RECEIPT_REPLY_TO`               |
| 47  | Newsletter provider (Brevo) key + list id, or swap for Mailchimp                                                     | `BREVO_API_KEY`, `BREVO_LIST_ID` |
| 48  | (Optional) Cloudflare Turnstile on the forms if spam ever gets through — honeypot + rate limiting are already active | `src/app/api/contact/route.ts`   |

## 11. Copy to review (not facts, but church voice)

Written as neutral, warm draft copy — please read and approve or rewrite:

- Hero welcome line: _"A sanctuary of light — come as you are."_
- Welcome statement (`welcomeStatement` in `src/content/pages.ts`)
- Three "What to expect" cards (`expectCards`)
- FAQ **questions** come from the PRD; answers are placeholders
- Prayer teaser and Contact page microcopy
- Privacy policy — legal wording + effective date (`siteSettings.legal.privacyEffectiveDate`); have leadership or a lawyer review

## 12. Photography

| #   | Item                                                                                                              |
| --- | ----------------------------------------------------------------------------------------------------------------- |
| 49  | Written permission from leadership **and** individuals for any photos/videos reused from Facebook (PRD risk item) |
| 50  | Hero/about photos with warm grade + duotone treatment once supplied                                               |

## 13. SEO and sharing

- `NEXT_PUBLIC_SITE_URL` must be the production URL before launch (drives
  `metadataBase`, sitemap, robots, canonical and JSON-LD URLs).
- The generated Open Graph image (1280×630) is live; replace with a
  photo-based version if preferred (`src/app/opengraph-image.tsx`).
- Local SEO: after launch, submit `sitemap.xml` to Google Search Console and
  create/verify the Google Business Profile for the address.

## 14. Operations (engineering follow-ups before heavy traffic)

- Rate limiter and receipt de-duplication are **in-memory** (fine for one
  server). Move to Upstash/Redis or KV when running multi-region.
- Sanity content layer reads sermons, events, staff profiles and ministries.
  The Studio also ships `blogPost`, `announcement` and `siteSettings` schemas;
  blog and announcements are not yet wired to pages (Phase 2). Publishing
  triggers the `/api/revalidate` webhook, so new sermons/events appear without
  a redeploy once `SANITY_REVALIDATE_SECRET` is set in both places.

---

**Phase 2 (deferred by design):** live chat alongside the stream, testimonies
with moderation, 3D gallery, daily devotional, blog/announcements, PWA push
notifications, English/Yoruba toggle. (The basic `/live` page ships in Phase 1 —
activate the player via item 17 above.)
