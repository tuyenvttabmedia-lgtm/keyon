"use client";

import Link from "next/link";
import { useState } from "react";
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
  createdAt: string;
  passwordChangedAt: string | null;
  lastSeenAt: string | null;
  activeSessionCount: number;
  deviceLabel: string | null;
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
  const [tab, setTab] = useState<"overview" | "edit">("overview");

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
        </div>
        <p className="mt-1 text-sm text-muted">
          {user.email} · {staffRoleHint(user.role)}
        </p>
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

      {tab === "overview" ? (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card px-4 py-3">
              <p className="text-xs text-muted">2FA</p>
              <p
                className={`mt-1 text-lg font-semibold ${
                  user.totpEnabled ? "text-emerald-700" : "text-amber-800"
                }`}
              >
                {user.totpEnabled ? "Đã bật" : "Chưa bật"}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card px-4 py-3">
              <p className="text-xs text-muted">Phiên đang mở</p>
              <p className="mt-1 text-lg font-semibold tabular-nums text-navy">
                {user.activeSessionCount}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card px-4 py-3">
              <p className="text-xs text-muted">Lần thấy gần nhất</p>
              <p className="mt-1 text-sm font-medium text-navy">
                {formatVi(user.lastSeenAt)}
              </p>
              {user.deviceLabel ? (
                <p className="text-xs text-muted">{user.deviceLabel}</p>
              ) : null}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-navy">Thông tin</h2>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted">Email</dt>
                <dd className="text-sm text-navy">{user.email}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Tên</dt>
                <dd className="text-sm text-navy">{user.name?.trim() || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Vai trò</dt>
                <dd className="text-sm text-navy">{staffRoleLabel(user.role)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Email đã xác minh</dt>
                <dd className="text-sm text-navy">
                  {user.emailVerified ? "Có" : "Chưa"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Tạo lúc</dt>
                <dd className="text-sm text-navy">{formatVi(user.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Đổi mật khẩu lần cuối</dt>
                <dd className="text-sm text-navy">
                  {formatVi(user.passwordChangedAt)}
                </dd>
              </div>
            </dl>
            <p className="mt-4 text-xs text-muted">
              Khóa / vô hiệu hóa tài khoản: chưa có trên schema — không hiển thị
              giả. Đặt lại mật khẩu sẽ thu hồi mọi phiên đăng nhập.
            </p>
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
