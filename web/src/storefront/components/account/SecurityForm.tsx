"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { AccountCopy } from "@/storefront/lib/account-cms";
import {
  BADGE_CLASS,
  BODY_MUTED_CLASS,
  BREADCRUMB_CLASS,
  BREADCRUMB_CURRENT_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  CTA_COMPACT_CLASS,
  CTA_LABEL_CLASS,
  FORM_ERROR_CLASS,
  FORM_LABEL_CLASS,
  FORM_SUCCESS_CLASS,
  INPUT_TEXT_CLASS,
  PAGE_TITLE_CLASS,
  SECTION_LEAD_CLASS,
  SUBSECTION_TITLE_CLASS,
} from "@/storefront/typography";
import {
  CARD_PORTAL,
  CTA_PRIMARY_EFFECT,
  HOVER_LINK_ACCENT,
  HOVER_ROW,
  OPACITY_DISABLED_BUSY,
  TRANSITION_UI,
} from "@/storefront/effects";

const INPUT_CLASS = `mt-1 w-full rounded-xl border border-border px-3 py-2.5 ${INPUT_TEXT_CLASS}`;
const CARD = CARD_PORTAL;

type SessionRow = {
  id: string;
  deviceLabel: string;
  ip: string | null;
  lastSeenAt: string;
  createdAt: string;
  current: boolean;
};

type SecurityStatus = {
  totpEnabled: boolean;
  totpRequired: boolean;
  email: string;
  emailVerified: boolean;
  pendingEmail: string | null;
  passwordUpdatedAt: string;
};

export function SecurityForm({ cms }: { cms: AccountCopy }) {
  const [status, setStatus] = useState<SecurityStatus | null>(null);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [currentPassword, setCurrent] = useState("");
  const [newPassword, setNew] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pendingChangeEmail, setPendingChangeEmail] = useState("");
  const [otpauthUrl, setOtpauthUrl] = useState<string | null>(null);
  const [totpSecret, setTotpSecret] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [totpCode, setTotpCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null);
  const [disablePassword, setDisablePassword] = useState("");
  const [showManualSecret, setShowManualSecret] = useState(false);

  const refresh = useCallback(async () => {
    const [st, sess] = await Promise.all([
      fetch("/api/account/totp").then((r) => r.json()),
      fetch("/api/account/sessions").then((r) => r.json()),
    ]);
    if (st.email) setStatus(st);
    if (Array.isArray(sess.sessions)) setSessions(sess.sessions);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    if (newPassword !== confirm) {
      setErr("Mật khẩu mới không khớp");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/account/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lỗi");
      setMsg("Đã đổi mật khẩu thành công");
      setCurrent("");
      setNew("");
      setConfirm("");
      await refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  async function sendVerify(email?: string) {
    setLoading(true);
    setMsg(null);
    setErr(null);
    try {
      const res = await fetch("/api/account/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(email ? { email } : {}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lỗi");
      setMsg(
        data.alreadyVerified
          ? "Email đã được xác thực"
          : "Đã gửi email xác thực — kiểm tra hộp thư / Mailpit",
      );
      setPendingChangeEmail("");
      await refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  async function totpSetup() {
    setLoading(true);
    setErr(null);
    setMsg(null);
    setBackupCodes(null);
    try {
      const res = await fetch("/api/account/totp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "setup" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lỗi");
      setOtpauthUrl(data.otpauthUrl);
      setTotpSecret(data.secret);
      setQrDataUrl(data.qrDataUrl ?? null);
      setShowManualSecret(false);
      setMsg("Quét mã QR bằng Authenticator, rồi nhập mã 6 số để bật");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  async function totpEnable(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    setMsg(null);
    try {
      const res = await fetch("/api/account/totp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "enable", code: totpCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lỗi");
      setBackupCodes(data.backupCodes ?? []);
      setOtpauthUrl(null);
      setTotpSecret(null);
      setQrDataUrl(null);
      setTotpCode("");
      setMsg("Đã bật 2FA — lưu backup codes ở nơi an toàn");
      await refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  async function totpDisable(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    setMsg(null);
    try {
      const res = await fetch("/api/account/totp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "disable", password: disablePassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lỗi");
      setDisablePassword("");
      setMsg("Đã tắt 2FA");
      await refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  async function revokeSession(id: string) {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/account/sessions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lỗi");
      await refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  async function revokeOthers() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/account/sessions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lỗi");
      setMsg("Đã đăng xuất các phiên khác");
      await refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  function fmt(iso: string) {
    return new Date(iso).toLocaleString("vi-VN");
  }

  const emailOk = Boolean(status?.emailVerified);
  const totpOk = Boolean(status?.totpEnabled);
  const sessionCount = sessions.length;

  return (
    <div className="space-y-5">
      <nav className={`flex flex-wrap items-center gap-1.5 ${BREADCRUMB_CLASS}`}>
        <Link href="/account" className={HOVER_LINK_ACCENT}>
          Tài khoản
        </Link>
        <span aria-hidden>›</span>
        <Link href="/account/profile" className={HOVER_LINK_ACCENT}>
          Thông tin tài khoản
        </Link>
        <span aria-hidden>›</span>
        <span className={BREADCRUMB_CURRENT_CLASS}>{cms.securityTitle}</span>
      </nav>

      <div>
        <h1 className={PAGE_TITLE_CLASS}>{cms.securityTitle}</h1>
        <p className={`mt-1.5 ${SECTION_LEAD_CLASS}`}>{cms.securityLead}</p>
      </div>

      {/* Status strip */}
      <div className="grid gap-3 sm:grid-cols-3">
        <StatusTile
          label="Email"
          ok={emailOk}
          value={emailOk ? "Đã xác thực" : "Chưa xác thực"}
          href="#email"
        />
        <StatusTile
          label="2FA"
          ok={totpOk}
          value={totpOk ? "Đã bật" : "Chưa bật"}
          href="#2fa"
        />
        <StatusTile
          label="Phiên đăng nhập"
          ok={sessionCount > 0}
          value={sessionCount > 0 ? `${sessionCount} thiết bị` : "Chưa ghi nhận"}
          href="#sessions"
          neutral
        />
      </div>

      {msg ? <p className={FORM_SUCCESS_CLASS}>{msg}</p> : null}
      {err ? <p className={FORM_ERROR_CLASS}>{err}</p> : null}

      {!emailOk ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 sm:px-5">
          <p className={CARD_TITLE_CLASS}>Xác thực email để xem license</p>
          <p className={`mt-1 ${CARD_META_CLASS} !text-amber-900`}>
            Bạn vẫn mua và nhận giao hàng được. License bị khóa xem cho đến khi
            xác thực email.
          </p>
          <button
            type="button"
            disabled={loading}
            onClick={() => sendVerify()}
            className={`mt-3 inline-flex h-10 items-center rounded-xl bg-accent px-4 ${CTA_COMPACT_CLASS} text-white ${TRANSITION_UI} ${OPACITY_DISABLED_BUSY}`}
          >
            Gửi email xác thực
          </button>
        </div>
      ) : null}

      {/* Email */}
      <section id="email" className={`scroll-mt-28 ${CARD}`}>
        <div className="flex items-start gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
            <MailIcon />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className={SUBSECTION_TITLE_CLASS}>Email xác thực</h2>
            <p className={`mt-1 ${BODY_MUTED_CLASS}`}>
              Kênh nhận thông báo đơn hàng và mở khóa xem license.
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 ${BADGE_CLASS} ${
              emailOk
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-800"
            }`}
          >
            {emailOk ? "Đã xác thực" : "Chưa xác thực"}
          </span>
        </div>

        <div className="mt-4 rounded-xl bg-surface px-4 py-3">
          <p className={FORM_LABEL_CLASS}>Email hiện tại</p>
          <p className={`mt-0.5 break-all ${CARD_TITLE_CLASS}`}>
            {status?.email ?? "…"}
          </p>
          {status?.pendingEmail ? (
            <p className={`mt-2 ${CARD_META_CLASS}`}>
              Đang chờ xác thực đổi sang:{" "}
              <span className="font-semibold text-navy">{status.pendingEmail}</span>
            </p>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {!emailOk ? (
            <button
              type="button"
              disabled={loading}
              onClick={() => sendVerify()}
              className={`inline-flex h-10 items-center rounded-xl bg-accent px-4 ${CTA_COMPACT_CLASS} text-white ${TRANSITION_UI} ${OPACITY_DISABLED_BUSY}`}
            >
              Gửi lại email xác thực
            </button>
          ) : null}
        </div>

        <div className="mt-4 border-t border-border pt-4">
          <p className={FORM_LABEL_CLASS}>Đổi email</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_auto]">
            <input
              type="email"
              placeholder="email-moi@example.com"
              className={`rounded-xl border border-border px-3 py-2.5 ${INPUT_TEXT_CLASS}`}
              value={pendingChangeEmail}
              onChange={(e) => setPendingChangeEmail(e.target.value)}
            />
            <button
              type="button"
              disabled={loading || !pendingChangeEmail.trim()}
              onClick={() => sendVerify(pendingChangeEmail.trim())}
              className={`inline-flex h-11 items-center justify-center rounded-xl border border-border px-4 ${CTA_COMPACT_CLASS} text-navy ${TRANSITION_UI} hover:border-accent ${OPACITY_DISABLED_BUSY}`}
            >
              Đổi & gửi xác thực
            </button>
          </div>
        </div>
      </section>

      {/* Password */}
      <section id="password" className={`scroll-mt-28 ${CARD}`}>
        <div className="flex items-start gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
            <LockIcon />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className={SUBSECTION_TITLE_CLASS}>Mật khẩu</h2>
            {status?.passwordUpdatedAt ? (
              <p className={`mt-1 ${CARD_META_CLASS}`}>
                Cập nhật lần cuối: {fmt(status.passwordUpdatedAt)}
              </p>
            ) : null}
          </div>
        </div>
        <form onSubmit={changePassword} className="mt-4 space-y-4">
          <label className="block">
            <span className={FORM_LABEL_CLASS}>Mật khẩu hiện tại</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              className={INPUT_CLASS}
              value={currentPassword}
              onChange={(e) => setCurrent(e.target.value)}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={FORM_LABEL_CLASS}>Mật khẩu mới</span>
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className={INPUT_CLASS}
                value={newPassword}
                onChange={(e) => setNew(e.target.value)}
              />
            </label>
            <label className="block">
              <span className={FORM_LABEL_CLASS}>Nhập lại mật khẩu mới</span>
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className={INPUT_CLASS}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`inline-flex h-11 items-center rounded-xl bg-navy px-5 ${CTA_LABEL_CLASS} text-white ${CTA_PRIMARY_EFFECT} ${OPACITY_DISABLED_BUSY}`}
          >
            Đổi mật khẩu
          </button>
        </form>
      </section>

      {/* Sessions */}
      <section id="sessions" className={`scroll-mt-28 ${CARD}`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
              <DevicesIcon />
            </span>
            <div>
              <h2 className={SUBSECTION_TITLE_CLASS}>Phiên đăng nhập</h2>
              <p className={`mt-1 ${BODY_MUTED_CLASS}`}>
                Thiết bị đang dùng tài khoản KEYON của bạn.
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={loading || sessions.length <= 1}
            onClick={revokeOthers}
            className={`rounded-lg border border-border px-3 py-1.5 ${CTA_COMPACT_CLASS} text-navy ${TRANSITION_UI} hover:border-accent ${OPACITY_DISABLED_BUSY}`}
          >
            Đăng xuất thiết bị khác
          </button>
        </div>
        <ul className="mt-4 space-y-1">
          {sessions.length === 0 ? (
            <li className={`rounded-xl bg-surface px-4 py-3 ${BODY_MUTED_CLASS}`}>
              Chưa có phiên được ghi nhận — đăng xuất rồi đăng nhập lại để bắt đầu
              theo dõi thiết bị.
            </li>
          ) : (
            sessions.map((s) => (
              <li
                key={s.id}
                className={`flex flex-wrap items-center justify-between gap-2 rounded-xl px-3 py-3 ${TRANSITION_UI} ${HOVER_ROW}`}
              >
                <div className="min-w-0">
                  <p className={CARD_TITLE_CLASS}>
                    {s.deviceLabel}
                    {s.current ? (
                      <span className="ml-2 rounded-full bg-accent-soft px-2 py-0.5 text-xs font-semibold text-accent">
                        Hiện tại
                      </span>
                    ) : null}
                  </p>
                  <p className={CARD_META_CLASS}>
                    {s.ip ?? "IP ẩn"} · {fmt(s.lastSeenAt)}
                  </p>
                </div>
                {!s.current ? (
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => revokeSession(s.id)}
                    className={`rounded-lg border border-border px-3 py-1.5 ${CTA_COMPACT_CLASS} text-danger ${TRANSITION_UI} hover:bg-rose-50 ${OPACITY_DISABLED_BUSY}`}
                  >
                    Đăng xuất
                  </button>
                ) : null}
              </li>
            ))
          )}
        </ul>
      </section>

      {/* 2FA */}
      <section id="2fa" className={`scroll-mt-28 ${CARD}`}>
        <div className="flex items-start gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
            <ShieldIcon />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className={SUBSECTION_TITLE_CLASS}>Xác thực hai bước (2FA)</h2>
            <p className={`mt-1 ${BODY_MUTED_CLASS}`}>
              Google / Microsoft Authenticator hoặc 2FAS.{" "}
              {status?.totpRequired
                ? "Vai trò của bạn bắt buộc bật 2FA."
                : "Khuyến khích bật để bảo vệ tài khoản."}
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 ${BADGE_CLASS} ${
              totpOk
                ? "bg-emerald-50 text-emerald-700"
                : "bg-surface text-muted"
            }`}
          >
            {totpOk ? "Đã bật" : "Chưa bật"}
          </span>
        </div>

        {!totpOk ? (
          <div className="mt-4 space-y-4">
            {!otpauthUrl ? (
              <button
                type="button"
                disabled={loading}
                onClick={totpSetup}
                className={`inline-flex h-11 items-center rounded-xl bg-accent px-5 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} ${OPACITY_DISABLED_BUSY}`}
              >
                Bắt đầu thiết lập 2FA
              </button>
            ) : (
              <form onSubmit={totpEnable} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-start">
                  <div className="mx-auto w-fit rounded-2xl border border-border bg-white p-3 shadow-sm sm:mx-0">
                    {qrDataUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={qrDataUrl}
                        alt="QR mã thiết lập 2FA KEYON"
                        width={220}
                        height={220}
                        className="block h-[220px] w-[220px]"
                      />
                    ) : (
                      <div className="flex h-[220px] w-[220px] items-center justify-center bg-surface text-sm text-muted">
                        Đang tạo QR…
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 space-y-3">
                    <p className={CARD_TITLE_CLASS}>Quét mã bằng app Authenticator</p>
                    <ol className={`list-decimal space-y-1.5 pl-4 ${BODY_MUTED_CLASS}`}>
                      <li>Mở Google / Microsoft Authenticator hoặc 2FAS</li>
                      <li>Chọn thêm tài khoản → quét mã QR</li>
                      <li>Nhập mã 6 số hiện trên app vào ô bên dưới</li>
                    </ol>
                    <button
                      type="button"
                      onClick={() => setShowManualSecret((v) => !v)}
                      className={`text-left ${CTA_COMPACT_CLASS} text-accent ${TRANSITION_UI} hover:underline`}
                    >
                      {showManualSecret
                        ? "Ẩn nhập thủ công"
                        : "Không quét được? Nhập secret thủ công"}
                    </button>
                    {showManualSecret ? (
                      <div className="rounded-xl border border-border bg-surface px-4 py-3">
                        <p className={FORM_LABEL_CLASS}>Secret (dán vào app)</p>
                        <p className="mt-1 break-all font-mono text-sm font-semibold tracking-wide text-navy">
                          {totpSecret}
                        </p>
                        <p className={`mt-2 ${CARD_META_CLASS}`}>
                          Trong app chọn “Nhập khóa thiết lập” / “Enter a setup
                          key”, rồi dán secret trên — không cần dán đường dẫn
                          otpauth.
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
                <label className="block max-w-sm">
                  <span className={FORM_LABEL_CLASS}>Mã 6 số từ app</span>
                  <input
                    className={INPUT_CLASS}
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value)}
                    inputMode="numeric"
                    required
                    pattern="\d{6}"
                    autoComplete="one-time-code"
                    placeholder="000000"
                  />
                </label>
                <button
                  type="submit"
                  disabled={loading}
                  className={`inline-flex h-11 items-center rounded-xl bg-navy px-5 ${CTA_LABEL_CLASS} text-white ${CTA_PRIMARY_EFFECT} ${OPACITY_DISABLED_BUSY}`}
                >
                  Xác nhận & bật 2FA
                </button>
              </form>
            )}
          </div>
        ) : !status?.totpRequired ? (
          <form onSubmit={totpDisable} className="mt-4 space-y-3">
            <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
              <label className="block">
                <span className={FORM_LABEL_CLASS}>Mật khẩu để tắt 2FA</span>
                <input
                  type="password"
                  required
                  className={INPUT_CLASS}
                  value={disablePassword}
                  onChange={(e) => setDisablePassword(e.target.value)}
                />
              </label>
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex h-11 items-center justify-center rounded-xl border border-border px-4 ${CTA_COMPACT_CLASS} text-danger ${TRANSITION_UI} hover:bg-rose-50 ${OPACITY_DISABLED_BUSY}`}
              >
                Tắt 2FA
              </button>
            </div>
          </form>
        ) : (
          <p className={`mt-4 ${BODY_MUTED_CLASS}`}>
            Không thể tắt 2FA với vai trò hiện tại.
          </p>
        )}

        {backupCodes ? (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className={CARD_TITLE_CLASS}>Backup codes (chỉ hiện một lần)</p>
            <p className={`mt-1 ${CARD_META_CLASS} !text-amber-900`}>
              Lưu lại ngay — mỗi mã dùng một lần khi mất app Authenticator.
            </p>
            <ul className="mt-3 grid gap-1 font-mono text-sm font-semibold text-navy sm:grid-cols-2">
              {backupCodes.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function StatusTile({
  label,
  value,
  ok,
  href,
  neutral,
}: {
  label: string;
  value: string;
  ok: boolean;
  href: string;
  neutral?: boolean;
}) {
  const tone = neutral
    ? "border-border bg-white"
    : ok
      ? "border-emerald-200 bg-emerald-50"
      : "border-amber-200 bg-amber-50";
  return (
    <a
      href={href}
      className={`rounded-2xl border px-4 py-3 ${tone} ${TRANSITION_UI} hover:border-accent`}
    >
      <p className={FORM_LABEL_CLASS}>{label}</p>
      <p className={`mt-1 ${CARD_TITLE_CLASS}`}>{value}</p>
    </a>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3 4.5 6v5.5c0 4.5 3.2 7.8 7.5 9 4.3-1.2 7.5-4.5 7.5-9V6L12 3Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DevicesIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3.5" y="4.5" width="17" height="12" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M8 20h8M12 16.5V20" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
