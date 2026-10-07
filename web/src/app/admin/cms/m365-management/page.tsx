import { defaultCmsM365ManagementService, readJsonFile } from "@/server/cms/store";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";
import { CmsSubnav } from "../CmsSubnav";
import { M365ManagementCmsForm } from "./m365-management-form";

export const dynamic = "force-dynamic";

export default async function AdminCmsM365ManagementPage() {
  const page = await readJsonFile("m365-management-service.json", defaultCmsM365ManagementService);
  return (
    <div className="space-y-4">
      <div>
        <h1 className={ADMIN_PAGE_TITLE_CLASS}>CMS · Quản lý Microsoft 365</h1>
        <p className="text-sm text-muted">
          Ảnh nền hero desktop cho <strong>/services/microsoft-365-management</strong>.
        </p>
      </div>
      <CmsSubnav active="/admin/cms/m365-management" />
      <M365ManagementCmsForm initial={page} />
    </div>
  );
}
