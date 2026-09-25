import Link from "next/link";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { BookOpen, Lightbulb, Newspaper } from "lucide-react";
import type { BlogPost } from "@/server/cms/types";
import type { CmsBlogTaxonomy } from "@/server/cms/types";
import {
  authorOf,
  categoryLabel,
  coverToneOf,
  COVER_TONE_CLASS,
  formatPostDate,
  pickFeatured,
  readMinutesOf,
} from "@/storefront/lib/blog";
import {
  filterPostsBySection,
  resourceIndexHref,
  resourcePostHref,
  resourceTopicHref,
  type ResourceSectionId,
} from "@/storefront/lib/resources";
import { LANDING_HERO_PAD } from "@/storefront/components/marketing/hero-shell";
import {
  BADGE_CLASS,
  BODY_MUTED_CLASS,
  BREADCRUMB_CLASS,
  BREADCRUMB_CURRENT_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  CTA_COMPACT_CLASS,
  CTA_LABEL_CLASS,
  INPUT_TEXT_CLASS,
  OVERLINE_CLASS,
  PAGE_LEAD_CLASS,
  PAGE_TITLE_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
  SUBSECTION_TITLE_CLASS,
} from "@/storefront/typography";
import {
  ELEVATION_CARD_HOVER,
  ELEVATION_CTA_HOVER,
  ELEVATION_HAIRLINE,
  HOVER_LIFT_CARD,
  HOVER_LINK_ACCENT,
  MOTION_NORMAL,
  TRANSITION_PANEL,
  TRANSITION_UI,
} from "@/storefront/effects";

const SECTION_META: Record<
  ResourceSectionId,
  { Icon: LucideIcon; glow: string; iconBg: string }
> = {
  insights: {
    Icon: Lightbulb,
    glow: "rgba(37,99,235,0.12)",
    iconBg: "bg-sky-50 text-sky-600",
  },
  guides: {
    Icon: BookOpen,
    glow: "rgba(124,58,237,0.12)",
    iconBg: "bg-violet-50 text-violet-600",
  },
  news: {
    Icon: Newspaper,
    glow: "rgba(14,165,164,0.14)",
    iconBg: "bg-accent-soft text-accent",
  },
};

/** Latest grid: compact cards — 4 slots like Home news. */
const LATEST_LIMIT = 4;

export function KnowledgeHubView({
  taxonomy,
  posts,
}: {
  taxonomy: CmsBlogTaxonomy;
  posts: BlogPost[];
}) {
  const sections = taxonomy.sections.filter((s) => s.visible);
  const topics = [...taxonomy.topics]
    .filter((t) => t.visible)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const featured = pickFeatured(posts, 3);
  const latest = posts.slice(0, LATEST_LIMIT);
  const heroSide = featured.length > 0 ? featured : posts.slice(0, 3);

  return (
    <div className="bg-white pb-0">
      {/* Hero — 2 cột, lấp khoảng trống bên phải */}
      <section className="relative overflow-x-clip border-b border-border bg-[#F7FAFC]">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_88%_18%,rgba(14,165,164,0.09),transparent_42%),radial-gradient(ellipse_at_8%_88%,rgba(14,165,233,0.05),transparent_48%)]"
          aria-hidden
        />
        <div className={`home-container relative ${LANDING_HERO_PAD}`}>
          <nav
            className={`mb-5 flex flex-wrap items-center gap-1.5 ${BREADCRUMB_CLASS}`}
            aria-label="Breadcrumb"
          >
            <Link href="/" className={HOVER_LINK_ACCENT}>
              Trang chủ
            </Link>
            <span aria-hidden className="text-muted-soft">
              ›
            </span>
            <span className={BREADCRUMB_CURRENT_CLASS}>Kiến thức</span>
          </nav>

          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10 xl:gap-12">
            <div className="min-w-0 max-w-[540px]">
              <p className={`${OVERLINE_CLASS} tracking-[0.18em] text-accent`}>
                Kiến thức
              </p>
              <h1 className={`mt-3 ${PAGE_TITLE_CLASS}`}>
                {taxonomy.hubTitle}
              </h1>
              <p className={`mt-4 ${PAGE_LEAD_CLASS}`}>{taxonomy.hubLead}</p>

              <form
                action="/kien-thuc/tin-tuc"
                method="get"
                className="mt-7 flex w-full flex-col gap-2 sm:flex-row sm:items-center"
              >
                <label className="relative min-w-0 flex-1">
                  <span className="sr-only">Tìm bài viết</span>
                  <input
                    name="q"
                    type="search"
                    placeholder="Tìm hướng dẫn, bản quyền, Windows…"
                    className={`h-12 w-full rounded-xl border border-border bg-white px-4 ${INPUT_TEXT_CLASS} outline-none ${TRANSITION_UI} focus:border-accent`}
                  />
                </label>
                <button
                  type="submit"
                  className={`inline-flex h-12 shrink-0 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white shadow-sm ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
                >
                  Tìm kiếm
                </button>
              </form>

              {topics.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {topics.map((t) => (
                    <Link
                      key={t.id}
                      href={resourceTopicHref(t.id)}
                      className={`rounded-full border border-border bg-white px-3.5 py-1.5 ${CTA_COMPACT_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
                    >
                      {t.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>

            <HeroSpotlight posts={heroSide} total={posts.length} />
          </div>
        </div>
      </section>

      {/* Chuyên mục — card dày hơn, có bài mới nhất */}
      <section className="border-b border-border bg-white py-9 md:py-11">
        <div className="home-container">
          <header className="max-w-2xl">
            <h2 className={SECTION_TITLE_CLASS}>Chuyên mục</h2>
            <p className={`mt-1.5 ${SECTION_LEAD_CLASS}`}>
              Chọn loại nội dung phù hợp — hướng dẫn, phân tích hoặc tin cập
              nhật.
            </p>
          </header>

          <ul className="mt-7 grid gap-3 md:grid-cols-3 md:gap-4">
            {sections.map((s) => {
              const id = s.id as ResourceSectionId;
              const meta = SECTION_META[id] ?? SECTION_META.news;
              const sectionPosts = filterPostsBySection(posts, id);
              const count = sectionPosts.length;
              const latestInSection = sectionPosts[0] ?? null;
              const Icon = meta.Icon;

              return (
                <li key={s.id}>
                  <Link
                    href={resourceIndexHref(id)}
                    className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-white p-5 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} hover:border-accent/40 ${ELEVATION_CARD_HOVER}`}
                  >
                    <span
                      className="pointer-events-none absolute inset-0 opacity-90"
                      style={{
                        background: `radial-gradient(ellipse 80% 55% at 12% 0%, ${meta.glow}, transparent 70%)`,
                      }}
                      aria-hidden
                    />
                    <div className="relative z-[1] flex flex-1 flex-col">
                      <span
                        className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${meta.iconBg}`}
                        aria-hidden
                      >
                        <Icon size={20} strokeWidth={1.75} />
                      </span>
                      <h3 className={`mt-4 ${SUBSECTION_TITLE_CLASS}`}>
                        {s.label}
                      </h3>
                      <p className={`mt-1.5 flex-1 ${BODY_MUTED_CLASS}`}>
                        {s.subtitle}
                      </p>

                      {latestInSection ? (
                        <div className="mt-4 rounded-xl border border-border/70 bg-[#F7FAFC] px-3 py-2.5">
                          <p className={CARD_META_CLASS}>Bài mới</p>
                          <p
                            className={`mt-0.5 line-clamp-2 ${CARD_TITLE_CLASS}`}
                          >
                            {latestInSection.title}
                          </p>
                        </div>
                      ) : (
                        <div className="mt-4 rounded-xl border border-dashed border-border/70 bg-[#F7FAFC] px-3 py-2.5">
                          <p className={CARD_META_CLASS}>Sắp có bài viết</p>
                        </div>
                      )}

                      <p
                        className={`mt-4 inline-flex items-center gap-1 ${CTA_COMPACT_CLASS} text-accent ${MOTION_NORMAL} transition-colors group-hover:text-accent-hover`}
                      >
                        {count === 0
                          ? "Xem chuyên mục"
                          : count === 1
                            ? "1 bài viết"
                            : `${count} bài viết`}
                        <span aria-hidden>→</span>
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 ? (
        <section className="border-b border-border bg-[#F7FAFC]">
          <div className="home-container py-9 md:py-11">
            <h2 className={SECTION_TITLE_CLASS}>Nổi bật</h2>
            <div className="mt-6 grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-stretch lg:gap-4">
              <FeaturedHero post={featured[0]!} />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 lg:grid-rows-2">
                {featured.slice(1, 3).map((p) => (
                  <FeaturedSide key={p.id} post={p} />
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Mới nhất — 4 bài, 4 cột desktop (gọn như Home) */}
      <section className="bg-white py-9 md:py-11">
        <div className="home-container">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className={SECTION_TITLE_CLASS}>Mới nhất</h2>
              <p className={`mt-1 ${SECTION_LEAD_CLASS}`}>
                Bài vừa xuất bản trên hub Kiến thức
              </p>
            </div>
            <Link
              href="/kien-thuc/tin-tuc"
              className={`${CTA_COMPACT_CLASS} text-accent hover:underline`}
            >
              Xem tất cả →
            </Link>
          </div>

          {latest.length === 0 ? (
            <p className={BODY_MUTED_CLASS}>
              Chưa có bài viết xuất bản. KEYON sẽ cập nhật sớm.
            </p>
          ) : (
            <>
              {/* Mobile: hàng gọn */}
              <ul className="flex flex-col gap-2.5 md:hidden">
                {latest.map((p) => (
                  <li key={p.id}>
                    <LatestRow post={p} />
                  </li>
                ))}
              </ul>

              {/* Tablet: 2 cột */}
              <ul className="hidden gap-3 md:grid md:grid-cols-2 lg:hidden">
                {latest.map((p) => (
                  <li key={p.id}>
                    <LatestCard post={p} compact />
                  </li>
                ))}
              </ul>

              {/* Desktop: 4 cột gọn */}
              <ul className="hidden gap-3.5 lg:grid lg:grid-cols-4">
                {latest.map((p) => (
                  <li key={p.id}>
                    <LatestCard post={p} />
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      {/* Support strip */}
      <section className="pb-9 md:pb-12">
        <div className="home-container">
          <div className="flex flex-col items-stretch gap-4 rounded-2xl bg-footer px-5 py-6 text-white sm:px-6 md:flex-row md:items-center md:justify-between md:px-8">
            <div>
              <h2 className={`${SECTION_TITLE_CLASS} !text-white`}>
                Cần hỗ trợ nhanh?
              </h2>
              <p className={`mt-2 max-w-xl ${SECTION_LEAD_CLASS} !text-slate-300`}>
                FAQ và trung tâm hỗ trợ — tách khỏi hub kiến thức.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/faq"
                className={`inline-flex h-11 items-center justify-center rounded-xl border border-white/25 bg-white/10 px-5 ${CTA_COMPACT_CLASS} text-white ${TRANSITION_UI} hover:bg-white/15`}
              >
                FAQ
              </Link>
              <Link
                href="/support"
                className={`inline-flex h-11 items-center justify-center rounded-xl bg-accent px-5 ${CTA_COMPACT_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover`}
              >
                Trung tâm hỗ trợ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function HeroSpotlight({
  posts,
  total,
}: {
  posts: BlogPost[];
  total: number;
}) {
  const primary = posts[0];
  const secondary = posts.slice(1, 3);

  if (!primary) {
    return (
      <div
        className={`rounded-2xl border border-border/80 bg-white p-6 ${ELEVATION_HAIRLINE}`}
      >
        <p className={CARD_TITLE_CLASS}>Hub kiến thức KEYON</p>
        <p className={`mt-2 ${BODY_MUTED_CLASS}`}>
          Hướng dẫn kích hoạt, phân tích bản quyền và tin sản phẩm sẽ xuất hiện
          tại đây.
        </p>
      </div>
    );
  }

  const tone = COVER_TONE_CLASS[coverToneOf(primary)];

  return (
    <div className="grid gap-3">
      <Link
        href={resourcePostHref(primary)}
        className={`group relative flex min-h-[11.5rem] flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br p-4 text-white sm:min-h-[13rem] sm:p-5 ${tone} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD}`}
      >
        {primary.coverUrl ? (
          <Image
            src={primary.coverUrl}
            alt={primary.coverAlt || ""}
            fill
            className={`object-cover opacity-80 ${MOTION_NORMAL} transition-transform group-hover:scale-105`}
            sizes="(max-width: 1024px) 100vw, 40vw"
            unoptimized
            priority
          />
        ) : null}
        <div className="relative z-[1]">
          <span
            className={`inline-flex rounded-md bg-accent px-2 py-0.5 ${BADGE_CLASS} text-white`}
          >
            Đọc ngay
          </span>
          <h2
            className={`mt-2.5 line-clamp-2 ${SUBSECTION_TITLE_CLASS} !text-white`}
          >
            {primary.title}
          </h2>
          <p className={`mt-1.5 ${CARD_META_CLASS} !text-white/75`}>
            {categoryLabel(primary)} · {formatPostDate(primary)}
          </p>
        </div>
      </Link>

      {secondary.length > 0 ? (
        <ul className="grid gap-2.5 sm:grid-cols-2">
          {secondary.map((p) => {
            const t = COVER_TONE_CLASS[coverToneOf(p)];
            return (
              <li key={p.id}>
                <Link
                  href={resourcePostHref(p)}
                  className={`group flex gap-2.5 overflow-hidden rounded-xl border border-border/80 bg-white p-2 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} hover:border-accent/40`}
                >
                  <span
                    className={`relative h-[4.25rem] w-[4.75rem] shrink-0 overflow-hidden rounded-lg bg-gradient-to-br ${t}`}
                  >
                    {p.coverUrl ? (
                      <Image
                        src={p.coverUrl}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="76px"
                        unoptimized
                      />
                    ) : null}
                  </span>
                  <span className="min-w-0 flex-1 self-center py-0.5 pr-1">
                    <span className={`block ${CARD_META_CLASS}`}>
                      {categoryLabel(p)}
                    </span>
                    <span
                      className={`mt-0.5 block line-clamp-2 ${CARD_TITLE_CLASS}`}
                    >
                      {p.title}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}

      <p className={`text-center ${CARD_META_CLASS}`}>
        {total > 0
          ? `${total} bài viết trên hub Kiến thức`
          : "Hub kiến thức KEYON"}
      </p>
    </div>
  );
}

function FeaturedHero({ post }: { post: BlogPost }) {
  const tone = COVER_TONE_CLASS[coverToneOf(post)];
  return (
    <Link
      href={resourcePostHref(post)}
      className={`group relative flex min-h-[16rem] flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br p-5 text-white sm:min-h-[18rem] sm:p-6 ${tone} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD}`}
    >
      {post.coverUrl ? (
        <Image
          src={post.coverUrl}
          alt={post.coverAlt || ""}
          fill
          className={`object-cover opacity-80 ${MOTION_NORMAL} transition-transform group-hover:scale-105`}
          sizes="(max-width: 1024px) 100vw, 55vw"
          unoptimized
        />
      ) : null}
      <div className="relative z-[1]">
        <span
          className={`inline-flex rounded-md bg-accent px-2.5 py-1 ${BADGE_CLASS} text-white`}
        >
          Nổi bật
        </span>
        <p className={`mt-3 ${CARD_META_CLASS} !text-white/70`}>
          {formatPostDate(post)}
        </p>
        <h3
          className={`mt-2 max-w-xl line-clamp-3 ${SUBSECTION_TITLE_CLASS} !text-white`}
        >
          {post.title}
        </h3>
        <p className="mt-2 max-w-xl line-clamp-2 text-sm text-white/75">
          {post.excerpt}
        </p>
      </div>
    </Link>
  );
}

function FeaturedSide({ post }: { post: BlogPost }) {
  const tone = COVER_TONE_CLASS[coverToneOf(post)];
  return (
    <Link
      href={resourcePostHref(post)}
      className={`group relative flex min-h-[8.5rem] overflow-hidden rounded-2xl bg-gradient-to-br ${tone} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD}`}
    >
      {post.coverUrl ? (
        <Image
          src={post.coverUrl}
          alt={post.coverAlt || ""}
          fill
          className={`object-cover opacity-75 ${MOTION_NORMAL} transition-transform group-hover:scale-105`}
          sizes="(max-width: 1024px) 50vw, 28vw"
          unoptimized
        />
      ) : null}
      <div className="relative z-[1] flex flex-1 flex-col justify-end p-4 text-white">
        <p className={`${CARD_META_CLASS} !text-white/70`}>
          {categoryLabel(post)}
        </p>
        <h3 className={`mt-1 line-clamp-2 ${CARD_TITLE_CLASS} !text-white`}>
          {post.title}
        </h3>
      </div>
    </Link>
  );
}

function LatestCard({
  post,
  compact = false,
}: {
  post: BlogPost;
  compact?: boolean;
}) {
  const tone = COVER_TONE_CLASS[coverToneOf(post)];
  return (
    <Link
      href={resourcePostHref(post)}
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-white ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} hover:border-border ${ELEVATION_CARD_HOVER}`}
    >
      <div
        className={`relative bg-gradient-to-br ${tone} ${
          compact ? "aspect-[5/3]" : "aspect-[4/3]"
        }`}
      >
        {post.coverUrl ? (
          <Image
            src={post.coverUrl}
            alt={post.coverAlt || ""}
            fill
            className={`object-cover ${MOTION_NORMAL} transition-transform group-hover:scale-105`}
            sizes={
              compact
                ? "(max-width: 1024px) 50vw, 25vw"
                : "(max-width: 1024px) 50vw, 22vw"
            }
            unoptimized
          />
        ) : null}
      </div>
      <div className={`flex flex-1 flex-col ${compact ? "p-3" : "p-3.5"}`}>
        <p className={CARD_META_CLASS}>
          {categoryLabel(post)} · {formatPostDate(post)}
        </p>
        <h3 className={`mt-1.5 line-clamp-2 ${CARD_TITLE_CLASS}`}>
          {post.title}
        </h3>
        {!compact ? (
          <p className={`mt-1.5 line-clamp-2 ${BODY_MUTED_CLASS}`}>
            {post.excerpt}
          </p>
        ) : null}
        <p className={`mt-auto pt-2.5 ${CARD_META_CLASS}`}>
          {authorOf(post)} · {readMinutesOf(post)} phút
        </p>
      </div>
    </Link>
  );
}

function LatestRow({ post }: { post: BlogPost }) {
  const tone = COVER_TONE_CLASS[coverToneOf(post)];
  return (
    <Link
      href={resourcePostHref(post)}
      className={`flex gap-2.5 overflow-hidden rounded-xl border border-border/80 bg-white p-2 ${ELEVATION_HAIRLINE} ${TRANSITION_UI} active:bg-surface`}
    >
      <span
        className={`relative h-16 w-[88px] shrink-0 overflow-hidden rounded-lg bg-gradient-to-br ${tone}`}
      >
        {post.coverUrl ? (
          <Image
            src={post.coverUrl}
            alt=""
            fill
            className="object-cover"
            sizes="176px"
            unoptimized
          />
        ) : null}
      </span>
      <span className="min-w-0 flex-1 self-center">
        <span className={`block ${CARD_META_CLASS}`}>
          {categoryLabel(post)} · {formatPostDate(post)}
        </span>
        <span className={`mt-0.5 block line-clamp-2 ${CARD_TITLE_CLASS}`}>
          {post.title}
        </span>
      </span>
    </Link>
  );
}
