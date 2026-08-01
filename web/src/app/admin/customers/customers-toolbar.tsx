"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import type {
  CustomerBoolFilter,
  CustomerVerifiedFilter,
} from "@/lib/admin-customers";

export function CustomersToolbar({
  q,
  verified,
  awaiting,
  ticket,
  isNew,
  minSpend,
  maxSpend,
  from,
  to,
  totalMatched,
  shown,
}: {
  q: string;
  verified: CustomerVerifiedFilter;
  awaiting: CustomerBoolFilter;
  ticket: CustomerBoolFilter;
  isNew: CustomerBoolFilter;
  minSpend: string;
  maxSpend: string;
  from: string;
  to: string;
  totalMatched: number;
  shown: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [search, setSearch] = useState(q);
  const [draftMin, setDraftMin] = useState(minSpend);
  const [draftMax, setDraftMax] = useState(maxSpend);
  const [draftFrom, setDraftFrom] = useState(from);
  const [draftTo, setDraftTo] = useState(to);

  useEffect(() => setSearch(q), [q]);
  useEffect(() => {
    setDraftMin(minSpend);
    setDraftMax(maxSpend);
    setDraftFrom(from);
    setDraftTo(to);
  }, [minSpend, maxSpend, from, to]);

  const push = useCallback(
    (patch: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [k, v] of Object.entries(patch)) {
        if (v == null || v === "" || v === "all") next.delete(k);
        else next.set(k, v);
      }
      startTransition(() => {
        router.push(`${pathname}?${next.toString()}`);
      });
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    const t = setTimeout(() => {
      if (search.trim() === (q ?? "").trim()) return;
      push({ q: search.trim() || null });
    }, 300);
    return () => clearTimeout(t);
  }, [search, q, push]);

  return (
    <div
      className={`sticky top-0 z-20 -mx-4 space-y-2.5 border-b border-border bg-[#f5f7fa]/95 px-4 py-3 backdrop-blur md:-mx-6 md:px-6 ${
        pending ? "opacity-80" : ""
      }`}
    >
      <div className="flex flex-wrap items-end gap-2">
        <label className="min-w-[200px] flex-1 text-xs">
          <span className="font-medium text-navy">Tìm kiếm</span>
          <input
            className="mt-1 w-full rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm"
            placeholder="Email, tên, SĐT…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <label className="text-xs">
          <span className="font-medium text-navy">Trạng thái</span>
          <select
            className="mt-1 block rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm"
            value={verified}
            onChange={(e) => push({ verified: e.target.value })}
          >
            <option value="all">Tất cả</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </label>
        <label className="text-xs">
          <span className="font-medium text-navy">Đơn chờ</span>
          <select
            className="mt-1 block rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm"
            value={awaiting}
            onChange={(e) => push({ awaiting: e.target.value })}
          >
            <option value="all">Tất cả</option>
            <option value="yes">Có</option>
            <option value="no">Không</option>
          </select>
        </label>
        <label className="text-xs">
          <span className="font-medium text-navy">Ticket</span>
          <select
            className="mt-1 block rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm"
            value={ticket}
            onChange={(e) => push({ ticket: e.target.value })}
          >
            <option value="all">Tất cả</option>
            <option value="yes">Có mở</option>
            <option value="no">Không</option>
          </select>
        </label>
        <label className="text-xs">
          <span className="font-medium text-navy">Khách mới</span>
          <select
            className="mt-1 block rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm"
            value={isNew}
            onChange={(e) => push({ isNew: e.target.value })}
          >
            <option value="all">Tất cả</option>
            <option value="yes">≤ 7 ngày</option>
            <option value="no">&gt; 7 ngày</option>
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-end gap-2">
        <label className="text-xs">
          <span className="font-medium text-navy">Chi tiêu từ</span>
          <input
            inputMode="numeric"
            className="mt-1 w-[110px] rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm"
            value={draftMin}
            onChange={(e) => setDraftMin(e.target.value.replace(/\D/g, ""))}
          />
        </label>
        <label className="text-xs">
          <span className="font-medium text-navy">đến</span>
          <input
            inputMode="numeric"
            className="mt-1 w-[110px] rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm"
            value={draftMax}
            onChange={(e) => setDraftMax(e.target.value.replace(/\D/g, ""))}
          />
        </label>
        <label className="text-xs">
          <span className="font-medium text-navy">ĐK từ</span>
          <input
            type="date"
            className="mt-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm"
            value={draftFrom}
            onChange={(e) => setDraftFrom(e.target.value)}
          />
        </label>
        <label className="text-xs">
          <span className="font-medium text-navy">đến</span>
          <input
            type="date"
            className="mt-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm"
            value={draftTo}
            onChange={(e) => setDraftTo(e.target.value)}
          />
        </label>
        <button
          type="button"
          className="rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-white"
          onClick={() =>
            push({
              minSpend: draftMin || null,
              maxSpend: draftMax || null,
              from: draftFrom || null,
              to: draftTo || null,
            })
          }
        >
          Áp dụng
        </button>
        <p className="text-xs text-muted sm:ml-auto">
          Hiển thị {shown}
          {totalMatched > shown ? ` / ${totalMatched}` : ""} khách
        </p>
      </div>
    </div>
  );
}
