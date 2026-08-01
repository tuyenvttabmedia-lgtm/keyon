import { defaultCmsBanner, readJsonFile } from "@/server/cms/store";
import { CmsSubnav } from "../CmsSubnav";
import { BannerForm } from "./banner-form";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";

export const dynamic = "force-dynamic";

export default async function AdminCmsBannerPage() {
  const banner = await readJsonFile("banner.json", defaultCmsBanner);
  return (
    <div className="space-y-4">
      <div>
        <h1 className={ADMIN_PAGE_TITLE_CLASS}>
          CMS · Banner Why KEYON
        </h1>
        <p className="text-sm text-muted">
          Gán ảnh / CTA cho ô vuông cột 3 section <strong>Vì sao chọn KEYON</strong> trên Home.
        </p>
      </div>
      <CmsSubnav active="/admin/cms/banner" />
      <BannerForm initial={banner} />
    </div>
  );
}
