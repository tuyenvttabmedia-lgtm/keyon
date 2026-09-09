import { NextResponse } from "next/server";
import { getMailSettingsPublic } from "@/server/mail/config";
import { verifyMailConnection } from "@/server/mail";
import { toErrorResponse } from "@/lib/errors";
import { requireStaffSession } from "@/server/auth/require-staff";

export async function POST() {
  try {
    await requireStaffSession({ capability: "settings" });

    const result = await verifyMailConnection();
    const pub = await getMailSettingsPublic();

    if (!result.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: result.error,
          data: pub,
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      ok: true,
      message: `Kết nối SMTP OK — ${result.cfg.host}:${result.cfg.port}`,
      data: pub,
    });
  } catch (e) {
    return toErrorResponse(e);
  }
}
