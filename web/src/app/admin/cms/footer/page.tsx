import { defaultCmsFooter, readJsonFile } from "@/server/cms/store";
import { CmsSubnav } from "../CmsSubnav";
import { FooterForm } from "./footer-form";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";

export const dynamic = "force-dynamic";

export default async function AdminCmsFooterPage() {
  const footer = await readJsonFile("footer.json", defaultCmsFooter);
  return (
    <div className="space-y-4">
      <div>
        <h1 className={ADMIN_PAGE_TITLE_CLASS}>
          CMS · Footer
        </h1>
        <p className="text-sm text-muted">Blurb, cột link, legal — lưu file</p>
      </div>
      <CmsSubnav active="/admin/cms/footer" />
      <FooterForm initial={footer} />
    </div>
  );
}
