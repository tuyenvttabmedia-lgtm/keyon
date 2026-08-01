"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { IntegrationMode, SupplierType } from "@prisma/client";
import {
  integrationModeLabel,
  processingLabel,
  supplierTypeLabel,
  type AdminSupplierListRow,
} from "@/lib/admin-suppliers";
import { BADGE_CLASS } from "@/storefront/typography";
import {
  ListPaginationBar,
  PageSizeSelect,
  useClientPagination,
} from "@/app/admin/ui/client-pagination";

type TypeFilter = "all" | SupplierType;
type ModeFilter = "all" | IntegrationMode;
type ActiveFilter = "all" | "active" | "inactive";

export function SuppliersConsole({
  rows,
  summary,
}: {
  rows: AdminSupplierListRow[];
  summary: {
    total: number;
    api: number;
    manual: number;
    needsAction: number;
    inactive: number;
  };
}) {
  const [q, setQ] = useState("");
  const [type, setType] = useState<TypeFilter>("all");
  const [mode, setMode] = useState<ModeFilter>("all");
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("all");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (type !== "all" && r.supplierType !== type) return false;
      if (mode !== "all" && r.integrationMode !== mode) return false;
      if (activeFilter === "active" && !r.active) return false;
      if (activeFilter === "inactive" && r.active) return false;
      if (!query) return true;
      return (
        r.name.toLowerCase().includes(query) ||
        r.id.toLowerCase().includes(query) ||
        (r.contactEmail?.toLowerCase().includes(query) ?? false) ||
        (r.contactName?.toLowerCase().includes(query) ?? false)
      );
    });
  }, [rows, q, type, mode, activeFilter]);

  const page = useClientPagination(
    filtered,
    "keyon.admin.suppliers.pageSize",
    `${q}|${type}|${mode}|${activeFilter}|${filtered.length}`,
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Kpi label="Tổng nhà cung cấp" value={summary.total} tone="text-navy" />
        <Kpi label="API tự động" value={summary.api} tone="text-sky-700" />
        <Kpi
          label="Xử lý thủ công"
          value={summary.manual}
          tone="text-amber-800"
        />
        <Link
          href="/admin/inbox"
          className="rounded-xl border border-border bg-card px-4 py-3 transition hover:border-accent/40 hover:bg-[#f8fafc]"
        >
          <p className="text-xs text-muted">Cần xử lý (Inbox)</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-red-700">
            {summary.needsAction.toLocaleString("vi-VN")}
          </p>
          <p className="mt-1 text-[11px] font-medium text-accent">
            Mở Inbox →
          </p>
        </Link>
        <Kpi
          label="Đang tắt"
          value={summary.inactive}
          tone="text-slate-600"
        />
      </div>

      <div className="flex flex-wrap items-end gap-2 rounded-2xl border border-border bg-card p-4">
        <label className="min-w-[200px] flex-1 text-xs">
          <span className="font-medium text-navy">Tìm kiếm</span>
          <input
            className="mt-1 w-full rounded-lg border border-border bg-white px-2.5 py-1.5 text-sm"
            placeholder="Tên, liên hệ…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        <label className="text-xs">
          <span className="font-medium text-navy">Loại nhà cung cấp</span>
          <select
            className="mt-1 block rounded-lg border border-border bg-white px-2.5 py-1.5 text-sm"
            value={type}
            onChange={(e) => setType(e.target.value as TypeFilter)}
          >
            <option value="all">Tất cả</option>
            <option value="INTERNAL">Kho KEYON</option>
            <option value="EXTERNAL">Nhà cung cấp ngoài</option>
            <option value="DISTRIBUTOR">Nhà phân phối</option>
            <option value="MARKETPLACE">Sàn thương mại</option>
          </select>
        </label>
        <label className="text-xs">
          <span className="font-medium text-navy">Phương thức xử lý</span>
          <select
            className="mt-1 block rounded-lg border border-border bg-white px-2.5 py-1.5 text-sm"
            value={mode}
            onChange={(e) => setMode(e.target.value as ModeFilter)}
          >
            <option value="all">Tất cả</option>
            <option value="NONE">Không tích hợp</option>
            <option value="MANUAL_OPS">Xử lý thủ công</option>
            <option value="API">API tự động</option>
          </select>
        </label>
        <label className="text-xs">
          <span className="font-medium text-navy">Trạng thái</span>
          <select
            className="mt-1 block rounded-lg border border-border bg-white px-2.5 py-1.5 text-sm"
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value as ActiveFilter)}
          >
            <option value="all">Tất cả</option>
            <option value="active">Đang dùng</option>
            <option value="inactive">Đang tắt</option>
          </select>
        </label>
        <PageSizeSelect
          value={page.pageSize}
          onChange={page.setPageSize}
          unit="NCC"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="border-b border-border bg-[#f8fafc] text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Nhà cung cấp</th>
              <th className="px-4 py-3">Loại</th>
              <th className="px-4 py-3">Xử lý đơn</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Gói / SKU</th>
              <th className="px-4 py-3">Liên hệ</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {page.pageItems.map((r) => (
              <tr
                key={r.id}
                className={`hover:bg-[#f8fafc]/50 ${
                  r.active ? "" : "opacity-70"
                }`}
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-navy">{r.name}</p>
                  {r.waitingHumanCount > 0 ? (
                    <Link
                      href="/admin/inbox"
                      className="mt-0.5 inline-block text-xs font-medium text-amber-800 hover:underline"
                    >
                      {r.waitingHumanCount} đơn chờ xử lý (Inbox) →
                    </Link>
                  ) : null}
                  {r.notes ? (
                    <p className="mt-0.5 max-w-[220px] truncate text-xs text-muted">
                      {r.notes}
                    </p>
                  ) : null}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full bg-navy-soft px-2 py-0.5 text-navy ${BADGE_CLASS}`}
                  >
                    {supplierTypeLabel(r.supplierType)}
                  </span>
                </td>
                <td className="px-4 py-3 text-navy">
                  {processingLabel(r.supplierType, r.integrationMode)}
                  <p className="text-xs text-muted">
                    {integrationModeLabel(r.integrationMode)}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      r.active
                        ? "rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700"
                        : "rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                    }
                  >
                    {r.active ? "Đang dùng" : "Đang tắt"}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono tabular-nums text-navy">
                  {r.skuCount}
                </td>
                <td className="px-4 py-3 text-xs text-muted">
                  {r.contactName || r.contactEmail || r.website ? (
                    <div className="space-y-0.5">
                      {r.contactName ? (
                        <p className="text-navy">{r.contactName}</p>
                      ) : null}
                      {r.contactEmail ? <p>{r.contactEmail}</p> : null}
                      {r.website ? (
                        <a
                          href={r.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-accent hover:underline"
                        >
                          Website
                        </a>
                      ) : null}
                    </div>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex flex-col items-end gap-1">
                    <Link
                      href={`/admin/suppliers/${r.id}`}
                      className="text-sm font-semibold text-accent hover:underline"
                    >
                      Chi tiết
                    </Link>
                    {r.supplierType === "INTERNAL" ? (
                      <Link
                        href="/admin/stock"
                        className="text-[11px] text-muted hover:text-accent hover:underline"
                      >
                        License Pool
                      </Link>
                    ) : null}
                    {r.integrationMode === "MANUAL_OPS" ? (
                      <Link
                        href="/admin/inbox"
                        className="text-[11px] text-muted hover:text-accent hover:underline"
                      >
                        Inbox
                      </Link>
                    ) : null}
                    {r.integrationMode === "API" ? (
                      <Link
                        href="/admin/settings?tab=ncc"
                        className="text-[11px] text-muted hover:text-accent hover:underline"
                      >
                        Cài đặt NCC
                      </Link>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
            {page.pageItems.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-sm text-muted"
                >
                  Không có nhà cung cấp khớp bộ lọc.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <ListPaginationBar
        page={page.page}
        pageCount={page.pageCount}
        from={page.from}
        to={page.to}
        total={page.total}
        unit="NCC"
        onPrev={() => page.setPage(page.page - 1)}
        onNext={() => page.setPage(page.page + 1)}
      />
    </div>
  );
}

function Kpi({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3">
      <p className="text-xs text-muted">{label}</p>
      <p className={`mt-1 text-2xl font-bold tabular-nums ${tone}`}>
        {value.toLocaleString("vi-VN")}
      </p>
    </div>
  );
}
