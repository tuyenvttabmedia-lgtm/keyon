"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { FaqCategoryMeta } from "@/storefront/content/faq-categories";
import type { FaqItem } from "@/storefront/content/types";
import {
  findGroupIdForCategory,
  groupCategoriesForSidebar,
  pickPopularFaqItems,
  sanitizeFaqDescription,
  type FaqGroupId,
} from "@/storefront/content/faq-groups";
import { FaqAnswer } from "@/storefront/components/FaqAnswer";
import {
  IconCard,
  IconFolder,
  IconHeadset,
  IconPackage,
  IconSearch,
  IconUser,
} from "@/storefront/components/icons/StoreIcons";
import {
  CARD_META_CLASS,
  OVERLINE_CLASS,
  PAGE_TITLE_CLASS,
  SECTION_LEAD_CLASS,
  SUBSECTION_TITLE_CLASS,
} from "@/storefront/typography";
import { ELEVATION_HAIRLINE, TRANSITION_UI } from "@/storefront/effects";

const PAGE_SIZE = 12;
const POPULAR_LIMIT = 8;

const CATEGORY_ICONS: Record<
  string,
  typeof IconCard | typeof IconPackage | typeof IconUser | typeof IconFolder
> = {
  payment: IconCard,
  "thanh-toan-giao-dich": IconCard,
  "gia-han-thay-doi": IconPackage,
  delivery: IconPackage,
  account: IconUser,
  "mua-hang": IconFolder,
  general: IconFolder,
};

const LEGACY_CATEGORY: Record<string, string> = {
  general: "mua-hang",
  delivery: "gia-han-thay-doi",
};

function resolveFaqCategoryId(
  raw: string | null | undefined,
  categories: FaqCategoryMeta[],
): string | null {
  if (!raw) return null;
  const mapped = LEGACY_CATEGORY[raw] ?? raw;
  return categories.some((c) => c.id === mapped) ? mapped : null;
}

type Props = {
  categories: FaqCategoryMeta[];
  items: FaqItem[];
  initialQuery?: string;
  initialCategory?: string | null;
  initialPage?: number;
  initialOpenId?: string | null;
};

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

export function FaqSupportView({
  categories,
  items,
  initialQuery = "",
  initialCategory = null,
  initialPage = 1,
  initialOpenId = null,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const listRef = useRef<HTMLElement | null>(null);

  const [query, setQuery] = useState(initialQuery);
  const deferredQuery = useDeferredValue(query.trim());
  const [category, setCategory] = useState<string | null>(() =>
    resolveFaqCategoryId(initialCategory, categories),
  );
  const [openId, setOpenId] = useState<string | null>(initialOpenId);
  const scrolledOpen = useRef(false);
  const [page, setPage] = useState(Math.max(1, initialPage));

  const counts = useMemo(() => {
    const map: Record<string, number> = Object.fromEntries(
      categories.map((c) => [c.id, 0]),
    );
    for (const item of items) {
      const raw = item.category ?? "mua-hang";
      const cat = LEGACY_CATEGORY[raw] ?? raw;
      map[cat] = (map[cat] ?? 0) + 1;
    }
    return map;
  }, [items, categories]);

  const grouped = useMemo(
    () => groupCategoriesForSidebar(categories),
    [categories],
  );

  const activeCategory =
    category && categories.some((c) => c.id === category)
      ? category
      : categories.find((c) => (counts[c.id] ?? 0) > 0)?.id ??
        categories[0]?.id ??
        "mua-hang";

  const activeGroupId =
    findGroupIdForCategory(activeCategory) ??
    grouped[0]?.group.id ??
    "mua-tren-keyon";

  const [openGroups, setOpenGroups] = useState<Set<FaqGroupId>>(
    () => new Set([activeGroupId as FaqGroupId]),
  );
  const [mobileGroup, setMobileGroup] = useState<FaqGroupId>(
    activeGroupId as FaqGroupId,
  );

  useEffect(() => {
    const gid = findGroupIdForCategory(activeCategory);
    if (!gid) return;
    setOpenGroups((prev) => {
      if (prev.has(gid)) return prev;
      const next = new Set(prev);
      next.add(gid);
      return next;
    });
    setMobileGroup(gid);
  }, [activeCategory]);

  const searching = deferredQuery.length >= 2;

  const popular = useMemo(
    () => pickPopularFaqItems(items, POPULAR_LIMIT),
    [items],
  );

  const filtered = useMemo(() => {
    if (searching) {
      const q = normalize(deferredQuery);
      return items.filter(
        (item) =>
          normalize(item.question).includes(q) ||
          normalize(item.answer).includes(q),
      );
    }
    return items.filter((item) => {
      const raw = item.category ?? "mua-hang";
      return (LEGACY_CATEGORY[raw] ?? raw) === activeCategory;
    });
  }, [items, searching, deferredQuery, activeCategory]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const activeMeta =
    categories.find((c) => c.id === activeCategory) ??
    categories[0] ?? {
      id: "mua-hang",
      label: "Mua hàng",
      description: "",
    };

  const activeDescription = sanitizeFaqDescription(activeMeta.description);

  const mobileGroupCats = useMemo(() => {
    const row = grouped.find((g) => g.group.id === mobileGroup);
    return row?.categories ?? [];
  }, [grouped, mobileGroup]);

  function syncUrl(next: {
    cat?: string | null;
    q?: string;
    page?: number;
  }) {
    const params = new URLSearchParams();
    const cat = next.cat === undefined ? category : next.cat;
    const q = next.q === undefined ? query : next.q;
    const p = next.page === undefined ? page : next.page;

    if (cat) params.set("cat", cat);
    if (q.trim()) params.set("q", q.trim());
    if (p > 1) params.set("page", String(p));

    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function selectCategory(id: string) {
    setCategory(id);
    setQuery("");
    setPage(1);
    setOpenId(null);
    syncUrl({ cat: id, q: "", page: 1 });
    requestAnimationFrame(() => {
      listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function toggleGroup(id: FaqGroupId) {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function onSearchChange(value: string) {
    setQuery(value);
    setPage(1);
    setOpenId(null);
    syncUrl({ q: value, page: 1, cat: category });
  }

  function openPopular(item: FaqItem) {
    const raw = item.category ?? "mua-hang";
    const cat = LEGACY_CATEGORY[raw] ?? raw;
    setCategory(cat);
    setQuery("");
    setPage(1);
    setOpenId(item.id);
    syncUrl({ cat, q: "", page: 1 });
    requestAnimationFrame(() => {
      listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function goToPage(p: number) {
    const next = Math.min(Math.max(1, p), totalPages);
    setPage(next);
    setOpenId(null);
    syncUrl({ page: next });
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  useEffect(() => {
    if (!initialOpenId || scrolledOpen.current) return;
    scrolledOpen.current = true;
    const el = document.getElementById(`faq-item-${initialOpenId}`);
    if (!el) return;
    el.scrollIntoView({ block: "center", behavior: "auto" });
  }, [initialOpenId]);

  const pageButtons = useMemo(() => {
    const pages: number[] = [];
    const windowSize = 5;
    let start = Math.max(1, safePage - Math.floor(windowSize / 2));
    const end = Math.min(totalPages, start + windowSize - 1);
    start = Math.max(1, end - windowSize + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }, [safePage, totalPages]);

  function categoryLabel(id: string) {
    const mapped = LEGACY_CATEGORY[id] ?? id;
    return categories.find((c) => c.id === mapped)?.label ?? id;
  }

  function groupCount(cats: FaqCategoryMeta[]) {
    return cats.reduce((sum, c) => sum + (counts[c.id] ?? 0), 0);
  }

  function renderAccordion(list: FaqItem[], showCatBadge: boolean) {
    if (list.length === 0) {
      return (
        <p className="rounded-xl border border-border bg-card px-4 py-8 text-center text-sm text-muted">
          {searching
            ? "Không có câu hỏi phù hợp. Thử từ khóa khác hoặc chọn danh mục bên trái."
            : "Danh mục này chưa có câu hỏi. Trong CMS → FAQ, gắn câu hỏi rồi Lưu và xuất bản."}
        </p>
      );
    }
    return (
      <div className="space-y-2">
        {list.map((item) => {
          const open = openId === item.id;
          return (
            <div
              key={item.id}
              id={`faq-item-${item.id}`}
              className={`scroll-mt-28 overflow-hidden rounded-xl border bg-white ${
                open ? `border-accent ${ELEVATION_HAIRLINE}` : "border-border"
              }`}
            >
              <button
                type="button"
                className="flex w-full items-start gap-3 px-4 py-3.5 text-left md:px-5"
                onClick={() => setOpenId(open ? null : item.id)}
                aria-expanded={open}
              >
                <span
                  className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                    open ? "bg-accent text-white" : "bg-navy-soft text-navy"
                  }`}
                  aria-hidden
                >
                  {open ? "−" : "+"}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-navy md:text-[15px]">
                    {item.question}
                  </span>
                  {showCatBadge ? (
                    <span className="mt-1 inline-block rounded-full bg-navy-soft px-2 py-0.5 text-[11px] font-medium text-muted">
                      {categoryLabel(item.category ?? "mua-hang")}
                    </span>
                  ) : null}
                </span>
              </button>
              {open ? (
                <div className="mx-4 mb-4 rounded-xl bg-accent-soft/70 px-4 py-3 text-navy md:mx-5">
                  <FaqAnswer text={item.answer} />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    );
  }

  function renderPagination() {
    if (totalPages <= 1) return null;
    return (
      <nav
        className="mt-6 flex flex-wrap items-center justify-center gap-1.5"
        aria-label="Phân trang FAQ"
      >
        <button
          type="button"
          disabled={safePage <= 1}
          onClick={() => goToPage(safePage - 1)}
          className="inline-flex h-9 items-center rounded-lg border border-border bg-white px-3 text-sm font-medium text-navy disabled:opacity-40"
        >
          Trước
        </button>
        {pageButtons[0]! > 1 ? (
          <>
            <button
              type="button"
              onClick={() => goToPage(1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-sm font-medium text-navy"
            >
              1
            </button>
            {pageButtons[0]! > 2 ? (
              <span className="px-1 text-muted">…</span>
            ) : null}
          </>
        ) : null}
        {pageButtons.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => goToPage(p)}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium ${
              p === safePage
                ? "border-accent bg-accent text-white"
                : "border-border bg-white text-navy hover:border-accent/40"
            }`}
            aria-current={p === safePage ? "page" : undefined}
          >
            {p}
          </button>
        ))}
        {pageButtons[pageButtons.length - 1]! < totalPages ? (
          <>
            {pageButtons[pageButtons.length - 1]! < totalPages - 1 ? (
              <span className="px-1 text-muted">…</span>
            ) : null}
            <button
              type="button"
              onClick={() => goToPage(totalPages)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-sm font-medium text-navy"
            >
              {totalPages}
            </button>
          </>
        ) : null}
        <button
          type="button"
          disabled={safePage >= totalPages}
          onClick={() => goToPage(safePage + 1)}
          className="inline-flex h-9 items-center rounded-lg border border-border bg-white px-3 text-sm font-medium text-navy disabled:opacity-40"
        >
          Sau
        </button>
      </nav>
    );
  }

  const helpCard = (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
          <IconHeadset size={18} />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-navy">Vẫn cần trợ giúp?</p>
          <Link
            href="/contact"
            className="mt-1 inline-flex text-sm font-semibold text-accent hover:underline"
          >
            Liên hệ với chúng tôi →
          </Link>
        </div>
      </div>
    </div>
  );

  function renderCategoryButton(c: FaqCategoryMeta, compact = false) {
    const active = !searching && activeCategory === c.id;
    const CatIcon = CATEGORY_ICONS[c.id] ?? IconFolder;
    const n = counts[c.id] ?? 0;
    return (
      <button
        type="button"
        onClick={() => selectCategory(c.id)}
        title={sanitizeFaqDescription(c.description) || c.label}
        className={`flex w-full items-center gap-2 text-left ${TRANSITION_UI} ${
          compact
            ? `shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium ${
                active
                  ? "border-accent bg-accent-soft text-navy"
                  : "border-border bg-white text-muted hover:border-accent/40"
              }`
            : `rounded-lg px-2.5 py-2 ${
                active
                  ? "bg-accent-soft font-semibold text-navy"
                  : "text-muted hover:bg-white hover:text-navy"
              }`
        }`}
      >
        {!compact ? (
          <span
            className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
              active
                ? "bg-accent text-white"
                : "bg-white text-navy ring-1 ring-border"
            }`}
            aria-hidden
          >
            <CatIcon size={14} />
          </span>
        ) : null}
        <span
          className={`min-w-0 flex-1 ${compact ? "" : "truncate text-[13px]"}`}
        >
          {c.label}
        </span>
        <span
          className={`tabular-nums ${
            compact
              ? "ml-1.5 text-xs opacity-70"
              : `text-[11px] ${active ? "text-accent" : "text-muted-soft"}`
          }`}
        >
          {n}
        </span>
      </button>
    );
  }

  return (
    <div className="bg-[#F7FAFC]">
      <div className="home-container py-8 md:py-10">
        <nav className={`text-muted ${CARD_META_CLASS}`} aria-label="Breadcrumb">
          <Link href="/" className="hover:text-accent">
            Trang chủ
          </Link>
          <span className="mx-2 text-border">›</span>
          <span className="text-navy">Câu hỏi thường gặp</span>
        </nav>

        <header className="mx-auto mt-6 max-w-2xl text-center">
          <h1 className={PAGE_TITLE_CLASS}>Câu hỏi thường gặp</h1>
          <p className={`mt-2 ${SECTION_LEAD_CLASS}`}>
            Gõ từ khóa để tìm nhanh — hoặc chọn nhóm và danh mục bên dưới.
          </p>
          <label className="relative mt-5 block w-full text-left">
            <span className="sr-only">Tìm kiếm câu hỏi</span>
            <span
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
              aria-hidden
            >
              <IconSearch size={20} />
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Ví dụ: thanh toán, kích hoạt, hoàn tiền, báo giá…"
              className={`h-12 w-full rounded-xl border border-border bg-white pl-12 pr-11 text-sm text-navy outline-none transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/15 md:h-14 md:text-[15px] ${ELEVATION_HAIRLINE}`}
              autoComplete="off"
            />
            {query ? (
              <button
                type="button"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-navy"
                onClick={() => onSearchChange("")}
                aria-label="Xóa tìm kiếm"
              >
                ×
              </button>
            ) : null}
          </label>
          {searching ? (
            <p className={`mt-2 ${CARD_META_CLASS}`}>
              {filtered.length} kết quả cho “{deferredQuery}”
            </p>
          ) : null}
        </header>

        {!searching && popular.length > 0 ? (
          <section
            className="mx-auto mt-8 max-w-3xl"
            aria-labelledby="faq-popular"
          >
            <p
              id="faq-popular"
              className={`${OVERLINE_CLASS} text-center text-muted`}
            >
              Việc hay gặp
            </p>
            <ul className="mt-3 flex flex-wrap justify-center gap-2">
              {popular.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => openPopular(item)}
                    className={`rounded-full border border-border bg-white px-3.5 py-2 text-left text-[13px] font-medium text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
                  >
                    {item.question}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* Mobile: group chips → category chips */}
        <div className="mt-8 space-y-2 lg:hidden">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {grouped.map(({ group, categories: cats }) => {
              const active = mobileGroup === group.id;
              const n = groupCount(cats);
              return (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => {
                    setMobileGroup(group.id);
                    setOpenGroups((prev) => new Set(prev).add(group.id));
                    const first =
                      cats.find((c) => (counts[c.id] ?? 0) > 0) ?? cats[0];
                    if (first && !searching) selectCategory(first.id);
                  }}
                  className={`shrink-0 rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                    active
                      ? "border-accent bg-accent text-white"
                      : "border-border bg-white text-navy hover:border-accent/40"
                  }`}
                >
                  {group.label}
                  <span className="ml-1.5 tabular-nums text-xs opacity-80">
                    {n}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {mobileGroupCats.map((c) => (
              <div key={c.id}>{renderCategoryButton(c, true)}</div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] space-y-3 overflow-y-auto pb-2 pr-1">
              <p className={`${OVERLINE_CLASS} text-muted`}>Nhóm danh mục</p>
              <div className="space-y-2">
                {grouped.map(({ group, categories: cats }) => {
                  const open = openGroups.has(group.id);
                  const n = groupCount(cats);
                  const containsActive =
                    !searching &&
                    cats.some((c) => c.id === activeCategory);
                  return (
                    <div
                      key={group.id}
                      className={`overflow-hidden rounded-xl border bg-white ${
                        containsActive
                          ? "border-accent/40"
                          : "border-border"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleGroup(group.id)}
                        className="flex w-full items-center gap-2 px-3 py-2.5 text-left"
                        aria-expanded={open}
                      >
                        <span
                          className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded text-xs font-bold ${
                            containsActive
                              ? "bg-accent text-white"
                              : "bg-navy-soft text-navy"
                          }`}
                          aria-hidden
                        >
                          {open ? "−" : "+"}
                        </span>
                        <span className="min-w-0 flex-1 text-[13px] font-semibold text-navy">
                          {group.label}
                        </span>
                        <span className="tabular-nums text-[11px] text-muted">
                          {n}
                        </span>
                      </button>
                      {open ? (
                        <ul className="space-y-0.5 border-t border-border/70 px-1.5 py-1.5">
                          {cats.map((c) => (
                            <li key={c.id}>{renderCategoryButton(c)}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  );
                })}
              </div>
              {helpCard}
            </div>
          </aside>

          <section ref={listRef} className="min-w-0 scroll-mt-24">
            <div className="mb-4">
              <h2 className={SUBSECTION_TITLE_CLASS}>
                {searching ? "Kết quả tìm kiếm" : activeMeta.label}
              </h2>
              <p className={`mt-1 ${CARD_META_CLASS}`}>
                {filtered.length} câu hỏi
                {!searching && activeDescription
                  ? ` · ${activeDescription}`
                  : null}
                {totalPages > 1 ? ` · Trang ${safePage}/${totalPages}` : null}
              </p>
            </div>

            {renderAccordion(visible, searching)}
            {renderPagination()}

            <div className="mt-6 lg:hidden">{helpCard}</div>
          </section>
        </div>
      </div>
    </div>
  );
}
