import { NextResponse } from "next/server";
import { z } from "zod";
import { isStaff, readSession } from "@/lib/auth";
import { staffHasCapability } from "@/lib/staff-access";
import {
  getTelegramSettingsPublic,
  saveTelegramSettings,
} from "@/server/telegram/config";

async function requireAdmin() {
  const session = await readSession();
  if (!session || !isStaff(session.role)) return null;
  if (!staffHasCapability(session.role, "settings")) return null;
  return session;
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await getTelegramSettingsPublic());
}

export async function PUT(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
}
