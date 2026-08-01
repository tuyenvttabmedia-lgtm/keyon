"use client";

import Link from "next/link";
import {
  ListPaginationBar,
  PageSizeSelect,
  useClientPagination,
} from "@/app/admin/ui/client-pagination";

export type ImportHistoryRow = {
  id: string;
  createdAt: string;
  sku: string | null;
  productName: string | null;
  variantId: string | null;
  added: number;
  duplicateFile: number;
  duplicateDb: number;
  invalid: number;
  actorEmail: string | null;
};

export function ImportHistoryTable({ rows }: { rows: ImportHistoryRow[] }) {
  const page = useClientPagination(
    rows,
    "keyon.admin.stock.importHistoryPageSize",
    rows.length,
  );

  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted">
        Chưa có lịch sử nhập kho (audit <code>stock.add</code>). Import mới sẽ
        ghi Imported / Duplicate / Invalid.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted">
          Lite từ AuditLog · không phải Import Batch entity (P2)
        </p>
        <PageSizeSelect
          value={page.pageSize}
          onChange={page.setPageSize}
          unit="batch"
        />
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-border text-muted">
            <tr>
              <th className="px-3 py-2">Created</th>
              <th className="px-3 py-2">SKU / Product</th>
              <th className="px-3 py-2">Imported</th>
              <th className="px-3 py-2">Dup file</th>
              <th className="px-3 py-2">Dup DB</th>
              <th className="px-3 py-2">Invalid</th>
              <th className="px-3 py-2">Actor</th>
            </tr>
          </thead>
          <tbody>
            {page.pageItems.map((r) => (
              <tr key={r.id} className="border-b border-border/70">
                <td className="px-3 py-3 text-xs text-muted">{r.createdAt}</td>
                <td className="px-3 py-3">
                  {r.sku ? (
                    <Link
                      href={`/admin/stock/${encodeURIComponent(r.sku)}`}
                      className="font-mono text-xs text-accent hover:underline"
                    >
                      {r.sku}
                    </Link>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                  {r.productName ? (
                    <p className="text-xs text-muted">{r.productName}</p>
                  ) : null}
                </td>
                <td className="px-3 py-3 font-mono text-emerald-700">{r.added}</td>
                <td className="px-3 py-3 font-mono text-amber-700">
                  {r.duplicateFile}
                </td>
                <td className="px-3 py-3 font-mono text-orange-700">
                  {r.duplicateDb}
                </td>
                <td className="px-3 py-3 font-mono text-red-700">{r.invalid}</td>
                <td className="px-3 py-3 text-xs text-muted">
                  {r.actorEmail ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ListPaginationBar
        page={page.page}
        pageCount={page.pageCount}
        from={page.from}
        to={page.to}
        total={page.total}
        unit="lần nhập"
        onPrev={() => page.setPage(page.page - 1)}
        onNext={() => page.setPage(page.page + 1)}
      />
    </div>
  );
}
