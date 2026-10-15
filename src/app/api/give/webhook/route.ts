import { NextResponse, type NextRequest } from "next/server";
import { verifyTransaction, verifyWebhookSignature } from "@/lib/paystack";
import { sendReceiptOnce } from "@/lib/receipts";
import { parseOrIssues, paystackWebhookSchema } from "@/lib/validation";

/**
 * Paystack webhook. Configure in the Paystack dashboard:
 *   Events → charge.success → https://your-domain/api/give/webhook
 *
 * The signature is verified with HMAC-SHA512 over the RAW body before we
 * trust any payload, the JSON shape is validated, and the transaction is
 * re-verified with Paystack.
 */
export async function POST(request: NextRequest) {
  const raw = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  const valid = await verifyWebhookSignature(raw, signature);
  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Malformed payload" }, { status: 400 });
  }

  const parsed = parseOrIssues(paystackWebhookSchema, parsedJson);
  if (!parsed.ok) {
    return NextResponse.json({ error: "Unexpected payload" }, { status: 400 });
  }

  const reference = parsed.data.data?.reference;
  if (parsed.data.event === "charge.success" && reference) {
    try {
      const verified = await verifyTransaction(reference);
      if (verified.status === "success") {
        const metadata = (verified.metadata ?? {}) as {
          purpose?: string;
          name?: string;
        };
        await sendReceiptOnce({
          reference,
          email: verified.customer?.email ?? "",
          amountKobo: verified.amount,
          purpose: metadata.purpose ?? "other",
          name: metadata.name,
        });
      }
    } catch (err) {
      console.error("[give:webhook]", err);
      return NextResponse.json({ error: "Processing error" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
