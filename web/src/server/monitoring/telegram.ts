/**
 * Optional Telegram push for monitoring alerts + inbound leads.
 * Hybrid: Admin → Cài đặt → Telegram (encrypted) with ENV fallback.
 */
import { resolveTelegram } from "@/server/telegram/config";

export async function notifyTelegram(text: string): Promise<boolean> {
  if (!text.trim()) return false;
  const resolved = await resolveTelegram();
  if (!resolved.ready) return false;

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${resolved.botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: resolved.chatId,
          text: text.slice(0, 3500),
          disable_web_page_preview: true,
        }),
        signal: AbortSignal.timeout(12_000),
      },
    );
    return res.ok;
  } catch {
    return false;
  }
}
