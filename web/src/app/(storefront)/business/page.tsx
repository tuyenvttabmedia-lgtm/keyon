import type { Metadata } from "next";
import { IaHubPage } from "@/storefront/components/marketing/IaLanding";
import { BUSINESS_HUB, BUSINESS_PAGES } from "@/storefront/nav/ia-pages";
import { buildMainPageMetadata } from "@/server/seo/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildMainPageMetadata("/business");
}

export default function BusinessHubPage() {
  const items = [
    ...Object.values(BUSINESS_PAGES).map((p) => ({
      label: p.title,
      href: `/business/${p.slug}`,
      description: p.subtitle,
    })),
    {
      label: "Quản lý bản quyền",
      href: "/solutions/license-management",
      description: "Canonical — theo dõi license trong Tài khoản KEYON",
    },
    {
      label: "Liên hệ kinh doanh",
      href: "/contact/sales",
      description: "CTA tư vấn B2B",
    },
  ];
  return (
    <IaHubPage title={BUSINESS_HUB.title} subtitle={BUSINESS_HUB.subtitle} items={items} />
  );
}
