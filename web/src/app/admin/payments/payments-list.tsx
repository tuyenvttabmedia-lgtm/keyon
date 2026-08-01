"use client";

import Link from "next/link";
import type { AdminPaymentListRow } from "@/lib/admin-payments";
import { reconcileHintLabel } from "@/lib/admin-payments";
import { CopyTextButton } from "@/app/admin/orders/copy-button";
import { StatusBadge } from "@/storefront/components/account/AccountNav";
import { paymentStatusForCustomer } from "@/storefront/lib/order-status";
import type { OrderStatus, PaymentStatus } from "@prisma/client";
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

function fmt(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function hintClass(hint: AdminPaymentListRow["reconcileHint"]) {
  switch (hint) {
    case "matched":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
    case "needs_review":
    case "mismatch":
      return "bg-amber-50 text-amber-800 ring-1 ring-amber-200";
    case "failed":
      return "bg-red-50 text-red-700 ring-1 ring-red-200";
    default:
      return "bg-slate-100 text-slate-600 ring-1 ring-slate-200";
  }
}

function toCsv(rows: AdminPaymentListRow[]) {
  const header = [
    "reference",
    "order",
    "email",
    "provider",
    "amountVnd",
    "status",
    "reconcile",
    "age",
    "createdAt",
    "txnId",
  ];
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const lines = [
    header.join(","),
    ...rows.map((r) =>
      [
        r.paymentReference,
        r.orderCode,
        r.customerEmail,
        r.provider,
        String(r.amountVnd),
        r.status,
        reconcileHintLabel(r.reconcileHint),
        r.ageLabel,
        r.createdAt,
        r.providerTransactionId ?? "",
      ]
        .map(escape)
        .join(","),
    ),
  ];
  return lines.join("\n");
}

export function PaymentsList({ rows }: { rows: AdminPaymentListRow[] }) {
  const page = useClientPagination(
    rows,
    "keyon.admin.payments.pageSize",
    rows.length,
  );

  function downloadCsv() {
    const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payments-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
        <p className={EMPTY_TITLE_CLASS}>Không có payment</p>
        <p className={`mt-1 ${EMPTY_BODY_CLASS}`}>Đổi bộ lọc hoặc từ khóa.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <PageSizeSelect
          value={page.pageSize}
          onChange={page.setPageSize}
          unit="payment"
        />
        <button
          type="button"
          onClick={downloadCsv}
          className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-navy hover:bg-navy-soft"
        >
          Export CSV
        </button>
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="border-b border-border bg-[#f8fafc]">
              <tr>
                <th className={`px-3 py-3 ${TABLE_HEADER_CLASS}`}>Reference</th>
                <th className={`px-3 py-3 ${TABLE_HEADER_CLASS}`}>Order</th>
                <th className={`px-3 py-3 ${TABLE_HEADER_CLASS}`}>Customer</th>
                <th className={`px-3 py-3 ${TABLE_HEADER_CLASS}`}>Provider</th>
                <th className={`px-3 py-3 ${TABLE_HEADER_CLASS}`}>Amount</th>
                <th className={`px-3 py-3 ${TABLE_HEADER_CLASS}`}>Status</th>
                <th className={`px-3 py-3 ${TABLE_HEADER_CLASS}`}>Đối soát</th>
                <th className={`px-3 py-3 ${TABLE_HEADER_CLASS}`}>Age</th>
                <th className={`px-3 py-3 ${TABLE_HEADER_CLASS}`}>Created</th>
                <th className={`px-3 py-3 ${TABLE_HEADER_CLASS}`} />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {page.pageItems.map((p) => (
                <tr key={p.id} className="hover:bg-[#f8fafc]/60">
                  <td className="px-3 py-2.5">
                    <Link
                      href={`/admin/payments/${p.id}`}
                      className="font-mono text-xs font-medium text-navy hover:text-accent"
                    >
                      {p.paymentReference}
                    </Link>
                  </td>
                  <td className="px-3 py-2.5">
                    <Link
                      href={`/admin/orders/${p.orderId}`}
                      className="font-medium text-accent hover:underline"
                    >
                      {p.orderCode}
                    </Link>
                  </td>
                  <td className="px-3 py-2.5">
                    {p.customerId ? (
                      <Link
                        href={`/admin/customers/${p.customerId}`}
                        className="text-navy hover:text-accent"
                      >
                        {p.customerName || p.customerEmail}
                      </Link>
                    ) : (
                      <span className="text-navy">{p.customerEmail}</span>
                    )}
                  </td>
                  <td className={`px-3 py-2.5 ${TABLE_CELL_CLASS}`}>
                    {p.provider}
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={INLINE_PRICE_CLASS}>
                      {p.amountVnd.toLocaleString("vi-VN")}đ
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <StatusBadge
                      status={paymentStatusForCustomer(
                        p.status as PaymentStatus,
                        p.orderStatus as OrderStatus,
                      )}
                    />
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 ${BADGE_CLASS} ${hintClass(p.reconcileHint)}`}
                    >
                      {reconcileHintLabel(p.reconcileHint)}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-xs font-semibold text-navy">
                    {p.ageLabel}
                  </td>
                  <td className={`px-3 py-2.5 ${TABLE_CELL_CLASS} !text-muted`}>
                    {fmt(p.createdAt)}
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <CopyTextButton text={p.paymentReference} label="Ref" />
                      <Link
                        href={`/admin/payments/${p.id}`}
                        className="text-sm font-medium text-accent hover:underline"
                      >
                        Workspace
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
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
        unit="payment"
        onPrev={() => page.setPage(page.page - 1)}
        onNext={() => page.setPage(page.page + 1)}
      />
    </div>
  );
}
