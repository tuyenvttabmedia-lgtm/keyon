"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import type { AccountCopy } from "@/storefront/lib/account-cms";
import { StoreButton } from "@/storefront/components/StoreButton";
import { PortalMenu } from "@/components/PortalMenu";
import {
  BADGE_CLASS,
  BREADCRUMB_CLASS,
  BREADCRUMB_CURRENT_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  CTA_COMPACT_CLASS,
  EMPTY_BODY_CLASS,
  EMPTY_TITLE_CLASS,
  FORM_LABEL_CLASS,
  INLINE_PRICE_CLASS,
  INPUT_TEXT_CLASS,
  LINK_FIELD_CLASS,
  PAGE_TITLE_CLASS,
  SECTION_LEAD_CLASS,
  TAB_ACTIVE_CLASS,
  TAB_CLASS,
  TABLE_HEADER_CLASS,
} from "@/storefront/typography";
import {
  CARD_PORTAL,
  CHART_FILL_OPACITY,
  CHART_STROKE_WIDTH,
  ELEVATION_NONE,
  HOVER_LINK_ACCENT,
  HOVER_OUTLINE_FILL,
  HOVER_ROW,
  HOVER_SOFT,
  OPACITY_DISABLED,
  TRANSITION_UI,
} from "@/storefront/effects";

const CARD = CARD_PORTAL;

const BTN_OUTLINE = `inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-white px-3 ${CTA_COMPACT_CLASS} text-navy ${TRANSITION_UI} ${HOVER_OUTLINE_FILL}`;

const LINK_MENU = `block px-3 py-2 ${CTA_COMPACT_CLASS} text-navy ${TRANSITION_UI} ${HOVER_SOFT}`;

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50] as const;

export type OrderListTab = "all" | "success" | "processing" | "cancelled";

export type OrderListStatusTone = "success" | "warning" | "danger" | "muted";

export type OrderListItem = {
  id: string;
  code: string;
  createdAtIso: string;
  totalVnd: number;
  /** Counts toward spend when true */
  countsAsSpend: boolean;
  tab: Exclude<OrderListTab, "all">;
  statusLabel: string;
  statusSub: string;
  statusTone: OrderListStatusTone;
  productTitle: string;
  productImageUrl: string | null;
  quantity: number;
  paymentMethodLabel: string;
  paymentReference: string | null;
};

type SpendPeriod = "12m" | "6m" | "all";

export function OrdersView({
  cms,
  items,
  companyName = null,
}: {
  cms: AccountCopy;
  items: OrderListItem[];
  companyName?: string | null;
}) {
  const [tab, setTab] = useState<OrderListTab>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZE_OPTIONS)[number]>(5);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [spendPeriod, setSpendPeriod] = useState<SpendPeriod>("12m");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const counts = useMemo(() => {
    const c = { all: items.length, success: 0, processing: 0, cancelled: 0 };
    for (const it of items) c[it.tab] += 1;
    return c;
  }, [items]);

  const spendSeries = useMemo(
    () => buildMonthlySpendSeries(items, spendPeriod),
    [items, spendPeriod],
  );

  const spendTotal = useMemo(
    () => spendSeries.reduce((sum, v) => sum + v, 0),
    [spendSeries],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const fromMs = dateFrom ? new Date(`${dateFrom}T00:00:00`).getTime() : null;
    const toMs = dateTo ? new Date(`${dateTo}T23:59:59`).getTime() : null;
    return items.filter((it) => {
      if (tab !== "all" && it.tab !== tab) return false;
      const t = new Date(it.createdAtIso).getTime();
      if (fromMs != null && t < fromMs) return false;
      if (toMs != null && t > toMs) return false;
      if (!q) return true;
      return (
        it.code.toLowerCase().includes(q) ||
        it.productTitle.toLowerCase().includes(q) ||
        (it.paymentReference?.toLowerCase().includes(q) ?? false) ||
        it.paymentMethodLabel.toLowerCase().includes(q)
      );
    });
  }, [items, tab, query, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const slice = filtered.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );
  const from = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = Math.min(safePage * pageSize, filtered.length);

  const tabs: { id: OrderListTab; label: string; count: number }[] = [
    { id: "all", label: cms.ordersTabAll, count: counts.all },
    { id: "success", label: cms.ordersTabSuccess, count: counts.success },
    {
      id: "processing",
      label: cms.ordersTabProcessing,
      count: counts.processing,
    },
    { id: "cancelled", label: cms.ordersTabCancelled, count: counts.cancelled },
  ];

  const periodSub =
    spendPeriod === "all"
      ? "Toàn bộ thời gian"
      : spendPeriod === "6m"
        ? "Trong 6 tháng qua"
        : "Trong 12 tháng qua";

  return (
    <div className="space-y-5">
      <nav className={`flex flex-wrap items-center gap-1.5 ${BREADCRUMB_CLASS}`}>
        <Link href="/" className={HOVER_LINK_ACCENT}>
          Trang chủ
        </Link>
        <span aria-hidden>›</span>
        <Link
          href="/account"
          className={HOVER_LINK_ACCENT}
        >
          Tài khoản
        </Link>
        <span aria-hidden>›</span>
        <span className={BREADCRUMB_CURRENT_CLASS}>{cms.ordersPageTitle}</span>
      </nav>

      {/* Title left; spend card hugs content width (mockup). */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        <div className="min-w-0 lg:max-w-[20rem]">
          <h1 className={PAGE_TITLE_CLASS}>{cms.ordersPageTitle}</h1>
          <p className={`mt-1.5 ${SECTION_LEAD_CLASS}`}>
            {companyName
              ? `Đơn gắn tài khoản này · ${companyName}. Không gồm đơn của đồng nghiệp khác cùng công ty.`
              : cms.ordersPageLead}
          </p>
        </div>
        <section className={`${CARD} w-fit max-w-full shrink-0 !px-4 !py-3`}>
          <div className="flex items-center gap-3 sm:gap-3.5">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
              <BagIcon />
            </span>
            <div className="min-w-0 shrink-0">
              <p className={FORM_LABEL_CLASS}>{cms.ordersSpendLabel}</p>
              <p className={`mt-0.5 ${INLINE_PRICE_CLASS}`}>
                {spendTotal.toLocaleString("vi-VN")}đ
              </p>
              <p className={`mt-0.5 ${CARD_META_CLASS}`}>{periodSub}</p>
            </div>
            <div className="hidden w-[7.5rem] shrink-0 sm:block">
              <Sparkline values={spendSeries} />
            </div>
            <label className="relative shrink-0">
              <span className="sr-only">Kỳ chi tiêu</span>
              <select
                value={spendPeriod}
                onChange={(e) =>
                  setSpendPeriod(e.target.value as SpendPeriod)
                }
                className={`h-9 appearance-none rounded-lg border border-border bg-white py-1.5 pl-2.5 pr-7 ${CTA_COMPACT_CLASS} text-navy outline-none ${TRANSITION_UI} focus:border-accent`}
              >
                <option value="12m">{cms.ordersSpendPeriodLabel}</option>
                <option value="6m">6 tháng qua</option>
                <option value="all">Tất cả</option>
              </select>
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted">
                ▾
              </span>
            </label>
          </div>
        </section>
      </div>

      {/* Tabs full row so all 4 visible; filters on next row. */}
      <div className="space-y-3 border-b border-border pb-3">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setTab(t.id);
                  setPage(1);
                }}
                className={`shrink-0 border-b-2 px-3 py-2 ${TRANSITION_UI} ${
                  active
                    ? `${TAB_ACTIVE_CLASS} border-navy`
                    : `${TAB_CLASS} border-transparent hover:text-navy`
                }`}
              >
                {t.label} ({t.count})
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative w-full max-w-[11.5rem] sm:w-44">
            <span className="sr-only">{cms.ordersSearchPlaceholder}</span>
            <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted">
              <SearchIcon />
            </span>
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder={cms.ordersSearchPlaceholder}
              className={`h-9 w-full rounded-xl border border-border bg-white pl-8 pr-2.5 ${INPUT_TEXT_CLASS} outline-none ${TRANSITION_UI} focus:border-accent`}
            />
          </label>
          <button
            type="button"
            className={`${BTN_OUTLINE} !h-9`}
            title="Tìm theo mã đơn, sản phẩm hoặc mã thanh toán"
            onClick={() => searchRef.current?.focus()}
          >
            <FilterIcon />
            {cms.ordersFilterCta}
          </button>
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5 sm:justify-end">
            <div className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border bg-white px-2">
              <CalendarIcon />
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setPage(1);
                }}
                className={`w-[7.25rem] bg-transparent ${CARD_META_CLASS} !text-navy outline-none`}
                aria-label="Từ ngày"
              />
            </div>
            <span className={CARD_META_CLASS}>–</span>
            <div className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border bg-white px-2">
              <CalendarIcon />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setPage(1);
                }}
                className={`w-[7.25rem] bg-transparent ${CARD_META_CLASS} !text-navy outline-none`}
                aria-label="Đến ngày"
              />
            </div>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className={`rounded-2xl border border-dashed border-border bg-white px-6 py-16 text-center ${ELEVATION_NONE}`}>
          <p className={EMPTY_TITLE_CLASS}>{cms.ordersEmptyTitle}</p>
          <p className={`mx-auto mt-2 max-w-md ${EMPTY_BODY_CLASS}`}>
            {cms.ordersEmptyBody}
          </p>
          <div className="mt-6 flex justify-center">
            <StoreButton href="/products">Khám phá sản phẩm</StoreButton>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className={`${CARD} text-center`}>
          <p className={CARD_TITLE_CLASS}>Không tìm thấy đơn phù hợp</p>
          <p className={`mt-1 ${SECTION_LEAD_CLASS}`}>
            Thử đổi tab, từ khóa hoặc khoảng ngày.
          </p>
        </div>
      ) : (
        <div className={`overflow-x-auto rounded-2xl border border-border bg-white ${ELEVATION_NONE}`}>
          <div
            className={`hidden min-w-[52rem] gap-x-2 border-b border-border bg-surface px-3 py-3 lg:grid lg:grid-cols-[7.75rem_minmax(0,1.35fr)_5rem_minmax(0,0.95fr)_6.25rem_7.5rem_2rem] ${TABLE_HEADER_CLASS}`}
          >
            <span>{cms.ordersColOrder}</span>
            <span>{cms.ordersColProduct}</span>
            <span>{cms.ordersColDate}</span>
            <span>{cms.ordersColPayment}</span>
            <span>{cms.ordersColStatus}</span>
            <span className="text-right">{cms.ordersColTotal}</span>
            <span />
          </div>
          <ul className="min-w-[52rem] divide-y divide-border">
            {slice.map((it) => (
              <OrderRow
                key={it.id}
                cms={cms}
                item={it}
                menuOpen={openMenuId === it.id}
                onToggleMenu={() =>
                  setOpenMenuId((id) => (id === it.id ? null : it.id))
                }
                onCloseMenu={() => setOpenMenuId(null)}
              />
            ))}
          </ul>
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <p className={CARD_META_CLASS}>
            Hiển thị {from} đến {to} của {filtered.length} đơn hàng
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <label className={`inline-flex items-center gap-2 ${CARD_META_CLASS}`}>
              <span>Mỗi trang</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(
                    Number(e.target.value) as (typeof PAGE_SIZE_OPTIONS)[number],
                  );
                  setPage(1);
                }}
                className={`h-9 rounded-lg border border-border bg-white px-2 ${CTA_COMPACT_CLASS} text-navy outline-none focus:border-accent`}
              >
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span>đơn</span>
            </label>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-navy ${TRANSITION_UI} enabled:hover:border-accent enabled:hover:bg-accent enabled:hover:text-white ${OPACITY_DISABLED}`}
              >
                ‹
              </button>
              {pageNumbers(safePage, totalPages).map((n, i) =>
                n === "…" ? (
                  <span key={`e${i}`} className={`px-1 ${CARD_META_CLASS}`}>
                    …
                  </span>
                ) : (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPage(n)}
                    className={
                      n === safePage
                        ? `inline-flex h-9 min-w-9 items-center justify-center rounded-lg bg-navy px-2 ${CTA_COMPACT_CLASS} text-white`
                        : `inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-border px-2 ${CTA_COMPACT_CLASS} text-navy ${TRANSITION_UI} ${HOVER_OUTLINE_FILL}`
                    }
                  >
                    {n}
                  </button>
                ),
              )}
              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-navy ${TRANSITION_UI} enabled:hover:border-accent enabled:hover:bg-accent enabled:hover:text-white ${OPACITY_DISABLED}`}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

const ORDER_MENU_W = 168;

function OrderRow({
  cms,
  item,
  menuOpen,
  onToggleMenu,
  onCloseMenu,
}: {
  cms: AccountCopy;
  item: OrderListItem;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);

  const created = new Date(item.createdAtIso);
  const dateLabel = created.toLocaleDateString("vi-VN");
  const timeLabel = created.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <li className={`relative px-3 py-4 ${TRANSITION_UI} ${HOVER_ROW}`}>
      <div className="grid gap-x-2 gap-y-3 lg:grid-cols-[7.75rem_minmax(0,1.35fr)_5rem_minmax(0,0.95fr)_6.25rem_7.5rem_2rem] lg:items-center">
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <p className={`truncate ${CARD_TITLE_CLASS}`}>#{item.code}</p>
            <CopyIconButton value={item.code} />
          </div>
          <Link
            href={`/account/orders/${item.id}`}
            className={`mt-1 inline-flex ${LINK_FIELD_CLASS}`}
          >
            {cms.ordersDetailCta} ›
          </Link>
        </div>

        <div className="flex min-w-0 items-center gap-2">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-surface">
            {item.productImageUrl ? (
              <Image
                src={item.productImageUrl}
                alt=""
                fill
                className="object-cover"
                sizes="40px"
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center text-[10px] font-bold text-navy">
                KEY
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className={`line-clamp-2 ${CARD_TITLE_CLASS}`}>
              {item.productTitle}
            </p>
            <p className={`mt-0.5 ${CARD_META_CLASS}`}>
              {item.quantity} {cms.ordersQtySuffix}
            </p>
          </div>
        </div>

        <div className="min-w-0">
          <p className={CARD_TITLE_CLASS}>{dateLabel}</p>
          <p className={`mt-0.5 ${CARD_META_CLASS}`}>{timeLabel}</p>
        </div>

        <div className="min-w-0">
          <p className={`truncate ${CARD_TITLE_CLASS}`}>
            {item.paymentMethodLabel}
          </p>
          {item.paymentReference ? (
            <p className={`mt-0.5 truncate ${CARD_META_CLASS}`}>
              {cms.ordersTxnPrefix}: {item.paymentReference}
            </p>
          ) : (
            <p className={`mt-0.5 ${CARD_META_CLASS}`}>—</p>
          )}
        </div>

        <div className="min-w-0">
          <span
            className={`inline-flex max-w-full truncate rounded-full px-2 py-0.5 ${BADGE_CLASS} ${toneClass(item.statusTone)}`}
          >
            {item.statusLabel}
          </span>
          <p className={`mt-1 truncate ${CARD_META_CLASS}`}>{item.statusSub}</p>
        </div>

        <div className="flex min-w-0 items-center justify-end">
          <p className={`whitespace-nowrap ${INLINE_PRICE_CLASS}`}>
            {item.totalVnd.toLocaleString("vi-VN")}đ
          </p>
        </div>

        <div className="relative flex justify-end">
          <button
            ref={btnRef}
            type="button"
            aria-label="Thêm thao tác"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            onClick={onToggleMenu}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-navy ${TRANSITION_UI} ${HOVER_OUTLINE_FILL}`}
          >
            ⋮
          </button>
          <PortalMenu
            open={menuOpen}
            onClose={onCloseMenu}
            anchorRef={btnRef}
            width={ORDER_MENU_W}
            className="bg-white py-1"
          >
            <Link
              href={`/account/orders/${item.id}`}
              className={LINK_MENU}
              role="menuitem"
              onClick={onCloseMenu}
            >
              {cms.ordersDetailCta}
            </Link>
            <Link
              href={`/account/tickets?orderId=${item.id}`}
              className={LINK_MENU}
              role="menuitem"
              onClick={onCloseMenu}
            >
              Yêu cầu hỗ trợ
            </Link>
          </PortalMenu>
        </div>
      </div>
    </li>
  );
}

function CopyIconButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      title={copied ? "Đã chép" : "Chép mã đơn"}
      onClick={async (e) => {
        e.preventDefault();
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* ignore */
        }
      }}
      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted ${TRANSITION_UI} ${HOVER_SOFT}`}
    >
      {copied ? (
        <span className="text-[10px] font-bold text-accent">✓</span>
      ) : (
        <CopyMini />
      )}
    </button>
  );
}

function pageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set<number>([1, total, current, current - 1, current + 1]);
  const sorted = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    const n = sorted[i]!;
    if (i > 0 && n - sorted[i - 1]! > 1) out.push("…");
    out.push(n);
  }
  return out;
}

function toneClass(tone: OrderListStatusTone) {
  switch (tone) {
    case "success":
      return "bg-emerald-50 text-emerald-700";
    case "warning":
      return "bg-amber-50 text-amber-800";
    case "danger":
      return "bg-rose-50 text-rose-700";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

function monthBucketKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}`;
}

/** Monthly spend buckets for the selected period (oldest → newest). */
function buildMonthlySpendSeries(
  items: OrderListItem[],
  period: SpendPeriod,
): number[] {
  const now = new Date();
  const months: Date[] = [];

  if (period === "6m" || period === "12m") {
    const count = period === "6m" ? 6 : 12;
    for (let i = count - 1; i >= 0; i--) {
      months.push(new Date(now.getFullYear(), now.getMonth() - i, 1));
    }
  } else {
    let earliest = now;
    let hasSpend = false;
    for (const it of items) {
      if (!it.countsAsSpend) continue;
      hasSpend = true;
      const t = new Date(it.createdAtIso);
      if (t < earliest) earliest = t;
    }
    if (!hasSpend) {
      for (let i = 5; i >= 0; i--) {
        months.push(new Date(now.getFullYear(), now.getMonth() - i, 1));
      }
    } else {
      let cur = new Date(earliest.getFullYear(), earliest.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 1);
      while (cur <= end) {
        months.push(new Date(cur));
        cur = new Date(cur.getFullYear(), cur.getMonth() + 1, 1);
      }
      if (months.length > 24) months.splice(0, months.length - 24);
      if (months.length < 2) {
        months.length = 0;
        for (let i = 5; i >= 0; i--) {
          months.push(new Date(now.getFullYear(), now.getMonth() - i, 1));
        }
      }
    }
  }

  const totals = new Map<string, number>();
  for (const m of months) totals.set(monthBucketKey(m), 0);

  for (const it of items) {
    if (!it.countsAsSpend) continue;
    const key = monthBucketKey(new Date(it.createdAtIso));
    if (!totals.has(key)) continue;
    totals.set(key, (totals.get(key) ?? 0) + it.totalVnd);
  }

  return months.map((m) => totals.get(monthBucketKey(m)) ?? 0);
}

function sparklinePaths(values: number[], width: number, height: number) {
  const n = values.length;
  if (n === 0) {
    return { line: "", area: "" };
  }
  const max = Math.max(...values, 0);
  const padX = 1;
  const padY = 3;
  const usableW = width - padX * 2;
  const usableH = height - padY * 2;

  const points = values.map((v, i) => {
    const x = n === 1 ? width / 2 : padX + (i / (n - 1)) * usableW;
    const y =
      max <= 0
        ? height - padY
        : padY + usableH - (v / max) * usableH;
    return { x, y };
  });

  const line = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
  const first = points[0]!;
  const last = points[n - 1]!;
  const area = `${line} L${last.x.toFixed(1)} ${height} L${first.x.toFixed(1)} ${height} Z`;
  return { line, area };
}

function Sparkline({ values }: { values: number[] }) {
  const width = 120;
  const height = 36;
  const { line, area } = sparklinePaths(values, width, height);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="h-9 w-full text-accent"
      aria-hidden
      preserveAspectRatio="none"
    >
      {area ? (
        <path
          d={area}
          fill="currentColor"
          opacity={CHART_FILL_OPACITY}
        />
      ) : null}
      {line ? (
        <path
          d={line}
          fill="none"
          stroke="currentColor"
          strokeWidth={CHART_STROKE_WIDTH}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="nonScalingStroke"
        />
      ) : null}
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 8h12l-1 12H7L6 8Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M9 8V7a3 3 0 0 1 6 0v1"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="m16 16 4 4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 6h16M7 12h10M10 18h4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="shrink-0 text-muted"
    >
      <rect
        x="3.5"
        y="5"
        width="17"
        height="15"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M3.5 10h17M8 3.5v3M16 3.5v3"
        stroke="currentColor"
        strokeWidth="1.75"
      />
    </svg>
  );
}

function CopyMini() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="9"
        y="9"
        width="11"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M5 15V5a2 2 0 0 1 2-2h10"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}
