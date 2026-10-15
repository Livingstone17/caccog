/**
 * Minimal fixed-window in-memory rate limiter.
 *
 * Suitable for a single serverless instance / single container. For
 * multi-region production traffic, swap for a shared store (Upstash, KV) —
 * see CONTENT_TODO.md → "Operations". Honeypot fields remain the first
 * line of spam defence.
 */
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function rateLimit(
  key: string,
  { limit = 5, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {},
): { ok: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= limit) {
    return {
      ok: false,
      retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  bucket.count += 1;
  return { ok: true, retryAfterSeconds: 0 };
}

/** Best-effort client identifier from request headers. */
export function clientKey(request: Request, prefix: string): string {
  const fwd = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  return `${prefix}:${fwd}`;
}
