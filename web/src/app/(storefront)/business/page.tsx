import type { Metadata } from "next";
import { BusinessHubLanding } from "@/storefront/components/business/BusinessHubLanding";
import { buildMainPageMetadata } from "@/server/seo/metadata";
import { absoluteTitle } from "@/server/seo/title";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return {
    ...(await buildMainPageMetadata("/business")),
    title: absoluteTitle("Giải pháp bản quyền phần mềm cho doanh nghiệp | KEYON"),
    description:
      "Mua, quản lý và gia hạn bản quyền phần mềm cho doanh nghiệp. KEYON hỗ trợ báo giá, bàn giao license và tư vấn theo quy mô sử dụng.",
  };
}

export default function BusinessHubPage() {
  return <BusinessHubLanding />;
}
