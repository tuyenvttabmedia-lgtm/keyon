import { defaultCmsNav, readJsonFile, type CmsNav } from "@/server/cms/store";
import { CmsSubnav } from "../CmsSubnav";
import { NavForm } from "./nav-form";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";

export const dynamic = "force-dynamic";

function normalizeNav(raw: CmsNav): CmsNav {
  return {
    logoUrl: raw.logoUrl?.trim() || undefined,
    brandName: raw.brandName?.trim() || defaultCmsNav.brandName,
    tagline:
      typeof raw.tagline === "string" ? raw.tagline : defaultCmsNav.tagline,
    items: Array.isArray(raw.items) ? raw.items : defaultCmsNav.items,
  };
}

export default async function AdminCmsNavPage() {
  const nav = normalizeNav(await readJsonFile("nav.json", defaultCmsNav));
  return (
    <div className="space-y-4">
      <div>
        <h1 className={ADMIN_PAGE_TITLE_CLASS}>CMS · Điều hướng</h1>
        <p className="text-sm text-muted">
          Logo header và tagline. Cây menu chính (mega) lấy từ IA code (
          <code className="text-xs">storefront/nav/ia.ts</code>
          ) — danh sách item dưới đây là legacy / tham chiếu, không điều khiển mega Phase 1.
        </p>
      </div>
      <CmsSubnav active="/admin/cms/nav" />
      <NavForm initial={nav} />
    </div>
  );
}
