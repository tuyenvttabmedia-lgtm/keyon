import type { Metadata } from "next";
import { SolutionsHubLanding } from "@/storefront/components/solutions/SolutionsHubLanding";
import { buildMainPageMetadata } from "@/server/seo/metadata";
import { absoluteTitle } from "@/server/seo/title";
import { defaultCmsSolutions, readJsonFile } from "@/server/cms/store";
import { toVideoEmbedUrl } from "@/storefront/components/solutions/intro-video";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return {
    ...(await buildMainPageMetadata("/solutions")),
    title: absoluteTitle("Giải pháp phần mềm, Cloud & bản quyền | KEYON"),
    description:
      "Khám phá giải pháp Microsoft 365, Cloud, bảo mật, backup và quản lý bản quyền. Chọn sản phẩm phù hợp nhu cầu trên KEYON.",
  };
}

export default async function SolutionsHubPage() {
  const cms = await readJsonFile("solutions.json", defaultCmsSolutions);
  return (
    <SolutionsHubLanding introEmbedUrl={toVideoEmbedUrl(cms.introVideoUrl)} />
  );
}
