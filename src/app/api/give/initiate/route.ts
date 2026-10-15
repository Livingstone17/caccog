import { NextResponse, type NextRequest } from "next/server";
import { isPaystackConfigured, initializeTransaction } from "@/lib/paystack";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { giveInitiateSchema, parseOrIssues } from "@/lib/validation";
import { isPlaceholder } from "@/lib/utils";

/**
 * Starts a Paystack checkout. The donor is redirected to Paystack's hosted
 * page — no card data ever reaches this server.
 */
export async function POST(request: NextRequest) {
  const limit = rateLimit(clientKey(request, "give-initiate"), {
    limit: 8,
    windowMs: 60_000,
  });
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot: bots fill this; pretend success without doing anything.
  if (body && typeof body === "object" && "company" in body) {
    const company = (body as { company?: unknown }).company;
    if (typeof company === "string" && company.trim() !== "") {
      return NextResponse.json({ authorization_url: undefined, ok: true });
    }
  }

  const parsed = parseOrIssues(giveInitiateSchema, body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { email, name, amountKobo, purpose, frequency, plan } = parsed.data;

  if (!isPaystackConfigured()) {
    return NextResponse.json(
      {
        error:
          "Online giving is being set up. Please use the bank transfer details on this page, or contact the church office.",
      },
      { status: 503 },
    );
  }

  const reference = `cog-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

  try {
    const init = await initializeTransaction({
      email,
      amountKobo,
      reference,
      purpose,
      name: name || undefined,
      planId: frequency === "monthly" && plan && !isPlaceholder(plan) ? plan : undefined,
    });

    return NextResponse.json({ authorization_url: init.authorization_url });
  } catch (err) {
    console.error("[give:initiate]", err);
    return NextResponse.json(
      { error: "We could not start checkout right now. Please try again." },
      { status: 502 },
    );
  }
}
