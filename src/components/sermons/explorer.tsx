// "use client";

// import { useMemo, useState } from "react";
// import type { Sermon } from "@/content/types";
// import { SermonCard } from "@/components/shared/cards";
// import { Reveal } from "@/components/ui/reveal";
// import { cn } from "@/lib/utils";

// interface ExplorerProps {
//   sermons: Sermon[];
//   series: string[];
//   speakers: string[];
// }

// type SortKey = "newest" | "oldest";

// function Select({
//   label,
//   value,
//   onChange,
//   options,
// }: {
//   label: string;
//   value: string;
//   onChange: (v: string) => void;
//   options: string[];
// }) {
//   return (
//     <label className="text-orange/90 flex flex-col gap-2 text-[0.62rem] tracking-[0.26em] uppercase">
//       {label}
//       <select
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="bg-charcoal/60 hover:border-orange/50 focus:border-orange min-h-12 rounded-none border border-white/15 px-4 py-3 text-sm font-normal tracking-normal text-white normal-case transition-colors duration-300 outline-none"
//       >
//         <option value="">All</option>
//         {options.map((opt) => (
//           <option key={opt} value={opt}>
//             {opt}
//           </option>
//         ))}
//       </select>
//     </label>
//   );
// }

// export function SermonExplorer({ sermons, series, speakers }: ExplorerProps) {
//   const [query, setQuery] = useState("");
//   const [activeSeries, setActiveSeries] = useState("");
//   const [activeSpeaker, setActiveSpeaker] = useState("");
//   const [sort, setSort] = useState<SortKey>("newest");

//   const filtered = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     const list = sermons.filter((s) => {
//       const matchesQuery =
//         !q ||
//         s.title.toLowerCase().includes(q) ||
//         s.scripture?.toLowerCase().includes(q) ||
//         s.excerpt.toLowerCase().includes(q);
//       const matchesSeries = !activeSeries || s.series === activeSeries;
//       const matchesSpeaker = !activeSpeaker || s.speaker === activeSpeaker;
//       return matchesQuery && matchesSeries && matchesSpeaker;
//     });
//     list.sort((a, b) =>
//       sort === "newest" ? (a.date < b.date ? 1 : -1) : a.date < b.date ? -1 : 1,
//     );
//     return list;
//   }, [sermons, query, activeSeries, activeSpeaker, sort]);

//   const hasFilters = Boolean(query || activeSeries || activeSpeaker);

//   return (
//     <div>
//       {/* Filter bar */}
//       <div className="surface rounded-none p-5 md:p-6">
//         <div className="grid gap-4 md:grid-cols-4">
//           <label className="text-orange/90 flex flex-col gap-2 text-[0.62rem] tracking-[0.26em] uppercase">
//             Search
//             <input
//               type="search"
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               placeholder="Title, scripture, keyword…"
//               className="bg-charcoal/60 hover:border-orange/50 focus:border-orange min-h-12 rounded-none border border-white/15 px-4 py-3 text-sm text-white transition-colors duration-300 outline-none placeholder:text-white/35"
//             />
//           </label>
//           <Select
//             label="Series"
//             value={activeSeries}
//             onChange={setActiveSeries}
//             options={series}
//           />
//           <Select
//             label="Speaker"
//             value={activeSpeaker}
//             onChange={setActiveSpeaker}
//             options={speakers}
//           />
//           <label className="text-orange/90 flex flex-col gap-2 text-[0.62rem] tracking-[0.26em] uppercase">
//             Order
//             <select
//               value={sort}
//               onChange={(e) => setSort(e.target.value as SortKey)}
//               className="bg-charcoal/60 hover:border-orange/50 focus:border-orange min-h-12 rounded-none border border-white/15 px-4 py-3 text-sm font-normal tracking-normal text-white normal-case transition-colors duration-300 outline-none"
//             >
//               <option value="newest">Newest first</option>
//               <option value="oldest">Oldest first</option>
//             </select>
//           </label>
//         </div>
//         <div className="mt-4 flex items-center justify-between gap-4 border-t border-white/10 pt-4">
//           <p className="text-xs text-white/55" aria-live="polite">
//             {filtered.length} {filtered.length === 1 ? "message" : "messages"}
//           </p>
//           {hasFilters && (
//             <button
//               type="button"
//               onClick={() => {
//                 setQuery("");
//                 setActiveSeries("");
//                 setActiveSpeaker("");
//               }}
//               className="text-orange hover:text-ember text-xs tracking-[0.2em] uppercase transition-colors duration-300"
//             >
//               Clear filters
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Results */}
//       <ul className="mt-8 grid gap-5 md:grid-cols-2">
//         {filtered.map((sermon) => (
//           <SermonCard key={sermon.id} sermon={sermon} />
//         ))}
//       </ul>

//       {filtered.length === 0 && (
//         <Reveal
//           className={cn(
//             "border-orange/30 mt-8 border border-dashed px-8 py-16 text-center",
//           )}
//         >
//           <p className="eyebrow">No matches</p>
//           <p className="text-muted mt-3 text-sm">
//             Try a different keyword or clear the filters.
//           </p>
//         </Reveal>
//       )}
//     </div>
//   );
// }



"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Sermon } from "@/content/types";
import { SermonCard } from "@/components/shared/cards";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

interface ExplorerProps {
  sermons: Sermon[];
  series: string[];
  speakers: string[];
}

type SortKey = "newest" | "oldest";

/* ─────────────────────────────────────────────
   Custom Dropdown
───────────────────────────────────────────── */
function CustomSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "All",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handlePointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  const selected = options.find((o) => o.value === value);
  const display = selected?.label ?? placeholder;

  return (
    <div ref={rootRef} className="relative flex flex-col gap-2">
      <span className="text-orange/90 text-[0.62rem] tracking-[0.26em] uppercase">
        {label}
      </span>

      {/* Trigger */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "bg-charcoal/60 hover:border-orange/50 focus:border-orange flex min-h-12 w-full items-center justify-between border px-4 py-3 text-left text-sm font-normal tracking-normal text-white normal-case transition-colors duration-300 outline-none",
          open ? "border-orange" : "border-white/15",
        )}
      >
        <span className={cn(!value && "text-white/35")}>{display}</span>
        <svg
          viewBox="0 0 12 8"
          className={cn(
            "ml-3 size-3 shrink-0 text-orange/80 transition-transform duration-300",
            open && "rotate-180",
          )}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden
        >
          <path d="M1 1.5 L6 6.5 L11 1.5" />
        </svg>
      </button>

      {/* Menu */}
      {open && (
        <ul
          role="listbox"
          className="border-orange/40 absolute top-[calc(100%+4px)] right-0 left-0 z-50 max-h-60 overflow-y-auto border bg-[#161616] shadow-[0_12px_40px_rgba(0,0,0,0.55)]"
        >
          {options.map((opt) => {
            const isActive = opt.value === value;
            return (
              <li key={opt.value || "__all"} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors duration-200",
                    isActive
                      ? "bg-orange/15 text-orange"
                      : "text-white/85 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <span>{opt.label}</span>
                  {isActive && (
                    <svg
                      viewBox="0 0 12 10"
                      className="size-3 shrink-0 text-orange"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      aria-hidden
                    >
                      <path d="M1 5 L4.5 8.5 L11 1.5" />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Explorer
───────────────────────────────────────────── */
export function SermonExplorer({ sermons, series, speakers }: ExplorerProps) {
  const [query, setQuery] = useState("");
  const [activeSeries, setActiveSeries] = useState("");
  const [activeSpeaker, setActiveSpeaker] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = sermons.filter((s) => {
      const matchesQuery =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.scripture?.toLowerCase().includes(q) ||
        s.excerpt.toLowerCase().includes(q);
      const matchesSeries = !activeSeries || s.series === activeSeries;
      const matchesSpeaker = !activeSpeaker || s.speaker === activeSpeaker;
      return matchesQuery && matchesSeries && matchesSpeaker;
    });
    list.sort((a, b) =>
      sort === "newest" ? (a.date < b.date ? 1 : -1) : a.date < b.date ? -1 : 1,
    );
    return list;
  }, [sermons, query, activeSeries, activeSpeaker, sort]);

  const hasFilters = Boolean(query || activeSeries || activeSpeaker);

  const seriesOptions = [
    { label: "All", value: "" },
    ...series.map((s) => ({ label: s, value: s })),
  ];

  const speakerOptions = [
    { label: "All", value: "" },
    ...speakers.map((s) => ({ label: s, value: s })),
  ];

  const sortOptions = [
    { label: "Newest first", value: "newest" },
    { label: "Oldest first", value: "oldest" },
  ];

  return (
    <div>
      {/* Filter bar */}
      <div className="surface rounded-none p-5 md:p-6">
        <div className="grid gap-4 md:grid-cols-4">
          {/* Search */}
          <label className="text-orange/90 flex flex-col gap-2 text-[0.62rem] tracking-[0.26em] uppercase">
            Search
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Title, scripture, keyword…"
              className="bg-charcoal/60 hover:border-orange/50 focus:border-orange min-h-12 rounded-none border border-white/15 px-4 py-3 text-sm text-white transition-colors duration-300 outline-none placeholder:text-white/35"
            />
          </label>

          {/* Series */}
          <CustomSelect
            label="Series"
            value={activeSeries}
            onChange={setActiveSeries}
            options={seriesOptions}
          />

          {/* Speaker */}
          <CustomSelect
            label="Speaker"
            value={activeSpeaker}
            onChange={setActiveSpeaker}
            options={speakerOptions}
          />

          {/* Order */}
          <CustomSelect
            label="Order"
            value={sort}
            onChange={(v) => setSort(v as SortKey)}
            options={sortOptions}
            placeholder="Newest first"
          />
        </div>

        <div className="mt-4 flex items-center justify-between gap-4 border-t border-white/10 pt-4">
          <p className="text-xs text-white/55" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? "message" : "messages"}
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setActiveSeries("");
                setActiveSpeaker("");
              }}
              className="text-orange hover:text-ember text-xs tracking-[0.2em] uppercase transition-colors duration-300"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <ul className="mt-8 grid gap-5 md:grid-cols-2">
        {filtered.map((sermon) => (
          <SermonCard key={sermon.id} sermon={sermon} />
        ))}
      </ul>

      {filtered.length === 0 && (
        <Reveal
          className={cn(
            "border-orange/30 mt-8 border border-dashed px-8 py-16 text-center",
          )}
        >
          <p className="eyebrow">No matches</p>
          <p className="text-muted mt-3 text-sm">
            Try a different keyword or clear the filters.
          </p>
        </Reveal>
      )}
    </div>
  );
}