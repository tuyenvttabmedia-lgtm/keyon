import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";
import { defaultSettings, readJsonFile } from "@/server/cms/store";
import { sendMail } from "@/server/mail";
import { childLogger } from "@/lib/logger";

const log = childLogger("contact");

const bodySchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  topic: z.string().trim().min(1).max(80),
  message: z.string().trim().min(10).max(5000),
});

function clientIp(req: Request) {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: Request) {
  try {
    const rl = rateLimit(`contact:${clientIp(req)}`, 8, 60_000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Quá nhiều yêu cầu. Thử lại sau ít phút." },
        { status: 429 },
      );
    }

    const body = bodySchema.parse(await req.json());
    const settings = await readJsonFile("settings.json", defaultSettings);
    const to = settings.supportEmail || "support@keyon.vn";

    const subject = `[KEYON Contact] ${body.topic} — ${body.name}`;
    const text = [
      `Họ tên: ${body.name}`,
      `Email: ${body.email}`,
      `SĐT: ${body.phone || "—"}`,
      `Chủ đề: ${body.topic}`,
      "",
      body.message,
    ].join("\n");

    const html = `
      <p><strong>Họ tên:</strong> ${escapeHtml(body.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(body.email)}</p>
      <p><strong>SĐT:</strong> ${escapeHtml(body.phone || "—")}</p>
      <p><strong>Chủ đề:</strong> ${escapeHtml(body.topic)}</p>
      <hr/>
      <p style="white-space:pre-wrap">${escapeHtml(body.message)}</p>
    `;

    await sendMail({
      to,
      subject,
      text,
      html,
      replyTo: body.email,
    });

    log.info({ to, topic: body.topic }, "contact form mailed");
    return NextResponse.json({ ok: true });
  } catch (e) {
    log.error(
      { err: e instanceof Error ? e.message : e },
      "contact form failed",
    );
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dữ liệu không hợp lệ" },
        { status: 400 },
      );
    }
    const msg = e instanceof Error ? e.message : "Gửi thất bại";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
