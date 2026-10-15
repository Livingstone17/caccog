import Link from "next/link";
import type { ChurchEvent, Sermon } from "@/content/types";
import { formatEventRange, formatShortDate } from "@/lib/format";
import { cn, isPlaceholder } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";

export function SermonCard({ sermon }: { sermon: Sermon }) {
  return (
    <Reveal as="li" className="h-full">
      <Link
        href={`/sermons/${sermon.slug}`}
        className="group bg-charcoal/40 hover:border-orange/45 hover:bg-charcoal/70 flex h-full flex-col justify-between border border-white/10 p-6 transition-[border-color,background-color] duration-700 md:p-8"
      >
        <div>
          <p className="text-orange/90 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs tracking-[0.2em] uppercase">
            <time dateTime={sermon.date}>{formatShortDate(sermon.date)}</time>
            <span aria-hidden className="text-white/30">
              /
            </span>
            <span className="text-muted">{sermon.series}</span>
          </p>
          <h3 className="font-display group-hover:text-ember mt-4 text-2xl leading-snug font-normal text-white transition-colors duration-500 md:text-[1.75rem]">
            {isPlaceholder(sermon.title) ? (
              <span className="placeholder-chip">{sermon.title}</span>
            ) : (
              sermon.title
            )}
          </h3>
          {sermon.scripture && (
            <p className="text-muted mt-3 text-sm italic">{sermon.scripture}</p>
          )}
        </div>
        <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
          <span className="text-sm text-white/70">{sermon.speaker}</span>
          <span className="text-orange flex items-center gap-2 text-[0.68rem] tracking-[0.24em] uppercase">
            Listen
            <span
              className="transition-transform duration-500 group-hover:translate-x-1.5"
              aria-hidden
            >
              →
            </span>
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

export function EventCard({ event, index = 0 }: { event: ChurchEvent; index?: number }) {
  const start = new Date(event.startsAt);
  const day = start.getDate();
  const month = new Intl.DateTimeFormat("en-GB", { month: "short" }).format(start);

  return (
    <Reveal as="li" delay={index * 0.08} className="h-full">
      <Link
        href={`/events/${event.slug}`}
        className="group bg-charcoal/40 hover:border-orange/45 hover:bg-charcoal/70 flex h-full gap-5 border border-white/10 p-6 transition-[border-color,background-color] duration-700 md:gap-6 md:p-7"
      >
        <div className="border-orange/30 flex w-16 shrink-0 flex-col items-center border-r pr-4 text-center md:w-20">
          <span className="font-display text-ember text-4xl leading-none font-light md:text-5xl">
            {day}
          </span>
          <span className="text-orange mt-1 text-[0.62rem] tracking-[0.3em] uppercase">
            {month}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display group-hover:text-ember text-xl leading-snug font-normal text-white transition-colors duration-500 md:text-2xl">
            {isPlaceholder(event.title) ? (
              <span className="placeholder-chip">{event.title}</span>
            ) : (
              event.title
            )}
          </h3>
          <p className="text-muted mt-2 text-sm">
            {formatEventRange(event.startsAt, event.endsAt)}
          </p>
          <p className="mt-1 truncate text-sm text-white/60">
            {isPlaceholder(event.venue) ? (
              <span className="placeholder-chip">{event.venue}</span>
            ) : (
              event.venue
            )}
          </p>
        </div>
        <span
          className="text-orange self-center opacity-0 transition-all duration-500 group-hover:translate-x-1 group-hover:opacity-100"
          aria-hidden
        >
          →
        </span>
      </Link>
    </Reveal>
  );
}

// export function SectionHeading({
//   eyebrow,
//   title,
//   href,
//   linkLabel,
//   align = "center",
//   style
// }: {
//   eyebrow: string;
//   title: string;
//   href?: string;
//   linkLabel?: string;
//   align?: "center" | "left";
//   style?: {}
// }) {
//   return (
//     <div
//       className={cn(
//         "mb-12 flex flex-col gap-5 md:mb-16",
//         align === "center" ? "items-center text-center" : "items-start text-left",
//       )}
//     >
//       <Reveal>
//         <p className="eyebrow">{eyebrow}</p>
//       </Reveal>
//       <Reveal delay={0.08}>
//         <h2 className="font-display max-w-2xl text-4xl leading-tight font-light text-white md:text-5xl">
//           {title}
//         </h2>
//       </Reveal>
//       {href && linkLabel && (
//         <Reveal delay={0.16}>
//           <Link
//             href={href}
//             className="group text-orange hover:text-ember inline-flex items-center gap-3 text-[0.7rem] tracking-[0.3em] uppercase transition-colors duration-500"
//           >
//             {linkLabel}
//             <span
//               className="bg-orange/60 h-px w-8 transition-all duration-500 group-hover:w-12"
//               aria-hidden
//             />
//           </Link>
//         </Reveal>
//       )}
//     </div>
//   );
// }
export function SectionHeading({
  eyebrow,
  title,
  href,
  linkLabel,
  align = "center",
  variant = "dark-bg", // Defaults to your current layout (white text on a dark bg)
  style,
}: {
  eyebrow: string;
  title: string;
  href?: string;
  linkLabel?: string;
  align?: "center" | "left";
  variant?: "dark-bg" | "light-bg"; // Adds theme capability
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={style}
      className={cn(
        "mb-12 flex flex-col gap-5 md:mb-16",
        align === "center" ? "items-center text-center" : "items-start text-left",
      )}
    >
      <Reveal>
        {/* Swaps eyebrow text colors based on context */}
        <p
          className={cn(
            "eyebrow",
            variant === "dark-bg" ? "text-slate-400" : "text-slate-500",
          )}
        >
          {eyebrow}
        </p>
      </Reveal>

      <Reveal delay={0.08}>
        {/* Dynamic Text Color Mapping */}
        <h2
          className={cn(
            "font-display max-w-2xl text-4xl leading-tight font-light md:text-5xl",
            variant === "dark-bg" ? "text-white" : "text-slate-900",
          )}
        >
          {title}
        </h2>
      </Reveal>

      {href && linkLabel && (
        <Reveal delay={0.16}>
          <Link
            href={href}
            className="group text-orange hover:text-ember inline-flex items-center gap-3 text-[0.7rem] tracking-[0.3em] uppercase transition-colors duration-500"
          >
            {linkLabel}
            <span
              className="bg-orange/60 h-px w-8 transition-all duration-500 group-hover:w-12"
              aria-hidden
            />
          </Link>
        </Reveal>
      )}
    </div>
  );
}
