import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { Suspense } from "react";
import { ThankYou } from "@/components/give/thank-you";

export const metadata: Metadata = pageMetadata("/give/thank-you", {
  title: "Giving confirmation",
  robots: { index: false, follow: false },
});

function ReferenceFallback() {
  return (
    <div className="surface mx-auto max-w-xl p-10 text-center">
      <p className="eyebrow">Confirming your gift</p>
      <p className="text-muted mt-4 text-sm">Loading…</p>
    </div>
  );
}

export default async function ThankYouPage(props: PageProps<"/give/thank-you">) {
  const search = await props.searchParams;
  const reference = typeof search.reference === "string" ? search.reference : null;

  return (
    <section className="container-page py-36 md:py-44">
      <Suspense fallback={<ReferenceFallback />}>
        <ThankYou reference={reference} />
      </Suspense>
    </section>
  );
}
