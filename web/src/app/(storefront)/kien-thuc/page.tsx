import type { Metadata } from "next";
import { IaHubPage } from "@/storefront/components/marketing/IaLanding";
import { RESOURCE_HUB, RESOURCE_SECTIONS } from "@/storefront/nav/ia-pages";
import { buildMainPageMetadata } from "@/server/seo/metadata";
import { KNOWLEDGE_HUB_PATH } from "@/storefront/lib/resources";
import type { MainSeoPageKey } from "@/lib/seo-main-pages";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildMainPageMetadata(KNOWLEDGE_HUB_PATH as MainSeoPageKey);
}

export default function KnowledgeHubPage() {
  const items = Object.values(RESOURCE_SECTIONS).map((s) => ({
    label: s.title,
    href: s.href,
    description: s.subtitle,
  }));
  items.push({
    label: "FAQ",
    href: "/faq",
    description: "Câu hỏi thường gặp về mua, giao và kích hoạt bản quyền.",
  });
  return (
    <IaHubPage
      title={RESOURCE_HUB.title}
      subtitle={RESOURCE_HUB.subtitle}
      items={items}
    />
  );
}
