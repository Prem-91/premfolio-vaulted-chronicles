// Best-effort in-memory rate limiter for admin server functions.
// CAVEAT: state is per-worker-instance. Resets on cold start and is not shared
// across instances. This is a speed bump, not a real defense — Supabase Auth
// already rate-limits sign-in/sign-up and is_admin() is the real gate.

import { getRequestIP, getRequestHeader } from "@tanstack/react-start/server";

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 30; // per identity per window

function identity(): string {
  const ip =
    getRequestIP({ xForwardedFor: true }) ||
    getRequestHeader("cf-connecting-ip") ||
    "unknown";
  return ip;
}

export function enforceRateLimit(scope = "admin"): void {
  const key = `${scope}:${identity()}`;
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }

  existing.count += 1;
  if (existing.count > MAX_REQUESTS) {
    throw new Error("Too many requests. Please slow down and try again shortly.");
  }

  // Best-effort cleanup to avoid unbounded memory growth.
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) if (b.resetAt < now) buckets.delete(k);
  }
}
