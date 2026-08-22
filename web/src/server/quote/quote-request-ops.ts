import "server-only";

import type { QuoteRequestStatus } from "@prisma/client";
import { childLogger } from "@/lib/logger";
import { prisma } from "@/lib/db";
import { QUOTE_REQUEST_STATUS_LABEL } from "@/lib/admin-quote-requests";
import { defaultCmsContact, defaultSettings, readJsonFile } from "@/server/cms/store";
import { sendMail } from "@/server/mail";

const log = childLogger("quote-ops");

function siteBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    process.env.APP_URL?.replace(/\/$/, "") ||
    "https://keyon.vn"
  );
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function contactContext() {
  const [settings, contact] = await Promise.all([
    readJsonFile("settings.json", defaultSettings),
    readJsonFile("contact-page.json", defaultCmsContact),
  ]);
  const supportEmail = settings.supportEmail || contact.emailValue || "support@keyon.vn";
  const hotline = contact.hotlineValue?.trim() || "0962288857";
  const hours = contact.hoursValue?.trim() || "Thứ 2 – Thứ 7: 8:00 – 18:00";
  const siteName = settings.siteName?.trim() || "KEYON";
  return { supportEmail, hotline, hours, siteName };
}

function mailShell(params: {
  title: string;
  greeting: string;
  bodyHtml: string;
  referenceCode: string;
  supportEmail: string;
  hotline: string;
  hours: string;
  siteName: string;
}) {
  const { title, greeting, bodyHtml, referenceCode, supportEmail, hotline, hours, siteName } =
    params;
  return `
    <div style="font-family:system-ui,sans-serif;max-width:560px;color:#0f172a">
      <p style="font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:.04em">${escapeHtml(siteName)}</p>
      <h1 style="font-size:20px;margin:8px 0 16px">${escapeHtml(title)}</h1>
      <p>${escapeHtml(greeting)}</p>
      ${bodyHtml}
      <p style="margin-top:20px;padding:12px;background:#f8fafc;border-radius:8px;font-size:14px">
        <strong>Mã yêu cầu:</strong> ${escapeHtml(referenceCode)}<br/>
        <strong>Hotline:</strong> ${escapeHtml(hotline)}<br/>
        <strong>Email:</strong> <a href="mailto:${escapeHtml(supportEmail)}">${escapeHtml(supportEmail)}</a><br/>
        <strong>Giờ làm việc:</strong> ${escapeHtml(hours)}
      </p>
      <p style="font-size:12px;color:#64748b;margin-top:24px">
        Trân trọng,<br/>Đội ngũ ${escapeHtml(siteName)}
      </p>
    </div>
  `;
}

export async function sendQuoteConfirmationEmail(input: {
  referenceCode: string;
  fullName: string;
  email: string;
  companyName: string;
  hasPortalTicket: boolean;
}) {
  const ctx = await contactContext();
  const firstName = input.fullName.trim().split(/\s+/)[0] || input.fullName;
  const ticketLine = input.hasPortalTicket
    ? `<p>Bạn có thể theo dõi trong <a href="${siteBaseUrl()}/account/tickets">Tài khoản KEYON → Hỗ trợ</a>.</p>`
    : "";

  const subject = `[${ctx.siteName}] Đã nhận yêu cầu báo giá ${input.referenceCode}`;
  const text = [
    `Chào ${firstName},`,
    "",
    `${ctx.siteName} đã nhận yêu cầu báo giá cho ${input.companyName}.`,
    `Mã tham chiếu: ${input.referenceCode}`,
    "",
    "Bộ phận kinh doanh sẽ liên hệ trong 1 ngày làm việc để làm rõ nhu cầu.",
    "Báo giá chi tiết dự kiến trong 1–3 ngày làm việc (tùy độ phức tạp).",
    "",
    `Hotline: ${ctx.hotline}`,
    `Email: ${ctx.supportEmail}`,
    `Giờ làm việc: ${ctx.hours}`,
  ].join("\n");

  const html = mailShell({
    ...ctx,
    title: "Yêu cầu báo giá đã được tiếp nhận",
    greeting: `Chào ${firstName},`,
    referenceCode: input.referenceCode,
    bodyHtml: `
      <p>${ctx.siteName} đã nhận yêu cầu báo giá cho <strong>${escapeHtml(input.companyName)}</strong>.</p>
      <p>Chúng tôi sẽ liên hệ qua email hoặc số điện thoại bạn đã cung cấp trong <strong>1 ngày làm việc</strong> để làm rõ nhu cầu. Báo giá chi tiết dự kiến trong <strong>1–3 ngày làm việc</strong>.</p>
      ${ticketLine}
    `,
  });

  await sendMail({
    to: input.email,
    subject,
    text,
    html,
    replyTo: ctx.supportEmail,
  });
}

export async function sendQuoteStatusEmail(input: {
  referenceCode: string;
  fullName: string;
  email: string;
  companyName: string;
  status: QuoteRequestStatus;
}) {
  if (input.status === "SPAM" || input.status === "NEW") return;

  const ctx = await contactContext();
  const firstName = input.fullName.trim().split(/\s+/)[0] || input.fullName;
  const statusLabel = QUOTE_REQUEST_STATUS_LABEL[input.status];

  let detail = "";
  if (input.status === "IN_REVIEW") {
    detail =
      "Yêu cầu của bạn đang được bộ phận kinh doanh xử lý. Chúng tôi có thể liên hệ thêm để làm rõ nhu cầu.";
  } else if (input.status === "QUOTED") {
    detail =
      "Bộ phận kinh doanh đã hoàn tất báo giá hoặc sẽ gửi chi tiết qua email/điện thoại trong thời gian sớm nhất. Vui lòng kiểm tra hộp thư (kể cả thư rác).";
  } else if (input.status === "CLOSED") {
    detail =
      "Yêu cầu báo giá này đã được đóng trên hệ thống KEYON. Nếu bạn cần hỗ trợ thêm, vui lòng liên hệ hotline hoặc gửi yêu cầu mới.";
  }

  const subject = `[${ctx.siteName}] ${input.referenceCode} — ${statusLabel}`;
  const text = [
    `Chào ${firstName},`,
    "",
    `Trạng thái yêu cầu báo giá ${input.referenceCode} (${input.companyName}): ${statusLabel}.`,
    detail,
    "",
    `Hotline: ${ctx.hotline} · ${ctx.supportEmail}`,
  ].join("\n");

  const html = mailShell({
    ...ctx,
    title: `Cập nhật yêu cầu báo giá — ${statusLabel}`,
    greeting: `Chào ${firstName},`,
    referenceCode: input.referenceCode,
    bodyHtml: `
      <p>Trạng thái yêu cầu báo giá cho <strong>${escapeHtml(input.companyName)}</strong>: <strong>${escapeHtml(statusLabel)}</strong>.</p>
      <p>${escapeHtml(detail)}</p>
    `,
  });

  await sendMail({
    to: input.email,
    subject,
    text,
    html,
    replyTo: ctx.supportEmail,
  });
}

export async function maybeLinkQuoteSupportTicket(input: {
  quoteRequestId: string;
  referenceCode: string;
  email: string;
  companyName: string;
  message: string | null;
}): Promise<{ ticketId: string | null }> {
  const user = await prisma.user.findFirst({
    where: {
      email: input.email.toLowerCase(),
      role: "CUSTOMER",
      disabledAt: null,
    },
    select: { id: true },
  });
  if (!user) return { ticketId: null };

  const existing = await prisma.quoteRequest.findUnique({
    where: { id: input.quoteRequestId },
    select: { supportTicketId: true },
  });
  if (existing?.supportTicketId) {
    return { ticketId: existing.supportTicketId };
  }

  const bodyLines = [
    `Yêu cầu báo giá doanh nghiệp ${input.referenceCode} cho ${input.companyName}.`,
    "",
    "KEYON sẽ liên hệ qua email/điện thoại đã cung cấp.",
    input.message?.trim() ? `\nGhi chú khách:\n${input.message.trim()}` : "",
  ].filter(Boolean);

  const ticket = await prisma.supportTicket.create({
    data: {
      userId: user.id,
      subject: `Báo giá ${input.referenceCode} — ${input.companyName}`,
      body: bodyLines.join("\n"),
      status: "OPEN",
    },
    select: { id: true },
  });

  await prisma.quoteRequest.update({
    where: { id: input.quoteRequestId },
    data: { supportTicketId: ticket.id },
  });

  await prisma.userNotification.create({
    data: {
      userId: user.id,
      title: `Yêu cầu báo giá ${input.referenceCode}`,
      body: "KEYON đã nhận yêu cầu báo giá của bạn. Bộ phận kinh doanh sẽ liên hệ trong 1 ngày làm việc.",
      href: "/account/tickets",
    },
  });

  log.info(
    { quoteRequestId: input.quoteRequestId, ticketId: ticket.id },
    "quote linked support ticket",
  );
  return { ticketId: ticket.id };
}

export async function runQuoteRequestFollowUp(input: {
  quoteRequestId: string;
  referenceCode: string;
  fullName: string;
  email: string;
  companyName: string;
  message: string | null;
}) {
  let hasPortalTicket = false;
  try {
    const linked = await maybeLinkQuoteSupportTicket(input);
    hasPortalTicket = linked.ticketId != null;
  } catch (e) {
    log.error(
      { err: e instanceof Error ? e.message : e, referenceCode: input.referenceCode },
      "quote ticket link failed",
    );
  }

  try {
    await sendQuoteConfirmationEmail({
      referenceCode: input.referenceCode,
      fullName: input.fullName,
      email: input.email,
      companyName: input.companyName,
      hasPortalTicket,
    });
  } catch (e) {
    log.error(
      { err: e instanceof Error ? e.message : e, referenceCode: input.referenceCode },
      "quote confirmation mail failed",
    );
  }
}
