"use client";

import Link from "next/link";
import type { AdminQuoteRequestListRow } from "@/lib/admin-quote-requests";
import {
  QUOTE_REQUEST_STATUS_LABEL,
  quoteRequestTypeLabel,
  quoteStatusTone,
} from "@/lib/admin-quote-requests";
import { CopyTextButton } from "@/app/admin/orders/copy-button";
import {
  BADGE_CLASS,
  EMPTY_BODY_CLASS,
  EMPTY_TITLE_CLASS,
  TABLE_CELL_CLASS,
  TABLE_HEADER_CLASS,
} from "@/storefront/typography";
import {
  ListPaginationBar,
  PageSizeSelect,
  useClientPagination,
} from "@/app/admin/ui/client-pagination";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function QuoteRequestsList({
  rows,
}: {
  rows: AdminQuoteRequestListRow[];
}) {
  const page = useClientPagination(
    rows,
    "keyon.admin.quoteRequests.pageSize",
    rows.length,
  );

  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
        <p className={EMPTY_TITLE_CLASS}>Không có yêu cầu báo giá</p>
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
          unit="yêu cầu"
        />
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="border-b border-border bg-[#f8fafc]">
              <tr>
                <th className={`px-4 py-3 ${TABLE_HEADER_CLASS}`}>Mã / thời gian</th>
                <th className={`px-4 py-3 ${TABLE_HEADER_CLASS}`}>Liên hệ</th>
                <th className={`px-4 py-3 ${TABLE_HEADER_CLASS}`}>Công ty</th>
                <th className={`px-4 py-3 ${TABLE_HEADER_CLASS}`}>Nhu cầu</th>
                <th className={`px-4 py-3 ${TABLE_HEADER_CLASS}`}>Trạng thái</th>
                <th className={`px-4 py-3 ${TABLE_HEADER_CLASS}`}>Phụ trách</th>
                <th className={`px-4 py-3 ${TABLE_HEADER_CLASS}`} />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {page.pageItems.map((r) => {
                const tone = quoteStatusTone(r.status);
                return (
                  <tr key={r.id} className="hover:bg-[#f8fafc]/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/admin/quote-requests/${r.id}`}
                          className="font-mono text-sm font-semibold text-navy hover:text-accent"
                        >
                          {r.referenceCode}
                        </Link>
                        <CopyTextButton text={r.referenceCode} label="Mã" />
                      </div>
                      <p className={`mt-0.5 ${TABLE_CELL_CLASS} !text-muted`}>
                        {fmtDate(r.createdAt)}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted">
                        {quoteRequestTypeLabel(r.requestType)}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-navy">{r.fullName}</p>
                      <p className="text-navy">{r.email}</p>
                      <p className={`${TABLE_CELL_CLASS} !text-muted`}>
                        {r.phone}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-navy">{r.companyName}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-navy">{r.productSummary}</p>
                      <p className={`mt-0.5 ${TABLE_CELL_CLASS} !text-muted`}>
                        {r.estimatedUsers} người dùng
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 ${BADGE_CLASS} ${tone.bg} ${tone.text}`}
                      >
                        {QUOTE_REQUEST_STATUS_LABEL[r.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`${TABLE_CELL_CLASS} text-navy`}>
                        {r.assigneeLabel || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/quote-requests/${r.id}`}
                        className="text-sm font-medium text-accent hover:underline"
                      >
                        Chi tiết
                      </Link>
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
        unit="yêu cầu"
        onPrev={() => page.setPage(page.page - 1)}
        onNext={() => page.setPage(page.page + 1)}
      />
    </div>
  );
}
