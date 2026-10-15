import { sendEmail } from "./email";

/**
 * Receipt delivery, sent at most once per reference.
 *
 * In-memory guard: on a single Node process this prevents double emails when
 * both the verify route and the webhook fire. For multi-instance deployments,
 * back this with a shared store (see CONTENT_TODO.md → Operations).
 */
const processed = new Set<string>();

export async function sendReceiptOnce(input: {
  reference: string;
  email: string;
  amountKobo: number;
  purpose: string;
  name?: string;
}): Promise<{ sent: boolean; mocked: boolean }> {
  const key = input.reference.toLowerCase();
  if (processed.has(key)) return { sent: false, mocked: false };
  processed.add(key);

  const naira = (input.amountKobo / 100).toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
  });

  const purpose =
    input.purpose && input.purpose !== "other" ? ` for ${input.purpose}` : "";

  const text = [
    `Thank you${input.name ? `, ${input.name}` : ""} for your giving.`,
    "",
    `Amount: ${naira}${purpose}`,
    `Reference: ${input.reference}`,
    "",
    "With gratitude,",
    "Citadel of Grace",
  ].join("\n");

  const inbox = process.env.CONTACT_INBOX_EMAIL;
  const to = [input.email];
  if (inbox && inbox !== input.email) to.push(inbox);

  const result = await sendEmail({
    to,
    subject: `Your giving receipt — ${naira}`,
    text,
    replyTo: process.env.RECEIPT_REPLY_TO || undefined,
  });

  return { sent: result.delivered, mocked: result.mocked };
}
