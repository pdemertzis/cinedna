const store = new Map();
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_RECOMMEND = 50;
const MAX_SEARCH = 120;

function getIP(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function pruneExpired() {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
}

function check(key, max) {
  pruneExpired();
  const now = Date.now();
  const entry = store.get(key) || { count: 0, resetAt: now + WINDOW_MS };

  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + WINDOW_MS;
  }

  entry.count += 1;
  store.set(key, entry);

  return { allowed: entry.count <= max, remaining: Math.max(0, max - entry.count) };
}

export function rateLimitRecommend(request) {
  const ip = getIP(request);
  return check(`recommend:${ip}`, MAX_RECOMMEND);
}

export function rateLimitSearch(request) {
  const ip = getIP(request);
  return check(`search:${ip}`, MAX_SEARCH);
}
