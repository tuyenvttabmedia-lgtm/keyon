import pino from "pino";

const level = process.env.LOG_LEVEL ?? "info";

/**
 * Do NOT use pino-pretty `transport` (thread-stream worker) under Next.js /
 * Turbopack — it resolves a broken path (`C:\ROOT\node_modules\...`) and
 * crashes with "the worker has exited" on the first log.info in RSC/API.
 *
 * Opt-in pretty logs only for standalone scripts: PINO_PRETTY=1
 */
const usePretty =
  process.env.PINO_PRETTY === "1" && process.env.NEXT_RUNTIME == null;

export const logger = pino({
  level,
  base: { service: "keyon" },
  ...(usePretty
    ? {
        transport: {
          target: "pino-pretty",
          options: { colorize: true, translateTime: "SYS:standard" },
        },
      }
    : {}),
});

export function childLogger(module: string) {
  return logger.child({ module });
}
