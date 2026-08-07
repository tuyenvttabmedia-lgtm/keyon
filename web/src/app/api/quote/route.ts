import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { childLogger } from "@/lib/logger";
import { defaultSettings, readJsonFile } from "@/server/cms/store";
import { sendMail } from "@/server/mail";
import {
  ESTIMATED_USERS_LABEL,
  LICENSE_TYPE_LABEL,
  TERM_LABEL,
  normalizePhone,
  quoteRequestBodySchema,
} from "@/lib/quote";
import { hashIp, publicReferenceCode } from "@/server/quote/ids";

const log = childLogger("quote");

function clientIp(req: Request) {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") ?? "unknown";
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fieldErrors(err: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = issue.path.join(".") || "_form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export async function POST(req: Request) {
  try {
    const ip = clientIp(req);
    const rl = rateLimit(`quote:${ip}`, 5, 60_000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Quá nhiều yêu cầu. Thử lại sau ít phút." },
        { status: 429 },
      );
    }

    const raw = await req.json();
    // Honeypot: treat filled companyUrl as soft success (no store)
    if (typeof raw?.companyUrl === "string" && raw.companyUrl.trim()) {
      log.warn({ ip }, "quote honeypot tripped");
      return NextResponse.json({ ok: true, referenceCode: null });
    }

    const body = quoteRequestBodySchema.parse(raw);
    const phone = normalizePhone(body.phone);
    const products = body.interestedProducts.map((p) => ({
      slug: p.slug?.trim() || undefined,
      name: p.name.trim(),
    }));
    const message = body.message?.trim() || null;
    const jobTitle = body.jobTitle?.trim() || null;
    const requestType = (body.requestType || "GENERAL").toUpperCase().slice(0, 60);
    const sourcePath = body.sourcePath?.trim() || null;
    const ua = req.headers.get("user-agent")?.slice(0, 400) || null;

    let referenceCode = publicReferenceCode();
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const row = await prisma.quoteRequest.create({
          data: {
            referenceCode,
            requestType,
            fullName: body.fullName,
            email: body.email.toLowerCase(),
            phone,
            companyName: body.companyName,
            jobTitle,
            interestedProducts: products,
            estimatedUsers: body.estimatedUsers,
            estimatedUsersOther:
              body.estimatedUsers === "OTHER" ? body.estimatedUsersOther ?? null : null,
            licenseType: body.licenseType,
            term: body.term,
            message,
            privacyAcceptedAt: new Date(),
            sourcePath,
            ipHash: hashIp(ip),
            userAgent: ua,
          },
          select: { referenceCode: true },
        });

        const settings = await readJsonFile("settings.json", defaultSettings);
        const to = settings.supportEmail || "support@keyon.vn";
        const usersLabel =
          body.estimatedUsers === "OTHER"
            ? `${body.estimatedUsersOther} người dùng`
            : ESTIMATED_USERS_LABEL[body.estimatedUsers];
        const productLine =
          products.length > 0
            ? products.map((p) => p.name).join(", ")
            : "—";

        const subject = `[KEYON Quote] ${row.referenceCode} — ${body.companyName}`;
        const text = [
          `Mã yêu cầu: ${row.referenceCode}`,
          `Loại: ${requestType}`,
          `Họ tên: ${body.fullName}`,
          `Email: ${body.email}`,
          `SĐT: ${phone}`,
          `Công ty: ${body.companyName}`,
          `Chức vụ: ${jobTitle || "—"}`,
          `Sản phẩm: ${productLine}`,
          `Quy mô: ${usersLabel}`,
          `License: ${LICENSE_TYPE_LABEL[body.licenseType]}`,
          `Thời hạn: ${TERM_LABEL[body.term]}`,
          `Nguồn: ${sourcePath || "—"}`,
          "",
          message || "(Không có mô tả thêm)",
        ].join("\n");

        const html = `
          <p><strong>Mã yêu cầu:</strong> ${escapeHtml(row.referenceCode)}</p>
          <p><strong>Loại:</strong> ${escapeHtml(requestType)}</p>
          <p><strong>Họ tên:</strong> ${escapeHtml(body.fullName)}</p>
          <p><strong>Email:</strong> ${escapeHtml(body.email)}</p>
          <p><strong>SĐT:</strong> ${escapeHtml(phone)}</p>
          <p><strong>Công ty:</strong> ${escapeHtml(body.companyName)}</p>
          <p><strong>Chức vụ:</strong> ${escapeHtml(jobTitle || "—")}</p>
          <p><strong>Sản phẩm:</strong> ${escapeHtml(productLine)}</p>
          <p><strong>Quy mô:</strong> ${escapeHtml(usersLabel)}</p>
          <p><strong>License:</strong> ${escapeHtml(LICENSE_TYPE_LABEL[body.licenseType])}</p>
          <p><strong>Thời hạn:</strong> ${escapeHtml(TERM_LABEL[body.term])}</p>
          <hr/>
          <p style="white-space:pre-wrap">${escapeHtml(message || "(Không có mô tả thêm)")}</p>
        `;

        try {
          await sendMail({
            to,
            subject,
            text,
            html,
            replyTo: body.email,
          });
        } catch (mailErr) {
          // Persist succeeded — do not fail the customer response on mail issues
          log.error(
            { err: mailErr instanceof Error ? mailErr.message : mailErr, referenceCode: row.referenceCode },
            "quote mail failed",
          );
        }

        log.info({ referenceCode: row.referenceCode, requestType }, "quote request created");
        return NextResponse.json({
          ok: true,
          referenceCode: row.referenceCode,
        });
      } catch (e) {
        const code = (e as { code?: string })?.code;
        if (code === "P2002") {
          referenceCode = publicReferenceCode();
          continue;
        }
        throw e;
      }
    }

    return NextResponse.json({ error: "Không tạo được mã yêu cầu. Thử lại." }, { status: 500 });
  } catch (e) {
    log.error({ err: e instanceof Error ? e.message : e }, "quote request failed");
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dữ liệu không hợp lệ", fields: fieldErrors(e) },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: "Gửi yêu cầu thất bại" }, { status: 400 });
  }
}
