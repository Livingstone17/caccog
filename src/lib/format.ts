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

export function formatEventRange(startsAt: string, endsAt?: string): string {
  const start = new Date(startsAt);
  const day = dateFmt.format(start);
  const startTime = timeFmt.format(start);
  if (!endsAt) return `${day} · ${startTime}`;
  const endTime = timeFmt.format(new Date(endsAt));
  return `${day} · ${startTime} – ${endTime}`;
}

export function formatMonthYear(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}
