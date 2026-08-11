const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const MAX_TRACKED_CLIENTS = 10_000;

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const attemptsByClient = new Map<string, RateLimitEntry>();

export function checkContactRateLimit(client: string, now = Date.now()) {
  for (const [key, entry] of attemptsByClient) {
    if (entry.resetAt <= now) {
      attemptsByClient.delete(key);
    }
  }

  const entry = attemptsByClient.get(client);

  if (entry) {
    if (entry.count >= MAX_REQUESTS) {
      return { allowed: false, retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000) };
    }

    entry.count += 1;
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (attemptsByClient.size >= MAX_TRACKED_CLIENTS) {
    const oldestClient = attemptsByClient.keys().next().value;
    if (oldestClient) {
      attemptsByClient.delete(oldestClient);
    }
  }

  attemptsByClient.set(client, { count: 1, resetAt: now + WINDOW_MS });
  return { allowed: true, retryAfterSeconds: 0 };
}
