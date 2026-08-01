import { NextResponse } from "next/server";
import { z } from "zod";
import { isStaff, readSession } from "@/lib/auth";
import { getMailSettingsPublic } from "@/server/mail/config";
import { sendMail } from "@/server/mail";

async function requireAdmin() {
  const session = await readSession();
  if (!session || !isStaff(session.role)) return null;
  if (session.role === "CS") return null;
  return session;
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = z
      .object({
        to: z.string().email().optional(),
      })
      .parse(await req.json().catch(() => ({})));

    const to = body.to?.trim() || session.email;
    await sendMail({
      to,
      subject: "[KEYON] Test SMTP",
      text: "Email thử từ Admin → Cài đặt → Email. Nếu nhận được, SMTP đang hoạt động.",
      html: `<p>Email thử từ <strong>Admin → Cài đặt → Email</strong>.</p><p>Nếu nhận được, SMTP đang hoạt động.</p>`,
    });

    return NextResponse.json({
      ok: true,
      message: `Đã gửi mail thử tới ${to}`,
      data: await getMailSettingsPublic(),
    });
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        error: e instanceof Error ? e.message : "Gửi thất bại",
        data: await getMailSettingsPublic(),
      },
      { status: 400 },
    );
  }
}
