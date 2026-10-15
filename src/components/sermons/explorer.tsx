"use client";

import { useMemo, useState } from "react";
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

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="text-orange/90 flex flex-col gap-2 text-[0.62rem] tracking-[0.26em] uppercase">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-charcoal/60 hover:border-orange/50 focus:border-orange min-h-12 rounded-none border border-white/15 px-4 py-3 text-sm font-normal tracking-normal text-white normal-case transition-colors duration-300 outline-none"
      >
        <option value="">All</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

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

  return (
    <div>
      {/* Filter bar */}
      <div className="surface rounded-none p-5 md:p-6">
        <div className="grid gap-4 md:grid-cols-4">
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
          <Select
            label="Series"
            value={activeSeries}
            onChange={setActiveSeries}
            options={series}
          />
          <Select
            label="Speaker"
            value={activeSpeaker}
            onChange={setActiveSpeaker}
            options={speakers}
          />
          <label className="text-orange/90 flex flex-col gap-2 text-[0.62rem] tracking-[0.26em] uppercase">
            Order
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="bg-charcoal/60 hover:border-orange/50 focus:border-orange min-h-12 rounded-none border border-white/15 px-4 py-3 text-sm font-normal tracking-normal text-white normal-case transition-colors duration-300 outline-none"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </label>
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
