import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getTurnstileSettingsPublic,
  saveTurnstileSettings,
} from "@/server/turnstile/config";
import { toErrorResponse } from "@/lib/errors";
import { requireStaffSession } from "@/server/auth/require-staff";

export async function GET() {
  try {
    await requireStaffSession({ capability: "settings", method: "GET" });
    return NextResponse.json(await getTurnstileSettingsPublic());
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
        siteKey: z.string().max(200).optional(),
        secretKey: z.string().max(200).optional(),
        clearSecret: z.boolean().optional(),
      })
      .parse(body);

    await saveTurnstileSettings(parsed);
    return NextResponse.json({
      ok: true,
      data: await getTurnstileSettingsPublic(),
    });
  } catch (e) {
    return toErrorResponse(e);
  }
}
