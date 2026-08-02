import type { Metadata } from "next";
import { FaqSupportView } from "@/storefront/components/FaqSupportView";
import { getFaqForPage } from "@/storefront/content/get-home-content";
import { buildMainPageMetadata } from "@/server/seo/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildMainPageMetadata("/faq");
}

export default async function FaqPage() {
  const faq = await getFaqForPage();
  const items = faq.map((f) => ({
    id: f.id,
    question: f.question,
    answer: f.answer,
    category: f.category,
  }));

  return <FaqSupportView items={items} />;
}
