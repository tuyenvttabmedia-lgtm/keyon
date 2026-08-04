import type { Metadata } from "next";
import { IaHubPage } from "@/storefront/components/marketing/IaLanding";
import { SOLUTION_PAGES, SOLUTIONS_HUB } from "@/storefront/nav/ia-pages";
import { buildMainPageMetadata } from "@/server/seo/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildMainPageMetadata("/solutions");
}

export default function SolutionsHubPage() {
  const items = Object.values(SOLUTION_PAGES).map((p) => ({
    label: p.title,
    href: `/solutions/${p.slug}`,
    description: p.subtitle,
  }));
  return <IaHubPage title={SOLUTIONS_HUB.title} subtitle={SOLUTIONS_HUB.subtitle} items={items} />;
}
