"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { BlogPost, CmsBlog } from "@/server/cms/types";
import { isHtmlBody } from "@/server/cms/blog-utils";
import { sanitizeBlogHtml } from "@/lib/sanitize-blog-html";
import {
  adjacentPosts,
  authorOf,
  BLOG_CATEGORIES,
  categoryLabel,
  collectPopularTags,
  coverToneOf,
  COVER_TONE_CLASS,
  formatPostDate,
  parseBlogBody,
  pickFeatured,
  readMinutesOf,
  tocFromBlocks,
  type BlogCategoryFilter,
} from "@/storefront/lib/blog";

function tocFromHtml(html: string) {
  const items: { id: string; text: string }[] = [];
  const re = /<h([23])[^>]*>([\s\S]*?)<\/h\1>/gi;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(html)) !== null) {
    const text = m[2].replace(/<[^>]+>/g, "").trim();
    if (!text) continue;
    const id =
      text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || `section-${++i}`;
    items.push({ id, text });
  }
  return items;
}

/** Ensure headings have ids for TOC anchors. */
function withHeadingIds(html: string) {
  let i = 0;
  return html.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi, (_all, level, attrs, inner) => {
    const text = String(inner).replace(/<[^>]+>/g, "").trim();
    const id =
      text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || `section-${++i}`;
    if (/\bid\s*=/.test(attrs)) {
      return `<h${level}${attrs}>${inner}</h${level}>`;
    }
    return `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
  });
}
import {
  BADGE_CLASS,
  BODY_CLASS,
  BODY_MUTED_CLASS,
  BREADCRUMB_CLASS,
  BREADCRUMB_CURRENT_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  CTA_COMPACT_CLASS,
  CTA_LABEL_CLASS,
  INPUT_TEXT_CLASS,
  PAGE_TITLE_CLASS,
  SECTION_LEAD_CLASS,
  SUBSECTION_TITLE_CLASS,
} from "@/storefront/typography";
import {
  ELEVATION_HAIRLINE,
  ELEVATION_NONE,
  HOVER_LINK_ACCENT,
  HOVER_OUTLINE_FILL,
  HOVER_ROW,
  TRANSITION_UI,
} from "@/storefront/effects";

const PREVIEW_BLOCKS = 5;

export function BlogDetailView({
  cms,
  post,
  posts,
}: {
  cms: CmsBlog;
  post: BlogPost;
  posts: BlogPost[];
}) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [helpful, setHelpful] = useState<"yes" | "no" | null>(null);
  const [yesCount, setYesCount] = useState(24);
  const [noCount, setNoCount] = useState(3);
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);

  const htmlMode = useMemo(() => isHtmlBody(post.body), [post.body]);
  const safeHtml = useMemo(() => {
    if (!htmlMode) return "";
    return withHeadingIds(sanitizeBlogHtml(post.body));
  }, [htmlMode, post.body]);
  const blocks = useMemo(
    () => (htmlMode ? [] : parseBlogBody(post.body)),
    [htmlMode, post.body],
  );
  const toc = useMemo(
    () => (htmlMode ? tocFromHtml(safeHtml) : tocFromBlocks(blocks)),
    [htmlMode, safeHtml, blocks],
  );
  const visibleBlocks = expanded ? blocks : blocks.slice(0, PREVIEW_BLOCKS);
  const canExpand = !htmlMode && blocks.length > PREVIEW_BLOCKS && !expanded;

  const { prev, next } = useMemo(
    () => adjacentPosts(posts, post.id),
    [posts, post.id],
  );

  const featured = useMemo(
    () => pickFeatured(posts.filter((p) => p.id !== post.id), 4),
    [posts, post.id],
  );

  const topicCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of posts) {
      if (!p.category) continue;
      map.set(p.category, (map.get(p.category) ?? 0) + 1);
    }
    return BLOG_CATEGORIES.filter((c) => c.id !== "all").map((c) => ({
      id: c.id as Exclude<BlogCategoryFilter, "all">,
      label: c.label,
      count: map.get(c.id) ?? 0,
      icon: c.icon,
    }));
  }, [posts]);

  const tags = useMemo(() => {
    const fromPost = post.tags ?? [];
    const popular = collectPopularTags(posts, 14);
    const merged = [...fromPost];
    for (const t of popular) {
      if (!merged.includes(t)) merged.push(t);
    }
    return merged.slice(0, 14);
  }, [post.tags, posts]);

  const tone = COVER_TONE_CLASS[coverToneOf(post)];

  function vote(kind: "yes" | "no") {
    if (helpful) return;
    setHelpful(kind);
    if (kind === "yes") setYesCount((n) => n + 1);
    else setNoCount((n) => n + 1);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  }

  function share(network: "fb" | "x" | "li") {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(post.title);
    const href =
      network === "fb"
        ? `https://www.facebook.com/sharer/sharer.php?u=${url}`
        : network === "x"
          ? `https://twitter.com/intent/tweet?url=${url}&text=${text}`
          : `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    window.open(href, "_blank", "noopener,noreferrer,width=640,height=480");
  }

  return (
    <div className="home-container space-y-6 py-8 md:space-y-8 md:py-12">
      <nav className={`flex flex-wrap items-center gap-1.5 ${BREADCRUMB_CLASS}`}>
        <Link href="/" className={HOVER_LINK_ACCENT}>
          Trang chủ
        </Link>
        <span aria-hidden>/</span>
        <Link href="/blog" className={HOVER_LINK_ACCENT}>
          Tin tức
        </Link>
        {post.category ? (
          <>
            <span aria-hidden>/</span>
            <Link
              href={`/blog?category=${post.category}`}
              className={HOVER_LINK_ACCENT}
            >
              {categoryLabel(post)}
            </Link>
          </>
        ) : null}
        <span aria-hidden>/</span>
        <span className={`line-clamp-1 ${BREADCRUMB_CURRENT_CLASS}`}>
          {post.title}
        </span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(16rem,0.85fr)] lg:items-start lg:gap-8">
        {/* Main article */}
        <article
          className={`rounded-2xl border border-border bg-white p-5 sm:p-7 ${ELEVATION_HAIRLINE}`}
        >
          <span
            className={`inline-flex rounded-full bg-accent-soft px-2.5 py-0.5 ${BADGE_CLASS} uppercase tracking-wide text-accent`}
          >
            {categoryLabel(post)}
          </span>
          <h1 className={`mt-3 ${PAGE_TITLE_CLASS}`}>{post.title}</h1>
          <p className={`mt-3 ${SECTION_LEAD_CLASS}`}>{post.excerpt}</p>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5">
            <div className="flex min-w-0 flex-wrap items-center gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
                {authorOf(post).slice(0, 1).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className={`flex items-center gap-1.5 ${CARD_TITLE_CLASS}`}>
                  {authorOf(post)}
                  <span
                    className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-sky-500 text-[10px] text-white"
                    title={cms.detailVerifiedLabel}
                  >
                    ✓
                  </span>
                </p>
                <p className={CARD_META_CLASS}>
                  {formatPostDate(post)} · {readMinutesOf(post)} phút đọc
                </p>
              </div>
            </div>
            <ShareRow
              onCopy={copyLink}
              onShare={share}
              copied={copied}
            />
          </div>

          <div
            className={`relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl bg-gradient-to-br ${tone}`}
          >
            {post.coverUrl ? (
              <Image
                src={post.coverUrl}
                alt={post.coverAlt?.trim() || post.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 70vw"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-end p-6">
                <p className={`max-w-md ${SUBSECTION_TITLE_CLASS} !text-white`}>
                  {post.title}
                </p>
              </div>
            )}
          </div>

          {toc.length > 0 ? (
            <div className="mt-6 rounded-2xl bg-surface px-4 py-4 sm:px-5">
              <p className={CARD_TITLE_CLASS}>{cms.detailTocTitle}</p>
              <ol className="mt-3 grid gap-2 sm:grid-cols-2">
                {toc.map((item, i) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className={`inline-flex gap-2 ${CTA_COMPACT_CLASS} text-navy ${TRANSITION_UI} hover:text-accent`}
                    >
                      <span className="text-accent">{i + 1}.</span>
                      <span className="line-clamp-2">{item.text}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          <div className="mt-6 space-y-5">
            {htmlMode ? (
              <div
                className={`blog-prose max-w-none space-y-4 ${BODY_CLASS} [&_h2]:scroll-mt-28 [&_h3]:scroll-mt-28 [&_a]:text-accent [&_img]:rounded-xl [&_table]:w-full [&_table]:text-sm`}
                dangerouslySetInnerHTML={{ __html: safeHtml }}
              />
            ) : (
              visibleBlocks.map((b, i) => {
                if (b.type === "h") {
                  const Tag = b.level === 2 ? "h2" : "h3";
                  return (
                    <Tag
                      key={`${b.id}-${i}`}
                      id={b.id}
                      className={`scroll-mt-28 ${
                        b.level === 2
                          ? SUBSECTION_TITLE_CLASS
                          : CARD_TITLE_CLASS
                      }`}
                    >
                      {b.text}
                    </Tag>
                  );
                }
                if (b.type === "callout") {
                  return (
                    <div
                      key={`c-${i}`}
                      className="flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3"
                    >
                      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
                        ✓
                      </span>
                      <p className={`${BODY_CLASS} !text-emerald-900`}>
                        {b.text}
                      </p>
                    </div>
                  );
                }
                return (
                  <p key={`p-${i}`} className={`${BODY_CLASS} !text-muted`}>
                    {b.text}
                  </p>
                );
              })
            )}
          </div>

          {/* Decorative gallery placeholders when expanded or always after first sections */}
          {expanded || !canExpand ? (
            <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`aspect-[4/3] rounded-xl bg-gradient-to-br ${tone} opacity-90`}
                />
              ))}
            </div>
          ) : null}

          {canExpand ? (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className={`inline-flex h-11 items-center gap-2 rounded-xl border border-accent bg-white px-5 ${CTA_LABEL_CLASS} text-accent ${TRANSITION_UI} hover:bg-accent hover:text-white`}
              >
                {cms.detailContinueCta}
                <span aria-hidden>→</span>
              </button>
            </div>
          ) : null}

          {/* Prev / next */}
          <div className="mt-10 grid gap-3 border-t border-border pt-6 sm:grid-cols-2">
            {prev ? (
              <Link
                href={`/blog/${prev.slug}`}
                className={`group flex gap-3 rounded-xl border border-border p-3 ${ELEVATION_NONE} ${TRANSITION_UI} ${HOVER_ROW}`}
              >
                <span
                  className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br ${COVER_TONE_CLASS[coverToneOf(prev)]}`}
                />
                <span className="min-w-0 flex-1">
                  <span className={CARD_META_CLASS}>{cms.detailPrevLabel}</span>
                  <span
                    className={`mt-1 line-clamp-2 block ${CARD_TITLE_CLASS} group-hover:text-accent`}
                  >
                    {prev.title}
                  </span>
                </span>
                <span className="self-center text-muted" aria-hidden>
                  ←
                </span>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                href={`/blog/${next.slug}`}
                className={`group flex gap-3 rounded-xl border border-border p-3 sm:flex-row-reverse sm:text-right ${ELEVATION_NONE} ${TRANSITION_UI} ${HOVER_ROW}`}
              >
                <span
                  className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br ${COVER_TONE_CLASS[coverToneOf(next)]}`}
                />
                <span className="min-w-0 flex-1">
                  <span className={CARD_META_CLASS}>{cms.detailNextLabel}</span>
                  <span
                    className={`mt-1 line-clamp-2 block ${CARD_TITLE_CLASS} group-hover:text-accent`}
                  >
                    {next.title}
                  </span>
                </span>
                <span className="self-center text-muted" aria-hidden>
                  →
                </span>
              </Link>
            ) : null}
          </div>

          {/* Feedback */}
          <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-surface px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div>
              <p className={CARD_TITLE_CLASS}>{cms.detailHelpfulTitle}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={!!helpful}
                  onClick={() => vote("yes")}
                  className={`inline-flex h-9 items-center gap-1.5 rounded-lg px-3 ${CTA_COMPACT_CLASS} ${TRANSITION_UI} ${
                    helpful === "yes"
                      ? "bg-accent text-white"
                      : `border border-border bg-white text-navy ${HOVER_OUTLINE_FILL}`
                  } disabled:opacity-100`}
                >
                  {cms.detailHelpfulYes} ({yesCount})
                </button>
                <button
                  type="button"
                  disabled={!!helpful}
                  onClick={() => vote("no")}
                  className={`inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-white px-3 ${CTA_COMPACT_CLASS} text-navy ${TRANSITION_UI} hover:border-border hover:bg-white disabled:opacity-100 ${
                    helpful === "no" ? "border-navy bg-navy-soft" : ""
                  }`}
                >
                  {cms.detailHelpfulNo} ({noCount})
                </button>
              </div>
            </div>
            <div>
              <p className={`mb-2 ${CARD_META_CLASS}`}>{cms.detailShareTitle}</p>
              <ShareRow onCopy={copyLink} onShare={share} copied={copied} />
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="space-y-5 lg:sticky lg:top-24">
          <section
            className={`rounded-2xl border border-border bg-white p-5 ${ELEVATION_HAIRLINE}`}
          >
            <h2 className={CARD_TITLE_CLASS}>{cms.detailSearchTitle}</h2>
            <form
              className="relative mt-3"
              onSubmit={(e) => {
                e.preventDefault();
                const q = search.trim();
                router.push(q ? `/blog?q=${encodeURIComponent(q)}` : "/blog");
              }}
            >
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                <SearchIcon />
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={cms.searchPlaceholder}
                className={`h-11 w-full rounded-xl border border-border bg-white pl-10 pr-3 ${INPUT_TEXT_CLASS} outline-none ${TRANSITION_UI} focus:border-accent`}
              />
            </form>
          </section>

          <section
            className={`rounded-2xl border border-border bg-white p-5 ${ELEVATION_HAIRLINE}`}
          >
            <h2 className={SUBSECTION_TITLE_CLASS}>
              {cms.detailCategoriesTitle}
            </h2>
            <ul className="mt-3 space-y-1">
              {topicCounts.map((t) => (
                <li key={t.id}>
                  <Link
                    href={`/blog?category=${t.id}`}
                    className={`flex items-center gap-2.5 rounded-xl px-2 py-2.5 ${TRANSITION_UI} ${HOVER_ROW}`}
                  >
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-surface text-navy">
                      <CatIcon name={t.icon} />
                    </span>
                    <span className={`min-w-0 flex-1 ${CARD_TITLE_CLASS}`}>
                      {t.label}
                    </span>
                    <span className={CARD_META_CLASS}>{t.count}</span>
                    <span className="text-muted" aria-hidden>
                      ›
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section
            className={`rounded-2xl border border-border bg-white p-5 ${ELEVATION_HAIRLINE}`}
          >
            <h2 className={SUBSECTION_TITLE_CLASS}>
              {cms.detailFeaturedTitle}
            </h2>
            <ul className="mt-4 space-y-3">
              {featured.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className={`flex gap-3 rounded-lg p-1 ${TRANSITION_UI} ${HOVER_ROW}`}
                  >
                    <span
                      className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br ${COVER_TONE_CLASS[coverToneOf(p)]}`}
                    >
                      {p.coverUrl ? (
                        <Image
                          src={p.coverUrl}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      ) : null}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`line-clamp-2 ${CARD_TITLE_CLASS}`}>
                        {p.title}
                      </span>
                      <span className={`mt-1 block ${CARD_META_CLASS}`}>
                        {formatPostDate(p)} · {readMinutesOf(p)} phút
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
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

          {tags.length > 0 ? (
            <section
              className={`rounded-2xl border border-border bg-white p-5 ${ELEVATION_HAIRLINE}`}
            >
              <h2 className={SUBSECTION_TITLE_CLASS}>{cms.detailTagsTitle}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?q=${encodeURIComponent(tag)}`}
                    className={`rounded-full border border-border bg-surface px-3 py-1.5 ${CTA_COMPACT_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:bg-accent-soft hover:text-accent`}
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

function ShareRow({
  onCopy,
  onShare,
  copied,
}: {
  onCopy: () => void;
  onShare: (n: "fb" | "x" | "li") => void;
  copied: boolean;
}) {
  const btn = `inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`;
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        className={btn}
        onClick={() => onShare("fb")}
        aria-label="Facebook"
      >
        <IconFb />
      </button>
      <button
        type="button"
        className={btn}
        onClick={() => onShare("x")}
        aria-label="X"
      >
        <IconX />
      </button>
      <button
        type="button"
        className={btn}
        onClick={() => onShare("li")}
        aria-label="LinkedIn"
      >
        <IconLi />
      </button>
      <button
        type="button"
        className={btn}
        onClick={onCopy}
        aria-label={copied ? "Đã sao chép" : "Sao chép liên kết"}
      >
        {copied ? <IconCheck /> : <IconLink />}
      </button>
    </div>
  );
}

function IconFb() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H8v3h3v7h3v-7h3l1-3h-4V9c0-.6.4-1 1-1Z" />
    </svg>
  );
}

function IconX() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.2 3H21l-6.6 7.5L22 21h-5.8l-4.5-5.9L6.2 21H3.4l7-8L2 3h5.9l4.1 5.4L18.2 3Zm-1 16.2h1.6L7 4.7H5.3l11.9 14.5Z" />
    </svg>
  );
}

function IconLi() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.5 9.5H3.7V20h2.8V9.5ZM5.1 4a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4ZM20.3 20h-2.8v-5.6c0-1.5-.6-2.5-1.9-2.5-1 0-1.5.7-1.8 1.3-.1.2-.1.6-.1.9V20h-2.8s.04-9.3 0-10.5h2.8v1.5c.4-.6 1.1-1.7 2.8-1.7 2 0 3.6 1.3 3.6 4.2V20Z" />
    </svg>
  );
}

function IconLink() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M10 13a5 5 0 0 0 7.1.1l1.4-1.4a5 5 0 0 0-7.1-7.1L10 6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M14 11a5 5 0 0 0-7.1-.1L5.5 12.3a5 5 0 0 0 7.1 7.1L14 18"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="m5 12 5 5L20 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.75" />
      <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function CatIcon({
  name,
}: {
  name: (typeof BLOG_CATEGORIES)[number]["icon"];
}) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none" as const,
  };
  switch (name) {
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
        </svg>
      );
    case "guide":
      return (
        <svg {...common} aria-hidden>
          <path d="M6 5h9l3 3v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common} aria-hidden>
          <path d="M12 3 5 6v5c0 5 3.2 8.2 7 9.5 3.8-1.3 7-4.5 7-9.5V6l-7-3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      );
    case "news":
      return (
        <svg {...common} aria-hidden>
          <path d="M5 7h14v3H5V7Zm2 5h10v8H7v-8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      );
    default:
      return (
        <svg {...common} aria-hidden>
          <path d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
  }
}
