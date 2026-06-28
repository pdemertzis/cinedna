import { kv } from "@vercel/kv";

/**
 * Redis-backed rate limiter. Safe across all serverless instances.
 * @param {string} identifier - e.g. IP address or "ip:x.x.x.x"
 * @param {object} options
 * @param {number} options.limit - max requests allowed in the window
 * @param {number} options.windowSeconds - sliding window in seconds
 * @returns {Promise<{ success: boolean, remaining: number, reset: number }>}
 */
export async function rateLimit(identifier, { limit = 10, windowSeconds = 60 } = {}) {
  const key = `rl:${identifier}`;
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const windowStart = now - windowMs;

  try {
    // Remove entries outside the current window, then add current request
    await kv.zremrangebyscore(key, 0, windowStart);
    await kv.zadd(key, { score: now, member: `${now}-${Math.random()}` });
    await kv.expire(key, windowSeconds + 1);

    const count = await kv.zcard(key);
    const remaining = Math.max(0, limit - count);
    const reset = Math.ceil((now + windowMs) / 1000);

    return { success: count <= limit, remaining, reset };
  } catch (err) {
    // If Redis is unavailable, fail open (allow the request)
    console.error("rateLimit Redis error:", err);
    return { success: true, remaining: limit, reset: 0 };
  }
}

/**
 * Helper: extract a consistent identifier from a Next.js request.
 * Uses x-forwarded-for (Vercel sets this), falls back to "anonymous".
 */
export function getIdentifier(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "anonymous";
  return `ip:${ip}`;
}
