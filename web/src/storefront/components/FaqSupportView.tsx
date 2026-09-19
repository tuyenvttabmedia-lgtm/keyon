"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { FaqCategoryMeta } from "@/storefront/content/faq-categories";
import type { FaqItem } from "@/storefront/content/types";
import {
  IconCard,
  IconFolder,
  IconHeadset,
  IconPackage,
  IconSearch,
  IconTile,
  IconUser,
} from "@/storefront/components/icons/StoreIcons";
import {
  PAGE_TITLE_CLASS,
  SECTION_LEAD_CLASS,
  SUBSECTION_TITLE_CLASS,
} from "@/storefront/typography";
import { ELEVATION_HAIRLINE, TRANSITION_UI } from "@/storefront/effects";

const PAGE_SIZE = 12;

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
  }

  function onSearchChange(value: string) {
    setQuery(value);
    setPage(1);
    setOpenId(null);
    syncUrl({ q: value, page: 1 });
  }

  function goToPage(p: number) {
    const next = Math.min(Math.max(1, p), totalPages);
    setPage(next);
    setOpenId(null);
    syncUrl({ page: next });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  useEffect(() => {
    setPage((p) => Math.min(p, Math.max(1, Math.ceil(filtered.length / PAGE_SIZE) || 1)));
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

  return (
    <div className="bg-white">
      <div className="home-container py-10 md:py-12">
        <nav className="text-sm text-muted" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-accent">
            Trang chủ
          </Link>
          <span className="mx-2 text-border">›</span>
          <span className="text-navy">Câu hỏi thường gặp</span>
        </nav>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <h1 className={PAGE_TITLE_CLASS}>Câu hỏi thường gặp</h1>
            <p className={`mt-2 ${SECTION_LEAD_CLASS}`}>
              Tìm theo từ khóa hoặc chọn danh mục — dễ tra cứu ngay cả khi có rất
              nhiều câu hỏi.
            </p>
          </div>
          <label className="relative block w-full lg:max-w-md">
            <span className="sr-only">Tìm kiếm câu hỏi</span>
            <span
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
              aria-hidden
            >
              <IconSearch size={18} />
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm kiếm câu hỏi…"
              className="h-12 w-full rounded-xl border border-border bg-card pl-11 pr-10 text-sm text-navy outline-none transition placeholder:text-muted focus:border-accent"
            />
            {query ? (
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-navy"
                onClick={() => onSearchChange("")}
                aria-label="Xóa tìm kiếm"
              >
                ×
              </button>
            ) : null}
          </label>
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-1 lg:hidden">
          {categories.map((c) => {
            const active = !searching && activeCategory === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => selectCategory(c.id)}
                className={`shrink-0 rounded-full border px-3.5 py-2 text-sm font-medium transition ${
                  active
                    ? "border-accent bg-accent-soft text-navy"
                    : "border-border bg-card text-muted hover:border-accent/40"
                }`}
              >
                {c.label}
                <span className="ml-1.5 tabular-nums text-xs opacity-70">
                  {counts[c.id] ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(240px,0.85fr)_1.4fr] lg:gap-10">
          <aside className="hidden space-y-4 lg:block">
            <p className="text-sm font-semibold text-navy">Danh mục câu hỏi</p>
            <ul className="space-y-2">
              {categories.map((c) => {
                const active = !searching && activeCategory === c.id;
                const CatIcon = CATEGORY_ICONS[c.id] ?? IconFolder;
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => selectCategory(c.id)}
                      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left ${TRANSITION_UI} ${
                        active
                          ? `border-accent bg-accent-soft ${ELEVATION_HAIRLINE}`
                          : "border-border bg-white/90 hover:border-accent/40"
                      }`}
                    >
                      <span
                        className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                          active
                            ? "bg-accent text-white"
                            : "bg-navy-soft text-navy"
                        }`}
                        aria-hidden
                      >
                        <CatIcon size={18} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-navy">
                          {c.label}
                        </span>
                        <span className="block truncate text-xs text-muted">
                          {counts[c.id] ?? 0} câu hỏi
                          {c.description ? ` · ${c.description}` : ""}
                        </span>
                      </span>
                      <span className="text-muted" aria-hidden>
                        ›
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start gap-3">
                <IconTile>
                  <IconHeadset size={18} />
                </IconTile>
                <div>
                  <p className="text-sm font-semibold text-navy">
                    Vẫn cần trợ giúp?
                  </p>
                  <Link
                    href="/contact"
                    className="mt-2 inline-flex text-sm font-semibold text-accent hover:underline"
                  >
                    Liên hệ với chúng tôi →
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          <section>
            <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
              <div>
                <h2 className={SUBSECTION_TITLE_CLASS}>
                  {searching ? "Kết quả tìm kiếm" : activeMeta.label}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {filtered.length} câu hỏi
                  {!searching && activeMeta.description
                    ? ` · ${activeMeta.description}`
                    : null}
                  {totalPages > 1
                    ? ` · Trang ${safePage}/${totalPages}`
                    : null}
                </p>
              </div>
            </div>

            {visible.length === 0 ? (
              <p className="rounded-xl border border-border bg-card px-4 py-8 text-center text-sm text-muted">
                {searching
                  ? "Không có câu hỏi phù hợp."
                  : "Danh mục này chưa có câu hỏi trên web. Trong Admin CMS → FAQ, gắn câu hỏi vào danh mục rồi bấm “Lưu và xuất bản”."}
              </p>
            ) : (
              <div className="space-y-2">
                {visible.map((item) => {
                  const open = openId === item.id;
                  const cat =
                    categories.find(
                      (c) => c.id === (item.category ?? "general"),
                    ) ?? activeMeta;
                  return (
                    <div
                      key={item.id}
                      className={`overflow-hidden rounded-xl border bg-white ${
                        open
                          ? `border-accent ${ELEVATION_HAIRLINE}`
                          : "border-border"
                      }`}
                    >
                      <button
                        type="button"
                        className="flex w-full items-start gap-3 px-4 py-4 text-left md:px-5"
                        onClick={() => setOpenId(open ? null : item.id)}
                        aria-expanded={open}
                      >
                        <span
                          className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                            open
                              ? "bg-accent text-white"
                              : "bg-navy-soft text-navy"
                          }`}
                          aria-hidden
                        >
                          {open ? "−" : "+"}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold text-navy md:text-[15px]">
                            {item.question}
                          </span>
                          {searching ? (
                            <span className="mt-1 inline-block rounded-full bg-navy-soft px-2 py-0.5 text-[11px] font-medium text-muted">
                              {cat.label}
                            </span>
                          ) : null}
                        </span>
                      </button>
                      {open ? (
                        <div className="mx-4 mb-4 rounded-xl bg-accent-soft/70 px-4 py-3 text-sm leading-relaxed text-navy whitespace-pre-line md:mx-5">
                          {item.answer}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}

            {totalPages > 1 ? (
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
                {pageButtons[0] > 1 ? (
                  <>
                    <button
                      type="button"
                      onClick={() => goToPage(1)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-sm font-medium text-navy"
                    >
                      1
                    </button>
                    {pageButtons[0] > 2 ? (
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
            ) : null}

            <div className="mt-6 rounded-xl border border-border bg-card p-5 lg:hidden">
              <p className="text-sm font-semibold text-navy">Vẫn cần trợ giúp?</p>
              <Link
                href="/contact"
                className="mt-3 inline-flex h-10 items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-white hover:bg-accent-hover"
              >
                Liên hệ với chúng tôi →
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
