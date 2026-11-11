import type { Faq } from "@/content/types";
import { cn, isPlaceholder } from "@/lib/utils";

/**
 * Native `<details>` accordion for FAQ lists. Shared by /plan-your-visit and
 * /give so both pages keep one visual and keyboard behaviour.
 */
export function FaqAccordion({
  items,
  className,
}: {
  items: Faq[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "divide-y divide-white/10 border-y border-white/10",
        className,
      )}
    >
      {items.map((faq, i) => (
        <details key={i} className="group py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left text-base text-white md:text-lg [&::-webkit-details-marker]:hidden">
            <span className="font-display font-normal">{faq.question}</span>
            <span
              className="text-orange relative size-6 shrink-0 transition-transform duration-500 group-open:rotate-45"
              aria-hidden
            >
              <span className="absolute top-1/2 left-1/2 h-px w-3.5 -translate-x-1/2 -translate-y-1/2 bg-current" />
              <span className="absolute top-1/2 left-1/2 h-3.5 w-px -translate-x-1/2 -translate-y-1/2 bg-current" />
            </span>
          </summary>
          <p className="text-muted mt-4 max-w-2xl text-sm leading-relaxed md:text-base">
            {isPlaceholder(faq.answer) ? (
              <span className="placeholder-chip">{faq.answer}</span>
            ) : (
              faq.answer
            )}
          </p>
        </details>
      ))}
    </div>
  );
}
