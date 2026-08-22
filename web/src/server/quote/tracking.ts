import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { createHash, randomInt } from "node:crypto";
import type { QuoteRequestStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { childLogger } from "@/lib/logger";
import {
  QUOTE_REQUEST_STATUS_LABEL,
  quoteRequestTypeLabel,
} from "@/lib/admin-quote-requests";
import {
  ESTIMATED_USERS_LABEL,
  LICENSE_TYPE_LABEL,
  TERM_LABEL,
} from "@/lib/quote";
import { loadSiteSettings } from "@/server/seo/settings";
import { defaultCmsContact, defaultSettings, readJsonFile } from "@/server/cms/store";
import { sendMail } from "@/server/mail";
import { getRedisConnection } from "@/server/queue";

const log = childLogger("quote-track");
const COOKIE = "keyon_quote_track";
const OTP_TTL_SEC = 600;
const SESSION_MAX_AGE_SEC = 60 * 60;

const REF_PATTERN = /^QT-[A-Z0-9]{4,12}$/i;

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) throw new Error("SESSION_SECRET missing");
  return new TextEncoder().encode(s);
}

function normEmail(email: string) {
  return email.trim().toLowerCase();
}

function normRef(ref: string) {
  return ref.trim().toUpperCase();
}

function otpKey(referenceCode: string, email: string) {
  const hash = createHash("sha256")
    .update(`${referenceCode}:${email}`)
    .digest("hex")
    .slice(0, 32);
  return `quote:track:otp:${hash}`;
}

function generateOtp() {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

export async function isQuotePublicTrackingEnabled(): Promise<boolean> {
  if (process.env.QUOTE_PUBLIC_TRACKING === "true") return true;
  if (process.env.QUOTE_PUBLIC_TRACKING === "false") return false;
  const settings = await loadSiteSettings();
  return Boolean(settings.quotePublicTrackingEnabled);
}

export function parseQuoteReferenceCode(raw: string): string | null {
  const ref = normRef(raw);
  return REF_PATTERN.test(ref) ? ref : null;
}

export type QuoteTrackPublicView = {
  referenceCode: string;
  status: QuoteRequestStatus;
  statusLabel: string;
  requestTypeLabel: string;
  companyName: string;
  estimatedUsersLabel: string;
  licenseTypeLabel: string;
  termLabel: string;
  productSummary: string;
  createdAt: string;
  updatedAt: string;
};

function productSummary(raw: unknown): string {
  if (!Array.isArray(raw) || raw.length === 0) return "—";
  const names = raw
    .map((p) =>
      p && typeof p === "object" && typeof (p as { name?: unknown }).name === "string"
        ? (p as { name: string }).name.trim()
        : "",
    )
    .filter(Boolean);
  if (names.length === 0) return "—";
  if (names.length <= 3) return names.join(", ");
  return `${names.slice(0, 3).join(", ")} +${names.length - 3}`;
}

function toPublicView(row: {
  referenceCode: string;
  status: QuoteRequestStatus;
  requestType: string;
  companyName: string;
  estimatedUsers: string;
  estimatedUsersOther: number | null;
  licenseType: string;
  term: string;
  interestedProducts: unknown;
  createdAt: Date;
  updatedAt: Date;
}): QuoteTrackPublicView {
  const usersKey = row.estimatedUsers as keyof typeof ESTIMATED_USERS_LABEL;
  const estimatedUsersLabel =
    row.estimatedUsers === "OTHER" && row.estimatedUsersOther != null
      ? `${row.estimatedUsersOther.toLocaleString("vi-VN")} người dùng`
      : ESTIMATED_USERS_LABEL[usersKey] ?? row.estimatedUsers;

  const licenseKey = row.licenseType as keyof typeof LICENSE_TYPE_LABEL;
  const termKey = row.term as keyof typeof TERM_LABEL;

  return {
    referenceCode: row.referenceCode,
    status: row.status,
    statusLabel: QUOTE_REQUEST_STATUS_LABEL[row.status],
    requestTypeLabel: quoteRequestTypeLabel(row.requestType),
    companyName: row.companyName,
    estimatedUsersLabel,
    licenseTypeLabel: LICENSE_TYPE_LABEL[licenseKey] ?? row.licenseType,
    termLabel: TERM_LABEL[termKey] ?? row.term,
    productSummary: productSummary(row.interestedProducts),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

async function findQuoteForGuest(referenceCode: string, email: string) {
  return prisma.quoteRequest.findFirst({
    where: {
      referenceCode,
      email: normEmail(email),
      status: { not: "SPAM" },
    },
    select: {
      referenceCode: true,
      status: true,
      requestType: true,
      companyName: true,
      estimatedUsers: true,
      estimatedUsersOther: true,
      licenseType: true,
      term: true,
      interestedProducts: true,
      createdAt: true,
      updatedAt: true,
      fullName: true,
    },
  });
}

export async function requestQuoteTrackOtp(input: {
  referenceCode: string;
  email: string;
  ip: string;
}): Promise<{ ok: true }> {
  const enabled = await isQuotePublicTrackingEnabled();
  if (!enabled) {
    return { ok: true };
  }

  const ref = parseQuoteReferenceCode(input.referenceCode);
  const email = normEmail(input.email);
  if (!ref || !email.includes("@")) {
    return { ok: true };
  }

  const rlIp = rateLimit(`quote-track-otp:ip:${input.ip}`, 12, 60 * 60_000);
  const rlEmail = rateLimit(`quote-track-otp:email:${email}`, 5, 60 * 60_000);
  if (!rlIp.ok || !rlEmail.ok) {
    return { ok: true };
  }

  const row = await findQuoteForGuest(ref, email);
  if (!row) {
    return { ok: true };
  }

  const code = generateOtp();
  const redis = getRedisConnection();
  await redis.set(otpKey(ref, email), code, "EX", OTP_TTL_SEC);

  const [settings, contact] = await Promise.all([
    readJsonFile("settings.json", defaultSettings),
    readJsonFile("contact-page.json", defaultCmsContact),
  ]);
  const siteName = settings.siteName?.trim() || "KEYON";
  const supportEmail = settings.supportEmail || contact.emailValue || "support@keyon.vn";
  const firstName = row.fullName.trim().split(/\s+/)[0] || row.fullName;

  const subject = `[${siteName}] Mã xác minh tra cứu ${ref}`;
  const text = [
    `Chào ${firstName},`,
    "",
    `Mã xác minh tra cứu yêu cầu báo giá ${ref}: ${code}`,
    "",
    `Mã có hiệu lực ${OTP_TTL_SEC / 60} phút. Không chia sẻ mã cho người khác.`,
    "",
    `Nếu bạn không yêu cầu, hãy bỏ qua email này hoặc liên hệ ${supportEmail}.`,
  ].join("\n");

  const html = `
    <p>Chào ${firstName},</p>
    <p>Mã xác minh tra cứu yêu cầu báo giá <strong>${ref}</strong>:</p>
    <p style="font-size:28px;font-weight:700;letter-spacing:4px">${code}</p>
    <p>Mã có hiệu lực ${OTP_TTL_SEC / 60} phút. Không chia sẻ mã cho người khác.</p>
    <p>Nếu bạn không yêu cầu, hãy bỏ qua email này hoặc liên hệ <a href="mailto:${supportEmail}">${supportEmail}</a>.</p>
  `;

  try {
    await sendMail({
      to: email,
      subject,
      text,
      html,
      replyTo: supportEmail,
    });
  } catch (e) {
    log.error(
      { err: e instanceof Error ? e.message : e, ref },
      "quote track otp mail failed",
    );
  }

  return { ok: true };
}

export async function verifyQuoteTrackOtp(input: {
  referenceCode: string;
  email: string;
  code: string;
  ip: string;
}): Promise<{ ok: boolean; quote?: QuoteTrackPublicView; error?: string }> {
  const enabled = await isQuotePublicTrackingEnabled();
  if (!enabled) {
    return { ok: false, error: "Tính năng tra cứu chưa được bật" };
  }

  const ref = parseQuoteReferenceCode(input.referenceCode);
  const email = normEmail(input.email);
  const code = input.code.trim();
  if (!ref || !email.includes("@") || !/^\d{6}$/.test(code)) {
    return { ok: false, error: "Thông tin không hợp lệ" };
  }

  const rl = rateLimit(`quote-track-verify:${input.ip}`, 20, 60 * 60_000);
  if (!rl.ok) {
    return { ok: false, error: "Quá nhiều lần thử. Thử lại sau." };
  }

  const redis = getRedisConnection();
  const stored = await redis.get(otpKey(ref, email));
  if (!stored || stored !== code) {
    return { ok: false, error: "Mã xác minh không đúng hoặc đã hết hạn" };
  }

  const row = await findQuoteForGuest(ref, email);
  if (!row) {
    return { ok: false, error: "Không tìm thấy yêu cầu" };
  }

  await redis.del(otpKey(ref, email));
  const token = await createQuoteTrackToken(ref, email);
  await setQuoteTrackCookie(token);

  return { ok: true, quote: toPublicView(row) };
}

export async function createQuoteTrackToken(referenceCode: string, email: string) {
  return new SignJWT({
    ref: referenceCode,
    email: normEmail(email),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SEC}s`)
    .sign(secret());
}

export async function setQuoteTrackCookie(token: string) {
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SEC,
  });
}

export async function readQuoteTrackSession(): Promise<{
  referenceCode: string;
  email: string;
} | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    const ref =
      typeof payload.ref === "string" ? normRef(payload.ref) : null;
    const email =
      typeof payload.email === "string" ? normEmail(payload.email) : null;
    if (!ref || !email) return null;
    return { referenceCode: ref, email };
  } catch {
    return null;
  }
}

export async function getQuoteTrackStatusForSession(): Promise<QuoteTrackPublicView | null> {
  const session = await readQuoteTrackSession();
  if (!session) return null;

  const row = await findQuoteForGuest(session.referenceCode, session.email);
  if (!row) return null;
  return toPublicView(row);
}

export function quoteTrackStatusPath(referenceCode?: string) {
  const base = "/contact/quote/status";
  if (!referenceCode) return base;
  return `${base}?ref=${encodeURIComponent(referenceCode)}`;
}
