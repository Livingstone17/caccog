import Link from "next/link";

/**
 * Short privacy notice shown next to forms (contact, newsletter) and on the
 * give page (§7). Keeps the data-use promise visible at the point of capture
 * instead of only in the Privacy Policy.
 */
export function PrivacyNotice({
  variant = "form",
  className,
}: {
  /** "form" for contact/newsletter, "give" for the donation flow. */
  variant?: "form" | "give";
  className?: string;
}) {
  const text =
    variant === "give"
      ? "Payments are processed by Paystack. We never see or store your card details — only the amount, purpose and email needed to issue your receipt."
      : "We only use what you share to reply to you. We never sell your data. Read our Privacy Policy.";

  return (
    <p className={`max-w-prose text-xs leading-relaxed text-white/55 ${className ?? ""}`}>
      {text}{" "}
      <Link
        href="/privacy"
        className="text-orange/80 decoration-orange/40 hover:text-orange focus-visible:outline-orange underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        Privacy Policy
      </Link>
      .
    </p>
  );
}
