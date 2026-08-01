export type HeroStatCard = {
  label: string;
  value: number;
  valueLabel: string;
  deltaPct: number;
  deltaLabel: string;
  up: boolean;
  /** Cumulative window series (oldest → newest) for sparkline. */
  series: number[];
};

export type HeroRecentActivity = {
  id: string;
  title: string;
  meta: string;
  mark: string;
  tone: "win" | "adobe" | "office" | "autodesk" | "generic";
  brandName?: string;
  /** Public product detail URL when slug is known. */
  href?: string;
};

export type HeroPublicStats = {
  windowDays: number;
  /** Shared Y scale so the three sparklines stay comparable. */
  sparkScaleMax: number;
  cards: {
    total: HeroStatCard;
    activated: HeroStatCard;
    pending: HeroStatCard;
  };
  recent: HeroRecentActivity[];
};
