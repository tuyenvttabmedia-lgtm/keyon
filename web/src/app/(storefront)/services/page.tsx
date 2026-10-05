import type { Metadata } from "next";
import { ServicesHub } from "@/storefront/components/services/ServicesHub";
import { buildMainPageMetadata } from "@/server/seo/metadata";
import { absoluteTitle } from "@/server/seo/title";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return {
    ...(await buildMainPageMetadata("/services")),
    title: absoluteTitle("Dịch vụ triển khai và quản lý CNTT | KEYON"),
    description:
      "Triển khai Microsoft 365, email, cloud, backup, bảo mật và quản lý hệ thống CNTT. Phạm vi được chốt trước khi thực hiện.",
  };
}

export default function ServicesPage() {
  return <ServicesHub />;
}
