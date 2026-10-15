import { NextResponse, type NextRequest } from "next/server";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { newsletterSchema, parseOrIssues } from "@/lib/validation";

/**
 * Newsletter signup (Brevo). Without BREVO_API_KEY the request succeeds in
 * "mock" mode so the UI can be demonstrated before credentials exist.
 */
export async function POST(request: NextRequest) {
  const limit = rateLimit(clientKey(request, "newsletter"), {
    limit: 4,
    windowMs: 60_000,
  });
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many attempts. Please wait a moment." },
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

  // Honeypot — report success to bots without subscribing them.
  if (body && typeof body === "object" && "company" in body) {
    const company = (body as { company?: unknown }).company;
    if (typeof company === "string" && company.trim() !== "") {
      return NextResponse.json({ ok: true });
    }
  }

  const parsed = parseOrIssues(newsletterSchema, body);
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  }

  const email = parsed.data.email;

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.info("[newsletter:mock]", email);
    return NextResponse.json({ ok: true, mocked: true });
  }

  try {
    const res = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        email,
        listIds: process.env.BREVO_LIST_ID ? [Number(process.env.BREVO_LIST_ID)] : [],
        updateEnabled: true,
      }),
    });

    if (!res.ok && res.status !== 409) {
      const detail = await res.text();
      console.error("[newsletter:error]", res.status, detail);
      return NextResponse.json(
        { ok: false, error: "We could not subscribe you. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[newsletter:exception]", err);
    return NextResponse.json(
      { ok: false, error: "We could not subscribe you. Please try again." },
      { status: 502 },
    );
  }
}
