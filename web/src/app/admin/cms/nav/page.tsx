import { defaultCmsNav, readJsonFile } from "@/server/cms/store";
import { CmsSubnav } from "../CmsSubnav";
import { NavForm } from "./nav-form";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";

export const dynamic = "force-dynamic";

export default async function AdminCmsNavPage() {
  const nav = await readJsonFile("nav.json", defaultCmsNav);
  return (
    <div className="space-y-4">
      <div>
        <h1 className={ADMIN_PAGE_TITLE_CLASS}>
          CMS · Điều hướng
        </h1>
        <p className="text-sm text-muted">Menu header storefront — lưu file</p>
      </div>
      <CmsSubnav active="/admin/cms/nav" />
      <NavForm initial={nav} />
    </div>
  );
}
