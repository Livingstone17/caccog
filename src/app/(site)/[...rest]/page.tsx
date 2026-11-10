import { notFound } from "next/navigation";

/**
 * Any URL that matches no other route lands here and renders the styled 404
 * from `(site)/not-found.tsx` inside the normal site chrome. Without it, an
 * unmatched path would fall back to Next's bare default 404, because the
 * custom page lives in a route group.
 */
export default function CatchAllPage(): never {
  notFound();
}
