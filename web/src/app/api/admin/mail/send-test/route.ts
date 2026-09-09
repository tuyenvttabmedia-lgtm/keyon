import { NextResponse } from "next/server";
import { z } from "zod";
import { getMailSettingsPublic } from "@/server/mail/config";
import { sendMail } from "@/server/mail";
import { toErrorResponse } from "@/lib/errors";
import { rateLimit } from "@/lib/rate-limit";
import { requireStaffSession } from "@/server/auth/require-staff";

export async function POST(req: Request) {
  try {
    const session = await requireStaffSession({ capability: "settings" });
    const rl = await rateLimit(`mail-test:${session.id}`, 10);
    if (!rl.ok) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

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
    if (e && typeof e === "object" && "status" in e && (e as { status: number }).status !== 400) {
      return toErrorResponse(e);
    }
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
