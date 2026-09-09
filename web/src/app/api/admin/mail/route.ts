import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getMailSettingsPublic,
  saveMailSettings,
} from "@/server/mail/config";
import { toErrorResponse } from "@/lib/errors";
import { requireStaffSession } from "@/server/auth/require-staff";

export async function GET() {
  try {
    await requireStaffSession({ capability: "settings", method: "GET" });
    return NextResponse.json(await getMailSettingsPublic());
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
  } catch (e) {
    return toErrorResponse(e);
  }
}
