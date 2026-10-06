import { defaultCmsCloudSolution, readJsonFile } from "@/server/cms/store";
import { CmsSubnav } from "../CmsSubnav";
import { CloudSolutionCmsForm } from "./cloud-form";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";

export const dynamic = "force-dynamic";

export default async function AdminCmsCloudPage() {
  const cloud = await readJsonFile("cloud-solution.json", defaultCmsCloudSolution);
  return (
    <div className="space-y-4">
      <div>
        <h1 className={ADMIN_PAGE_TITLE_CLASS}>CMS · Cloud & Hạ tầng</h1>
        <p className="text-sm text-muted">
          Ảnh nền hero desktop cho <strong>/solutions/cloud</strong>.
        </p>
      </div>
      <CmsSubnav active="/admin/cms/cloud" />
      <CloudSolutionCmsForm initial={cloud} />
    </div>
  );
}
