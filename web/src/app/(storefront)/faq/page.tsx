import { FaqSupportView } from "@/storefront/components/FaqSupportView";
import { getFaqForPage } from "@/storefront/content/get-home-content";

export const dynamic = "force-dynamic";

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
