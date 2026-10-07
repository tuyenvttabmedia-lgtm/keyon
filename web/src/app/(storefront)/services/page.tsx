import type { Metadata } from "next";
import { ServicesHub } from "@/storefront/components/services/ServicesHub";
import { buildMainPageMetadata } from "@/server/seo/metadata";
import { absoluteTitle } from "@/server/seo/title";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return {
    ...(await buildMainPageMetadata("/services")),
    title: absoluteTitle("Dịch vụ triển khai và quản lý giải pháp số | KEYON"),
    description:
      "Triển khai Microsoft 365, di chuyển email, cloud, backup và bảo mật. KEYON chốt phạm vi trước khi thực hiện.",
  };
}

export default function ServicesPage() {
  return <ServicesHub />;
}
