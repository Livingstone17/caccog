import { z } from "zod";

/**
 * Server-side input validation for every API route (§7 of the spec).
 *
 * Anything the browser sends is untrusted: schemas are strict about types and
 * lengths, unknown keys are stripped (`.strip()` is Zod 4's default), and the
 * parsed result — not the raw body — is what routes use.
 *
 * Honeypot fields are declared here too so they can't be smuggled past the
 * early-exit checks in the route handlers.
 */

/** RFC-5322-lite: good enough to reject typos without rejecting real inboxes. */
const email = z
  .string()
  .trim()
  .min(3)
  .max(254)
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address.");

/** Free text with a hard ceiling — stops megabyte payloads. */
const boundedText = (max: number, min = 1) => z.string().trim().min(min).max(max);

/** Honeypot: bots fill this, humans never see it. */
const honeypot = z.string().max(200).optional();

const contactTopic = z.enum(["contact", "prayer"]).catch("contact");

export const contactSchema = z.object({
  name: boundedText(200),
  email,
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  subject: z.string().trim().max(300).optional().or(z.literal("")),
  message: boundedText(5000, 5),
  topic: contactTopic,
  // honeypots
  company: honeypot,
  website: honeypot,
  fax: honeypot,
});

export const newsletterSchema = z.object({
  email,
  company: honeypot,
});

export const GIVE_PURPOSES = [
  "tithe",
  "offering",
  "building",
  "missions",
  "other",
] as const;

export const giveInitiateSchema = z.object({
  email,
  name: z.string().trim().max(200).optional().or(z.literal("")),
  amountKobo: z.coerce
    .number()
    .int()
    .min(100_000, "Amount must be at least ₦1,000.")
    .max(1_000_000_000, "Amount must be at most ₦10,000,000."),
  purpose: z.enum(GIVE_PURPOSES).catch("other"),
  frequency: z.enum(["once", "monthly"]).catch("once"),
  plan: z.string().trim().max(120).optional().or(z.literal("")),
  company: honeypot,
});

/** Paystack references: `cog-<base36>-<base36>`, but accept their format too. */
export const paystackReference = z
  .string()
  .trim()
  .min(6)
  .max(80)
  .regex(/^[A-Za-z0-9._-]+$/, "Invalid reference.");

export const giveVerifyQuerySchema = z.object({
  reference: paystackReference,
});

/**
 * Webhook envelope. Only the fields we act on are modelled — the rest of the
 * Paystack payload is ignored rather than trusted.
 */
export const paystackWebhookSchema = z.object({
  event: z.string().max(100),
  data: z
    .object({
      reference: paystackReference.optional(),
    })
    .partial()
    .optional(),
});

/** Parse and return a typed value, or the first issue message. */
export function parseOrIssues<T>(schema: z.ZodType<T>, input: unknown) {
  const result = schema.safeParse(input);
  if (result.success) return { ok: true as const, data: result.data };
  const first = result.error.issues[0];
  return {
    ok: false as const,
    error: first ? `${first.message}` : "Invalid request.",
  };
}
