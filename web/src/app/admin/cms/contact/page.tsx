import { defaultCmsContact, readJsonFile } from "@/server/cms/store";
import { CmsSubnav } from "../CmsSubnav";
import { ContactForm } from "./contact-form";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";

export const dynamic = "force-dynamic";

export default async function AdminCmsContactPage() {
  const raw = await readJsonFile("contact-page.json", defaultCmsContact);
  const contact = { ...defaultCmsContact, ...raw };
  return (
    <div className="space-y-4">
      <div>
        <h1 className={ADMIN_PAGE_TITLE_CLASS}>CMS · Liên hệ</h1>
        <p className="text-sm text-muted">
          Hero, bản đồ (mã nhúng), thông tin, form, ô hỗ trợ tức thì
        </p>
      </div>
      <CmsSubnav active="/admin/cms/contact" />
      <ContactForm initial={contact} />
    </div>
  );
}
