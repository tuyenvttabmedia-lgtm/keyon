"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ShopSidebar } from "./ShopSidebar";
import { ShopProductCard, ShopProductListItem } from "./ShopProductCard";
import {
  SHOP_PAGE_SIZE,
  filterProducts,
  sortProducts,
} from "./shop-utils";
import type {
  ShopCatalogProps,
  ShopCategoryId,
  ShopLicenseType,
  ShopPlatform,
  ShopSort,
  ShopViewMode,
} from "./types";
import {
  BADGE_CLASS,
  BODY_MUTED_CLASS,
  CTA_COMPACT_CLASS,
  EMPTY_BODY_CLASS,
  EMPTY_TITLE_CLASS,
  INPUT_TEXT_CLASS,
} from "@/storefront/typography";

export function ShopCatalog({
  products,
  categories,
  initialCategory = "all",
  initialQuery = "",
}: ShopCatalogProps) {
  const boundMin = 100_000;
  const boundMax = Math.max(
    10_000_000,
    ...products.map((p) => p.priceVnd),
    1_000_000,
  );

  const [category, setCategory] = useState<ShopCategoryId | "all">(
    isCategory(initialCategory) ? initialCategory : "all",
  );
  const [licenses, setLicenses] = useState<ShopLicenseType[]>([]);
  const [platforms, setPlatforms] = useState<ShopPlatform[]>([]);
  const [priceMin, setPriceMin] = useState(boundMin);
  const [priceMax, setPriceMax] = useState(Math.min(boundMax, 10_000_000));
  const [sort, setSort] = useState<ShopSort>("newest");
  const [view, setView] = useState<ShopViewMode>("grid");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const licenseCounts = useMemo(() => {
    const base = filterProducts(products, {
      category,
      licenses: [],
      platforms,
      priceMin,
      priceMax,
      query: initialQuery,
    });
    return {
      retail: base.filter((p) => p.licenseTypes.includes("retail")).length,
      oem: base.filter((p) => p.licenseTypes.includes("oem")).length,
      volume: base.filter((p) => p.licenseTypes.includes("volume")).length,
      subscription: base.filter((p) => p.licenseTypes.includes("subscription")).length,
    };
  }, [products, category, platforms, priceMin, priceMax, initialQuery]);

  const platformCounts = useMemo(() => {
    const base = filterProducts(products, {
      category,
      licenses,
      platforms: [],
      priceMin,
      priceMax,
      query: initialQuery,
    });
    return {
      windows: base.filter((p) => p.platforms.includes("windows")).length,
      macos: base.filter((p) => p.platforms.includes("macos")).length,
      linux: base.filter((p) => p.platforms.includes("linux")).length,
      android: base.filter((p) => p.platforms.includes("android")).length,
    };
  }, [products, category, licenses, priceMin, priceMax, initialQuery]);

  const filtered = useMemo(
    () =>
      sortProducts(
        filterProducts(products, {
          category,
          licenses,
          platforms,
          priceMin,
          priceMax,
          query: initialQuery,
        }),
        sort,
      ),
    [products, category, licenses, platforms, priceMin, priceMax, initialQuery, sort],
  );

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / SHOP_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * SHOP_PAGE_SIZE;
  const pageItems = filtered.slice(start, start + SHOP_PAGE_SIZE);
  const from = total === 0 ? 0 : start + 1;
  const to = Math.min(start + SHOP_PAGE_SIZE, total);

  const hasActiveFilters =
    category !== "all" ||
    licenses.length > 0 ||
    platforms.length > 0 ||
    priceMin > boundMin ||
    priceMax < Math.min(boundMax, 10_000_000);

  const clearFilters = () => {
    setCategory("all");
    setLicenses([]);
    setPlatforms([]);
    setPriceMin(boundMin);
    setPriceMax(Math.min(boundMax, 10_000_000));
    setPage(1);
  };

  const sidebar = (
    <ShopSidebar
      categories={categories}
      activeCategory={category}
      onCategory={(id) => {
        setCategory(id);
        setPage(1);
        setFiltersOpen(false);
      }}
      licenses={licenses}
      onToggleLicense={(id) => {
        setLicenses((prev) =>
          prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        );
        setPage(1);
      }}
      platforms={platforms}
      onTogglePlatform={(id) => {
        setPlatforms((prev) =>
          prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        );
        setPage(1);
      }}
      licenseCounts={licenseCounts}
      platformCounts={platformCounts}
      priceMin={priceMin}
      priceMax={priceMax}
      boundMin={boundMin}
      boundMax={Math.min(boundMax, 10_000_000)}
      onPriceMin={(n) => {
        setPriceMin(n);
        setPage(1);
      }}
      onPriceMax={(n) => {
        setPriceMax(n);
        setPage(1);
      }}
      onClear={clearFilters}
      hasActiveFilters={hasActiveFilters}
    />
  );

  return (
    <div className="home-container py-6 md:py-8">
      <div className="mb-4 flex items-center justify-between lg:hidden">
        <p className={BODY_MUTED_CLASS}>
          {total > 0 ? `${from}–${to} / ${total} sản phẩm` : "0 sản phẩm"}
        </p>
        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          className={`inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-white px-3 ${CTA_COMPACT_CLASS} text-navy`}
        >
          Bộ lọc
          {hasActiveFilters ? (
            <span className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 ${BADGE_CLASS} text-white`}>
              !
            </span>
          ) : null}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-6 xl:grid-cols-[260px_minmax(0,1fr)] xl:gap-8">
        <div className="hidden lg:block">{sidebar}</div>

        <div className="min-w-0">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className={`hidden lg:block ${BODY_MUTED_CLASS}`}>
              {total > 0
                ? `Hiển thị ${from}–${to} trong tổng số ${total} sản phẩm`
                : "Không có sản phẩm phù hợp"}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <label className={`inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-white px-3 ${INPUT_TEXT_CLASS}`}>
                <span className="text-muted-soft">Sắp xếp:</span>
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value as ShopSort);
                    setPage(1);
                  }}
                  className="bg-transparent font-semibold outline-none"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price_asc">Giá tăng dần</option>
                  <option value="price_desc">Giá giảm dần</option>
                  <option value="name">Tên A–Z</option>
                </select>
              </label>
              <div className="inline-flex rounded-xl border border-border bg-white p-1">
                <ViewBtn active={view === "grid"} onClick={() => setView("grid")} label="Lưới">
                  <GridIcon />
                </ViewBtn>
                <ViewBtn active={view === "list"} onClick={() => setView("list")} label="Danh sách">
                  <ListIcon />
                </ViewBtn>
              </div>
            </div>
          </div>

          {pageItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-16 text-center">
              <p className={EMPTY_TITLE_CLASS}>Không tìm thấy sản phẩm</p>
              <p className={`mt-1 ${EMPTY_BODY_CLASS}`}>Thử đổi bộ lọc hoặc xóa tất cả điều kiện.</p>
              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className={`mt-4 inline-flex h-10 items-center rounded-xl bg-accent px-4 ${CTA_COMPACT_CLASS} text-white`}
                >
                  Xóa bộ lọc
                </button>
              ) : (
                <Link
                  href="/products"
                  className={`mt-4 inline-flex h-10 items-center rounded-xl border border-border px-4 ${CTA_COMPACT_CLASS} text-navy`}
                >
                  Tải lại trang
                </Link>
              )}
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-3.5 md:grid-cols-3 lg:grid-cols-4">
              {pageItems.map((p) => (
                <ShopProductCard key={p.id} item={p} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {pageItems.map((p) => (
                <ShopProductListItem key={p.id} item={p} />
              ))}
            </div>
          )}

          {totalPages > 1 ? (
            <Pagination
              page={safePage}
              totalPages={totalPages}
              onChange={(p) => {
                setPage(p);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          ) : null}
        </div>
      </div>

      {filtersOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-navy/40"
            aria-label="Đóng bộ lọc"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[min(100%,320px)] flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <strong className="text-navy">Bộ lọc</strong>
              <button
                type="button"
                className={`${CTA_COMPACT_CLASS} text-muted`}
                onClick={() => setFiltersOpen(false)}
              >
                Đóng
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">{sidebar}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function isCategory(v: string): v is ShopCategoryId | "all" {
  return ["all", "windows", "office", "adobe", "cloud", "security", "other"].includes(v);
}

function ViewBtn({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition ${
        active ? "bg-accent text-white" : "text-muted hover:bg-surface hover:text-navy"
      }`}
    >
      {children}
    </button>
  );
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  const pages = paginationWindow(page, totalPages);
  return (
    <nav className="mt-8 flex items-center justify-center gap-1.5" aria-label="Phân trang">
      <PageBtn disabled={page <= 1} onClick={() => onChange(page - 1)} label="Trang trước">
        ‹
      </PageBtn>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`e-${i}`} className="px-1 text-muted-soft">
            …
          </span>
        ) : (
          <PageBtn key={p} active={p === page} onClick={() => onChange(p)} label={`Trang ${p}`}>
            {p}
          </PageBtn>
        ),
      )}
      <PageBtn disabled={page >= totalPages} onClick={() => onChange(page + 1)} label="Trang sau">
        ›
      </PageBtn>
    </nav>
  );
}

function PageBtn({
  children,
  onClick,
  disabled,
  active,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-current={active ? "page" : undefined}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2 ${CTA_COMPACT_CLASS} transition disabled:opacity-40 ${
        active
          ? "bg-accent text-white"
          : "border border-border bg-white text-navy hover:border-accent hover:text-accent"
      }`}
    >
      {children}
    </button>
  );
}

function paginationWindow(page: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const out: (number | "…")[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(total - 1, page + 1);
  if (start > 2) out.push("…");
  for (let i = start; i <= end; i++) out.push(i);
  if (end < total - 1) out.push("…");
  out.push(total);
  return out;
}

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  );
}
