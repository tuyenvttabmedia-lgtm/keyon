"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  staffRoleLabel,
  type AdminUserListRow,
  type StaffRole,
} from "@/lib/admin-users";
import { BADGE_CLASS } from "@/storefront/typography";
import {
  ListPaginationBar,
  PageSizeSelect,
  useClientPagination,
} from "@/app/admin/ui/client-pagination";

type RoleFilter = "all" | StaffRole;
type StatusFilter = "all" | "active" | "disabled";
type TotpFilter = "all" | "on" | "off";

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

export function UsersConsole({
  rows,
  summary,
  canManage,
}: {
  rows: AdminUserListRow[];
  summary: {
    total: number;
    admin: number;
    fulfillment: number;
    cs: number;
    totpOn: number;
  };
  canManage: boolean;
}) {
  const [q, setQ] = useState("");
  const [role, setRole] = useState<RoleFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [totp, setTotp] = useState<TotpFilter>("all");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (role !== "all" && r.role !== role) return false;
      if (status === "active" && r.disabled) return false;
      if (status === "disabled" && !r.disabled) return false;
      if (totp === "on" && !r.totpEnabled) return false;
      if (totp === "off" && r.totpEnabled) return false;
      if (!query) return true;
      return (
        r.email.toLowerCase().includes(query) ||
        (r.name?.toLowerCase().includes(query) ?? false)
      );
    });
  }, [rows, q, role, status, totp]);

  const page = useClientPagination(
    filtered,
    "keyon.admin.users.pageSize",
    `${q}|${role}|${status}|${totp}|${filtered.length}`,
  );

  const hasFilters =
    q.trim() !== "" || role !== "all" || status !== "all" || totp !== "all";

  function clearFilters() {
    setQ("");
    setRole("all");
    setStatus("all");
    setTotp("all");
  }

  const kpiCards = [
    { label: "Tổng nhân viên", value: summary.total, tone: "text-navy" },
    { label: "Quản trị viên", value: summary.admin, tone: "text-sky-700" },
    { label: "Giao hàng", value: summary.fulfillment, tone: "text-amber-800" },
    { label: "CSKH", value: summary.cs, tone: "text-emerald-700" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((c) => (
          <div
            key={c.label}
            className="rounded-xl border border-border bg-card px-4 py-3"
          >
            <p className="text-xs text-muted">{c.label}</p>
            <p className={`mt-1 text-2xl font-bold tabular-nums ${c.tone}`}>
              {c.value.toLocaleString("vi-VN")}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-end gap-2 rounded-2xl border border-border bg-card p-4">
        <label className="min-w-[200px] flex-1 text-xs">
          <span className="font-medium text-navy">Tìm kiếm</span>
          <input
            className="mt-1 w-full rounded-lg border border-border bg-white px-2.5 py-1.5 text-sm"
            placeholder="Tìm theo tên hoặc email..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        <label className="text-xs">
          <span className="font-medium text-navy">Vai trò</span>
          <select
            className="mt-1 block rounded-lg border border-border bg-white px-2.5 py-1.5 text-sm"
            value={role}
            onChange={(e) => setRole(e.target.value as RoleFilter)}
          >
            <option value="all">Tất cả</option>
            <option value="ADMIN">Quản trị viên</option>
            <option value="FULFILLMENT">Giao hàng</option>
            <option value="CS">CSKH</option>
          </select>
        </label>
        <label className="text-xs">
          <span className="font-medium text-navy">Trạng thái</span>
          <select
            className="mt-1 block rounded-lg border border-border bg-white px-2.5 py-1.5 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
          >
            <option value="all">Tất cả</option>
            <option value="active">Hoạt động</option>
            <option value="disabled">Đã khóa</option>
          </select>
        </label>
        <label className="text-xs">
          <span className="font-medium text-navy">2FA</span>
          <select
            className="mt-1 block rounded-lg border border-border bg-white px-2.5 py-1.5 text-sm"
            value={totp}
            onChange={(e) => setTotp(e.target.value as TotpFilter)}
          >
            <option value="all">Tất cả</option>
            <option value="on">Đã bật</option>
            <option value="off">Chưa bật</option>
          </select>
        </label>
        <PageSizeSelect
          value={page.pageSize}
          onChange={page.setPageSize}
          unit="người / trang"
        />
        {hasFilters ? (
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-navy"
          >
            Xóa bộ lọc
          </button>
        ) : null}
      </div>

      <p className="text-xs text-muted">
        2FA bật: {summary.totpOn}/{summary.total}
      </p>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border bg-[#f8fafc] text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Nhân viên</th>
              <th className="px-4 py-3">Vai trò</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">2FA</th>
              <th className="px-4 py-3">Hoạt động gần nhất</th>
              <th className="px-4 py-3">Phiên</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {page.pageItems.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-sm text-muted"
                >
                  <p>Không tìm thấy nhân viên phù hợp.</p>
                  {hasFilters ? (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="mt-2 text-sm font-medium text-accent hover:underline"
                    >
                      Xóa bộ lọc
                    </button>
                  ) : null}
                </td>
              </tr>
            ) : (
              page.pageItems.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-navy">
                      {u.name?.trim() || "—"}
                    </p>
                    <p className="text-xs text-muted">{u.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full bg-navy-soft px-2.5 py-0.5 text-navy ${BADGE_CLASS}`}
                    >
                      {staffRoleLabel(u.role)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {u.disabled ? (
                      <span className="font-medium text-red-700">Đã khóa</span>
                    ) : (
                      <span className="font-medium text-emerald-700">
                        Hoạt động
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {u.totpEnabled ? (
                      <span className="text-emerald-700">Đã bật</span>
                    ) : (
                      <span className="text-amber-800">Chưa bật</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {formatVi(u.lastSeenAt)}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {u.activeSessionCount > 0
                      ? `${u.activeSessionCount} phiên`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/users/${u.id}`}
                      className="text-sm font-medium text-accent hover:underline"
                    >
                      Chi tiết
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="border-t border-border px-4 py-3">
          <ListPaginationBar
            page={page.page}
            pageCount={page.pageCount}
            from={page.from}
            to={page.to}
            total={page.total}
            unit="người"
            onPrev={() => page.setPage(page.page - 1)}
            onNext={() => page.setPage(page.page + 1)}
          />
        </div>
      </div>
    </div>
  );
}
