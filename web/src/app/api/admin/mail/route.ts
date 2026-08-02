import { NextResponse } from "next/server";
import { z } from "zod";
import { isStaff, readSession } from "@/lib/auth";
import { staffHasCapability } from "@/lib/staff-access";
import {
  getMailSettingsPublic,
  saveMailSettings,
} from "@/server/mail/config";

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
  return NextResponse.json(await getMailSettingsPublic());
}

export async function PUT(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = z
    .object({
      provider: z.enum(["env", "brevo", "custom"]),
      host: z.string().optional(),
      port: z.number().int().min(1).max(65535).optional(),
      secure: z.boolean().optional(),
      user: z.string().optional(),
      pass: z.string().optional(),
      from: z.string().optional(),
      replyTo: z.string().optional(),
    })
    .parse(body);

  await saveMailSettings(parsed);
  return NextResponse.json({
    ok: true,
    data: await getMailSettingsPublic(),
  });
}
