import { defaultCmsFaq, readJsonFile } from "@/server/cms/store";
import { CmsSubnav } from "../CmsSubnav";
import { FaqForm } from "./faq-form";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";

export const dynamic = "force-dynamic";

export default async function AdminCmsFaqPage() {
  const faq = await readJsonFile("faq.json", defaultCmsFaq);
  return (
    <div className="space-y-4">
      <div>
        <h1 className={ADMIN_PAGE_TITLE_CLASS}>
          CMS · FAQ
        </h1>
        <p className="text-sm text-muted">Quản lý câu hỏi — hiện Home / trang FAQ</p>
      </div>
      <CmsSubnav active="/admin/cms/faq" />
      <FaqForm initial={faq} />
    </div>
  );
}
