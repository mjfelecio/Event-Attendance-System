import "server-only";

/**
 * Minimal in-memory fixed-window rate limiter.
 *
 * Good enough for a single-server deployment (this app runs on one Node
 * process with a local SQLite file). If the app is ever scaled to multiple
 * instances, replace with a shared store (Redis or similar).
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): boolean {
  const now = Date.now();

  // Opportunistic cleanup so the map doesn't grow unbounded
  if (buckets.size > 10_000) {
    for (const [k, v] of buckets) {
      if (v.resetAt < now) buckets.delete(k);
    }
  }

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (bucket.count >= limit) {
    return false;
  }

  bucket.count += 1;
  return true;
}

/** Best-effort client identifier for rate limiting. */
export function clientKey(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local"
  );
}
