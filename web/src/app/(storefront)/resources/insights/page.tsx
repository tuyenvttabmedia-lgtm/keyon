import type { Metadata } from "next";
import { ResourceStub } from "@/storefront/components/marketing/IaLanding";
import { RESOURCE_SECTIONS } from "@/storefront/nav/ia-pages";
import { buildMainPageMetadata } from "@/server/seo/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    ...(await buildMainPageMetadata("/resources/insights")),
    title: "Kiến thức | KEYON",
    description: RESOURCE_SECTIONS.insights!.subtitle,
  };
}

export default function ResourcesInsightsPage() {
  const s = RESOURCE_SECTIONS.insights!;
  return (
    <ResourceStub
      title={s.title}
      subtitle={s.subtitle}
      primary={{ label: "Xem tin / bài hiện có", href: "/blog" }}
    />
  );
}
