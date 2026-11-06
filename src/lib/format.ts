const dateFmt = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const shortFmt = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const timeFmt = new Intl.DateTimeFormat("en-GB", {
  hour: "numeric",
  minute: "2-digit",
});

export function formatDate(iso: string): string {
  return dateFmt.format(new Date(iso));
}

export function formatShortDate(iso: string): string {
  return shortFmt.format(new Date(iso));
}

export function formatTime(iso: string): string {
  return timeFmt.format(new Date(iso));
}

const dayMonthFmt = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
});

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function formatEventRange(startsAt: string, endsAt?: string): string {
  const start = new Date(startsAt);
  const day = dateFmt.format(start);
  const startTime = timeFmt.format(start);
  if (!endsAt) return `${day} · ${startTime}`;
  const end = new Date(endsAt);
  // Events running past their start day (a fasting period, a convention) read
  // as a date span instead of one day with a time range.
  if (!isSameDay(start, end)) {
    return start.getFullYear() === end.getFullYear()
      ? `${dayMonthFmt.format(start)} – ${shortFmt.format(end)}`
      : `${shortFmt.format(start)} – ${shortFmt.format(end)}`;
  }
  return `${day} · ${startTime} – ${timeFmt.format(end)}`;
}

export function formatMonthYear(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}
