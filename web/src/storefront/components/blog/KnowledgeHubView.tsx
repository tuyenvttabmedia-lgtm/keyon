import Link from "next/link";
import Image from "next/image";
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
import {
  BADGE_CLASS,
  BODY_MUTED_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  CTA_COMPACT_CLASS,
  CTA_LABEL_CLASS,
  INPUT_TEXT_CLASS,
  OVERLINE_CLASS,
  PAGE_TITLE_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
  SUBSECTION_TITLE_CLASS,
} from "@/storefront/typography";
import {
  ELEVATION_HAIRLINE,
  HOVER_LIFT_CARD,
  MOTION_NORMAL,
  TRANSITION_PANEL,
  TRANSITION_UI,
} from "@/storefront/effects";

const SECTION_ICON: Record<ResourceSectionId, string> = {
  insights: "◆",
  guides: "▣",
  news: "◉",
};

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
  const latest = posts.slice(0, 6);

  return (
    <div className="pb-0">
      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-[#F0F7FA] via-white to-white">
        <div className="home-container space-y-6 py-10 md:space-y-8 md:py-14">
          <div className="max-w-2xl">
            <p className={`${OVERLINE_CLASS} text-accent`}>KEYON</p>
            <h1 className={`mt-2 ${PAGE_TITLE_CLASS}`}>{taxonomy.hubTitle}</h1>
            <span
              className="mt-3 block h-1 w-12 rounded-full bg-accent"
              aria-hidden
            />
            <p className={`mt-4 ${SECTION_LEAD_CLASS}`}>{taxonomy.hubLead}</p>
          </div>

          <form
            action="/kien-thuc/tin-tuc"
            method="get"
            className="flex w-full max-w-xl flex-col gap-2 sm:flex-row sm:items-center"
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
              className={`inline-flex h-12 shrink-0 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover`}
            >
              Tìm kiếm
            </button>
          </form>

          {topics.length > 0 ? (
            <div className="flex flex-wrap gap-2">
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
      </section>

      {/* Chuyên mục */}
      <section className="home-container py-10 md:py-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className={SECTION_TITLE_CLASS}>Chuyên mục</h2>
            <p className={`mt-1 ${BODY_MUTED_CLASS}`}>
              Chọn loại nội dung phù hợp — hướng dẫn, phân tích hoặc tin cập nhật.
            </p>
          </div>
        </div>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((s) => {
            const id = s.id as ResourceSectionId;
            const count = filterPostsBySection(posts, id).length;
            return (
              <li key={s.id}>
                <Link
                  href={resourceIndexHref(id)}
                  className={`group flex h-full flex-col rounded-2xl border border-border bg-white p-5 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} hover:border-accent/50`}
                >
                  <span
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent"
                    aria-hidden
                  >
                    {SECTION_ICON[id]}
                  </span>
                  <span className={`mt-4 ${SUBSECTION_TITLE_CLASS}`}>
                    {s.label}
                  </span>
                  <p className={`mt-2 flex-1 ${BODY_MUTED_CLASS}`}>{s.subtitle}</p>
                  <p className={`mt-4 ${CARD_META_CLASS} text-accent`}>
                    {count} bài viết →
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Featured */}
      {featured.length > 0 ? (
        <section className="border-y border-border bg-[#F7FAFC]">
          <div className="home-container py-10 md:py-12">
            <h2 className={SECTION_TITLE_CLASS}>Nổi bật</h2>
            <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.9fr)] lg:items-stretch">
              <FeaturedHero post={featured[0]!} />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:grid-rows-2">
                {featured.slice(1, 3).map((p) => (
                  <FeaturedSide key={p.id} post={p} />
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Latest */}
      <section className="home-container py-10 md:py-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className={SECTION_TITLE_CLASS}>Mới nhất</h2>
          <Link
            href="/kien-thuc/tin-tuc"
            className={`${CTA_COMPACT_CLASS} text-accent hover:underline`}
          >
            Xem tất cả tin →
          </Link>
        </div>
        {latest.length === 0 ? (
          <p className={`mt-6 ${BODY_MUTED_CLASS}`}>
            Chưa có bài viết xuất bản. KEYON sẽ cập nhật sớm.
          </p>
        ) : (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((p) => (
              <li key={p.id}>
                <LatestCard post={p} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Support strip */}
      <section className="pb-10 md:pb-14">
        <div className="home-container">
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h2 className={SUBSECTION_TITLE_CLASS}>Cần hỗ trợ nhanh?</h2>
              <p className={`mt-1 ${BODY_MUTED_CLASS}`}>
                Câu hỏi thường gặp và trung tâm hỗ trợ — tách khỏi hub kiến thức.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/faq"
                className={`inline-flex h-11 items-center justify-center rounded-xl border border-border bg-white px-5 ${CTA_COMPACT_CLASS} ${TRANSITION_UI} hover:border-accent`}
              >
                FAQ
              </Link>
              <Link
                href="/support"
                className={`inline-flex h-11 items-center justify-center rounded-xl bg-navy px-5 ${CTA_COMPACT_CLASS} text-white ${TRANSITION_UI} hover:bg-accent`}
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

function FeaturedHero({ post }: { post: BlogPost }) {
  const tone = COVER_TONE_CLASS[coverToneOf(post)];
  return (
    <Link
      href={resourcePostHref(post)}
      className={`group relative flex min-h-[18rem] flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br p-5 text-white sm:min-h-[22rem] sm:p-6 ${tone} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD}`}
    >
      {post.coverUrl ? (
        <Image
          src={post.coverUrl}
          alt={post.coverAlt || ""}
          fill
          className={`object-cover opacity-80 ${MOTION_NORMAL} transition-transform group-hover:scale-105`}
          sizes="(max-width: 1024px) 100vw, 60vw"
          unoptimized
        />
      ) : null}
      <div className="relative z-[1]">
        <span
          className={`inline-flex rounded-md bg-accent px-2.5 py-1 ${BADGE_CLASS} text-white`}
        >
          Nổi bật
        </span>
        <p className="mt-3 text-[12px] text-white/70">{formatPostDate(post)}</p>
        <h3 className={`mt-2 max-w-xl ${SUBSECTION_TITLE_CLASS} !text-white`}>
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
      className={`group relative flex min-h-[9.5rem] overflow-hidden rounded-2xl bg-gradient-to-br ${tone} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD}`}
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
        <p className="text-[11px] text-white/70">{categoryLabel(post)}</p>
        <h3 className={`mt-1 line-clamp-2 ${CARD_TITLE_CLASS} !text-white`}>
          {post.title}
        </h3>
      </div>
    </Link>
  );
}

function LatestCard({ post }: { post: BlogPost }) {
  const tone = COVER_TONE_CLASS[coverToneOf(post)];
  return (
    <Link
      href={resourcePostHref(post)}
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD}`}
    >
      <div className={`relative aspect-[16/9] bg-gradient-to-br ${tone}`}>
        {post.coverUrl ? (
          <Image
            src={post.coverUrl}
            alt={post.coverAlt || ""}
            fill
            className={`object-cover ${MOTION_NORMAL} transition-transform group-hover:scale-105`}
            sizes="(max-width: 640px) 100vw, 33vw"
            unoptimized
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className={CARD_META_CLASS}>
          {categoryLabel(post)} · {formatPostDate(post)}
        </p>
        <h3 className={`mt-1.5 line-clamp-2 ${CARD_TITLE_CLASS}`}>{post.title}</h3>
        <p className={`mt-2 line-clamp-2 ${BODY_MUTED_CLASS}`}>{post.excerpt}</p>
        <p className={`mt-auto pt-3 ${CARD_META_CLASS}`}>
          {authorOf(post)} · {readMinutesOf(post)} phút
        </p>
      </div>
    </Link>
  );
}
