"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type {
  CmsStaticPage,
  CmsStaticPageCollection,
  CmsStaticPageStatus,
} from "@/server/cms/types";
import { TABLE_CELL_CLASS, TABLE_HEADER_CLASS } from "@/storefront/typography";
import {
  ListPaginationBar,
  PageSizeSelect,
  useClientPagination,
} from "@/app/admin/ui/client-pagination";

const COLLECTION_LABEL: Record<CmsStaticPageCollection, string> = {
  policy: "Chính sách",
  legal: "Pháp lý",
  general: "Chung",
};

export function StaticPagesList({ initial }: { initial: CmsStaticPage[] }) {
  const [q, setQ] = useState("");
  const [collection, setCollection] = useState<CmsStaticPageCollection | "all">(
    "all",
  );
  const [status, setStatus] = useState<CmsStaticPageStatus | "all">("all");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return [...initial]
      .filter((p) => (collection === "all" ? true : p.collection === collection))
      .filter((p) => (status === "all" ? true : p.status === status))
      .filter((p) => {
        if (!needle) return true;
        return (
          p.title.toLowerCase().includes(needle) ||
          p.slug.toLowerCase().includes(needle)
        );
      })
      .sort(
        (a, b) =>
          a.sortOrder - b.sortOrder || a.title.localeCompare(b.title, "vi"),
      );
  }, [initial, q, collection, status]);

  const page = useClientPagination(
    filtered,
    "keyon.admin.cms.pagesPageSize",
    `${q}|${collection}|${status}`,
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:flex-wrap sm:items-center">
        <input
          className="h-10 min-w-[12rem] flex-1 rounded-lg border border-border px-3 text-sm"
          placeholder="Tìm theo tiêu đề hoặc slug…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className="h-10 rounded-lg border border-border px-3 text-sm"
          value={collection}
          onChange={(e) =>
            setCollection(e.target.value as CmsStaticPageCollection | "all")
          }
        >
          <option value="all">Mọi nhóm</option>
          <option value="policy">Chính sách</option>
          <option value="legal">Pháp lý</option>
          <option value="general">Chung</option>
        </select>
        <select
          className="h-10 rounded-lg border border-border px-3 text-sm"
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as CmsStaticPageStatus | "all")
          }
        >
          <option value="all">Mọi trạng thái</option>
          <option value="published">Đã xuất bản</option>
          <option value="draft">Nháp</option>
        </select>
        <PageSizeSelect
          value={page.pageSize}
          onChange={page.setPageSize}
          unit="trang"
        />
        <p className="text-xs text-muted sm:ml-auto">
          {filtered.length}/{initial.length} trang · {page.page}/{page.pageCount}
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-[#f8fafc]">
            <tr>
              <th className={`px-4 py-3 ${TABLE_HEADER_CLASS}`}>Trang</th>
              <th className={`px-4 py-3 ${TABLE_HEADER_CLASS}`}>Nhóm</th>
              <th className={`px-4 py-3 ${TABLE_HEADER_CLASS}`}>Trạng thái</th>
              <th className={`px-4 py-3 ${TABLE_HEADER_CLASS}`}>Thứ tự</th>
              <th className={`px-4 py-3 ${TABLE_HEADER_CLASS}`}>Cập nhật</th>
              <th className={`px-4 py-3 ${TABLE_HEADER_CLASS}`} />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {page.pageItems.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-sm text-muted"
                >
                  Không có trang phù hợp bộ lọc.
                </td>
              </tr>
            ) : (
              page.pageItems.map((p) => (
                <tr key={p.id} className="hover:bg-[#f8fafc]/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-navy">{p.title || "(Chưa đặt tiêu đề)"}</p>
                    <p className={`mt-0.5 ${TABLE_CELL_CLASS} !text-muted`}>
                      /{p.collection === "policy" ? `policy/${p.slug}` : `pages/${p.slug}`}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs font-medium text-navy">
                      {COLLECTION_LABEL[p.collection]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        p.status === "published"
                          ? "rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700"
                          : "rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800"
                      }
                    >
                      {p.status === "published" ? "Đã xuất bản" : "Nháp"}
                    </span>
                  </td>
                  <td className={`px-4 py-3 ${TABLE_CELL_CLASS}`}>{p.sortOrder}</td>
                  <td className={`px-4 py-3 ${TABLE_CELL_CLASS} !text-muted`}>
                    {new Date(p.updatedAt).toLocaleString("vi-VN")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/cms/pages/${p.id}`}
                      className="font-medium text-accent hover:underline"
                    >
                      Sửa
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <ListPaginationBar
        page={page.page}
        pageCount={page.pageCount}
        from={page.from}
        to={page.to}
        total={page.total}
        unit="trang"
        onPrev={() => page.setPage(page.page - 1)}
        onNext={() => page.setPage(page.page + 1)}
      />
    </div>
  );
}
