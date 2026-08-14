import type { Metadata } from "next";
import { BusinessHubLanding } from "@/storefront/components/business/BusinessHubLanding";
import { buildMainPageMetadata } from "@/server/seo/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    ...(await buildMainPageMetadata("/business")),
    title: "Doanh nghiệp | KEYON",
    description:
      "Giải pháp doanh nghiệp KEYON: năng suất, cloud, bảo mật, backup, quản lý license — cùng volume, gia hạn và tư vấn B2B.",
  };
}

export default function BusinessHubPage() {
  return <BusinessHubLanding />;
}
