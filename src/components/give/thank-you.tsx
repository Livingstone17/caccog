"use client";

import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/button";

interface VerifyResponse {
  status: "success" | "failed" | "pending" | "abandoned" | "error";
  amountKobo?: number;
  purpose?: string;
  email?: string;
  error?: string;
}

const PURPOSE_LABELS: Record<string, string> = {
  tithe: "Tithe",
  offering: "Offering",
  building: "Building fund",
  missions: "Missions",
  other: "Other",
};

export function ThankYou({ reference }: { reference: string | null }) {
  const [state, setState] = useState<"loading" | "done">(reference ? "loading" : "done");
  const [result, setResult] = useState<VerifyResponse | null>(
    reference
      ? null
      : { status: "error", error: "No transaction reference was provided." },
  );

  useEffect(() => {
    if (!reference) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/give/verify?reference=${encodeURIComponent(reference)}`,
        );
        const data = (await res.json()) as VerifyResponse;
        if (!cancelled) {
          setResult(data);
          setState("done");
        }
      } catch {
        if (!cancelled) {
          setResult({
            status: "error",
            error: "We could not confirm the transaction just now.",
          });
          setState("done");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reference]);

  if (state === "loading") {
    return (
      <div className="surface mx-auto max-w-xl p-10 text-center">
        <p className="eyebrow">Confirming your gift</p>
        <p className="text-muted mt-4 text-sm">
          Please hold on while we verify this transaction with Paystack…
        </p>
        <span
          className="mx-auto mt-6 block h-px w-32 overflow-hidden bg-white/10"
          aria-hidden
        >
          <span className="bg-orange block h-px w-1/3 animate-[drift_1.4s_ease-in-out_infinite]" />
        </span>
      </div>
    );
  }

  const success = result?.status === "success";

  return (
    <div className="surface mx-auto max-w-xl p-8 text-center md:p-12">
      <span
        className={`mx-auto flex size-14 items-center justify-center rounded-full border ${
          success
            ? "border-orange bg-orange/15 text-ember"
            : "border-white/25 text-white/70"
        }`}
        aria-hidden
      >
        {success ? "✓" : "!"}
      </span>

      <h1 className="font-display mt-6 text-4xl font-light text-white">
        {success ? "Thank you for giving" : "Almost there"}
      </h1>

      {success && (
        <>
          <p className="text-muted mt-4 text-base leading-relaxed">
            Your gift of{" "}
            <span className="text-ember">
              ₦{((result?.amountKobo ?? 0) / 100).toLocaleString("en-NG")}
            </span>
            {result?.purpose && PURPOSE_LABELS[result.purpose]
              ? ` (${PURPOSE_LABELS[result.purpose]})`
              : ""}{" "}
            has been confirmed. A receipt is on its way to{" "}
            <span className="text-white">{result?.email}</span>.
          </p>
          <p className="mt-3 text-sm text-white/60">
            Reference: <span className="text-white/80">{reference}</span>
          </p>
        </>
      )}

      {!success && (
        <p className="text-muted mt-4 text-base leading-relaxed">
          {result?.status === "pending"
            ? "Your payment is still being confirmed by Paystack. You will receive an email as soon as it completes."
            : result?.status === "failed" || result?.status === "abandoned"
              ? "The payment was not completed. No money has left your account — you can try again whenever you are ready."
              : (result?.error ??
                "We could not confirm this transaction. If you were charged, please contact the church office.")}
        </p>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/give" variant={success ? "ghost" : "primary"}>
          {success ? "Give again" : "Try again"}
        </ButtonLink>
        <ButtonLink href="/" variant={success ? "primary" : "ghost"}>
          Return home
        </ButtonLink>
      </div>
    </div>
  );
}
