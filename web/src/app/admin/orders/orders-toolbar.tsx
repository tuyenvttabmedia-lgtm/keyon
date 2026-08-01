"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import type {
  DatePreset,
  OrdersFilterChip,
  PageSize,
  ReceiveFilter,
  SalesMotionFilter,
} from "@/lib/admin-orders";
import { PAGE_SIZES } from "@/lib/admin-orders";
import {
  BADGE_CLASS,
  FIELD_CAPTION_CLASS,
  FIELD_VALUE_NUM_CLASS,
} from "@/storefront/typography";

export type OrdersSummaryProps = {
  awaitingPayment: number;
  awaitingFulfillment: number;
  needsAction: number;
  completedInRange: number;
  matching: number;
};

const CHIPS: { id: OrdersFilterChip; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "awaiting_payment", label: "Chờ thanh toán" },
  { id: "awaiting_fulfillment", label: "Chờ giao" },
  { id: "fulfilling", label: "Đang giao" },
  { id: "needs_action", label: "Cần xử lý" },
  { id: "completed", label: "Hoàn tất" },
  { id: "cancelled", label: "Hủy / lỗi TT" },
];

const DATES: { id: DatePreset; label: string }[] = [
  { id: "all", label: "Mọi lúc" },
  { id: "today", label: "Hôm nay" },
  { id: "yesterday", label: "Hôm qua" },
  { id: "last7", label: "7 ngày gần đây" },
  { id: "last30", label: "30 ngày gần đây" },
  { id: "thisMonth", label: "Tháng này" },
  { id: "lastMonth", label: "Tháng trước" },
  { id: "custom", label: "Tùy chọn khoảng thời gian" },
];

const RECEIVES: { id: ReceiveFilter; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "key", label: "Key" },
  { id: "account", label: "Tài khoản" },
  { id: "activation", label: "Kích hoạt" },
];

type BrandOpt = { id: string; name: string };
type ProductOpt = { id: string; name: string; brandId: string };

export function OrdersToolbar({
  q,
  chip,
  date,
  from,
  to,
  brandId,
  productId,
  receive,
  provider,
  salesMotion,
  minVnd,
  maxVnd,
  pageSize,
  total,
  page,
  pageCount,
  brands,
  products,
  providers,
  summary,
}: {
  q: string;
  chip: OrdersFilterChip;
  date: DatePreset;
  from: string;
  to: string;
  brandId: string;
  productId: string;
  receive: ReceiveFilter;
  provider: string;
  salesMotion: SalesMotionFilter;
  minVnd: string;
  maxVnd: string;
  pageSize: PageSize;
  total: number;
  page: number;
  pageCount: number;
  brands: BrandOpt[];
  products: ProductOpt[];
  providers: string[];
  summary: OrdersSummaryProps;
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
  }, [from, to]);
  useEffect(() => {
    setDraftMin(minVnd);
    setDraftMax(maxVnd);
  }, [minVnd, maxVnd]);

  const push = useCallback(
    (patch: Record<string, string | null>, resetPage = true) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [k, v] of Object.entries(patch)) {
        if (v == null || v === "" || v === "all") next.delete(k);
        else next.set(k, v);
      }
      if (resetPage) next.delete("page");
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

  const filteredProducts = useMemo(() => {
    if (!brandId) return products;
    return products.filter((p) => p.brandId === brandId);
  }, [products, brandId]);

  const kpiCards: {
    label: string;
    value: number;
    chip: OrdersFilterChip | null;
    tone: string;
    ring: string;
  }[] = [
    {
      label: "Chờ thanh toán",
      value: summary.awaitingPayment,
      chip: "awaiting_payment",
      tone: "text-amber-700",
      ring: "ring-amber-100",
    },
    {
      label: "Chờ / đang giao",
      value: summary.awaitingFulfillment,
      chip: "awaiting_fulfillment",
      tone: "text-amber-800",
      ring: "ring-amber-100",
    },
    {
      label: "Cần xử lý",
      value: summary.needsAction,
      chip: "needs_action",
      tone: "text-red-700",
      ring: "ring-red-100",
    },
    {
      label: "Hoàn tất (khoảng lọc)",
      value: summary.completedInRange,
      chip: "completed",
      tone: "text-emerald-700",
      ring: "ring-emerald-100",
    },
    {
      label: "Khớp bộ lọc",
      value: summary.matching,
      chip: null,
      tone: "text-navy",
      ring: "ring-slate-100",
    },
  ];

  return (
    <div
      className={`sticky top-0 z-20 -mx-4 space-y-2.5 border-b border-border bg-[#f5f7fa]/95 px-4 py-3 backdrop-blur md:-mx-6 md:px-6 ${
        pending ? "opacity-80" : ""
      }`}
    >
      <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-5">
        {kpiCards.map((c) => {
          const active = c.chip != null && chip === c.chip;
          const clickable = c.chip != null;
          const Tag = clickable ? "button" : "div";
          return (
            <Tag
              key={c.label}
              {...(clickable
                ? {
                    type: "button" as const,
                    onClick: () =>
                      push({
                        chip: chip === c.chip ? null : c.chip,
                      }),
                  }
                : {})}
              className={`rounded-xl border bg-card px-3 py-2 text-left ring-1 transition ${c.ring} ${
                clickable
                  ? active
                    ? "border-accent shadow-sm"
                    : "border-border hover:border-accent/40"
                  : "border-border"
              }`}
            >
              <p className={FIELD_CAPTION_CLASS}>{c.label}</p>
              <p className={`mt-0.5 ${FIELD_VALUE_NUM_CLASS} ${c.tone}`}>
                {(c.value ?? 0).toLocaleString("vi-VN")}
              </p>
            </Tag>
          );
        })}
      </div>

      <div className="flex flex-wrap items-end gap-2">
        <label className="min-w-[200px] flex-1 text-xs">
          <span className="font-medium text-navy">Tìm kiếm</span>
          <input
            className="mt-1 w-full rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm"
            placeholder="Mã đơn, email, payment ref…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>

        <label className="text-xs">
          <span className="font-medium text-navy">Thời gian</span>
          <select
            className="mt-1 block max-w-[200px] rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm"
            value={date}
            onChange={(e) => {
              const v = e.target.value as DatePreset;
              if (v !== "custom") {
                push({ date: v === "all" ? null : v, from: null, to: null });
              } else {
                push({ date: "custom" });
              }
            }}
          >
            {DATES.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs">
          <span className="font-medium text-navy">Thương hiệu</span>
          <select
            className="mt-1 block max-w-[160px] rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm"
            value={brandId}
            onChange={(e) =>
              push({
                brandId: e.target.value || null,
                productId: null,
              })
            }
          >
            <option value="">Tất cả</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs">
          <span className="font-medium text-navy">Sản phẩm</span>
          <select
            className="mt-1 block max-w-[180px] rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm"
            value={productId}
            onChange={(e) => push({ productId: e.target.value || null })}
          >
            <option value="">Tất cả</option>
            {filteredProducts.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs">
          <span className="font-medium text-navy">Loại nhận</span>
          <select
            className="mt-1 block rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm"
            value={receive}
            onChange={(e) => push({ receive: e.target.value })}
          >
            {RECEIVES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
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
          <span className="font-medium text-navy">Sales motion</span>
          <select
            className="mt-1 block rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm"
            value={salesMotion}
            onChange={(e) => push({ salesMotion: e.target.value })}
          >
            <option value="all">Tất cả</option>
            <option value="SELF_SERVE">Self-serve</option>
            <option value="QUOTE_REQUIRED">Quote</option>
          </select>
        </label>

        <label className="text-xs">
          <span className="font-medium text-navy">Mỗi trang</span>
          <select
            className="mt-1 block rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm"
            value={pageSize}
            onChange={(e) => push({ pageSize: e.target.value })}
          >
            {PAGE_SIZES.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-end gap-2">
        <label className="text-xs">
          <span className="font-medium text-navy">Giá từ (VND)</span>
          <input
            inputMode="numeric"
            className="mt-1 w-[120px] rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm"
            placeholder="0"
            value={draftMin}
            onChange={(e) => setDraftMin(e.target.value.replace(/\D/g, ""))}
          />
        </label>
        <label className="text-xs">
          <span className="font-medium text-navy">Giá đến (VND)</span>
          <input
            inputMode="numeric"
            className="mt-1 w-[120px] rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm"
            placeholder="—"
            value={draftMax}
            onChange={(e) => setDraftMax(e.target.value.replace(/\D/g, ""))}
          />
        </label>
        <button
          type="button"
          className="rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-white"
          onClick={() =>
            push({
              minVnd: draftMin || null,
              maxVnd: draftMax || null,
            })
          }
        >
          Lọc giá
        </button>
        {minVnd || maxVnd ? (
          <button
            type="button"
            className="rounded-lg border border-border px-3 py-1.5 text-sm text-navy"
            onClick={() => {
              setDraftMin("");
              setDraftMax("");
              push({ minVnd: null, maxVnd: null });
            }}
          >
            Xóa lọc giá
          </button>
        ) : null}
      </div>

      {date === "custom" ? (
        <div className="flex flex-wrap items-end gap-2 rounded-xl border border-border bg-card px-3 py-2">
          <label className="text-xs">
            <span className="font-medium text-navy">Từ ngày</span>
            <input
              type="date"
              className="mt-1 block rounded-lg border border-border px-2.5 py-1.5 text-sm"
              value={draftFrom}
              onChange={(e) => setDraftFrom(e.target.value)}
            />
          </label>
          <label className="text-xs">
            <span className="font-medium text-navy">Đến ngày</span>
            <input
              type="date"
              className="mt-1 block rounded-lg border border-border px-2.5 py-1.5 text-sm"
              value={draftTo}
              onChange={(e) => setDraftTo(e.target.value)}
            />
          </label>
          <button
            type="button"
            className="rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-white"
            onClick={() =>
              push({
                date: "custom",
                from: draftFrom || null,
                to: draftTo || null,
              })
            }
          >
            Áp dụng
          </button>
          <button
            type="button"
            className="rounded-lg border border-border px-3 py-1.5 text-sm text-navy"
            onClick={() => {
              setDraftFrom("");
              setDraftTo("");
              push({ date: null, from: null, to: null });
            }}
          >
            Đặt lại
          </button>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-1.5">
        {CHIPS.map((c) => {
          const hot =
            c.id === "awaiting_payment" ||
            c.id === "needs_action" ||
            c.id === "awaiting_fulfillment" ||
            c.id === "fulfilling";
          const active = chip === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => push({ chip: c.id === "all" ? null : c.id })}
              className={
                active
                  ? hot
                    ? `rounded-full bg-accent px-2.5 py-1 text-white shadow-sm ${BADGE_CLASS}`
                    : `rounded-full bg-navy px-2.5 py-1 font-semibold text-white ${BADGE_CLASS}`
                  : hot
                    ? `rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 font-semibold text-amber-900 hover:bg-amber-100 ${BADGE_CLASS}`
                    : `rounded-full border border-border bg-card px-2.5 py-1 font-medium text-navy hover:bg-navy-soft ${BADGE_CLASS}`
              }
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
        <p>
          <span className="font-medium text-navy">{total.toLocaleString("vi-VN")}</span>{" "}
          đơn · trang {page}/{pageCount}
        </p>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={page <= 1}
            className="rounded-md border border-border bg-card px-2.5 py-1 text-navy disabled:opacity-40"
            onClick={() => push({ page: String(page - 1) }, false)}
          >
            Trước
          </button>
          <button
            type="button"
            disabled={page >= pageCount}
            className="rounded-md border border-border bg-card px-2.5 py-1 text-navy disabled:opacity-40"
            onClick={() => push({ page: String(page + 1) }, false)}
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
}
