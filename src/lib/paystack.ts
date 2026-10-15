/**
 * Paystack server-side helpers.
 *
 * Card details never touch this server: donors are redirected to Paystack's
 * hosted checkout page. We only exchange JSON with Paystack's API using the
 * secret key, and confirm payments ourselves via verify + signed webhook.
 */

const PAYSTACK_BASE = "https://api.paystack.co";

export function isPaystackConfigured(): boolean {
  return Boolean(process.env.PAYSTACK_SECRET_KEY);
}

function headers() {
  return {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
  };
}

export interface InitializeInput {
  email: string;
  /** Amount in kobo */
  amountKobo: number;
  reference: string;
  purpose: string;
  name?: string;
  planId?: string;
}

export async function initializeTransaction(input: InitializeInput) {
  const callbackUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/give/thank-you`;
  const body: Record<string, unknown> = {
    email: input.email,
    amount: input.amountKobo,
    currency: "NGN",
    reference: input.reference,
    callback_url: callbackUrl,
    metadata: {
      purpose: input.purpose,
      name: input.name ?? "",
      source: "citadel-of-grace-website",
    },
  };

  if (input.planId) {
    body.plan = input.planId;
  }

  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = (await res.json()) as {
    status: boolean;
    message?: string;
    data?: { authorization_url: string; access_code: string; reference: string };
  };

  if (!res.ok || !data.status || !data.data) {
    throw new Error(data.message ?? "Unable to start checkout");
  }

  return data.data;
}

export async function verifyTransaction(reference: string) {
  const res = await fetch(
    `${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: headers(), cache: "no-store" },
  );

  const data = (await res.json()) as {
    status: boolean;
    message?: string;
    data?: {
      status: string;
      amount: number;
      currency: string;
      customer?: { email?: string; first_name?: string; last_name?: string };
      metadata?: Record<string, unknown>;
    };
  };

  if (!res.ok || !data.status || !data.data) {
    throw new Error(data.message ?? "Verification failed");
  }

  return data.data;
}

/** Verifies the x-paystack-signature webhook header (HMAC SHA512). */
export async function verifyWebhookSignature(
  payload: string,
  signature: string | null,
): Promise<boolean> {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret || !signature) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"],
  );
  const digest = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const expected = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Constant-time-ish comparison
  if (expected.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return diff === 0;
}
