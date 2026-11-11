#!/usr/bin/env node
/**
 * Sends one real email through src/lib/email.ts so the Resend credentials can be
 * proven without going through the contact form.
 *
 *   pnpm email:test you@example.com
 *
 * Falls back to CONTACT_INBOX_EMAIL when no address is given. Needs
 * RESEND_API_KEY + EMAIL_FROM, and EMAIL_FROM must be on a domain verified in
 * Resend — otherwise Resend rejects the send and the reason is printed here.
 */
import { emailConfig, sendEmail } from "../src/lib/email.ts";

const to = process.argv[2] ?? process.env.CONTACT_INBOX_EMAIL;
const { from, configured } = emailConfig();

if (!configured) {
  console.error(
    [
      "Cannot send a test email.",
      "  • RESEND_API_KEY and EMAIL_FROM must both be set in .env",
      "  • EMAIL_FROM must be on a domain verified in Resend (sanity check: resend.com/domains)",
    ].join("\n"),
  );
  process.exit(1);
}

if (!to) {
  console.error("Give a destination address: pnpm email:test someone@example.com");
  process.exit(1);
}

console.log(`From: ${from}\nTo:   ${to}\n`);

const result = await sendEmail({
  to,
  subject: "Resend test — Citadel of Grace website",
  text: [
    "This is a test message from the Citadel of Grace website.",
    "",
    "If you are reading it, contact-form and receipt email delivery is configured correctly.",
  ].join("\n"),
});

if (!result.delivered) {
  console.error(`Failed: ${result.error ?? "unknown error"}`);
  process.exit(1);
}

if (result.mocked) {
  console.error("Mocked — no email was sent.");
  process.exit(1);
}

console.log(`Accepted by Resend (id: ${result.id ?? "n/a"}). Check the inbox.`);
