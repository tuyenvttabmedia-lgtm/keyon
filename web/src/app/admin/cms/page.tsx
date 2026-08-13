import { defaultCmsHome, readJsonFile } from "@/server/cms/store";
import { CmsHomeForm } from "./home-form";
import { CmsSubnav } from "./CmsSubnav";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";

export const dynamic = "force-dynamic";

export default async function AdminCmsHomePage() {
  const raw = await readJsonFile("home.json", defaultCmsHome);
  const home = {
    ...defaultCmsHome,
    ...raw,
    heroTitleAccent: raw.heroTitleAccent ?? "",
  };
  return (
    <div className="space-y-4">
      <div>
        <h1 className={ADMIN_PAGE_TITLE_CLASS}>
          CMS · Trang chủ
        </h1>
        <p className="text-sm text-muted">
          Bản đồ section khớp trang chủ · nối tới CMS liên quan (đối tác, FAQ,
          footer…)
        </p>
      </div>
      <CmsSubnav active="/admin/cms" />
      <CmsHomeForm initial={home} />
    </div>
  );
}
