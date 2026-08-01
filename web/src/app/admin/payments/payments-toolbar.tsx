"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import type { PaymentStatusFilter, PaymentsKpi } from "@/lib/admin-payments";
import {
  FIELD_CAPTION_CLASS,
  FIELD_VALUE_NUM_CLASS,
} from "@/storefront/typography";

export function PaymentsToolbar({
  q,
  status,
  provider,
  from,
  to,
  minVnd,
  maxVnd,
  providers,
  kpi,
  shown,
  totalMatched,
}: {
  q: string;
  status: PaymentStatusFilter;
  provider: string;
  from: string;
  to: string;
  minVnd: string;
  maxVnd: string;
  providers: string[];
  kpi: PaymentsKpi;
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
  const [draftMin, setDraftMin] = useState(minVnd);
  const [draftMax, setDraftMax] = useState(maxVnd);

  useEffect(() => setSearch(q), [q]);
  useEffect(() => {
    setDraftFrom(from);
    setDraftTo(to);
    setDraftMin(minVnd);
    setDraftMax(maxVnd);
  }, [from, to, minVnd, maxVnd]);

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
    key: PaymentStatusFilter;
    label: string;
    value: number;
    tone: string;
    ring: string;
  }[] = [
    {
      key: "SUCCEEDED",
      label: "Đã thanh toán",
      value: kpi.paid,
      tone: "text-emerald-700",
      ring: "ring-emerald-100",
    },
    {
      key: "AWAITING",
      label: "Đang chờ",
      value: kpi.awaiting,
      tone: "text-amber-700",
      ring: "ring-amber-100",
    },
    {
      key: "FAILED",
      label: "Thất bại",
      value: kpi.failed,
      tone: "text-red-700",
      ring: "ring-red-100",
    },
    {
      key: "needs_review",
      label: "Cần đối soát",
      value: kpi.needsReview,
      tone: "text-amber-800",
      ring: "ring-amber-100",
    },
  ];

  return (
    <div
      className={`sticky top-0 z-20 -mx-4 space-y-2.5 border-b border-border bg-[#f5f7fa]/95 px-4 py-3 backdrop-blur md:-mx-6 md:px-6 ${
        pending ? "opacity-80" : ""
      }`}
    >
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => {
          const active = status === c.key;
          return (
            <button
              key={c.key}
              type="button"
              onClick={() =>
                push({ status: status === c.key ? null : c.key })
              }
              className={`rounded-xl border bg-card px-3 py-2 text-left ring-1 transition ${c.ring} ${
                active
                  ? "border-accent shadow-sm"
                  : "border-border hover:border-accent/40"
              }`}
            >
              <p className={FIELD_CAPTION_CLASS}>{c.label}</p>
              <p className={`mt-0.5 ${FIELD_VALUE_NUM_CLASS} ${c.tone}`}>
                {c.value.toLocaleString("vi-VN")}
              </p>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-end gap-2">
        <label className="min-w-[200px] flex-1 text-xs">
          <span className="font-medium text-navy">Tìm kiếm</span>
          <input
            className="mt-1 w-full rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm"
            placeholder="Ref, order, email, txn ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <label className="text-xs">
          <span className="font-medium text-navy">Provider</span>
          <select
            className="mt-1 block max-w-[140px] rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm"
            value={provider}
            onChange={(e) => push({ provider: e.target.value || null })}
          >
            <option value="">Tất cả</option>
            {providers.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs">
          <span className="font-medium text-navy">Status</span>
          <select
            className="mt-1 block rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm"
            value={status}
            onChange={(e) => push({ status: e.target.value })}
          >
            <option value="all">Tất cả</option>
            <option value="SUCCEEDED">Đã TT</option>
            <option value="AWAITING">Đang chờ</option>
            <option value="FAILED">Thất bại</option>
            <option value="needs_review">Cần đối soát</option>
          </select>
        </label>
        <label className="text-xs">
          <span className="font-medium text-navy">Từ ngày</span>
          <input
            type="date"
            className="mt-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm"
            value={draftFrom}
            onChange={(e) => setDraftFrom(e.target.value)}
          />
        </label>
        <label className="text-xs">
          <span className="font-medium text-navy">Đến</span>
          <input
            type="date"
            className="mt-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm"
            value={draftTo}
            onChange={(e) => setDraftTo(e.target.value)}
          />
        </label>
        <label className="text-xs">
          <span className="font-medium text-navy">Giá từ</span>
          <input
            inputMode="numeric"
            className="mt-1 w-[100px] rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm"
            value={draftMin}
            onChange={(e) => setDraftMin(e.target.value.replace(/\D/g, ""))}
          />
        </label>
        <label className="text-xs">
          <span className="font-medium text-navy">đến</span>
          <input
            inputMode="numeric"
            className="mt-1 w-[100px] rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm"
            value={draftMax}
            onChange={(e) => setDraftMax(e.target.value.replace(/\D/g, ""))}
          />
        </label>
        <button
          type="button"
          className="rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-white"
          onClick={() =>
            push({
              from: draftFrom || null,
              to: draftTo || null,
              minVnd: draftMin || null,
              maxVnd: draftMax || null,
            })
          }
        >
          Áp dụng
        </button>
        <p className="text-xs text-muted sm:ml-auto">
          {shown}
          {totalMatched > shown ? ` / ${totalMatched}` : ""} payment
        </p>
      </div>
    </div>
  );
}
