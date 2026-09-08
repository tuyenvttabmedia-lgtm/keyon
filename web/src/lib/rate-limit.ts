import { getRedisConnection } from "@/server/queue";

type Bucket = { count: number; resetAt: number };

const memoryBuckets = new Map<string, Bucket>();

function memoryLimit(
  key: string,
  max: number,
  windowMs: number,
): { ok: boolean; remaining: number } {
  const now = Date.now();
  const current = memoryBuckets.get(key);
  if (!current || current.resetAt < now) {
    memoryBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: max - 1 };
  }
  if (current.count >= max) {
    return { ok: false, remaining: 0 };
  }
  current.count += 1;
  return { ok: true, remaining: max - current.count };
}

/**
 * Redis INCR window when Redis is up; falls back to in-process memory.
 */
export async function rateLimit(
  key: string,
  max = Number(process.env.RATE_LIMIT_MAX ?? 60),
  windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000),
): Promise<{ ok: boolean; remaining: number }> {
  const redisKey = `keyon:rl:${key}`;
  try {
    const redis = getRedisConnection();
    const count = await redis.incr(redisKey);
    if (count === 1) {
      await redis.pexpire(redisKey, windowMs);
    }
    if (count > max) {
      return { ok: false, remaining: 0 };
    }
    return { ok: true, remaining: Math.max(0, max - count) };
  } catch {
    return memoryLimit(key, max, windowMs);
  }
}
