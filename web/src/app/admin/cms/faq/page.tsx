import { defaultCmsFaq, readJsonFile } from "@/server/cms/store";
import { normalizeFaqDocument } from "@/server/cms/faq";
import { CmsSubnav } from "../CmsSubnav";
import { FaqForm } from "./faq-form";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";

export const dynamic = "force-dynamic";

export default async function AdminCmsFaqPage() {
  const raw = await readJsonFile("faq.json", defaultCmsFaq);
  const faq = normalizeFaqDocument(raw);
  return (
    <div className="space-y-4">
      <div>
        <h1 className={ADMIN_PAGE_TITLE_CLASS}>CMS · FAQ</h1>
        <p className="text-sm text-muted">
          Quản lý câu hỏi trên trang này. Danh mục mở từ nút Danh mục — cùng 5 cụm với /faq.
        </p>
      </div>
      <CmsSubnav active="/admin/cms/faq" />
      <FaqForm initial={faq} />
    </div>
  );
}
