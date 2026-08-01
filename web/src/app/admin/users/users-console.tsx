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

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (role !== "all" && r.role !== role) return false;
      if (!query) return true;
      return (
        r.email.toLowerCase().includes(query) ||
        (r.name?.toLowerCase().includes(query) ?? false) ||
        r.id.toLowerCase().includes(query)
      );
    });
  }, [rows, q, role]);

  const page = useClientPagination(
    filtered,
    "keyon.admin.users.pageSize",
    `${q}|${role}|${filtered.length}`,
  );

  const kpiCards = [
    { label: "Tổng staff", value: summary.total, tone: "text-navy" },
    { label: "Quản trị", value: summary.admin, tone: "text-sky-700" },
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
            placeholder="Tên hoặc email…"
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
            <option value="ADMIN">Quản trị</option>
            <option value="FULFILLMENT">Giao hàng</option>
            <option value="CS">CSKH</option>
          </select>
        </label>
        <PageSizeSelect
          value={page.pageSize}
          onChange={page.setPageSize}
          unit="user"
        />
      </div>

      <p className="text-xs text-muted">
        2FA bật: {summary.totpOn}/{summary.total} · Không có trường khóa tài khoản
        trên schema — không hiển thị “Đang hoạt động” giả.
      </p>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-[#f8fafc] text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Người dùng</th>
              <th className="px-4 py-3">Vai trò</th>
              <th className="px-4 py-3">2FA</th>
              <th className="px-4 py-3">Phiên / Lần cuối</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {page.pageItems.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-sm text-muted"
                >
                  Không có tài khoản phù hợp bộ lọc.
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
                    {u.totpEnabled ? (
                      <span className="text-emerald-700">Đã bật</span>
                    ) : (
                      <span className="text-amber-800">Chưa bật</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">
                    <p>
                      {u.activeSessionCount > 0
                        ? `${u.activeSessionCount} phiên`
                        : "Không phiên"}
                    </p>
                    <p>{formatVi(u.lastSeenAt)}</p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/users/${u.id}`}
                      className="text-sm font-medium text-accent hover:underline"
                    >
                      {canManage ? "Chi tiết" : "Xem"}
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
            unit="user"
            onPrev={() => page.setPage(page.page - 1)}
            onNext={() => page.setPage(page.page + 1)}
          />
        </div>
      </div>
    </div>
  );
}
