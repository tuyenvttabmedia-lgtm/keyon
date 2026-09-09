import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getTelegramSettingsPublic,
  saveTelegramSettings,
} from "@/server/telegram/config";
import { toErrorResponse } from "@/lib/errors";
import { requireStaffSession } from "@/server/auth/require-staff";

export async function GET() {
  try {
    await requireStaffSession({ capability: "settings", method: "GET" });
    return NextResponse.json(await getTelegramSettingsPublic());
  } catch (e) {
    return toErrorResponse(e);
  }
}

export async function PUT(req: Request) {
  try {
    await requireStaffSession({ capability: "settings", method: "PUT" });

    const body = await req.json();
    const parsed = z
      .object({
        enabled: z.boolean().optional(),
        chatId: z.string().max(64).optional(),
        botToken: z.string().max(200).optional(),
        clearBotToken: z.boolean().optional(),
      })
      .parse(body);

    await saveTelegramSettings(parsed);
    return NextResponse.json({
      ok: true,
      data: await getTelegramSettingsPublic(),
    });
  } catch (e) {
    return toErrorResponse(e);
  }
}
