import Link from "next/link";
import { notFound } from "next/navigation";
import {
  loadPublishedStaticPages,
  loadStaticPageBySlug,
} from "@/server/cms/static-pages";
import { isHtmlBody, legacyBodyToHtml } from "@/server/cms/blog-utils";
import { sanitizeBlogHtml } from "@/lib/sanitize-blog-html";
import {
  BREADCRUMB_CLASS,
  BREADCRUMB_CURRENT_CLASS,
  CARD_TITLE_CLASS,
  SECTION_LEAD_CLASS,
  SUBSECTION_TITLE_CLASS,
} from "@/storefront/typography";
import { ELEVATION_HAIRLINE, TRANSITION_UI } from "@/storefront/effects";
import { PolicyDetailView } from "@/storefront/components/policy/PolicyDetailView";
import { loadPolicyCms } from "@/storefront/components/policy/load-policy-cms";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const page = await loadStaticPageBySlug(slug, { publishedOnly: true });
  if (!page || page.collection === "policy") {
    return { title: "Trang — KEYON" };
  }
  return {
    title: page.metaTitle || `${page.title} — KEYON`,
    description: page.metaDescription || page.description,
  };
}

export default async function PublicStaticPage({ params }: Props) {
  const { slug } = await params;
  const page = await loadStaticPageBySlug(slug, { publishedOnly: true });
  if (!page || page.collection === "policy") notFound();

  if (page.template === "policy") {
    const cms = await loadPolicyCms();
    const siblings = await loadPublishedStaticPages(page.collection);
    const item = {
      id: page.id,
      slug: page.slug,
      title: page.title,
      description: page.description,
      iconKey: page.iconKey ?? ("terms" as const),
      body: page.body,
      updatedAt: page.updatedAt.slice(0, 10),
      pdfUrl: page.pdfUrl,
    };
    return (
      <PolicyDetailView
        cms={{
          ...cms,
          items: siblings.map((p) => ({
            id: p.id,
            slug: p.slug,
            title: p.title,
            description: p.description,
            iconKey: p.iconKey ?? "terms",
            body: p.body,
            updatedAt: p.updatedAt.slice(0, 10),
            pdfUrl: p.pdfUrl,
          })),
        }}
        item={item}
        basePath="/pages"
      />
    );
  }

  return <SimpleStaticPageView page={page} />;
}

function SimpleStaticPageView({
  page,
}: {
  page: NonNullable<Awaited<ReturnType<typeof loadStaticPageBySlug>>>;
}) {
  const html = sanitizeBlogHtml(
    isHtmlBody(page.body) ? page.body : legacyBodyToHtml(page.body),
  );

  return (
    <div className="bg-[#F4F8FB]">
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="home-container relative py-5 md:py-6">
          <nav
            className={`flex flex-wrap items-center gap-1.5 ${BREADCRUMB_CLASS} !text-white/65`}
          >
            <Link href="/" className={`${TRANSITION_UI} hover:text-accent`}>
              Trang chủ
            </Link>
            <span aria-hidden>›</span>
            <span className={`${BREADCRUMB_CURRENT_CLASS} !text-white/90`}>
              {page.title}
            </span>
          </nav>
          <h1 className={`mt-3 ${SUBSECTION_TITLE_CLASS} !text-white md:text-2xl`}>
            {page.title}
          </h1>
          {page.description ? (
            <p className={`mt-2 max-w-2xl ${SECTION_LEAD_CLASS} !text-white/75`}>
              {page.description}
            </p>
          ) : null}
        </div>
      </section>

      <div className="home-container py-6 md:py-8">
        <article
          className={`rounded-2xl border border-border bg-white p-6 sm:p-8 ${ELEVATION_HAIRLINE}`}
        >
          <div
            className="prose prose-slate max-w-none prose-headings:text-navy prose-p:text-muted prose-li:text-muted prose-a:text-accent prose-strong:text-navy"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <p className={`mt-8 border-t border-border pt-4 ${CARD_TITLE_CLASS}`}>
            <Link href="/" className="text-accent hover:underline">
              ← Về trang chủ
            </Link>
          </p>
        </article>
      </div>
    </div>
  );
}
