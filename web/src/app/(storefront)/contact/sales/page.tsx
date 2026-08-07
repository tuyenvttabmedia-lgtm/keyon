import type { Metadata } from "next";
import { SalesQuoteForm } from "@/storefront/components/business/SalesQuoteForm";
import { buildMainPageMetadata } from "@/server/seo/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    ...(await buildMainPageMetadata("/contact/sales")),
    title: "Liên hệ kinh doanh | KEYON",
    description:
      "Tư vấn bản quyền doanh nghiệp, volume licensing và yêu cầu báo giá KEYON.",
  };
}

type Props = {
  searchParams: Promise<{ estimatedUsers?: string; intent?: string }>;
};

export default async function ContactSalesPage({ searchParams }: Props) {
  const sp = await searchParams;
  return <SalesQuoteForm initialUsers={sp.estimatedUsers} />;
}
