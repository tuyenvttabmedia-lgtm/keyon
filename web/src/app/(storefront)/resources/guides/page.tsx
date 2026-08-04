import type { Metadata } from "next";
import { ResourceStub } from "@/storefront/components/marketing/IaLanding";
import { RESOURCE_SECTIONS } from "@/storefront/nav/ia-pages";
import { buildMainPageMetadata } from "@/server/seo/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    ...(await buildMainPageMetadata("/resources/guides")),
    title: "Hướng dẫn | KEYON",
    description: RESOURCE_SECTIONS.guides!.subtitle,
  };
}

export default function ResourcesGuidesPage() {
  const s = RESOURCE_SECTIONS.guides!;
  return (
    <ResourceStub
      title={s.title}
      subtitle={s.subtitle}
      primary={{ label: "Xem hướng dẫn / bài hiện có", href: "/blog" }}
    />
  );
}
