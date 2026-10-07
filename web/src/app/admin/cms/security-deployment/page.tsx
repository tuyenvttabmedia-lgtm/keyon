import { defaultCmsSecurityDeploymentService, readJsonFile } from "@/server/cms/store";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";
import { CmsSubnav } from "../CmsSubnav";
import { SecurityDeploymentCmsForm } from "./security-deployment-form";

export const dynamic = "force-dynamic";

export default async function AdminCmsSecurityDeploymentPage() {
  const security = await readJsonFile(
    "security-deployment-service.json",
    defaultCmsSecurityDeploymentService,
  );
  return (
    <div className="space-y-4">
      <div>
        <h1 className={ADMIN_PAGE_TITLE_CLASS}>CMS · Triển khai bảo mật</h1>
        <p className="text-sm text-muted">
          Ảnh nền hero desktop cho <strong>/services/security-deployment</strong>.
        </p>
      </div>
      <CmsSubnav active="/admin/cms/security-deployment" />
      <SecurityDeploymentCmsForm initial={security} />
    </div>
  );
}
