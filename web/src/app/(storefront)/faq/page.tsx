import type { Metadata } from "next";
import { FaqSupportView } from "@/storefront/components/FaqSupportView";
import { getFaqForPage } from "@/storefront/content/get-home-content";
import { buildMainPageMetadata } from "@/server/seo/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildMainPageMetadata("/faq");
}

type Props = {
  searchParams: Promise<{ q?: string; cat?: string; page?: string }>;
};

export default async function FaqPage({ searchParams }: Props) {
  const sp = await searchParams;
  const faq = await getFaqForPage();
  const pageNum = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);

  return (
    <FaqSupportView
      categories={faq.categories}
      items={faq.items}
      initialQuery={sp.q?.trim() || ""}
      initialCategory={sp.cat?.trim() || null}
      initialPage={pageNum}
    />
  );
}
