import type { Metadata } from "next";
import { BusinessHubLanding } from "@/storefront/components/business/BusinessHubLanding";
import { buildMainPageMetadata } from "@/server/seo/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    ...(await buildMainPageMetadata("/business")),
    title: "Doanh nghiệp | KEYON",
    description:
      "Volume licensing, subscription, tư vấn bản quyền và báo giá B2B trên KEYON.",
  };
}

export default function BusinessHubPage() {
  return <BusinessHubLanding />;
}
