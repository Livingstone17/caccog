"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ChurchEvent } from "@/content/types";
import { formatEventRange } from "@/lib/format";
import { downloadIcs } from "./add-to-calendar";
import { cn, isPlaceholder } from "@/lib/utils";

function monthKey(iso: string) {
  return iso.slice(0, 7);
}

function prettyMonth(key: string) {
  const [y, m] = key.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(new Date(y, (m || 1) - 1, 1));
}

function useCalendarGrid(key: string) {
  return useMemo(() => {
    const [y, m] = key.split("-").map(Number);
    const first = new Date(y, (m || 1) - 1, 1);
    const startOffset = (first.getDay() + 6) % 7; // Monday-first
    const daysInMonth = new Date(y, m || 1, 0).getDate();
    const cells: (number | null)[] = Array.from({ length: startOffset }, () => null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [key]);
}

export function EventExplorer({ events }: { events: ChurchEvent[] }) {
  const months = useMemo(
    () => [...new Set(events.map((e) => monthKey(e.startsAt)))],
    [events],
  );
  const [view, setView] = useState<"list" | "month">("list");
  const [cursor, setCursor] = useState(months[0] ?? monthKey(new Date().toISOString()));
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const byMonth = useMemo(() => {
    const map = new Map<string, ChurchEvent[]>();
    for (const e of events) {
      const key = monthKey(e.startsAt);
      map.set(key, [...(map.get(key) ?? []), e]);
    }
    return map;
  }, [events]);

  const cells = useCalendarGrid(cursor);
  const cursorEvents = byMonth.get(cursor) ?? [];

  const eventsOnDay = (day: number) =>
    cursorEvents.filter((e) => new Date(e.startsAt).getDate() === day);

  const moveMonth = (delta: number) => {
    const [y, m] = cursor.split("-").map(Number);
    const next = new Date(y, (m || 1) - 1 + delta, 1);
    const key = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`;
    setCursor(key);
    setSelectedDay(null);
  };

  const selectedEvents = selectedDay ? eventsOnDay(selectedDay) : [];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex rounded-full border border-white/15 p-1">
          {(["list", "month"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              aria-pressed={view === v}
              className={cn(
                "min-h-10 rounded-full px-5 text-xs tracking-[0.2em] uppercase transition-colors duration-500",
                view === v ? "bg-orange text-black" : "text-white/70 hover:text-white",
              )}
            >
              {v === "list" ? "List" : "Month"}
            </button>
          ))}
        </div>
        <p className="text-xs tracking-[0.2em] text-white/50 uppercase">
          {events.length} upcoming
        </p>
      </div>

      {view === "list" ? (
        <div className="mt-10 space-y-12">
          {[...byMonth.entries()].map(([key, list]) => (
            <div key={key}>
              <h2 className="font-display text-ember mb-5 flex items-center gap-4 text-2xl font-light">
                {prettyMonth(key)}
                <span className="bg-orange/25 h-px flex-1" aria-hidden />
              </h2>
              <ul className="space-y-5">
                {list.map((event) => (
                  <li key={event.id}>
                    <Link
                      href={`/events/${event.slug}`}
                      className="group bg-charcoal/40 hover:border-orange/45 hover:bg-charcoal/70 flex flex-col gap-3 border border-white/10 p-6 transition-colors duration-700 md:flex-row md:items-center md:gap-8"
                    >
                      <div className="md:w-56">
                        <p className="text-orange text-sm">
                          {formatEventRange(event.startsAt, event.endsAt)}
                        </p>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display group-hover:text-ember text-xl font-normal text-white transition-colors duration-500 md:text-2xl">
                          {isPlaceholder(event.title) ? (
                            <span className="placeholder-chip">{event.title}</span>
                          ) : (
                            event.title
                          )}
                        </h3>
                        <p className="text-muted mt-1 text-sm">
                          {isPlaceholder(event.venue) ? (
                            <span className="placeholder-chip">{event.venue}</span>
                          ) : (
                            event.venue
                          )}
                        </p>
                      </div>
                      <span
                        className="text-orange transition-transform duration-500 group-hover:translate-x-1.5"
                        aria-hidden
                      >
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div className="surface p-5 md:p-7">
            <div className="mb-5 flex items-center justify-between">
              <button
                type="button"
                onClick={() => moveMonth(-1)}
                className="hover:border-orange/60 hover:text-ember flex size-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors duration-500"
                aria-label="Previous month"
              >
                ←
              </button>
              <p className="font-display text-xl font-light text-white md:text-2xl">
                {prettyMonth(cursor)}
              </p>
              <button
                type="button"
                onClick={() => moveMonth(1)}
                className="hover:border-orange/60 hover:text-ember flex size-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors duration-500"
                aria-label="Next month"
              >
                →
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center" aria-hidden>
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <span
                  key={i}
                  className="text-orange/70 pb-2 text-[0.6rem] tracking-[0.2em] uppercase"
                >
                  {d}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, i) => {
                const has = day ? eventsOnDay(day).length > 0 : false;
                const active = day !== null && selectedDay === day;
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={!day || !has}
                    onClick={() => setSelectedDay(day)}
                    className={cn(
                      "relative flex aspect-square items-center justify-center border text-sm transition-colors duration-300",
                      !day && "border-transparent",
                      day && !has && "border-white/8 text-white/45",
                      has &&
                        "border-orange/40 hover:bg-orange/15 cursor-pointer text-white",
                      active && "bg-orange/25 border-orange text-ember",
                    )}
                    aria-label={day ? `${day}${has ? " — has events" : ""}` : undefined}
                  >
                    {day}
                    {has && (
                      <span
                        className="bg-orange absolute bottom-1.5 size-1 rounded-full"
                        aria-hidden
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="eyebrow mb-4">
              {selectedDay
                ? `${prettyMonth(cursor)} ${selectedDay}`
                : "Select a highlighted day"}
            </p>
            {selectedDay && selectedEvents.length === 0 && (
              <p className="text-muted text-sm">No events on this day.</p>
            )}
            {!selectedDay && (
              <p className="text-muted max-w-sm text-sm leading-relaxed">
                Days with an orange marker have events. Choose one to see the details, or
                switch to the list view.
              </p>
            )}
            <ul className="space-y-4">
              {selectedEvents.map((event) => (
                <li key={event.id} className="border-orange/30 bg-charcoal/50 border p-5">
                  <p className="text-orange text-xs">
                    {formatEventRange(event.startsAt, event.endsAt)}
                  </p>
                  <h3 className="font-display mt-2 text-lg font-normal text-white">
                    {event.title}
                  </h3>
                  <p className="text-muted mt-1 text-sm">{event.venue}</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      href={`/events/${event.slug}`}
                      className="text-orange hover:text-ember text-xs tracking-[0.2em] uppercase"
                    >
                      Details →
                    </Link>
                    <button
                      type="button"
                      onClick={() => downloadIcs(event)}
                      className="hover:text-ember text-xs tracking-[0.2em] text-white/70 uppercase"
                    >
                      Add to calendar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
