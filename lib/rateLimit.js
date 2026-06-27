import { kv } from "@vercel/kv";
import * as Sentry from "@sentry/nextjs";

const WINDOW_SECONDS = 10 * 60; // 10 minutes
const MAX_RECOMMEND = 50;
const MAX_SEARCH = 120;

// Fallback store, only used if KV is unreachable. Per-instance, so it's not
// as strong a guarantee as KV, but keeps rate limiting working in that case.
const fallbackStore = new Map();

function getIP(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function checkFallback(key, max) {
  const now = Date.now();
  const entry = fallbackStore.get(key) || { count: 0, resetAt: now + WINDOW_SECONDS * 1000 };

  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + WINDOW_SECONDS * 1000;
  }

  entry.count += 1;
  fallbackStore.set(key, entry);

  return { allowed: entry.count <= max, remaining: Math.max(0, max - entry.count) };
}

async function check(key, max) {
  try {
    const count = await kv.incr(key);
    if (count === 1) {
      await kv.expire(key, WINDOW_SECONDS);
    }
    return { allowed: count <= max, remaining: Math.max(0, max - count) };
  } catch (error) {
    // KV unavailable — fall back to in-memory limiting rather than failing open/closed.
    Sentry.captureException(error);
    return checkFallback(key, max);
  }
}

export async function rateLimitRecommend(request) {
  const ip = getIP(request);
  return check(`recommend:${ip}`, MAX_RECOMMEND);
}

export async function rateLimitSearch(request) {
  const ip = getIP(request);
  return check(`search:${ip}`, MAX_SEARCH);
}
