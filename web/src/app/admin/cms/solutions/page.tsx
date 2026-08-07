import { defaultCmsSolutions, readJsonFile } from "@/server/cms/store";
import { CmsSubnav } from "../CmsSubnav";
import { SolutionsCmsForm } from "./solutions-form";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";

export const dynamic = "force-dynamic";

export default async function AdminCmsSolutionsPage() {
  const solutions = await readJsonFile("solutions.json", defaultCmsSolutions);
  return (
    <div className="space-y-4">
      <div>
        <h1 className={ADMIN_PAGE_TITLE_CLASS}>CMS · Solutions Hub</h1>
        <p className="text-sm text-muted">
          Video giới thiệu hero cho <strong>/solutions</strong>.
        </p>
      </div>
      <CmsSubnav active="/admin/cms/solutions" />
      <SolutionsCmsForm initial={{ ...defaultCmsSolutions, ...solutions }} />
    </div>
  );
}
