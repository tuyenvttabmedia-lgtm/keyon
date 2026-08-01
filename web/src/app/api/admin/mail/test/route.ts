import { NextResponse } from "next/server";
import { isStaff, readSession } from "@/lib/auth";
import { getMailSettingsPublic } from "@/server/mail/config";
import { verifyMailConnection } from "@/server/mail";

async function requireAdmin() {
  const session = await readSession();
  if (!session || !isStaff(session.role)) return null;
  if (session.role === "CS") return null;
  return session;
}

export async function POST() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
}
