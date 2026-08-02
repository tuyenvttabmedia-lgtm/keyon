"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { BlogPost, CmsBlog } from "@/server/cms/types";
import {
  authorOf,
  BLOG_CATEGORIES,
  categoryLabel,
  coverToneOf,
  COVER_TONE_CLASS,
  formatPostDate,
  pickFeatured,
  postDateIso,
  readMinutesOf,
  type BlogCategoryFilter,
} from "@/storefront/lib/blog";
import {
  BADGE_CLASS,
  BODY_MUTED_CLASS,
  BREADCRUMB_CLASS,
  BREADCRUMB_CURRENT_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  CTA_COMPACT_CLASS,
  CTA_LABEL_CLASS,
  EMPTY_BODY_CLASS,
  EMPTY_TITLE_CLASS,
  INPUT_TEXT_CLASS,
  PAGE_TITLE_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
  SUBSECTION_TITLE_CLASS,
} from "@/storefront/typography";
import {
  ELEVATION_CARD_HOVER,
  ELEVATION_HAIRLINE,
  ELEVATION_NONE,
  HOVER_LIFT_CARD,
  HOVER_OUTLINE_FILL,
  HOVER_ROW,
  MOTION_NORMAL,
  TRANSITION_PANEL,
  TRANSITION_UI,
} from "@/storefront/effects";

const PAGE_SIZE = 6;

type SortId = "newest" | "oldest";

export function BlogIndexView({
  cms,
  posts,
  initialQuery = "",
  initialCategory = "all",
}: {
  cms: CmsBlog;
  posts: BlogPost[];
  initialQuery?: string;
  initialCategory?: BlogCategoryFilter;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState<SortId>("newest");
  const [category, setCategory] =
    useState<BlogCategoryFilter>(initialCategory);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [bookmarksReady, setBookmarksReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("keyon_blog_saved");
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, boolean>;
        if (parsed && typeof parsed === "object") setSaved(parsed);
      }
    } catch {
      /* ignore */
    }
    setBookmarksReady(true);
  }, []);

  useEffect(() => {
    if (!bookmarksReady) return;
    try {
      localStorage.setItem("keyon_blog_saved", JSON.stringify(saved));
    } catch {
      /* ignore */
    }
  }, [saved, bookmarksReady]);

  const featured = useMemo(() => pickFeatured(posts, 3), [posts]);

  const topicCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of posts) {
      if (!p.category) continue;
      map.set(p.category, (map.get(p.category) ?? 0) + 1);
    }
    return BLOG_CATEGORIES.filter((c) => c.id !== "all")
      .map((c) => ({
        id: c.id as Exclude<BlogCategoryFilter, "all">,
        label: c.label,
        count: map.get(c.id) ?? 0,
        icon: c.icon,
      }))
      .filter((c) => c.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = posts.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (!q) return true;
      const inTags = (p.tags ?? []).some((t) => t.toLowerCase().includes(q));
      return (
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        categoryLabel(p).toLowerCase().includes(q) ||
        inTags
      );
    });
    list.sort((a, b) => {
      const da = new Date(postDateIso(a)).getTime();
      const db = new Date(postDateIso(b)).getTime();
      return sort === "newest" ? db - da : da - db;
    });
    return list;
  }, [posts, query, sort, category]);

  const latestPool = useMemo(() => {
    const heroId = featured[0]?.id;
    // Avoid duplicating the large featured hero; keep enough posts for the list.
    return filtered.filter(
      (p) =>
        p.id !== heroId || category !== "all" || Boolean(query.trim()),
    );
  }, [filtered, featured, category, query]);

  const latest = latestPool.slice(0, visible);
  const canLoadMore = visible < latestPool.length;

  const trending = useMemo(() => {
    return [...posts]
      .sort(
        (a, b) =>
          new Date(postDateIso(b)).getTime() - new Date(postDateIso(a)).getTime(),
      )
      .slice(0, 5);
  }, [posts]);

  function toggleSave(id: string) {
    setSaved((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = true;
      return next;
    });
  }

  return (
    <div className="pb-0">
      <div className="home-container space-y-8 py-8 md:space-y-10 md:py-12">
        <nav className={`flex flex-wrap items-center gap-1.5 ${BREADCRUMB_CLASS}`}>
          <Link href="/" className="transition-colors hover:text-accent">
            Trang chủ
          </Link>
          <span aria-hidden>/</span>
          <span className={BREADCRUMB_CURRENT_CLASS}>{cms.pageTitle}</span>
        </nav>

        {/* Title + search/sort */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="min-w-0 max-w-2xl">
            <h1 className={PAGE_TITLE_CLASS}>{cms.pageTitle}</h1>
            <span
              className="mt-2 block h-1 w-12 rounded-full bg-accent"
              aria-hidden
            />
            <p className={`mt-3 ${SECTION_LEAD_CLASS}`}>{cms.pageLead}</p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center lg:w-auto lg:max-w-md lg:shrink-0">
            <label className="relative min-w-0 flex-1">
              <span className="sr-only">{cms.searchPlaceholder}</span>
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                <SearchIcon />
              </span>
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setVisible(PAGE_SIZE);
                }}
                placeholder={cms.searchPlaceholder}
                className={`h-11 w-full rounded-xl border border-border bg-white pl-10 pr-3 ${INPUT_TEXT_CLASS} outline-none ${TRANSITION_UI} focus:border-accent`}
              />
            </label>
            <label className="relative shrink-0">
              <span className="sr-only">Sắp xếp</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortId)}
                className={`h-11 w-full appearance-none rounded-xl border border-border bg-white py-2 pl-3 pr-9 sm:w-[9.5rem] ${CTA_COMPACT_CLASS} text-navy outline-none ${TRANSITION_UI} focus:border-accent`}
              >
                <option value="newest">{cms.sortNewest}</option>
                <option value="oldest">{cms.sortOldest}</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted">
                ▾
              </span>
            </label>
          </div>
        </div>

        {/* Featured hero */}
        {featured.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.9fr)] lg:items-stretch">
            <FeaturedHero post={featured[0]!} badge={cms.featuredBadge} />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:grid-rows-2">
              {featured.slice(1, 3).map((p) => (
                <FeaturedSide key={p.id} post={p} />
              ))}
            </div>
          </div>
        ) : null}

        {/* Category chips */}
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {BLOG_CATEGORIES.map((c) => {
            const active = category === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setCategory(c.id);
                  setVisible(PAGE_SIZE);
                }}
                className={`flex min-w-[5.25rem] shrink-0 flex-col items-center gap-2 rounded-xl border px-3 py-3 ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${
                  active
                    ? "border-accent bg-accent-soft text-accent"
                    : `border-border bg-white text-navy ${ELEVATION_HAIRLINE} hover:border-accent/50`
                }`}
              >
                <span
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${
                    active ? "bg-accent text-white" : "bg-surface text-navy"
                  }`}
                >
                  <CatIcon name={c.icon} />
                </span>
                <span className={`${CTA_COMPACT_CLASS} text-center leading-snug`}>
                  {c.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Latest + sidebar */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(16rem,0.85fr)] lg:items-start">
          <section className="min-w-0">
            <h2 className={SUBSECTION_TITLE_CLASS}>{cms.latestTitle}</h2>
            {latest.length === 0 ? (
              <div
                className={`mt-5 rounded-2xl border border-dashed border-border bg-white px-6 py-14 text-center ${ELEVATION_NONE}`}
              >
                <p className={EMPTY_TITLE_CLASS}>{cms.emptyTitle}</p>
                <p className={`mx-auto mt-2 max-w-md ${EMPTY_BODY_CLASS}`}>
                  {cms.emptyBody}
                </p>
              </div>
            ) : (
              <ul className="mt-5 space-y-4">
                {latest.map((p) => (
                  <li key={p.id}>
                    <LatestCard
                      post={p}
                      saved={!!saved[p.id]}
                      onToggleSave={() => toggleSave(p.id)}
                    />
                  </li>
                ))}
              </ul>
            )}
            {canLoadMore ? (
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisible((n) => n + PAGE_SIZE)}
                  className={`inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-white px-5 ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} ${HOVER_OUTLINE_FILL}`}
                >
                  {cms.loadMoreCta}
                  <span aria-hidden>↓</span>
                </button>
              </div>
            ) : null}
          </section>

          <aside className="space-y-5 lg:sticky lg:top-24">
            <section
              className={`rounded-2xl border border-border bg-white p-5 ${ELEVATION_HAIRLINE}`}
            >
              <h2 className={SUBSECTION_TITLE_CLASS}>{cms.trendingTitle}</h2>
              <ol className="mt-4 space-y-3">
                {trending.map((p, i) => (
                  <li key={p.id}>
                    <Link
                      href={`/blog/${p.slug}`}
                      className={`flex gap-3 rounded-lg p-1 ${TRANSITION_UI} ${HOVER_ROW}`}
                    >
                      <span
                        className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-accent-soft ${BADGE_CLASS} text-accent`}
                      >
                        {i + 1}
                      </span>
                      <span
                        className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br ${COVER_TONE_CLASS[coverToneOf(p)]}`}
                      >
                        {p.coverUrl ? (
                          <Image
                            src={p.coverUrl}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : null}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={`line-clamp-2 ${CARD_TITLE_CLASS}`}>
                          {p.title}
                        </span>
                        <span className={`mt-1 block ${CARD_META_CLASS}`}>
                          {formatPostDate(p)}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>

            <section
              className={`rounded-2xl border border-border bg-white p-5 ${ELEVATION_HAIRLINE}`}
            >
              <h2 className={SUBSECTION_TITLE_CLASS}>{cms.topicsTitle}</h2>
              <ul className="mt-4 space-y-1.5">
                {topicCounts.map((t) => {
                  const active = category === t.id;
                  return (
                    <li key={t.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setCategory(t.id);
                          setVisible(PAGE_SIZE);
                        }}
                        className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left ${TRANSITION_UI} ${
                          active
                            ? "bg-accent-soft text-accent"
                            : `${HOVER_ROW} text-navy`
                        }`}
                      >
                        <span
                          className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                            active
                              ? "bg-accent text-white"
                              : "bg-surface text-navy"
                          }`}
                        >
                          <CatIcon name={t.icon} />
                        </span>
                        <span className={`min-w-0 flex-1 ${CARD_TITLE_CLASS}`}>
                          {t.label}
                        </span>
                        <span className={CARD_META_CLASS}>{t.count}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section
              className={`rounded-2xl border border-border bg-surface p-5 ${ELEVATION_NONE}`}
            >
              <h2 className={CARD_TITLE_CLASS}>{cms.exploreTitle}</h2>
              <p className={`mt-2 ${BODY_MUTED_CLASS}`}>{cms.exploreBody}</p>
              <Link
                href={cms.exploreHref}
                className={`mt-4 inline-flex h-11 w-full items-center justify-center rounded-xl bg-navy ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent`}
              >
                {cms.exploreCta}
              </Link>
            </section>
          </aside>
        </div>
      </div>

      {/* CTA liên hệ — chưa có API newsletter thật */}
      <section className="pb-8 pt-4 md:pb-10 md:pt-6 lg:pb-12">
        <div className="home-container">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-navy via-[#0f2a4a] to-accent px-5 py-7 text-white sm:px-7 sm:py-8 md:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-8">
              <div className="hidden shrink-0 sm:block" aria-hidden>
                <NewsletterArt />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className={`${SECTION_TITLE_CLASS} !text-white`}>
                  Cần hỗ trợ hoặc cập nhật từ KEYON?
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/75 md:text-[15px]">
                  Bản tin email chưa mở. Liên hệ trực tiếp hoặc theo dõi bài viết mới trên
                  trang Blog.
                </p>
              </div>
              <div className="flex w-full shrink-0 flex-col gap-2 sm:max-w-sm lg:w-[18.5rem] lg:max-w-none">
                <Link
                  href="/contact"
                  className={`inline-flex h-12 w-full items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover`}
                >
                  Liên hệ KEYON
                </Link>
                <Link
                  href="/faq"
                  className={`inline-flex h-12 w-full items-center justify-center rounded-xl border border-white/25 bg-white/10 px-6 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-white/15`}
                >
                  Xem FAQ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── Cards ──────────────────────────────────────────────────────────────── */

function FeaturedHero({ post, badge }: { post: BlogPost; badge: string }) {
  const tone = COVER_TONE_CLASS[coverToneOf(post)];
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group relative flex min-h-[18rem] flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br p-5 text-white sm:min-h-[22rem] sm:p-6 ${tone} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD}`}
    >
      {post.coverUrl ? (
        <Image
          src={post.coverUrl}
          alt=""
          fill
          className={`object-cover opacity-40 ${MOTION_NORMAL} transition-transform group-hover:scale-105`}
          sizes="(max-width: 1024px) 100vw, 60vw"
        />
      ) : (
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          aria-hidden
        >
          <WaveDecor />
        </div>
      )}
      <div className="relative z-[1]">
        <span
          className={`inline-flex rounded-md bg-accent px-2.5 py-1 ${BADGE_CLASS} text-white`}
        >
          {badge}
        </span>
        <p className={`mt-3 text-[12px] text-white/70`}>{formatPostDate(post)}</p>
        <h2 className={`mt-2 max-w-xl ${SUBSECTION_TITLE_CLASS} !text-white`}>
          {post.title}
        </h2>
        <p className={`mt-2 max-w-xl line-clamp-2 text-sm text-white/75`}>
          {post.excerpt}
        </p>
        <p className={`mt-4 text-[12px] text-white/70`}>
          {authorOf(post)} · {readMinutesOf(post)} phút đọc
        </p>
      </div>
    </Link>
  );
}

function FeaturedSide({ post }: { post: BlogPost }) {
  const tone = COVER_TONE_CLASS[coverToneOf(post)];
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group relative flex min-h-[10.5rem] flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br p-4 text-white sm:p-5 ${tone} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD}`}
    >
      {post.coverUrl ? (
        <Image
          src={post.coverUrl}
          alt=""
          fill
          className={`object-cover opacity-35 ${MOTION_NORMAL} transition-transform group-hover:scale-105`}
          sizes="(max-width: 1024px) 50vw, 30vw"
        />
      ) : null}
      <div className="relative z-[1]">
        <span
          className={`inline-flex rounded-md bg-white/15 px-2 py-0.5 ${BADGE_CLASS} text-white`}
        >
          {categoryLabel(post)}
        </span>
        <p className={`mt-2 text-[12px] text-white/65`}>{formatPostDate(post)}</p>
        <h3 className={`mt-1 line-clamp-2 ${CARD_TITLE_CLASS} !text-white`}>
          {post.title}
        </h3>
      </div>
      <span
        className={`relative z-[1] ml-auto inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white ${TRANSITION_UI} group-hover:bg-accent group-hover:border-accent`}
        aria-hidden
      >
        →
      </span>
    </Link>
  );
}

function LatestCard({
  post,
  saved,
  onToggleSave,
}: {
  post: BlogPost;
  saved: boolean;
  onToggleSave: () => void;
}) {
  const tone = COVER_TONE_CLASS[coverToneOf(post)];
  return (
    <article
      className={`flex flex-col gap-4 overflow-hidden rounded-2xl border border-border/80 bg-white p-3 sm:flex-row sm:items-stretch sm:p-4 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER} hover:border-border`}
    >
      <Link
        href={`/blog/${post.slug}`}
        className={`relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl bg-gradient-to-br sm:aspect-auto sm:h-auto sm:w-[11.5rem] md:w-[13rem] ${tone}`}
      >
        {post.coverUrl ? (
          <Image
            src={post.coverUrl}
            alt=""
            fill
            className={`object-cover ${MOTION_NORMAL} transition-transform hover:scale-105`}
            sizes="208px"
          />
        ) : null}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <span className={CARD_META_CLASS}>{formatPostDate(post)}</span>
          <span
            className={`inline-flex rounded-full bg-accent-soft px-2.5 py-0.5 ${BADGE_CLASS} text-accent`}
          >
            {categoryLabel(post)}
          </span>
        </div>
        <Link href={`/blog/${post.slug}`} className="mt-1.5 block">
          <h3
            className={`${CARD_TITLE_CLASS} ${TRANSITION_UI} hover:text-accent sm:text-[15px] sm:font-bold`}
          >
            {post.title}
          </h3>
        </Link>
        <p className={`mt-1.5 line-clamp-2 ${BODY_MUTED_CLASS}`}>{post.excerpt}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <p className={CARD_META_CLASS}>
            {authorOf(post)} · {readMinutesOf(post)} phút đọc
          </p>
          <button
            type="button"
            onClick={onToggleSave}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent ${
              saved ? "border-accent bg-accent-soft text-accent" : ""
            }`}
            aria-label={saved ? "Bỏ lưu" : "Lưu bài viết"}
          >
            <BookmarkIcon filled={saved} />
          </button>
        </div>
      </div>
    </article>
  );
}

/* ─── Icons / decor ──────────────────────────────────────────────────────── */

function WaveDecor() {
  return (
    <svg className="h-full w-full" viewBox="0 0 600 400" preserveAspectRatio="none">
      <path
        d="M0 280 C120 220, 200 320, 320 260 S520 180, 600 240 L600 400 L0 400 Z"
        fill="currentColor"
        className="text-white/20"
      />
      <path
        d="M0 200 C140 140, 220 240, 340 180 S520 120, 600 160"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-accent/50"
      />
    </svg>
  );
}

function NewsletterArt() {
  return (
    <div className="relative flex h-28 w-36 items-center justify-center">
      <div className="absolute inset-0 rounded-2xl bg-white/10" />
      <svg width="88" height="72" viewBox="0 0 88 72" fill="none" aria-hidden>
        <rect
          x="8"
          y="16"
          width="72"
          height="44"
          rx="8"
          stroke="white"
          strokeOpacity="0.85"
          strokeWidth="2"
        />
        <path
          d="M12 20 L44 42 L76 20"
          stroke="white"
          strokeOpacity="0.85"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M62 8 L70 2 L74 12"
          stroke="#5EEAD4"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="m16 16 4 4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 4h10a1 1 0 0 1 1 1v15l-6-3.5L6 20V5a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
        fill={filled ? "currentColor" : "none"}
      />
    </svg>
  );
}

function CatIcon({
  name,
}: {
  name: (typeof BLOG_CATEGORIES)[number]["icon"];
}) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none" as const };
  switch (name) {
    case "all":
      return (
        <svg {...common} aria-hidden>
          <path d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case "key":
      return (
        <svg {...common} aria-hidden>
          <circle cx="9" cy="14" r="4" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12 12.5 20 4.5M16.5 4.5 19 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "windows":
      return (
        <svg {...common} aria-hidden>
          <path d="M4 5.5 11 4.5v7H4V5.5Zm9-1.2L20 3v8.5h-7V4.3ZM4 13.5h7V20L4 19v-5.5Zm9 0h7V21l-7-1.2V13.5Z" fill="currentColor" />
        </svg>
      );
    case "office":
      return (
        <svg {...common} aria-hidden>
          <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M8 9h8M8 12h8M8 15h5" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case "building":
      return (
        <svg {...common} aria-hidden>
          <path d="M5 20V6a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v14M9 20v-4h4v4M19 20V10h-3" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M8 8h2M12 8h2M8 11h2M12 11h2" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case "guide":
      return (
        <svg {...common} aria-hidden>
          <path d="M6 5h9l3 3v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.6" />
          <path d="M14 5v4h4M8 12h8M8 15h6" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common} aria-hidden>
          <path d="M12 3 5 6v5c0 5 3.2 8.2 7 9.5 3.8-1.3 7-4.5 7-9.5V6l-7-3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      );
    default:
      return (
        <svg {...common} aria-hidden>
          <path d="M5 7h14v3H5V7Zm2 5h10v8H7v-8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      );
  }
}
