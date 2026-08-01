import { defaultCmsHome, readJsonFile } from "@/server/cms/store";
import { CmsHomeForm } from "./home-form";
import { CmsSubnav } from "./CmsSubnav";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";

export const dynamic = "force-dynamic";

export default async function AdminCmsHomePage() {
  const home = await readJsonFile("home.json", defaultCmsHome);
  return (
    <div className="space-y-4">
      <div>
        <h1 className={ADMIN_PAGE_TITLE_CLASS}>
          CMS · Trang chủ
        </h1>
        <p className="text-sm text-muted">Chỉnh Hero — Draft/Publish tối giản</p>
      </div>
      <CmsSubnav active="/admin/cms" />
      <CmsHomeForm initial={home} />
    </div>
  );
}
