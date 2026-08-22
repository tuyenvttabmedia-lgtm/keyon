"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  staffRoleHint,
  staffRoleLabel,
  type StaffRole,
} from "@/lib/admin-users";
import { BADGE_CLASS } from "@/storefront/typography";
import { UserForm } from "./user-form";

export type UserDetailData = {
  id: string;
  email: string;
  name: string | null;
  role: StaffRole;
  totpEnabled: boolean;
  emailVerified: boolean;
  disabled: boolean;
  createdAt: string;
  passwordChangedAt: string | null;
  lastSeenAt: string | null;
  activeSessionCount: number;
  isSelf: boolean;
};

type SessionRow = {
  id: string;
  deviceLabel: string | null;
  ip: string | null;
  createdAt: string;
  lastSeenAt: string;
};

function formatVi(iso: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("vi-VN", {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return "—";
  }
}

export function UserDetail({
  user,
  canManage,
}: {
  user: UserDetailData;
  canManage: boolean;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"overview" | "edit">("overview");
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);

  const loadSessions = useCallback(async () => {
    if (!canManage) return;
    const res = await fetch(`/api/admin/users/${user.id}/sessions`);
    const data = await res.json();
    if (res.ok) setSessions(data.sessions ?? []);
  }, [canManage, user.id]);

  useEffect(() => {
    void loadSessions();
  }, [loadSessions]);

  useEffect(() => {
    try {
      const key = `keyon.staffReset.${user.id}`;
      const url = sessionStorage.getItem(key);
      if (url) {
        setDevResetUrl(url);
        setMsg("Đã tạo nhân viên. Dùng link đặt mật khẩu bên dưới (dev) hoặc kiểm tra email.");
        sessionStorage.removeItem(key);
      }
    } catch {
      /* ignore */
    }
  }, [user.id]);

  async function setDisabled(disabled: boolean) {
    if (disabled) {
      const ok = window.confirm(
        "Khóa tài khoản?\n\nNhân viên sẽ không thể đăng nhập hoặc tiếp tục sử dụng trang quản trị.",
      );
      if (!ok) return;
    }
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disabled }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Thao tác thất bại");
      setMsg(disabled ? "Đã khóa tài khoản." : "Đã mở khóa tài khoản.");
      router.refresh();
      void loadSessions();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setBusy(false);
    }
  }

  async function requestPasswordReset() {
    setBusy(true);
    setMsg(null);
    setDevResetUrl(null);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "password_reset" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Không gửi được");
      setMsg(data.message ?? "Đã gửi yêu cầu đặt lại mật khẩu.");
      if (data.resetUrl) setDevResetUrl(data.resetUrl as string);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setBusy(false);
    }
  }

  async function revokeSession(sessionId: string) {
    if (!window.confirm("Đăng xuất phiên này?")) return;
    setBusy(true);
    try {
      const res = await fetch(
        `/api/admin/users/${user.id}/sessions?sessionId=${encodeURIComponent(sessionId)}`,
        { method: "DELETE" },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lỗi");
      await loadSessions();
      router.refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setBusy(false);
    }
  }

  async function revokeAll() {
    if (!window.confirm("Đăng xuất tất cả phiên của nhân viên này?")) return;
    setBusy(true);
    try {
      const res = await fetch(
        `/api/admin/users/${user.id}/sessions?all=1`,
        { method: "DELETE" },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lỗi");
      await loadSessions();
      router.refresh();
      setMsg("Đã đăng xuất tất cả phiên.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setBusy(false);
    }
  }

  const tabs: { id: "overview" | "edit"; label: string; show: boolean }[] = [
    { id: "overview", label: "Tổng quan", show: true },
    { id: "edit", label: "Sửa", show: canManage },
  ];

  return (
    <div className="space-y-4">
      <div>
        <Link
          href="/admin/users"
          className="text-sm font-medium text-accent hover:underline"
        >
          ← Người dùng
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold text-navy">
            {user.name?.trim() || user.email}
          </h1>
          <span
            className={`rounded-full bg-navy-soft px-2.5 py-0.5 text-navy ${BADGE_CLASS}`}
          >
            {staffRoleLabel(user.role)}
          </span>
          {user.disabled ? (
            <span className={`rounded-full bg-red-50 px-2.5 py-0.5 text-red-700 ${BADGE_CLASS}`}>
              Đã khóa
            </span>
          ) : (
            <span className={`rounded-full bg-emerald-50 px-2.5 py-0.5 text-emerald-800 ${BADGE_CLASS}`}>
              Hoạt động
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-muted">
          {user.email} · {staffRoleHint(user.role)}
        </p>
        {user.role === "ADMIN" && !user.totpEnabled ? (
          <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            Khuyến nghị bật 2FA cho tài khoản quản trị.{" "}
            {user.isSelf ? (
              <Link href="/account/security" className="font-medium underline">
                Thiết lập 2FA
              </Link>
            ) : (
              "Nhân viên tự bật trong Bảo mật tài khoản."
            )}
          </p>
        ) : null}
      </div>

      <div className="flex gap-1 border-b border-border">
        {tabs
          .filter((t) => t.show)
          .map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={
                tab === t.id
                  ? "border-b-2 border-accent px-3 py-2 text-sm font-semibold text-accent"
                  : "px-3 py-2 text-sm font-medium text-muted hover:text-navy"
              }
            >
              {t.label}
            </button>
          ))}
      </div>

      {msg ? (
        <p
          className={`text-sm ${
            msg.includes("Lỗi") || msg.includes("thất bại") || msg.startsWith("Không")
              ? "text-red-600"
              : "text-emerald-700"
          }`}
        >
          {msg}
        </p>
      ) : null}
      {devResetUrl ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          Dev — link đặt mật khẩu:{" "}
          <a className="font-medium underline" href={devResetUrl}>
            {devResetUrl}
          </a>
        </p>
      ) : null}

      {tab === "overview" ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-navy">Thông tin</h2>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted">Họ tên</dt>
                <dd className="text-sm text-navy">{user.name?.trim() || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Email</dt>
                <dd className="text-sm text-navy">{user.email}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Vai trò</dt>
                <dd className="text-sm text-navy">{staffRoleLabel(user.role)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Trạng thái</dt>
                <dd className="text-sm text-navy">
                  {user.disabled ? "Đã khóa" : "Hoạt động"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Ngày tạo</dt>
                <dd className="text-sm text-navy">{formatVi(user.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Hoạt động gần nhất</dt>
                <dd className="text-sm text-navy">{formatVi(user.lastSeenAt)}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-navy">Bảo mật</h2>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted">2FA</dt>
                <dd
                  className={`text-sm font-medium ${
                    user.totpEnabled ? "text-emerald-700" : "text-amber-800"
                  }`}
                >
                  {user.totpEnabled ? "Đã bật" : "Chưa bật"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Email đã xác minh</dt>
                <dd className="text-sm text-navy">
                  {user.emailVerified ? "Có" : "Chưa"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Đổi mật khẩu lần cuối</dt>
                <dd className="text-sm text-navy">
                  {formatVi(user.passwordChangedAt)}
                </dd>
              </div>
            </dl>
            {user.isSelf ? (
              <div className="mt-4">
                <Link
                  href="/account/security#password"
                  className="inline-flex rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-white"
                >
                  Đổi mật khẩu
                </Link>
                <p className="mt-2 text-xs text-muted">
                  Nhập mật khẩu hiện tại để đặt mật khẩu mới — không cần email.
                </p>
              </div>
            ) : canManage ? (
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={busy || user.disabled}
                  onClick={() => void requestPasswordReset()}
                  className="rounded-lg border border-border px-3 py-1.5 text-sm font-semibold text-navy disabled:opacity-50"
                >
                  Đặt lại mật khẩu (email)
                </button>
                {user.disabled ? (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void setDisabled(false)}
                    className="rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    Mở khóa tài khoản
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={busy || user.isSelf}
                    onClick={() => void setDisabled(true)}
                    className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-700 disabled:opacity-50"
                    title={
                      user.isSelf
                        ? "Không thể khóa chính mình"
                        : undefined
                    }
                  >
                    Khóa tài khoản
                  </button>
                )}
              </div>
            ) : null}
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-navy">
                Phiên đăng nhập
              </h2>
              {canManage ? (
                <button
                  type="button"
                  disabled={busy || sessions.length === 0}
                  onClick={() => void revokeAll()}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-navy disabled:opacity-50"
                >
                  Đăng xuất tất cả phiên
                </button>
              ) : null}
            </div>
            <p className="mt-1 text-xs text-muted">
              Đang mở: {user.activeSessionCount} phiên
            </p>
            {sessions.length === 0 ? (
              <p className="mt-3 text-sm text-muted">Không có phiên hoạt động.</p>
            ) : (
              <ul className="mt-3 divide-y divide-border rounded-xl border border-border">
                {sessions.map((s) => (
                  <li
                    key={s.id}
                    className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 text-sm"
                  >
                    <div>
                      <p className="font-medium text-navy">
                        {s.deviceLabel || "Thiết bị"}
                      </p>
                      <p className="text-xs text-muted">
                        {s.ip ? `IP ${s.ip} · ` : ""}
                        Lần cuối {formatVi(s.lastSeenAt)}
                      </p>
                    </div>
                    {canManage ? (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void revokeSession(s.id)}
                        className="text-xs font-medium text-accent hover:underline disabled:opacity-50"
                      >
                        Đăng xuất phiên
                      </button>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card p-5">
          <UserForm
            mode="edit"
            userId={user.id}
            initial={{
              email: user.email,
              name: user.name,
              role: user.role,
            }}
          />
        </div>
      )}
    </div>
  );
}
