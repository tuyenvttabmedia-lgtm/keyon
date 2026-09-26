"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import type { AccountCopy } from "@/storefront/lib/account-cms";
import type { OrderListStatusTone } from "@/storefront/lib/order-list-status";
import {
  BADGE_CLASS,
  BODY_MUTED_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  CTA_COMPACT_CLASS,
  EMPTY_BODY_CLASS,
  FIELD_VALUE_NUM_CLASS,
  FORM_LABEL_CLASS,
  INLINE_PRICE_CLASS,
  LINK_ACCENT_CLASS,
  SECTION_LEAD_CLASS,
  SUBSECTION_TITLE_CLASS,
} from "@/storefront/typography";
import {
  CARD_PORTAL,
  CHART_FILL_OPACITY,
  CHART_POINT_R,
  CHART_POINT_R_HOVER,
  CHART_STROKE_WIDTH,
  HOVER_ROW,
  HOVER_SOFT,
  TRANSITION_UI,
} from "@/storefront/effects";

const CARD = CARD_PORTAL;

export type OverviewPeriod = "7d" | "30d" | "90d";

export type OverviewOrderRow = {
  id: string;
  code: string;
  createdAtIso: string;
  productTitle: string;
  productImageUrl: string | null;
  totalVnd: number;
  statusLabel: string;
  statusTone: OrderListStatusTone;
};

export type OverviewSpendPoint = {
  createdAtIso: string;
  amountVnd: number;
};

export type OverviewLicenseEvent = {
  createdAtIso: string;
  bucket: OverviewLicenseBucket;
};

export type OverviewLicenseBucket =
  | "activating"
  | "ready"
  | "expired"
  | "unavailable";

export type OverviewNoti = {
  id: string;
  title: string;
  body: string;
  href: string | null;
  createdAtIso: string;
  readAt: string | null;
};

export type OverviewLicenseBreakdown = Record<OverviewLicenseBucket, number>;

type Props = {
  cms: AccountCopy;
  userName: string | null;
  recentOrders: OverviewOrderRow[];
  orderCreatedAt: string[];
  spendPoints: OverviewSpendPoint[];
  licenseEvents: OverviewLicenseEvent[];
  licenseBreakdown: OverviewLicenseBreakdown;
  notifications: OverviewNoti[];
};

export function OverviewView({
  cms,
  userName,
  recentOrders,
  orderCreatedAt,
  spendPoints,
  licenseEvents,
  licenseBreakdown,
  notifications,
}: Props) {
  const [statsPeriod, setStatsPeriod] = useState<OverviewPeriod>("7d");
  const [spendPeriod, setSpendPeriod] = useState<OverviewPeriod>("7d");
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const stats = useMemo(
    () => computePeriodStats(statsPeriod, orderCreatedAt, licenseEvents),
    [statsPeriod, orderCreatedAt, licenseEvents],
  );

  const spend = useMemo(
    () => buildDailySpendSeries(spendPoints, spendPeriod),
    [spendPoints, spendPeriod],
  );

  const spendTotal = spend.values.reduce((s, v) => s + v, 0);
  const spendDeltaPct = percentChange(spendTotal, spend.prevTotal);
  const periodLabel = (p: OverviewPeriod) =>
    p === "7d"
      ? cms.overviewPeriod7d
      : p === "30d"
        ? cms.overviewPeriod30d
        : cms.overviewPeriod90d;

  const licenseTotal =
    licenseBreakdown.activating +
    licenseBreakdown.ready +
    licenseBreakdown.expired +
    licenseBreakdown.unavailable;

  const welcomeName = userName?.trim() || "bạn";

  return (
    <div className="space-y-4">
      {/* Row 1: welcome + account stats */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-stretch">
        <section
          className={`${CARD} relative overflow-hidden !py-5 sm:!py-6`}
          style={{
            background:
              "linear-gradient(100deg, #ffffff 55%, rgba(14,165,164,0.1) 100%)",
          }}
        >
          <div className="relative z-10 max-w-lg pr-4 sm:pr-36 md:pr-40">
            <h1 className={SUBSECTION_TITLE_CLASS}>
              {cms.overviewWelcomeHi}, {welcomeName}{" "}
              <span aria-hidden>👋</span>
            </h1>
            <p className={`mt-2 ${SECTION_LEAD_CLASS}`}>
              {cms.overviewWelcomeBody}
            </p>
          </div>
          <WelcomeArtwork />
        </section>

        <section className={`${CARD} !py-5`}>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className={SUBSECTION_TITLE_CLASS}>{cms.overviewStatsTitle}</h2>
            <PeriodSelect
              value={statsPeriod}
              onChange={setStatsPeriod}
              label7={cms.overviewPeriod7d}
              label30={cms.overviewPeriod30d}
              label90={cms.overviewPeriod90d}
            />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <StatTile
              icon={<OrdersStatIcon />}
              value={stats.orders.current}
              label={cms.overviewStatOrders}
              deltaPct={stats.orders.deltaPct}
            />
            <StatTile
              icon={<LicenseStatIcon />}
              value={stats.licenses.current}
              label={cms.overviewStatLicenses}
              deltaPct={stats.licenses.deltaPct}
            />
            <StatTile
              icon={<ActivatingStatIcon />}
              value={stats.activating.current}
              label={cms.overviewStatActivating}
              deltaPct={stats.activating.deltaPct}
            />
            <StatTile
              icon={<CompletedStatIcon />}
              value={stats.completed.current}
              label={cms.overviewStatCompleted}
              deltaPct={stats.completed.deltaPct}
            />
          </div>
        </section>
      </div>

      {/* Row 2: recent orders — full width */}
      <section className={`${CARD} !py-5`}>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className={SUBSECTION_TITLE_CLASS}>
            {cms.overviewRecentOrdersTitle}
          </h2>
          <Link href="/account/orders" className={LINK_ACCENT_CLASS}>
            {cms.overviewViewAll}
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className={EMPTY_BODY_CLASS}>{cms.overviewEmptyOrders}</p>
        ) : (
          <ul className="-mx-1 divide-y divide-border">
            {recentOrders.map((o) => (
              <li key={o.id}>
                <Link
                  href={`/account/orders/${o.id}`}
                  className={`flex items-center gap-2.5 rounded-lg px-1 py-2.5 ${TRANSITION_UI} ${HOVER_ROW}`}
                >
                  <span className="relative inline-flex h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-border bg-surface">
                    {o.productImageUrl ? (
                      <Image
                        src={o.productImageUrl}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="36px"
                      />
                    ) : (
                      <span className="m-auto text-muted">
                        <BoxMiniIcon />
                      </span>
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={`truncate ${CARD_TITLE_CLASS}`}>
                      {o.productTitle}
                    </p>
                    <p className={`mt-0.5 truncate ${CARD_META_CLASS}`}>
                      {o.code} · {formatDateVi(o.createdAtIso)}
                    </p>
                  </div>
                  <span
                    className={`inline-flex shrink-0 rounded-full px-2 py-0.5 ${BADGE_CLASS} ${toneBadge(o.statusTone)}`}
                  >
                    {o.statusLabel}
                  </span>
                  <p
                    className={`hidden w-[5.75rem] shrink-0 text-right sm:block ${INLINE_PRICE_CLASS}`}
                  >
                    {o.totalVnd.toLocaleString("vi-VN")}đ
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Row 3: licenses + spend */}
      <div className="grid gap-4 lg:grid-cols-2 lg:items-stretch">
        <section className={`${CARD} flex flex-col !py-5`}>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className={SUBSECTION_TITLE_CLASS}>
              {cms.overviewLicensesTitle}
            </h2>
            <Link href="/account/assets" className={LINK_ACCENT_CLASS}>
              {cms.overviewViewAll}
            </Link>
          </div>
          <div className="flex min-h-[11.5rem] flex-1 items-center gap-5 sm:gap-6">
            <DonutChart
              total={licenseTotal}
              segments={[
                {
                  value: licenseBreakdown.activating,
                  color: "#0ea5a4",
                },
                {
                  value: licenseBreakdown.ready,
                  color: "#34d399",
                },
                {
                  value: licenseBreakdown.expired,
                  color: "#fbbf24",
                },
                {
                  value: licenseBreakdown.unavailable,
                  color: "#94a3b8",
                },
              ]}
            />
            <ul className="grid min-w-0 flex-1 grid-cols-1 gap-3 sm:gap-3.5">
              <LegendRow
                color="#0ea5a4"
                label={cms.overviewLicenseActivating}
                count={licenseBreakdown.activating}
              />
              <LegendRow
                color="#34d399"
                label={cms.overviewLicenseReady}
                count={licenseBreakdown.ready}
              />
              <LegendRow
                color="#fbbf24"
                label={cms.overviewLicenseExpired}
                count={licenseBreakdown.expired}
              />
              <LegendRow
                color="#94a3b8"
                label={cms.overviewLicenseUnavailable}
                count={licenseBreakdown.unavailable}
              />
            </ul>
          </div>
        </section>

        <section className={`${CARD} flex flex-col !py-5`}>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <h2 className={SUBSECTION_TITLE_CLASS}>{cms.overviewSpendTitle}</h2>
            <PeriodSelect
              value={spendPeriod}
              onChange={(p) => {
                setSpendPeriod(p);
                setHoverIdx(null);
              }}
              label7={cms.overviewPeriod7d}
              label30={cms.overviewPeriod30d}
              label90={cms.overviewPeriod90d}
            />
          </div>
          <p className={INLINE_PRICE_CLASS}>
            {spendTotal.toLocaleString("vi-VN")}đ
          </p>
          <p className={`mt-1 ${CARD_META_CLASS}`}>
            <DeltaText pct={spendDeltaPct} /> {cms.overviewSpendComparePrefix}{" "}
            {periodLabel(spendPeriod).toLowerCase().replace(" qua", " trước")}
          </p>
          <div className="mt-auto pt-2">
            <SpendChart
              labels={spend.labels}
              values={spend.values}
              hoverIdx={hoverIdx}
              onHover={setHoverIdx}
            />
          </div>
        </section>
      </div>

      {/* Row 4: shortcuts + notifications */}
      <div className="grid gap-4 lg:grid-cols-2 lg:items-stretch">
        <section className={`${CARD} !py-5`}>
          <h2 className={`mb-3 ${SUBSECTION_TITLE_CLASS}`}>
            {cms.overviewShortcutsTitle}
          </h2>
          <div className="grid grid-cols-3 gap-2">
            <Shortcut href="/products" label={cms.overviewShortcutShop} icon="shop" />
            <Shortcut
              href="/account/assets"
              label={cms.overviewShortcutLicenses}
              icon="license"
            />
            <Shortcut
              href="/account/orders"
              label={cms.overviewShortcutOrders}
              icon="orders"
            />
            <Shortcut
              href="/account/tickets"
              label={cms.overviewShortcutSupport}
              icon="support"
            />
            <Shortcut href="/faq" label={cms.overviewShortcutFaq} icon="faq" />
            <Shortcut
              href={cms.activationGuideHref || "/faq"}
              label={cms.overviewShortcutGuide}
              icon="guide"
            />
          </div>
        </section>

        <section className={`${CARD} !py-5`}>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className={SUBSECTION_TITLE_CLASS}>{cms.overviewNotiTitle}</h2>
            <Link href="/account/notifications" className={LINK_ACCENT_CLASS}>
              {cms.overviewViewAll}
            </Link>
          </div>
          {notifications.length === 0 ? (
            <p className={EMPTY_BODY_CLASS}>{cms.overviewEmptyNoti}</p>
          ) : (
            <ul className="space-y-2.5">
              {notifications.map((n) => (
                <li key={n.id}>
                  <Link
                    href={n.href || "/account/notifications"}
                    className={`flex gap-2.5 rounded-lg px-1 py-1 ${TRANSITION_UI} hover:bg-surface`}
                  >
                    <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                      <BellMiniIcon />
                    </span>
                    <div className="min-w-0 flex-1 py-0.5">
                      <p className={`line-clamp-2 ${CARD_TITLE_CLASS}`}>
                        {n.title}
                      </p>
                      {n.body ? (
                        <p className={`mt-0.5 line-clamp-1 ${BODY_MUTED_CLASS}`}>
                          {n.body}
                        </p>
                      ) : null}
                      <p className={`mt-1 ${CARD_META_CLASS}`}>
                        {relativeTimeVi(n.createdAtIso)}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

/* ─── Stats / series helpers ─────────────────────────────────────────────── */

function daysForPeriod(period: OverviewPeriod) {
  return period === "7d" ? 7 : period === "30d" ? 30 : 90;
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function percentChange(current: number, previous: number) {
  if (previous <= 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

function countInRange(isos: string[], fromMs: number, toMs: number) {
  let n = 0;
  for (const iso of isos) {
    const t = new Date(iso).getTime();
    if (t >= fromMs && t < toMs) n += 1;
  }
  return n;
}

function computePeriodStats(
  period: OverviewPeriod,
  orderCreatedAt: string[],
  licenseEvents: OverviewLicenseEvent[],
) {
  const days = daysForPeriod(period);
  const now = Date.now();
  const curFrom = now - days * 24 * 60 * 60 * 1000;
  const prevFrom = curFrom - days * 24 * 60 * 60 * 1000;

  const metric = (
    filter: (e: OverviewLicenseEvent) => boolean,
    source: "orders" | "licenses" | "filtered",
  ) => {
    if (source === "orders") {
      const current = countInRange(orderCreatedAt, curFrom, now);
      const previous = countInRange(orderCreatedAt, prevFrom, curFrom);
      return { current, deltaPct: percentChange(current, previous) };
    }
    const isos = licenseEvents.filter(filter).map((e) => e.createdAtIso);
    if (source === "licenses") {
      const current = countInRange(
        licenseEvents.map((e) => e.createdAtIso),
        curFrom,
        now,
      );
      const previous = countInRange(
        licenseEvents.map((e) => e.createdAtIso),
        prevFrom,
        curFrom,
      );
      return { current, deltaPct: percentChange(current, previous) };
    }
    const current = countInRange(isos, curFrom, now);
    const previous = countInRange(isos, prevFrom, curFrom);
    return { current, deltaPct: percentChange(current, previous) };
  };

  return {
    orders: metric(() => true, "orders"),
    licenses: metric(() => true, "licenses"),
    activating: metric((e) => e.bucket === "activating", "filtered"),
    completed: metric((e) => e.bucket === "ready", "filtered"),
  };
}

function buildDailySpendSeries(
  points: OverviewSpendPoint[],
  period: OverviewPeriod,
) {
  const days = daysForPeriod(period);
  const today = startOfDay(new Date());
  const labels: string[] = [];
  const values: number[] = [];
  const buckets = new Map<string, number>();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    buckets.set(key, 0);
    labels.push(
      `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`,
    );
  }

  const curFrom = today.getTime() - (days - 1) * 24 * 60 * 60 * 1000;
  const prevFrom = curFrom - days * 24 * 60 * 60 * 1000;
  let prevTotal = 0;

  for (const p of points) {
    const t = new Date(p.createdAtIso);
    const ms = t.getTime();
    if (ms >= prevFrom && ms < curFrom) prevTotal += p.amountVnd;
    if (ms < curFrom || ms > Date.now()) continue;
    const key = `${t.getFullYear()}-${t.getMonth()}-${t.getDate()}`;
    if (!buckets.has(key)) continue;
    buckets.set(key, (buckets.get(key) ?? 0) + p.amountVnd);
  }

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    values.push(buckets.get(key) ?? 0);
  }

  // For 30/90d, thin labels for readability
  const labelEvery = period === "7d" ? 1 : period === "30d" ? 5 : 15;
  const displayLabels = labels.map((l, i) =>
    i === 0 || i === labels.length - 1 || i % labelEvery === 0 ? l : "",
  );

  return { labels: displayLabels, values, prevTotal };
}

function formatDateVi(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN");
}

function relativeTimeVi(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Vừa xong";
  if (m < 60) return `${m} phút trước`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} giờ trước`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} ngày trước`;
  return formatDateVi(iso);
}

function toneBadge(tone: OrderListStatusTone) {
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

/* ─── UI pieces ──────────────────────────────────────────────────────────── */

function PeriodSelect({
  value,
  onChange,
  label7,
  label30,
  label90,
}: {
  value: OverviewPeriod;
  onChange: (p: OverviewPeriod) => void;
  label7: string;
  label30: string;
  label90: string;
}) {
  return (
    <label className="relative shrink-0">
      <span className="sr-only">Kỳ thời gian</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as OverviewPeriod)}
        className={`h-9 appearance-none rounded-lg border border-border bg-white py-1.5 pl-2.5 pr-7 ${CTA_COMPACT_CLASS} text-navy outline-none ${TRANSITION_UI} focus:border-accent`}
      >
        <option value="7d">{label7}</option>
        <option value="30d">{label30}</option>
        <option value="90d">{label90}</option>
      </select>
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted">
        ▾
      </span>
    </label>
  );
}

function StatTile({
  icon,
  value,
  label,
  deltaPct,
}: {
  icon: ReactNode;
  value: number;
  label: string;
  deltaPct: number;
}) {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-border bg-white px-2.5 py-2">
      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
        {icon}
      </span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-1.5">
          <p className={FIELD_VALUE_NUM_CLASS}>{value}</p>
          <DeltaText pct={deltaPct} />
        </div>
        <p className={`mt-0.5 ${FORM_LABEL_CLASS}`}>{label}</p>
      </div>
    </div>
  );
}

function DeltaText({ pct }: { pct: number }) {
  if (pct === 0) {
    return <span className={`${CARD_META_CLASS} !text-muted`}>0%</span>;
  }
  if (pct > 0) {
    return (
      <span className={`${CARD_META_CLASS} !text-emerald-600`}>↑ {pct}%</span>
    );
  }
  return (
    <span className={`${CARD_META_CLASS} !text-rose-600`}>↓ {Math.abs(pct)}%</span>
  );
}

function LegendRow({
  color,
  label,
  count,
}: {
  color: string;
  label: string;
  count: number;
}) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-lg bg-surface/60 px-2.5 py-2">
      <span className="flex min-w-0 items-center gap-2.5">
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className={`truncate ${CARD_TITLE_CLASS} !font-medium`}>
          {label}
        </span>
      </span>
      <span className={FIELD_VALUE_NUM_CLASS}>{count}</span>
    </li>
  );
}

function Shortcut({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: "shop" | "license" | "orders" | "support" | "faq" | "guide";
}) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-1.5 rounded-xl border border-border bg-white px-1.5 py-2.5 text-center ${TRANSITION_UI} hover:border-accent ${HOVER_SOFT}`}
    >
      <span className="inline-flex h-8 w-8 items-center justify-center text-navy">
        <ShortcutIcon name={icon} />
      </span>
      <span className={`leading-snug ${CTA_COMPACT_CLASS} text-navy`}>
        {label}
      </span>
    </Link>
  );
}

function smoothLinePath(pts: { x: number; y: number }[]) {
  if (pts.length === 0) return "";
  if (pts.length === 1) return `M${pts[0]!.x} ${pts[0]!.y}`;
  if (pts.length === 2) {
    return `M${pts[0]!.x} ${pts[0]!.y} L${pts[1]!.x} ${pts[1]!.y}`;
  }
  let d = `M${pts[0]!.x.toFixed(1)} ${pts[0]!.y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i === 0 ? 0 : i - 1]!;
    const p1 = pts[i]!;
    const p2 = pts[i + 1]!;
    const p3 = pts[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

function SpendChart({
  labels,
  values,
  hoverIdx,
  onHover,
}: {
  labels: string[];
  values: number[];
  hoverIdx: number | null;
  onHover: (i: number | null) => void;
}) {
  const W = 320;
  const H = 128;
  const padL = 30;
  const padR = 6;
  const padT = 12;
  const padB = 22;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const max = Math.max(...values, 1);
  const niceMax = niceCeil(max);
  const yTicks = [0, niceMax / 2, niceMax];
  const n = values.length;
  const pts = values.map((v, i) => {
    const x = padL + (n <= 1 ? plotW / 2 : (i / (n - 1)) * plotW);
    const y = padT + plotH - (v / niceMax) * plotH;
    return { x, y, v };
  });
  const line = smoothLinePath(pts);
  const area =
    pts.length > 0
      ? `${line} L${pts[n - 1]!.x.toFixed(1)} ${padT + plotH} L${pts[0]!.x.toFixed(1)} ${padT + plotH} Z`
      : "";
  const hi = hoverIdx != null ? pts[hoverIdx] : null;

  return (
    <div
      className="relative mt-2 w-full"
      style={{ aspectRatio: `${W} / ${H}` }}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full text-accent"
        role="img"
        aria-label="Biểu đồ chi tiêu"
        onMouseLeave={() => onHover(null)}
      >
        {yTicks.map((t, i) => {
          const y = padT + plotH - (t / niceMax) * plotH;
          return (
            <g key={i}>
              <line
                x1={padL}
                x2={W - padR}
                y1={y}
                y2={y}
                stroke="#cbd5e1"
                strokeWidth="1"
                vectorEffect="nonScalingStroke"
              />
              <text
                x={padL - 5}
                y={y + 3}
                textAnchor="end"
                fill="#94a3b8"
                fontSize="9"
              >
                {formatAxisVnd(t)}
              </text>
            </g>
          );
        })}
        {area ? (
          <path d={area} fill="currentColor" opacity={CHART_FILL_OPACITY} />
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
        {pts.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={hoverIdx === i ? CHART_POINT_R_HOVER : CHART_POINT_R}
            fill="white"
            stroke="currentColor"
            strokeWidth="1.25"
            vectorEffect="nonScalingStroke"
            className="pointer-events-none"
          />
        ))}
        {pts.map((p, i) => (
          <rect
            key={`h${i}`}
            x={p.x - plotW / Math.max(n, 1) / 2}
            y={padT}
            width={Math.max(plotW / Math.max(n, 1), 10)}
            height={plotH}
            fill="transparent"
            onMouseEnter={() => onHover(i)}
          />
        ))}
        {labels.map((l, i) =>
          l ? (
            <text
              key={i}
              x={pts[i]?.x ?? 0}
              y={H - 6}
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="9"
            >
              {l}
            </text>
          ) : null,
        )}
        {hi ? (
          <g>
            <rect
              x={Math.min(Math.max(hi.x - 38, padL), W - padR - 76)}
              y={Math.max(hi.y - 24, 2)}
              width="76"
              height="18"
              rx="5"
              fill="#0f172a"
            />
            <text
              x={Math.min(Math.max(hi.x, padL + 38), W - padR - 38)}
              y={Math.max(hi.y - 11, 15)}
              textAnchor="middle"
              fill="white"
              fontSize="9"
              fontWeight="600"
            >
              {hi.v.toLocaleString("vi-VN")}đ
            </text>
          </g>
        ) : null}
      </svg>
    </div>
  );
}

function niceCeil(n: number) {
  if (n <= 0) return 1;
  const exp = Math.pow(10, Math.floor(Math.log10(n)));
  const m = n / exp;
  const nice = m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10;
  return nice * exp;
}

function formatAxisVnd(n: number) {
  if (n >= 1_000_000) {
    const v = n / 1_000_000;
    return `${Number.isInteger(v) ? v : v.toFixed(1)}M`;
  }
  if (n >= 1000) return `${Math.round(n / 1000)}K`;
  return String(Math.round(n));
}

function DonutChart({
  total,
  segments,
}: {
  total: number;
  segments: { value: number; color: string }[];
}) {
  const size = 132;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  const safeTotal = total > 0 ? total : 1;

  return (
    <div className="relative h-[8.25rem] w-[8.25rem] shrink-0">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="h-full w-full"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={stroke}
        />
        {segments.map((s, i) => {
          if (s.value <= 0) return null;
          const len = (s.value / safeTotal) * c;
          const el = (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={stroke}
              strokeDasharray={`${len} ${c - len}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className={FIELD_VALUE_NUM_CLASS}>{total}</p>
      </div>
    </div>
  );
}

function WelcomeArtwork() {
  return (
    <div
      className="pointer-events-none absolute inset-y-0 right-0 flex w-[7.5rem] items-center justify-center sm:w-36 md:w-40"
      aria-hidden
    >
      {/* Soft watermark K on the right */}
      <span className="absolute right-2 select-none font-display text-[5.5rem] font-bold leading-none text-accent/10 sm:right-3 sm:text-[6.5rem]">
        K
      </span>
      <div className="relative z-[1] mr-2 sm:mr-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-navy text-white sm:h-16 sm:w-16">
          <span className="font-display text-2xl font-bold sm:text-3xl">K</span>
        </div>
        <div className="mx-auto mt-1.5 h-1.5 w-10 rounded-full bg-navy/10" />
      </div>
    </div>
  );
}

function BoxMiniIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M12 12v9M3 7.5l9 4.5 9-4.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function BellMiniIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M10 18a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function OrdersStatIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 8h12l-1 12H7L6 8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9 8V7a3 3 0 0 1 6 0v1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LicenseStatIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="4"
        y="5"
        width="16"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M8 10h8M8 14h5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function ActivatingStatIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 8v4l2.5 2.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CompletedStatIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="m8.5 12.5 2.5 2.5 4.5-5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShortcutIcon({
  name,
}: {
  name: "shop" | "license" | "orders" | "support" | "faq" | "guide";
}) {
  switch (name) {
    case "shop":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4 9h16l-1.2 11H5.2L4 9Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M9 9V7a3 3 0 0 1 6 0v2"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      );
    case "license":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect
            x="4"
            y="4"
            width="16"
            height="16"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path d="M8 9h8M8 13h5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case "orders":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M8 6h12M8 12h12M8 18h12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="4.5" cy="6" r="1" fill="currentColor" />
          <circle cx="4.5" cy="12" r="1" fill="currentColor" />
          <circle cx="4.5" cy="18" r="1" fill="currentColor" />
        </svg>
      );
    case "support":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4 12a8 8 0 0 1 16 0v5a2 2 0 0 1-2 2h-2v-6h4M4 12v5a2 2 0 0 0 2 2h2v-6H4"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      );
    case "faq":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M9.5 9.5a2.5 2.5 0 1 1 3.6 2.2c-.7.4-1.1.9-1.1 1.8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="12" cy="17" r="0.9" fill="currentColor" />
        </svg>
      );
    default:
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M5 4h10l4 4v12H5V4Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path d="M14 4v5h5M8 13h8M8 17h6" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
  }
}
