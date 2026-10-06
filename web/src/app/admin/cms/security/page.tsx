import { defaultCmsSecuritySolution, readJsonFile } from "@/server/cms/store";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";
import { CmsSubnav } from "../CmsSubnav";
import { SecurityCmsForm } from "./security-form";

export const dynamic = "force-dynamic";

export default async function AdminCmsSecurityPage() {
  const security = await readJsonFile("security-solution.json", defaultCmsSecuritySolution);
  return (
    <div className="space-y-4">
      <div>
        <h1 className={ADMIN_PAGE_TITLE_CLASS}>CMS · Bảo mật</h1>
        <p className="text-sm text-muted">
          Ảnh nền hero desktop cho <strong>/solutions/security</strong>.
        </p>
      </div>
      <CmsSubnav active="/admin/cms/security" />
      <SecurityCmsForm initial={security} />
    </div>
  );
}
