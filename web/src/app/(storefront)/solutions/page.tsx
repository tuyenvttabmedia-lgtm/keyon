import type { Metadata } from "next";
import { SolutionsHubLanding } from "@/storefront/components/solutions/SolutionsHubLanding";
import { buildMainPageMetadata } from "@/server/seo/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    ...(await buildMainPageMetadata("/solutions")),
    title: "Giải pháp | KEYON",
    description:
      "Giải pháp KEYON theo nhu cầu: năng suất, cloud, bảo mật, backup và quản lý bản quyền.",
  };
}

export default function SolutionsHubPage() {
  return <SolutionsHubLanding />;
}
