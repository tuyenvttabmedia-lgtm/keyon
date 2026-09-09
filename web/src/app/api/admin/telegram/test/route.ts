import { NextResponse } from "next/server";
import { notifyTelegram } from "@/server/monitoring/telegram";
import {
  getTelegramSettingsPublic,
  recordTelegramHealth,
  resolveTelegram,
} from "@/server/telegram/config";
import { toErrorResponse } from "@/lib/errors";
import { requireStaffSession } from "@/server/auth/require-staff";

export async function POST() {
  try {
    await requireStaffSession({ capability: "settings" });

    const resolved = await resolveTelegram();
    if (!resolved.enabled) {
      await recordTelegramHealth(false, "Telegram đang tắt");
      return NextResponse.json(
        {
          ok: false,
          error: "Telegram đang tắt. Bật trong Cài đặt rồi thử lại.",
          data: await getTelegramSettingsPublic(),
        },
        { status: 400 },
      );
    }
    if (!resolved.ready) {
      await recordTelegramHealth(false, "Thiếu bot token hoặc chat ID");
      return NextResponse.json(
        {
          ok: false,
          error: "Thiếu Bot token hoặc Chat ID (Admin hoặc ENV).",
          data: await getTelegramSettingsPublic(),
        },
        { status: 400 },
      );
    }

    const ok = await notifyTelegram(
      `KEYON test\nTelegram đã kết nối.\nThời điểm: ${new Date().toISOString()}`,
    );

    if (!ok) {
      await recordTelegramHealth(false, "Telegram API không trả OK");
      return NextResponse.json(
        {
          ok: false,
          error: "Gửi thất bại — kiểm tra Bot token / Chat ID.",
          data: await getTelegramSettingsPublic(),
        },
        { status: 400 },
      );
    }

    await recordTelegramHealth(true);
    return NextResponse.json({
      ok: true,
      message: "Đã gửi tin nhắn thử tới Telegram.",
      data: await getTelegramSettingsPublic(),
    });
  } catch (e) {
    return toErrorResponse(e);
  }
}
