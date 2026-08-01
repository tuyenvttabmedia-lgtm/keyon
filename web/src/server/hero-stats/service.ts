import { unstable_cache } from "next/cache";
import {
  HeroStatsRepository,
  lastDayKeys,
} from "./repository";
import type { HeroPublicStats, HeroRecentActivity, HeroStatCard } from "./types";

const WINDOW_DAYS = 7;

function formatVndCount(n: number): string {
  return n.toLocaleString("vi-VN");
}

function formatDelta(pct: number): { deltaPct: number; deltaLabel: string; up: boolean } {
  const rounded = Math.round(pct * 10) / 10;
  const up = rounded >= 0;
  const abs = Math.abs(rounded);
  const deltaLabel = `${up ? "+" : "−"}${abs.toLocaleString("vi-VN", {
    maximumFractionDigits: 1,
  })}%`;
  return { deltaPct: rounded, deltaLabel, up };
}

function deltaFrom(now: number, weekAgo: number) {
  if (weekAgo <= 0) {
    if (now <= 0) return formatDelta(0);
    return formatDelta(100);
  }
  return formatDelta(((now - weekAgo) / weekAgo) * 100);
}

/** Running sum — growth curve over the window (better for sparklines than raw daily spikes). */
export function toCumulative(series: number[]): number[] {
  let sum = 0;
  return series.map((v) => {
    sum += v;
    return sum;
  });
}

function mapSeries(keys: string[], map: Map<string, number>): number[] {
  return keys.map((k) => map.get(k) ?? 0);
}

function relativeTimeVi(date: Date, now = new Date()): string {
  const sec = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 1000));
  if (sec < 60) return "vừa xong";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} phút trước`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} giờ trước`;
  const day = Math.floor(hr / 24);
  return `${day} ngày trước`;
}

function markFromBrand(
  brandName: string | undefined,
  title: string,
): Pick<HeroRecentActivity, "mark" | "tone"> {
  const b = (brandName ?? "").toLowerCase();
  const t = title.toLowerCase();
  const hay = `${b} ${t}`;

  if (hay.includes("adobe")) return { mark: "Ad", tone: "adobe" };
  if (hay.includes("autodesk") || hay.includes("autocad")) {
    return { mark: "AC", tone: "autodesk" };
  }
  if (
    hay.includes("microsoft 365") ||
    hay.includes("office 365") ||
    hay.includes("m365") ||
    (hay.includes("office") && !hay.includes("openoffice"))
  ) {
    return { mark: "365", tone: "office" };
  }
  if (hay.includes("windows") || hay.includes("microsoft")) {
    return { mark: "MS", tone: "win" };
  }
  if (brandName?.trim()) {
    const parts = brandName.trim().split(/\s+/);
    const mark =
      parts.length >= 2
        ? `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase()
        : brandName.slice(0, 2).toUpperCase();
    return { mark: mark || "KN", tone: "generic" };
  }
  return { mark: title.slice(0, 2).toUpperCase() || "KN", tone: "generic" };
}

/** Prefer catalog product name; fall back to line title (public-safe, no secrets). */
function publicActivityTitle(productName: string | undefined, lineTitle: string): string {
  const name = (productName ?? "").trim() || lineTitle.trim();
  return name.replace(/\s+/g, " ").slice(0, 72);
}

const RECENT_DISPLAY = 2;

function toCard(
  label: string,
  value: number,
  weekAgo: number,
  series: number[],
): HeroStatCard {
  const d = deltaFrom(value, weekAgo);
  return {
    label,
    value,
    valueLabel: formatVndCount(value),
    deltaPct: d.deltaPct,
    deltaLabel: d.deltaLabel,
    up: d.up,
    series,
  };
}

async function computePublicStats(): Promise<HeroPublicStats> {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - WINDOW_DAYS * 24 * 60 * 60 * 1000);
  const keys = lastDayKeys(WINDOW_DAYS, now);
  const rangeFrom = new Date(`${keys[0]}T00:00:00.000Z`);
  const rangeTo = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const [
    totalNow,
    totalBefore,
    deliveredNow,
    deliveredBefore,
    pendingNow,
    pendingBefore,
    soldDaily,
    deliveryDaily,
    pendingDaily,
    recentRows,
  ] = await Promise.all([
    HeroStatsRepository.sumSoldQuantity(),
    HeroStatsRepository.sumSoldQuantity(weekAgo),
    HeroStatsRepository.countDeliveries(),
    HeroStatsRepository.countDeliveries(weekAgo),
    HeroStatsRepository.countOpenJobs(),
    HeroStatsRepository.countOpenJobs(weekAgo),
    HeroStatsRepository.dailySoldQuantity(rangeFrom, rangeTo),
    HeroStatsRepository.dailyDeliveryCounts(rangeFrom, rangeTo),
    HeroStatsRepository.dailyOpenJobCreatedCounts(rangeFrom, rangeTo),
    HeroStatsRepository.recentDeliveries(12),
  ]);

  const seenProducts = new Set<string>();
  const recent: HeroRecentActivity[] = [];
  for (const r of recentRows) {
    const product = r.orderItem.variant.product;
    const dedupeKey = product.id || r.orderItem.title;
    if (seenProducts.has(dedupeKey)) continue;
    seenProducts.add(dedupeKey);

    const title = publicActivityTitle(product.name, r.orderItem.title);
    const brandName = product.brand.name;
    const { mark, tone } = markFromBrand(brandName, title);
    recent.push({
      id: r.id,
      title,
      brandName,
      href: product.slug ? `/products/${product.slug}` : undefined,
      meta: `Đã giao thành công · ${relativeTimeVi(r.createdAt, now)}`,
      mark,
      tone,
    });
    if (recent.length >= RECENT_DISPLAY) break;
  }

  const totalSeries = toCumulative(mapSeries(keys, soldDaily));
  const activatedSeries = toCumulative(mapSeries(keys, deliveryDaily));
  const pendingSeries = toCumulative(mapSeries(keys, pendingDaily));
  const scaleMax = Math.max(1, ...totalSeries, ...activatedSeries, ...pendingSeries);

  return {
    windowDays: WINDOW_DAYS,
    sparkScaleMax: scaleMax,
    cards: {
      total: toCard("Tổng license", totalNow, totalBefore, totalSeries),
      activated: toCard(
        "Đã kích hoạt",
        deliveredNow,
        deliveredBefore,
        activatedSeries,
      ),
      pending: toCard(
        "Chờ kích hoạt",
        pendingNow,
        pendingBefore,
        pendingSeries,
      ),
    },
    recent,
  };
}

/** Cached public hero stats — Outer Layer read model. */
export const getHeroPublicStats = unstable_cache(
  async () => computePublicStats(),
  ["hero-public-stats-v5"],
  { revalidate: 60 },
);

export const HeroStatsService = {
  getPublicWindowStats: getHeroPublicStats,
};
