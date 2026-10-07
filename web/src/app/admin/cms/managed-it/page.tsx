import { defaultCmsManagedItService, readJsonFile } from "@/server/cms/store";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";
import { CmsSubnav } from "../CmsSubnav";
import { ManagedItCmsForm } from "./managed-it-form";

export const dynamic = "force-dynamic";

export default async function AdminCmsManagedItPage() {
  const page = await readJsonFile("managed-it-service.json", defaultCmsManagedItService);
  return (
    <div className="space-y-4">
      <div>
        <h1 className={ADMIN_PAGE_TITLE_CLASS}>CMS · Managed IT / MSP</h1>
        <p className="text-sm text-muted">
          Ảnh nền hero desktop cho <strong>/services/managed-it</strong>.
        </p>
      </div>
      <CmsSubnav active="/admin/cms/managed-it" />
      <ManagedItCmsForm initial={page} />
    </div>
  );
}
