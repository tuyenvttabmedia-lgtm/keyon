import type { Metadata } from "next";
import { FaqSupportView } from "@/storefront/components/FaqSupportView";
import { getFaqForPage } from "@/storefront/content/get-home-content";
import { buildMainPageMetadata } from "@/server/seo/metadata";
import { buildFaqPageJsonLd } from "@/server/seo/structured-data";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildMainPageMetadata("/faq");
}

type Props = {
  searchParams: Promise<{ q?: string; cat?: string; page?: string; open?: string }>;
};

export default async function FaqPage({ searchParams }: Props) {
  const sp = await searchParams;
  const faq = await getFaqForPage();
  const openId = sp.open?.trim() || null;
  const opened = openId ? faq.items.find((i) => i.id === openId) : undefined;
  const pageNum = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  const faqLd = buildFaqPageJsonLd(
    faq.items.map((i) => ({ question: i.question, answer: i.answer })),
  );

  return (
    <>
      {faqLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      ) : null}
      <FaqSupportView
        categories={faq.categories}
        items={faq.items}
        initialQuery={sp.q?.trim() || ""}
        initialCategory={sp.cat?.trim() || opened?.category || null}
        initialPage={pageNum}
        initialOpenId={opened?.id ?? null}
      />
    </>
  );
}
