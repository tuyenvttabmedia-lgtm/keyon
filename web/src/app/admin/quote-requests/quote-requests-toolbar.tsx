"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import type {
  QuoteRequestStatusFilter,
  QuoteRequestsKpi,
} from "@/lib/admin-quote-requests";
import {
  QUOTE_REQUEST_STATUSES,
  QUOTE_REQUEST_STATUS_LABEL,
} from "@/lib/admin-quote-requests";
import {
  FIELD_CAPTION_CLASS,
  FIELD_VALUE_NUM_CLASS,
} from "@/storefront/typography";

export function QuoteRequestsToolbar({
  q,
  status,
  requestType,
  from,
  to,
  requestTypes,
  kpi,
  shown,
  totalMatched,
}: {
  q: string;
  status: QuoteRequestStatusFilter;
  requestType: string;
  from: string;
  to: string;
  requestTypes: string[];
  kpi: QuoteRequestsKpi;
  shown: number;
  totalMatched: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [search, setSearch] = useState(q);
  const [draftFrom, setDraftFrom] = useState(from);
  const [draftTo, setDraftTo] = useState(to);

  useEffect(() => setSearch(q), [q]);
  useEffect(() => {
    setDraftFrom(from);
    setDraftTo(to);
  }, [from, to]);

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

  const cards: {
    key: QuoteRequestStatusFilter;
    label: string;
    value: number;
    tone: string;
    ring: string;
  }[] = [
    {
      key: "NEW",
      label: QUOTE_REQUEST_STATUS_LABEL.NEW,
      value: kpi.NEW,
      tone: "text-sky-800",
      ring: "ring-sky-100",
    },
    {
      key: "IN_REVIEW",
      label: QUOTE_REQUEST_STATUS_LABEL.IN_REVIEW,
      value: kpi.IN_REVIEW,
      tone: "text-amber-900",
      ring: "ring-amber-100",
    },
    {
      key: "QUOTED",
      label: QUOTE_REQUEST_STATUS_LABEL.QUOTED,
      value: kpi.QUOTED,
      tone: "text-emerald-800",
      ring: "ring-emerald-100",
    },
    {
      key: "CLOSED",
      label: QUOTE_REQUEST_STATUS_LABEL.CLOSED,
      value: kpi.CLOSED,
      tone: "text-slate-700",
      ring: "ring-slate-200",
    },
  ];

  return (
    <div
      className={`sticky top-0 z-20 -mx-4 space-y-2.5 border-b border-border bg-[#f5f7fa]/95 px-4 py-3 backdrop-blur md:-mx-6 md:px-6 ${
        pending ? "opacity-80" : ""
      }`}
    >
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => push({ status: status === c.key ? "all" : c.key })}
            className={`rounded-xl border border-border bg-card px-3 py-2 text-left ring-2 transition ${
              status === c.key ? c.ring : "ring-transparent"
            }`}
          >
            <p className={FIELD_CAPTION_CLASS}>{c.label}</p>
            <p className={`${FIELD_VALUE_NUM_CLASS} ${c.tone}`}>{c.value}</p>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-end gap-2">
        <label className="min-w-[200px] flex-1 text-xs">
          <span className="font-medium text-navy">Tìm kiếm</span>
          <input
            className="mt-1 w-full rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm"
            placeholder="Mã QT-, email, công ty, SĐT…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <label className="text-xs">
          <span className="font-medium text-navy">Trạng thái</span>
          <select
            className="mt-1 block rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm"
            value={status}
            onChange={(e) => push({ status: e.target.value })}
          >
            <option value="all">Tất cả</option>
            {QUOTE_REQUEST_STATUSES.map((s) => (
              <option key={s} value={s}>
                {QUOTE_REQUEST_STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs">
          <span className="font-medium text-navy">Loại yêu cầu</span>
          <select
            className="mt-1 block max-w-[12rem] rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm"
            value={requestType}
            onChange={(e) => push({ requestType: e.target.value || null })}
          >
            <option value="">Tất cả</option>
            {requestTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs">
          <span className="font-medium text-navy">Từ ngày</span>
          <input
            type="date"
            className="mt-1 block rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm"
            value={draftFrom}
            onChange={(e) => setDraftFrom(e.target.value)}
            onBlur={() => push({ from: draftFrom || null })}
          />
        </label>
        <label className="text-xs">
          <span className="font-medium text-navy">Đến ngày</span>
          <input
            type="date"
            className="mt-1 block rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm"
            value={draftTo}
            onChange={(e) => setDraftTo(e.target.value)}
            onBlur={() => push({ to: draftTo || null })}
          />
        </label>
      </div>

      <p className={FIELD_CAPTION_CLASS}>
        Hiển thị {shown.toLocaleString("vi-VN")} /{" "}
        {totalMatched.toLocaleString("vi-VN")} yêu cầu
        {kpi.SPAM > 0 ? ` · ${kpi.SPAM} spam` : ""}
      </p>
    </div>
  );
}
