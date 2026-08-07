import type { Metadata } from "next";
import { defaultCmsSolutions, readJsonFile } from "@/server/cms/store";
import { SolutionsHubLanding } from "@/storefront/components/solutions/SolutionsHubLanding";
import { buildMainPageMetadata } from "@/server/seo/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    ...(await buildMainPageMetadata("/solutions")),
    title: "Giải pháp | KEYON",
    description:
      "Giải pháp số KEYON cho doanh nghiệp: bản quyền phần mềm, quản lý license, bảo mật, backup, năng suất và cloud.",
  };
}

export default async function SolutionsHubPage() {
  const cmsRaw = await readJsonFile("solutions.json", defaultCmsSolutions);
  const cms = { ...defaultCmsSolutions, ...cmsRaw };
  return (
    <SolutionsHubLanding introVideoUrl={cms.introVideoUrl.trim() || null} />
  );
}
