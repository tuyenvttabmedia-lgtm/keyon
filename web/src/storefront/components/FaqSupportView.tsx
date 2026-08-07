"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { FAQ_CATEGORIES, type FaqCategoryId } from "@/storefront/content/faq-categories";
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
import { PAGE_TITLE_CLASS, SECTION_LEAD_CLASS, SUBSECTION_TITLE_CLASS } from "@/storefront/typography";
import { ELEVATION_HAIRLINE, TRANSITION_UI } from "@/storefront/effects";

const PAGE_SIZE = 12;

const CATEGORY_ICONS = {
  payment: IconCard,
  delivery: IconPackage,
  account: IconUser,
  general: IconFolder,
} as const;

type Props = {
  items: FaqItem[];
  initialQuery?: string;
};

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

function categoryMeta(id: string) {
  return FAQ_CATEGORIES.find((c) => c.id === id) ?? FAQ_CATEGORIES[3];
}

export function FaqSupportView({ items, initialQuery = "" }: Props) {
  const [query, setQuery] = useState(initialQuery);
  const deferredQuery = useDeferredValue(query.trim());
  const [category, setCategory] = useState<FaqCategoryId | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const counts = useMemo(() => {
    const map = Object.fromEntries(
      FAQ_CATEGORIES.map((c) => [c.id, 0]),
    ) as Record<FaqCategoryId, number>;
    for (const item of items) {
      const cat = (item.category ?? "general") as FaqCategoryId;
      map[cat] = (map[cat] ?? 0) + 1;
    }
    return map;
  }, [items]);

  const activeCategory =
    category ??
    FAQ_CATEGORIES.find((c) => counts[c.id] > 0)?.id ??
    ("general" as FaqCategoryId);

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

  const visible = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visibleCount;
  const activeMeta = categoryMeta(activeCategory);

  function selectCategory(id: FaqCategoryId) {
    setCategory(id);
    setQuery("");
    setVisibleCount(PAGE_SIZE);
    setOpenId(null);
  }

  function onSearchChange(value: string) {
    setQuery(value);
    setVisibleCount(PAGE_SIZE);
    setOpenId(null);
  }

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
          <h1 className={PAGE_TITLE_CLASS}>
            Câu hỏi thường gặp
          </h1>
          <p className={`mt-2 ${SECTION_LEAD_CLASS}`}>
            Tìm theo từ khóa hoặc chọn danh mục — dễ tra cứu ngay cả khi có rất nhiều câu hỏi.
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

      {/* Mobile category chips */}
      <div className="mt-8 flex gap-2 overflow-x-auto pb-1 lg:hidden">
        {FAQ_CATEGORIES.map((c) => {
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
                {counts[c.id]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(240px,0.85fr)_1.4fr] lg:gap-10">
        <aside className="hidden space-y-4 lg:block">
          <p className="text-sm font-semibold text-navy">Danh mục câu hỏi</p>
          <ul className="space-y-2">
            {FAQ_CATEGORIES.map((c) => {
              const active = !searching && activeCategory === c.id;
              const CatIcon = CATEGORY_ICONS[c.id];
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
                        active ? "bg-accent text-white" : "bg-navy-soft text-navy"
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
                        {counts[c.id]} câu hỏi · {c.description}
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
                <p className="text-sm font-semibold text-navy">Không tìm thấy?</p>
                <p className="mt-1 text-sm text-muted">
                  Đội hỗ trợ sẵn sàng giúp bạn theo mã đơn.
                </p>
              </div>
            </div>
            <Link
              href="/contact"
              className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-white hover:bg-accent-hover"
            >
              Liên hệ với chúng tôi →
            </Link>
          </div>
        </aside>

        <section className="min-w-0">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className={SUBSECTION_TITLE_CLASS}>
                {searching ? "Kết quả tìm kiếm" : activeMeta.label}
              </h2>
              <p className="mt-0.5 text-sm text-muted">
                {searching
                  ? `${filtered.length} kết quả cho “${deferredQuery}”`
                  : `${filtered.length} câu hỏi trong danh mục`}
              </p>
            </div>
            {searching ? (
              <button
                type="button"
                className="text-sm font-medium text-accent hover:underline"
                onClick={() => onSearchChange("")}
              >
                Xóa tìm kiếm
              </button>
            ) : null}
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-white/80 px-6 py-12 text-center backdrop-blur-sm">
              <p className="font-medium text-navy">Không có câu hỏi phù hợp</p>
              <p className="mt-1 text-sm text-muted">
                Thử từ khóa khác hoặc chọn danh mục bên trái.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-block text-sm font-semibold text-accent hover:underline"
              >
                Liên hệ hỗ trợ →
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              {visible.map((item) => {
                const open = openId === item.id;
                const cat = categoryMeta(item.category ?? "general");
                return (
                  <div key={item.id} className="border-b border-border last:border-b-0">
                    <button
                      type="button"
                      className="flex w-full items-start gap-3 px-4 py-4 text-left md:px-5"
                      aria-expanded={open}
                      onClick={() => setOpenId(open ? null : item.id)}
                    >
                      <span
                        className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-sm font-semibold ${
                          open
                            ? "bg-accent text-white"
                            : "bg-navy-soft text-navy"
                        }`}
                        aria-hidden
                      >
                        {open ? "−" : "+"}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-navy md:text-base">
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
                      <div className="mx-4 mb-4 rounded-xl bg-accent-soft/70 px-4 py-3 text-sm leading-relaxed text-navy md:mx-5">
                        {item.answer}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}

          {hasMore ? (
            <div className="mt-4 text-center">
              <button
                type="button"
                className="inline-flex h-10 items-center rounded-lg border border-border bg-white/90 px-5 text-sm font-semibold text-navy hover:border-accent"
                onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
              >
                Xem thêm ({filtered.length - visibleCount} còn lại)
              </button>
            </div>
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
