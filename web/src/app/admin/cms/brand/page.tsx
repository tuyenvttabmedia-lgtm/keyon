import { defaultSettings, readJsonFile } from "@/server/cms/store";
import { normalizeSiteSettings } from "@/server/seo/settings";
import { CmsSubnav } from "../CmsSubnav";
import { BrandIconsForm } from "./brand-form";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";

export default async function CmsBrandPage() {
  const settings = normalizeSiteSettings(
    await readJsonFile("settings.json", defaultSettings),
  );

  return (
    <div className="space-y-2">
      <div>
        <h1 className={ADMIN_PAGE_TITLE_CLASS}>CMS · Favicon</h1>
        <p className="mt-1 text-sm text-muted">
          Icon tab trình duyệt và Apple touch — upload từ Media, lưu vào cấu hình
          site (settings).
        </p>
      </div>
      <CmsSubnav active="/admin/cms/brand" />
      <BrandIconsForm initial={settings} />
    </div>
  );
}
