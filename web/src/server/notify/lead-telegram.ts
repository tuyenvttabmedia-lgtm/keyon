import { notifyTelegram } from "@/server/monitoring/telegram";
import { childLogger } from "@/lib/logger";

const log = childLogger("lead-notify");

/**
 * Best-effort Telegram push for inbound leads (contact / quote).
 * Never throws — mail/DB success must not depend on Telegram.
 */
export async function notifyLeadTelegram(text: string): Promise<void> {
  try {
    const ok = await notifyTelegram(text);
    if (!ok) {
      log.debug("telegram lead notify skipped or failed (env missing or API error)");
    }
  } catch (e) {
    log.warn(
      { err: e instanceof Error ? e.message : e },
      "telegram lead notify error",
    );
  }
}
