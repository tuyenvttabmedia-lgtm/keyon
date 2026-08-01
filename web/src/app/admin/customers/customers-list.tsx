"use client";

import Link from "next/link";
import type { AdminCustomerListRow } from "@/lib/admin-customers";
import { customerInitials } from "@/lib/admin-customers";
import { CopyTextButton } from "@/app/admin/orders/copy-button";
import {
  BADGE_CLASS,
  EMPTY_BODY_CLASS,
  EMPTY_TITLE_CLASS,
  INLINE_PRICE_CLASS,
  TABLE_CELL_CLASS,
  TABLE_HEADER_CLASS,
} from "@/storefront/typography";
import {
  ListPaginationBar,
  PageSizeSelect,
  useClientPagination,
} from "@/app/admin/ui/client-pagination";

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function CustomersList({ rows }: { rows: AdminCustomerListRow[] }) {
  const page = useClientPagination(
    rows,
    "keyon.admin.customers.pageSize",
    rows.length,
  );

  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
        <p className={EMPTY_TITLE_CLASS}>Không có khách phù hợp</p>
        <p className={`mt-1 ${EMPTY_BODY_CLASS}`}>Đổi bộ lọc hoặc từ khóa.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <PageSizeSelect
          value={page.pageSize}
          onChange={page.setPageSize}
          unit="khách"
        />
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-border bg-[#f8fafc]">
            <tr>
              <th className={`px-4 py-3 ${TABLE_HEADER_CLASS}`}>Khách</th>
              <th className={`px-4 py-3 ${TABLE_HEADER_CLASS}`}>Liên hệ</th>
              <th className={`px-4 py-3 ${TABLE_HEADER_CLASS}`}>Đơn</th>
              <th className={`px-4 py-3 ${TABLE_HEADER_CLASS}`}>Chi tiêu</th>
              <th className={`px-4 py-3 ${TABLE_HEADER_CLASS}`}>Đơn gần nhất</th>
              <th className={`px-4 py-3 ${TABLE_HEADER_CLASS}`}>Trạng thái</th>
              <th className={`px-4 py-3 ${TABLE_HEADER_CLASS}`} />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {page.pageItems.map((c) => {
              const initials = customerInitials(c.name, c.email);
              return (
                <tr key={c.id} className="hover:bg-[#f8fafc]/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent">
                        {initials}
                      </span>
                      <div className="min-w-0">
                        <Link
                          href={`/admin/customers/${c.id}`}
                          className="font-medium text-navy hover:text-accent"
                        >
                          {c.name || "—"}
                        </Link>
                        {c.hasAwaiting ? (
                          <p className="text-[11px] font-medium text-amber-800">
                            Có đơn đang chờ
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-navy">{c.email}</p>
                    <p className={`${TABLE_CELL_CLASS} !text-muted`}>
                      {c.phone || "—"}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">
                      {c.orderCount}
                    </span>
                    {c.openTicketCount > 0 ? (
                      <p className="mt-1 text-[11px] text-amber-800">
                        {c.openTicketCount} ticket
                      </p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    <span className={INLINE_PRICE_CLASS}>
                      {c.totalSpendVnd.toLocaleString("vi-VN")}đ
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {c.lastOrderCode ? (
                      <>
                        <p className="font-medium text-navy">{c.lastOrderCode}</p>
                        <p className={`${TABLE_CELL_CLASS} !text-muted`}>
                          {fmtDate(c.lastOrderAt)}
                        </p>
                      </>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 ${BADGE_CLASS} ${
                        c.emailVerified
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                          : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
                      }`}
                    >
                      {c.emailVerified ? "Verified" : "Unverified"}
                    </span>
                    {c.totpEnabled ? (
                      <p className="mt-1 text-[11px] text-muted">2FA</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <CopyTextButton text={c.email} label="Email" />
                      <Link
                        href={`/admin/customers/${c.id}`}
                        className="text-sm font-medium text-accent hover:underline"
                      >
                        Workspace
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      </div>
      <ListPaginationBar
        page={page.page}
        pageCount={page.pageCount}
        from={page.from}
        to={page.to}
        total={page.total}
        unit="khách"
        onPrev={() => page.setPage(page.page - 1)}
        onNext={() => page.setPage(page.page + 1)}
      />
    </div>
  );
}
