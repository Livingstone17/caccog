# Citadel of Grace — website

A modern, immersive website for **Citadel of Grace**, a Christ Apostolic Church
(CAC) congregation. Built to the PRD: a "sanctuary of light" experience with a
signature 3D hero, while staying fast, accessible and SEO-friendly — a
first-time visitor should find service times, the address and the livestream
in under 10 seconds on a phone.

> **Status:** Phase 1 (MVP) complete as a build. All church-specific facts are
> placeholders — see **[CONTENT_TODO.md](./CONTENT_TODO.md)** before launch.

---

## Quick start

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Useful scripts:

| Command                        | What it does                                                                |
| ------------------------------ | --------------------------------------------------------------------------- |
| `pnpm dev`                     | Dev server (Turbopack)                                                      |
| `pnpm build`                   | Production build (all pages prerendered)                                    |
| `pnpm start`                   | Serve the production build                                                  |
| `pnpm lint`                    | ESLint (flat config, react-hooks v6 rules)                                  |
| `pnpm typecheck`               | Strict TypeScript, no emit                                                  |
| `pnpm format` / `format:check` | Prettier (Tailwind class sorting)                                           |
| `pnpm studio`                  | Sanity Studio at `http://localhost:3333` (needs `SANITY_STUDIO_PROJECT_ID`) |

Copy `.env.example` → `.env` and fill in keys as they arrive (Paystack,
Resend, Sanity, Brevo). The site runs fully without them — payments, email and
CMS fall back to honest "pending" states.

---

## Stack

- **Next.js 16 (App Router) + TypeScript (strict)**, Turbopack, deployed to Vercel
- **Tailwind CSS v4** with design tokens in `@theme` (`src/app/globals.css`)
- **Three.js via React Three Fiber + drei** for the hero; `@react-three/postprocessing`
  bloom only on capable devices
- **GSAP + ScrollTrigger** (scroll choreography), **Lenis** (smooth scroll),
  **Framer Motion** (reveals, nav, page transitions)
- **Sanity** headless CMS (`sanity.config.ts` + `sanity/` schemas) with a
  local-content fallback so the site never depends on CMS uptime
- **Paystack** giving (hosted checkout + server verification + signed webhook)
- **Resend** for form/receipt email, **Brevo** optional for the newsletter

### Design system — "Quiet Majesty"

Tokens in `src/app/globals.css`: black `#0A0A0A`, charcoal `#161616`, white
`#FFFFFF`, muted `#A3A3A3`, orange `#FF7A1A`, ember `#FFB36B`. Cormorant
Garamond (display) + Inter (text) via `next/font`. Orange is accent-only:
hairlines, eyebrows, buttons. Motion is slow and eased (600–1200 ms),
reduced-motion is respected everywhere.

Reusable primitives: `ButtonLink`/`Button`, `Section`, `Reveal`,
`SplitHeadline`, `PageHeader`, `Divider`, `CopyButton` in `src/components/ui/`.

---

## The Rising Citadel (3D hero)

```
src/components/hero/
  hero.tsx           server: 200svh section + sticky viewport
  hero-poster.tsx    paints instantly — the fallback IS this poster
  hero-copy.tsx      overlay text, GSAP scroll-scrubbed cross-fade
  hero-canvas.tsx    capability gate + idle lazy-load of the canvas
src/components/three/
  citadel-canvas.tsx Canvas, PerformanceMonitor, pause off-screen
  scene.tsx          citadel geometry, fake god-rays, particles, clouds, camera rig
  bloom.tsx          bloom pass, mounted only when allowed
```

How it degrades (in order):

1. **Poster first** — gradient + drawn SVG citadel paints on first render; text
   is readable before any JS.
2. **Capability gate** (`src/lib/capability.ts`): static hero if WebGL is
   missing, `prefers-reduced-motion`, Save-Data, ≤2 GB memory or ≤3 cores.
3. **Idle lazy-load** — canvas imports after first paint via
   `next/dynamic` (`ssr:false` inside a client component, per Next 16 rules).
4. **Adaptive quality** — dpr capped at 1.5, drei `PerformanceMonitor` drops to
   1.0 and disables bloom on decline; render pauses when the tab is hidden or
   the canvas scrolls off-screen; bloom only ≥1024 px / ≥4 GB / ≥4 cores.
5. **Scroll choreography** — camera ascends through clouds into the glow while
   the hero copy cross-fades into Welcome; desktop gets gentle pointer
   parallax, mobile an auto-drift (no gyroscope permission).

Asset budget: geometry-only scene (no textures/models to download), one
font pair, target ≤250 KB initial JS excluding the lazy 3D chunk.

---

## Content & CMS

- **Local content (default):** `src/content/` — typed TS modules with
  clearly-marked placeholders. Everything bracketed renders as a styled
  "pending" chip; links disable themselves rather than faking facts.
- **Sanity (optional):** `SANITY_STUDIO_PROJECT_ID` + `SANITY_PROJECT_ID`
  activate GROQ queries in `src/lib/sanity.ts` for **sermons, events, leaders
  and ministries**, with automatic fallback to local content on error.
  Schemas for `announcement` and `siteSettings` ship ready for Phase 2.
- Staff editing: `pnpm studio` → Sermons, Events, Leadership, Ministries,
  Announcements, Site settings. Portable Text renders through the same
  excerpt mapper, so no code changes are needed to publish.

---

## Giving (Paystack)

Flow: `GiveForm` → `POST /api/give/initiate` (validates, rate-limits, creates
reference) → donor redirected to **Paystack-hosted checkout** (card data never
touches this server) → back to `/give/thank-you?reference=…` →
`GET /api/give/verify` re-verifies server-side and sends the receipt once →
`POST /api/give/webhook` (HMAC-SHA512 signature check) double-confirms and is
idempotent.

Bank-transfer block with copy buttons sits beside the form as the zero-dependency
fallback. Recurring giving appears when `NEXT_PUBLIC_PAYSTACK_PLAN_ID` is set.

## Forms

Contact/prayer/newsletter: honeypot field + in-memory rate limiting → Resend
(or mocked to console without keys). Success states are explicit; errors are
human.

## SEO & accessibility

- Server-rendered pages, `sitemap.xml`, `robots.txt`, `manifest.webmanifest`,
  canonical URLs, generated `opengraph-image` (1280×630, self-hosted fonts).
- JSON-LD: `Church` (home), `Event` (event pages), `Article` (+VideoObject)
  for sermons.
- WCAG 2.2 AA targets: skip link, visible focus rings, keyboard-friendly nav
  (Escape closes the overlay menu), `aria-live` on filtered results, contrast
  overlays on every media surface, captions-ready video embeds,
  `prefers-reduced-motion` honoured by Lenis/GSAP/Framer/CSS/3D alike.

---

## Project structure

```
src/
  app/                 routes, metadata files, API route handlers
  components/
    hero/ three/       the 3D experience
    home/ site/        page sections + chrome (nav, footer, cursor, scroll)
    ui/ shared/        design-system primitives and content components
  content/             placeholder content + content-access layer (CMS fallback)
  lib/                 paystack, email, sanity, jsonld, ics, rate-limit, …
sanity/                Studio schemas
CONTENT_TODO.md         every placeholder + open [CONFIRM] item
```

## Deploy (Vercel)

1. Import the repo, framework preset **Next.js** (defaults are fine).
2. Set env vars: `NEXT_PUBLIC_SITE_URL`, Paystack pair (+ optional plan),
   `RESEND_API_KEY`, `EMAIL_FROM`, `CONTACT_INBOX_EMAIL`, `RECEIPT_REPLY_TO`,
   optional `BREVO_*`, optional `SANITY_*`.
3. Point the domain, then add the production webhook URL in the Paystack
   dashboard and submit the sitemap to Search Console.

## Roadmap (Phase 2, per PRD)

Live chat alongside the stream, moderated testimonies, 3D gallery, daily
devotional, blog/announcements (announcement schema already exists), installable
PWA with push reminders, English/Yoruba toggle. The basic live page (`/live`)
already ships with a click-to-load YouTube embed, schedule and giving/prayer
links — see CONTENT_TODO item 17 to activate the player.
