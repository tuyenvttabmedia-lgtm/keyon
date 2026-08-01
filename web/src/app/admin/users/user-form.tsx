"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  staffRoleHint,
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
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      if (mode === "create") {
        const res = await fetch("/api/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            name: name.trim() || null,
            role,
            password,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Tạo thất bại");
        router.push(`/admin/users/${data.id}`);
        router.refresh();
        return;
      }

      const body: {
        name: string | null;
        role: StaffRole;
        password?: string;
      } = {
        name: name.trim() || null,
        role,
      };
      if (password.trim()) body.password = password;

      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lưu thất bại");
      setPassword("");
      setMsg(
        body.password
          ? "Đã lưu · mật khẩu mới — mọi phiên đăng nhập đã thu hồi."
          : "Đã lưu.",
      );
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
        <span className="font-medium text-navy">Email</span>
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
        ) : null}
      </label>

      <label className="block text-sm">
        <span className="font-medium text-navy">Tên hiển thị</span>
        <input
          className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={120}
          placeholder="VD: Nguyễn A"
        />
      </label>

      <label className="block text-sm">
        <span className="font-medium text-navy">Vai trò</span>
        <select
          className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
          value={role}
          onChange={(e) => setRole(e.target.value as StaffRole)}
        >
          <option value="ADMIN">Quản trị</option>
          <option value="FULFILLMENT">Giao hàng</option>
          <option value="CS">CSKH</option>
        </select>
        <span className="mt-1 block text-xs text-muted">
          {staffRoleHint(role)}
        </span>
      </label>

      <label className="block text-sm">
        <span className="font-medium text-navy">
          {mode === "create" ? "Mật khẩu" : "Đặt lại mật khẩu (tuỳ chọn)"}
        </span>
        <input
          required={mode === "create"}
          type="password"
          className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={mode === "create" || password ? 8 : undefined}
          autoComplete="new-password"
          placeholder={
            mode === "create" ? "Tối thiểu 8 ký tự" : "Để trống nếu không đổi"
          }
        />
      </label>

      {msg ? (
        <p
          className={`text-sm ${
            msg.startsWith("Đã") ? "text-emerald-700" : "text-red-600"
          }`}
        >
          {msg}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Đang lưu…" : mode === "create" ? "Tạo tài khoản" : "Lưu"}
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
