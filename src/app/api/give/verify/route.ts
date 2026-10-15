import { NextResponse, type NextRequest } from "next/server";
import { isPaystackConfigured, verifyTransaction } from "@/lib/paystack";
import { sendReceiptOnce } from "@/lib/receipts";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { giveVerifyQuerySchema, parseOrIssues } from "@/lib/validation";

/** Server-side verification of a completed transaction. */
export async function GET(request: NextRequest) {
  const limit = rateLimit(clientKey(request, "give-verify"), {
    limit: 30,
    windowMs: 60_000,
  });
  if (!limit.ok) {
    return NextResponse.json(
      { status: "error", error: "Too many verification attempts." },
      { status: 429 },
    );
  }

  const parsedReference = parseOrIssues(giveVerifyQuerySchema, {
    reference: request.nextUrl.searchParams.get("reference") ?? "",
  });
  if (!parsedReference.ok) {
    return NextResponse.json(
      { status: "error", error: "Missing or invalid reference." },
      { status: 400 },
    );
  }
  const reference = parsedReference.data.reference;

  if (!isPaystackConfigured()) {
    return NextResponse.json({
      status: "error",
      error: "Payment verification is not configured yet.",
    });
  }

  try {
    const data = await verifyTransaction(reference);
    const status =
      data.status === "success"
        ? "success"
        : data.status === "failed"
          ? "failed"
          : data.status === "abandoned"
            ? "abandoned"
            : "pending";

    if (status === "success") {
      const metadata = (data.metadata ?? {}) as {
        purpose?: string;
        name?: string;
      };
      const email = data.customer?.email ?? "";
      // Fire-and-forget receipt; never block the UI on email delivery.
      void sendReceiptOnce({
        reference,
        email,
        amountKobo: data.amount,
        purpose: typeof metadata.purpose === "string" ? metadata.purpose : "other",
        name: typeof metadata.name === "string" ? metadata.name : undefined,
      }).catch((err) => console.error("[give:receipt]", err));
    }

    return NextResponse.json({
      status,
      amountKobo: data.amount,
      purpose: (data.metadata as { purpose?: string } | undefined)?.purpose,
      email: data.customer?.email,
    });
  } catch (err) {
    console.error("[give:verify]", err);
    return NextResponse.json(
      { status: "error", error: "Verification failed." },
      { status: 502 },
    );
  }
}
