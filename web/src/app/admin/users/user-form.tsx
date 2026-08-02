"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  staffRoleHint,
  staffRoleLabel,
  type StaffRole,
} from "@/lib/admin-users";

export function UserForm({
  mode,
  userId,
  initial,
}: {
  mode: "create" | "edit";
  userId?: string;
  initial?: {
    email: string;
    name: string | null;
    role: StaffRole;
  };
}) {
  const router = useRouter();
  const [email, setEmail] = useState(initial?.email ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [role, setRole] = useState<StaffRole>(initial?.role ?? "FULFILLMENT");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    setDevResetUrl(null);
    try {
      if (mode === "create") {
        const res = await fetch("/api/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            name: name.trim() || null,
            role,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Tạo thất bại");
        if (data.resetUrl && typeof data.resetUrl === "string") {
          try {
            sessionStorage.setItem(
              `keyon.staffReset.${data.id}`,
              data.resetUrl,
            );
          } catch {
            /* ignore */
          }
        }
        router.push(`/admin/users/${data.id}`);
        router.refresh();
        return;
      }

      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || null,
          role,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lưu thất bại");
      setMsg("Đã lưu.");
      router.refresh();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-4">
      <label className="block text-sm">
        <span className="font-medium text-navy">Họ tên *</span>
        <input
          required={mode === "create"}
          className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={120}
          placeholder="VD: Nguyễn Văn A"
        />
      </label>

      <label className="block text-sm">
        <span className="font-medium text-navy">Email *</span>
        <input
          required
          type="email"
          disabled={mode === "edit"}
          className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm disabled:bg-[#f8fafc] disabled:text-muted"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="off"
        />
        {mode === "edit" ? (
          <span className="mt-1 block text-xs text-muted">
            Email không đổi trên MVP (tránh trùng / mất phiên định danh).
          </span>
        ) : (
          <span className="mt-1 block text-xs text-muted">
            Hệ thống sẽ gửi email để nhân viên tự đặt mật khẩu. Admin không đặt
            mật khẩu hộ.
          </span>
        )}
      </label>

      <label className="block text-sm">
        <span className="font-medium text-navy">Vai trò *</span>
        <select
          className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
          value={role}
          onChange={(e) => setRole(e.target.value as StaffRole)}
        >
          <option value="ADMIN">{staffRoleLabel("ADMIN")}</option>
          <option value="FULFILLMENT">{staffRoleLabel("FULFILLMENT")}</option>
          <option value="CS">{staffRoleLabel("CS")}</option>
        </select>
        <span className="mt-1 block text-xs text-muted">
          {staffRoleHint(role)}
        </span>
      </label>

      {msg ? (
        <p
          className={`text-sm ${
            msg.includes("thất bại") || msg.includes("Lỗi") || msg.startsWith("Không")
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

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading
            ? "Đang lưu…"
            : mode === "create"
              ? "Thêm nhân viên"
              : "Lưu"}
        </button>
        <Link
          href={userId ? `/admin/users/${userId}` : "/admin/users"}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-navy"
        >
          Hủy
        </Link>
      </div>
    </form>
  );
}
