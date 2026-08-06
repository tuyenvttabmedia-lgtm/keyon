import type { Metadata } from "next";
import { BusinessHubLanding } from "@/storefront/components/business/BusinessHubLanding";
import { buildMainPageMetadata } from "@/server/seo/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    ...(await buildMainPageMetadata("/business")),
    title: "Doanh nghiệp | KEYON",
    description:
      "Giải pháp bản quyền cho doanh nghiệp: volume licensing, subscription, tư vấn và quản lý license trên nền tảng KEYON.",
  };
}

export default function BusinessHubPage() {
  return <BusinessHubLanding />;
}
