import type { Metadata } from "next";
import { SolutionsHubLanding } from "@/storefront/components/solutions/SolutionsHubLanding";
import { buildMainPageMetadata } from "@/server/seo/metadata";
import { absoluteTitle } from "@/server/seo/title";
import { defaultCmsSolutions, readJsonFile } from "@/server/cms/store";
import { resolveMediaUrl } from "@/lib/media-url";
import { resolveStorage } from "@/server/storage/config";
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
  const [cmsRaw, storage] = await Promise.all([
    readJsonFile("solutions.json", defaultCmsSolutions),
    resolveStorage(),
  ]);
  const mediaBase =
    storage.driver === "wasabi"
      ? storage.wasabi.publicBaseUrl ||
        `${storage.wasabi.endpoint.replace(/\/$/, "")}/${storage.wasabi.bucket}`
      : "";
  const cms = { ...defaultCmsSolutions, ...cmsRaw };
  const heroImageUrl = resolveMediaUrl(cms.heroImageUrl, mediaBase) || cms.heroImageUrl || undefined;
  return (
    <SolutionsHubLanding
      introEmbedUrl={toVideoEmbedUrl(cms.introVideoUrl)}
      heroImageUrl={heroImageUrl}
    />
  );
}
