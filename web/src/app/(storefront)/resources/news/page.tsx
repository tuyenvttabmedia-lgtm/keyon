import type { Metadata } from "next";
import { ResourceStub } from "@/storefront/components/marketing/IaLanding";
import { RESOURCE_SECTIONS } from "@/storefront/nav/ia-pages";
import { buildMainPageMetadata } from "@/server/seo/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    ...(await buildMainPageMetadata("/resources/news")),
    title: "Tin tức | KEYON",
    description: RESOURCE_SECTIONS.news!.subtitle,
  };
}

export default function ResourcesNewsPage() {
  const s = RESOURCE_SECTIONS.news!;
  return (
    <ResourceStub
      title={s.title}
      subtitle={s.subtitle}
      note={s.aliasNote}
      primary={{ label: "Mở tin tức (/blog)", href: "/blog" }}
    />
  );
}
