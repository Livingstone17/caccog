import { NextResponse, type NextRequest } from "next/server";
import { sendEmail } from "@/lib/email";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { contactSchema, parseOrIssues } from "@/lib/validation";

const HIDDEN_INPUTS = new Set(["company", "website", "fax"]);

/**
 * Contact + prayer request delivery (Resend) with honeypot + rate limiting.
 * Success is returned even in local dev (email mocked to console) so the
 * form experience can be tested without credentials.
 */
export async function POST(request: NextRequest) {
  const limit = rateLimit(clientKey(request, "contact"), {
    limit: 5,
    windowMs: 60_000,
  });
  if (!limit.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: "Too many messages from your network. Please wait a minute.",
      },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  // Honeypot — always report success to bots, before any real validation.
  if (body && typeof body === "object") {
    const raw = body as Record<string, unknown>;
    for (const key of HIDDEN_INPUTS) {
      if (typeof raw[key] === "string" && raw[key].trim() !== "") {
        return NextResponse.json({ ok: true });
      }
    }
  }

  const parsed = parseOrIssues(contactSchema, body);
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  }

  const { name, email, phone, subject, message, topic } = parsed.data;

  const inbox = process.env.CONTACT_INBOX_EMAIL;
  const mailSubject =
    topic === "prayer"
      ? `Prayer request from ${name}`
      : `Website enquiry from ${name}${subject ? `: ${subject}` : ""}`;

  const text = [
    topic === "prayer" ? "PRAYER REQUEST" : "CONTACT FORM",
    "",
    `From: ${name} <${email}>`,
    phone ? `Phone: ${phone}` : null,
    subject ? `Subject: ${subject}` : null,
    "",
    message,
  ]
    .filter(Boolean)
    .join("\n");

  const recipients = inbox && inbox.includes("@") ? inbox : email;

  const result = await sendEmail({
    to: recipients,
    subject: mailSubject,
    text,
    replyTo: email,
  });

  if (!result.delivered) {
    return NextResponse.json(
      { ok: false, error: "We could not send your message. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, mocked: result.mocked });
}
