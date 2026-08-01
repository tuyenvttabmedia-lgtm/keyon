"use client";

import { useEffect, useMemo, useState } from "react";

export const ADMIN_PAGE_SIZES = [20, 50, 100] as const;
export type AdminPageSize = (typeof ADMIN_PAGE_SIZES)[number];

function readStored(key: string, fallback: AdminPageSize): AdminPageSize {
  if (typeof window === "undefined") return fallback;
  try {
    const n = Number(window.localStorage.getItem(key));
    return (ADMIN_PAGE_SIZES as readonly number[]).includes(n)
      ? (n as AdminPageSize)
      : fallback;
  } catch {
    return fallback;
  }
}

/** Client-side pagination for admin list tables (filter → slice). */
export function useClientPagination<T>(
  items: T[],
  storageKey: string,
  /** Change this when filters change to reset to page 1 */
  resetKey: string | number = "",
) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState<AdminPageSize>(20);

  useEffect(() => {
    setPageSizeState(readStored(storageKey, 20));
  }, [storageKey]);

  useEffect(() => {
    setPage(1);
  }, [resetKey, pageSize]);

  const pageCount = Math.max(1, Math.ceil(items.length / pageSize) || 1);
  const safePage = Math.min(page, pageCount);

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, safePage, pageSize]);

  function setPageSize(next: AdminPageSize) {
    setPageSizeState(next);
    try {
      window.localStorage.setItem(storageKey, String(next));
    } catch {
      /* ignore */
    }
  }

  return {
    pageItems,
    page: safePage,
    pageSize,
    pageCount,
    setPage,
    setPageSize,
    total: items.length,
    from: items.length === 0 ? 0 : (safePage - 1) * pageSize + 1,
    to: Math.min(safePage * pageSize, items.length),
  };
}

export function PageSizeSelect({
  value,
  onChange,
  label = "Mỗi trang",
  unit,
}: {
  value: AdminPageSize;
  onChange: (n: AdminPageSize) => void;
  label?: string;
  unit?: string;
}) {
  return (
    <label className="text-xs">
      <span className="font-medium text-navy">{label}</span>
      <select
        className="mt-1 block rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) as AdminPageSize)}
      >
        {ADMIN_PAGE_SIZES.map((n) => (
          <option key={n} value={n}>
            {unit ? `${n} ${unit}` : n}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ListPaginationBar({
  page,
  pageCount,
  from,
  to,
  total,
  unit = "dòng",
  onPrev,
  onNext,
}: {
  page: number;
  pageCount: number;
  from: number;
  to: number;
  total: number;
  unit?: string;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (total === 0) return null;
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
      <p className="text-xs text-muted">
        Hiển thị {from}–{to} / {total} {unit}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={onPrev}
          className="rounded-md border border-border bg-card px-2.5 py-1 text-navy disabled:opacity-40"
        >
          ← Trước
        </button>
        <span className="text-xs text-muted">
          Trang {page}/{pageCount}
        </span>
        <button
          type="button"
          disabled={page >= pageCount}
          onClick={onNext}
          className="rounded-md border border-border bg-card px-2.5 py-1 text-navy disabled:opacity-40"
        >
          Sau →
        </button>
      </div>
    </div>
  );
}
