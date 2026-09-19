"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { FaqCategoryMeta } from "@/storefront/content/faq-categories";
import type { FaqItem } from "@/storefront/content/types";
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
  delivery: IconPackage,
  account: IconUser,
  general: IconFolder,
};

type Props = {
  categories: FaqCategoryMeta[];
  items: FaqItem[];
  initialQuery?: string;
  initialCategory?: string | null;
  initialPage?: number;
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
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const listRef = useRef<HTMLElement | null>(null);

  const [query, setQuery] = useState(initialQuery);
  const deferredQuery = useDeferredValue(query.trim());
  const [category, setCategory] = useState<string | null>(initialCategory);
  const [openId, setOpenId] = useState<string | null>(null);
  const [page, setPage] = useState(Math.max(1, initialPage));

  const counts = useMemo(() => {
    const map: Record<string, number> = Object.fromEntries(
      categories.map((c) => [c.id, 0]),
    );
    for (const item of items) {
      const cat = item.category ?? "general";
      map[cat] = (map[cat] ?? 0) + 1;
    }
    return map;
  }, [items, categories]);

  const activeCategory =
    category && categories.some((c) => c.id === category)
      ? category
      : categories.find((c) => (counts[c.id] ?? 0) > 0)?.id ??
        categories[0]?.id ??
        "general";

  const searching = deferredQuery.length >= 2;

  const popular = useMemo(
    () => items.filter((i) => i.popular).slice(0, POPULAR_LIMIT),
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
    return items.filter(
      (item) => (item.category ?? "general") === activeCategory,
    );
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
      id: "general",
      label: "Chung",
      description: "",
    };

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

  function onSearchChange(value: string) {
    setQuery(value);
    setPage(1);
    setOpenId(null);
    syncUrl({ q: value, page: 1, cat: category });
  }

  function openPopular(item: FaqItem) {
    const cat = item.category ?? "general";
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
    setPage((p) =>
      Math.min(p, Math.max(1, Math.ceil(filtered.length / PAGE_SIZE) || 1)),
    );
  }, [filtered.length]);

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
    return categories.find((c) => c.id === id)?.label ?? id;
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
              className={`overflow-hidden rounded-xl border bg-white ${
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
                      {categoryLabel(item.category ?? "general")}
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

        {/* Search-first hero */}
        <header className="mx-auto mt-6 max-w-2xl text-center">
          <h1 className={PAGE_TITLE_CLASS}>Câu hỏi thường gặp</h1>
          <p className={`mt-2 ${SECTION_LEAD_CLASS}`}>
            Gõ từ khóa để tìm nhanh — hoặc chọn danh mục bên dưới.
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
              placeholder="Ví dụ: thanh toán, kích hoạt, hoàn tiền…"
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

        {/* Popular — only when not searching */}
        {!searching && popular.length > 0 ? (
          <section className="mx-auto mt-8 max-w-3xl" aria-labelledby="faq-popular">
            <p id="faq-popular" className={`${OVERLINE_CLASS} text-center text-muted`}>
              Câu hỏi hay gặp
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

        {/* Mobile category chips */}
        <div className="mt-8 flex gap-2 overflow-x-auto pb-1 lg:hidden">
          {categories.map((c) => {
            const active = !searching && activeCategory === c.id;
            const n = counts[c.id] ?? 0;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => selectCategory(c.id)}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                  active
                    ? "border-accent bg-accent-soft text-navy"
                    : "border-border bg-white text-muted hover:border-accent/40"
                }`}
              >
                {c.label}
                <span className="ml-1.5 tabular-nums text-xs opacity-70">{n}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[240px_minmax(0,1fr)]">
          {/* Slim sticky sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] space-y-3 overflow-y-auto pb-2 pr-1">
              <p className={`${OVERLINE_CLASS} text-muted`}>Danh mục</p>
              <ul className="space-y-0.5">
                {categories.map((c) => {
                  const active = !searching && activeCategory === c.id;
                  const CatIcon = CATEGORY_ICONS[c.id] ?? IconFolder;
                  const n = counts[c.id] ?? 0;
                  return (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => selectCategory(c.id)}
                        title={c.description || c.label}
                        className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left ${TRANSITION_UI} ${
                          active
                            ? "bg-accent-soft font-semibold text-navy"
                            : "text-muted hover:bg-white hover:text-navy"
                        }`}
                      >
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
                        <span className="min-w-0 flex-1 truncate text-[13px]">
                          {c.label}
                        </span>
                        <span
                          className={`tabular-nums text-[11px] ${
                            active ? "text-accent" : "text-muted-soft"
                          }`}
                        >
                          {n}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
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
                {!searching && activeMeta.description
                  ? ` · ${activeMeta.description}`
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
