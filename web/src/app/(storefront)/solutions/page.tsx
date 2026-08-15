import type { Metadata } from "next";
import { SolutionsHubLanding } from "@/storefront/components/solutions/SolutionsHubLanding";
import { buildMainPageMetadata } from "@/server/seo/metadata";
import { defaultCmsSolutions, readJsonFile } from "@/server/cms/store";
import { toVideoEmbedUrl } from "@/storefront/components/solutions/intro-video";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    ...(await buildMainPageMetadata("/solutions")),
    title: "Giải pháp | KEYON",
    description:
      "Giải pháp KEYON theo nhu cầu: năng suất, cloud & hạ tầng, bảo mật, sao lưu, quản lý bản quyền và mix theo quy mô.",
  };
}

export default async function SolutionsHubPage() {
  const cms = await readJsonFile("solutions.json", defaultCmsSolutions);
  return (
    <SolutionsHubLanding introEmbedUrl={toVideoEmbedUrl(cms.introVideoUrl)} />
  );
}
