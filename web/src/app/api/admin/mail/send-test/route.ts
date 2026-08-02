import { NextResponse } from "next/server";
import { z } from "zod";
import { isStaff, readSession } from "@/lib/auth";
import { staffHasCapability } from "@/lib/staff-access";
import { getMailSettingsPublic } from "@/server/mail/config";
import { sendMail } from "@/server/mail";

async function requireAdmin() {
  const session = await readSession();
  if (!session || !isStaff(session.role)) return null;
  if (!staffHasCapability(session.role, "settings")) return null;
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
        to: z.string().trim().email("Email nhận thử không hợp lệ"),
      })
      .parse(await req.json().catch(() => ({})));

    const to = body.to;
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
    const error =
      e instanceof z.ZodError
        ? (e.issues[0]?.message ?? "Email nhận thử không hợp lệ")
        : e instanceof Error
          ? e.message
          : "Gửi thất bại";
    return NextResponse.json(
      {
        ok: false,
        error,
        data: await getMailSettingsPublic(),
      },
      { status: 400 },
    );
  }
}
