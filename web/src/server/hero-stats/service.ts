import { unstable_cache } from "next/cache";
import {
  HeroStatsRepository,
  lastDayKeys,
} from "./repository";
import type { HeroPublicStats, HeroStatCard } from "./types";

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
  ]);

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
    // Type compat — Home UI does not render recent activity.
    recent: [],
  };
}

/** Cached public hero stats — Outer Layer read model. */
export const getHeroPublicStats = unstable_cache(
  async () => computePublicStats(),
  ["hero-public-stats-v6"],
  { revalidate: 60 },
);

export const HeroStatsService = {
  getPublicWindowStats: getHeroPublicStats,
};
