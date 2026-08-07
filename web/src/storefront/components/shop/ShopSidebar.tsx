"use client";

import type { ReactNode } from "react";
import type { ShopCategoryId, ShopCategoryMeta, ShopLicenseType, ShopPlatform } from "./types";
import {
  CATEGORY_LABELS,
  LICENSE_LABELS,
  PLATFORM_LABELS,
  formatVnd,
} from "./shop-utils";
import {
  BODY_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  FIELD_CAPTION_CLASS,
  INPUT_TEXT_CLASS,
  LINK_COMPACT_CLASS,
  OVERLINE_CLASS,
} from "@/storefront/typography";
import { ELEVATION_HAIRLINE, TRANSITION_UI } from "@/storefront/effects";

const CATEGORY_ORDER: ShopCategoryId[] = [
  "windows",
  "office",
  "adobe",
  "cloud",
  "security",
  "other",
];

type Props = {
  categories: ShopCategoryMeta[];
  activeCategory: ShopCategoryId | "all";
  onCategory: (id: ShopCategoryId | "all") => void;
  licenses: ShopLicenseType[];
  onToggleLicense: (id: ShopLicenseType) => void;
  platforms: ShopPlatform[];
  onTogglePlatform: (id: ShopPlatform) => void;
  licenseCounts: Record<ShopLicenseType, number>;
  platformCounts: Record<ShopPlatform, number>;
  priceMin: number;
  priceMax: number;
  boundMin: number;
  boundMax: number;
  onPriceMin: (n: number) => void;
  onPriceMax: (n: number) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
};

export function ShopSidebar(props: Props) {
  return (
    <aside className="space-y-5">
      <div className={`overflow-hidden rounded-2xl border border-border/80 bg-white ${ELEVATION_HAIRLINE}`}>
        <div className="border-b border-border px-4 py-3">
          <h2 className={CARD_TITLE_CLASS}>Danh mục</h2>
        </div>
        <ul className="p-2">
          <CategoryRow
            label="Tất cả"
            count={props.categories.reduce((s, c) => s + c.count, 0)}
            active={props.activeCategory === "all"}
            onClick={() => props.onCategory("all")}
            icon="all"
          />
          {CATEGORY_ORDER.map((id) => {
            const meta = props.categories.find((c) => c.id === id);
            const count = meta?.count ?? 0;
            // Hide empty categories (Security/Backup-era zeros mislead shoppers)
            if (!count) return null;
            return (
              <CategoryRow
                key={id}
                label={CATEGORY_LABELS[id]}
                count={count}
                active={props.activeCategory === id}
                onClick={() => props.onCategory(id)}
                icon={id}
              />
            );
          })}
        </ul>
      </div>

      <div className={`overflow-hidden rounded-2xl border border-border/80 bg-white ${ELEVATION_HAIRLINE}`}>
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className={CARD_TITLE_CLASS}>Bộ lọc</h2>
          {props.hasActiveFilters ? (
            <button
              type="button"
              onClick={props.onClear}
              className={`${LINK_COMPACT_CLASS} text-accent transition hover:text-accent-hover`}
            >
              Xóa tất cả
            </button>
          ) : null}
        </div>

        <div className="space-y-5 p-4">
          <FilterGroup title="Loại giấy phép">
            {(Object.keys(LICENSE_LABELS) as ShopLicenseType[]).map((id) => (
              <CheckRow
                key={id}
                label={LICENSE_LABELS[id]}
                count={props.licenseCounts[id]}
                checked={props.licenses.includes(id)}
                onChange={() => props.onToggleLicense(id)}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Khoảng giá">
            <PriceRange
              boundMin={props.boundMin}
              boundMax={props.boundMax}
              priceMin={props.priceMin}
              priceMax={props.priceMax}
              onPriceMin={props.onPriceMin}
              onPriceMax={props.onPriceMax}
            />
          </FilterGroup>

          <FilterGroup title="Nền tảng">
            {(Object.keys(PLATFORM_LABELS) as ShopPlatform[]).map((id) => (
              <CheckRow
                key={id}
                label={PLATFORM_LABELS[id]}
                count={props.platformCounts[id]}
                checked={props.platforms.includes(id)}
                onChange={() => props.onTogglePlatform(id)}
              />
            ))}
          </FilterGroup>
        </div>
      </div>
    </aside>
  );
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className={`mb-2.5 ${OVERLINE_CLASS} text-muted-soft`}>{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function CheckRow({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className={`flex cursor-pointer items-center gap-2.5 ${BODY_CLASS}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
      />
      <span className="min-w-0 flex-1">{label}</span>
      <span className={`tabular-nums ${CARD_META_CLASS}`}>{count}</span>
    </label>
  );
}

function CategoryRow({
  label,
  count,
  active,
  onClick,
  icon,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  icon: ShopCategoryId | "all";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left ${TRANSITION_UI} ${
        active ? "bg-accent-soft font-semibold text-accent" : `${BODY_CLASS} hover:bg-surface`
      }`}
    >
      <span
        className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          active ? "bg-accent text-white" : "bg-surface text-muted"
        }`}
        aria-hidden
      >
        <CatIcon id={icon} />
      </span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
      <span className={`tabular-nums ${CARD_META_CLASS} ${active ? "!text-accent" : ""}`}>
        {count}
      </span>
    </button>
  );
}

function PriceRange({
  boundMin,
  boundMax,
  priceMin,
  priceMax,
  onPriceMin,
  onPriceMax,
}: {
  boundMin: number;
  boundMax: number;
  priceMin: number;
  priceMax: number;
  onPriceMin: (n: number) => void;
  onPriceMax: (n: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="relative h-6">
        <input
          type="range"
          min={boundMin}
          max={boundMax}
          step={50_000}
          value={priceMin}
          onChange={(e) => onPriceMin(Math.min(Number(e.target.value), priceMax))}
          className="absolute inset-x-0 top-1 z-[2] w-full accent-accent"
          aria-label="Giá tối thiểu"
        />
        <input
          type="range"
          min={boundMin}
          max={boundMax}
          step={50_000}
          value={priceMax}
          onChange={(e) => onPriceMax(Math.max(Number(e.target.value), priceMin))}
          className="absolute inset-x-0 top-1 z-[1] w-full accent-accent"
          aria-label="Giá tối đa"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <label className={`block ${FIELD_CAPTION_CLASS}`}>
          Từ
          <input
            type="text"
            inputMode="numeric"
            value={formatVnd(priceMin)}
            readOnly
            className={`mt-1 w-full rounded-lg border border-border bg-surface px-2.5 py-2 ${INPUT_TEXT_CLASS} font-medium`}
          />
        </label>
        <label className={`block ${FIELD_CAPTION_CLASS}`}>
          Đến
          <input
            type="text"
            inputMode="numeric"
            value={formatVnd(priceMax)}
            readOnly
            className={`mt-1 w-full rounded-lg border border-border bg-surface px-2.5 py-2 ${INPUT_TEXT_CLASS} font-medium`}
          />
        </label>
      </div>
    </div>
  );
}

function CatIcon({ id }: { id: ShopCategoryId | "all" }) {
  const props = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    "aria-hidden": true as const,
  };
  if (id === "windows") {
    return (
      <svg {...props} fill="currentColor" stroke="none">
        <path d="M3 5.5 10.5 4.4v6.7H3V5.5Zm0 7.4h7.5v6.7L3 18.5v-5.6Zm8.7-8.3L21 3v8.1h-9.3V4.6Zm0 9.5H21V21l-9.3-1.3v-5.6Z" />
      </svg>
    );
  }
  if (id === "office") {
    return (
      <svg {...props}>
        <rect x="4" y="3" width="12" height="18" rx="1.5" />
        <path d="M16 7h3.5v10H16" />
      </svg>
    );
  }
  if (id === "adobe") {
    return (
      <svg {...props} fill="currentColor" stroke="none">
        <path d="M12 3 4 21h4.2l1.5-3.8h4.6L16 21h4L12 3Z" />
      </svg>
    );
  }
  if (id === "cloud") {
    return (
      <svg {...props}>
        <path d="M7 18h9a3.5 3.5 0 0 0 .2-7 5 5 0 0 0-9.7 1.5A3 3 0 0 0 7 18Z" />
      </svg>
    );
  }
  if (id === "security") {
    return (
      <svg {...props}>
        <path d="M12 3 5 6v5c0 4 2.8 7 7 8 4.2-1 7-4 7-8V6l-7-3Z" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
