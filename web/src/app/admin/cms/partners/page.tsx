import { defaultCmsPartners, readJsonFile } from "@/server/cms/store";
import { CmsSubnav } from "../CmsSubnav";
import { PartnersForm } from "./partners-form";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";

export const dynamic = "force-dynamic";

export default async function AdminCmsPartnersPage() {
  const partners = await readJsonFile("partners.json", defaultCmsPartners);
  return (
    <div className="space-y-4">
      <div>
        <h1 className={ADMIN_PAGE_TITLE_CLASS}>
          CMS · Đối tác
        </h1>
        <p className="text-sm text-muted">
          Thêm / sửa / xóa đối tác và upload logo. Mục bật “Hiện trên Home” hiện ở section{" "}
          <strong>Đối tác tin cậy</strong>. Tối đa <strong>4 logo</strong> đầu (ưu tiên có
          ảnh) cũng hiện trong float <strong>Trusted by</strong> trên Hero — chưa có logo thì
          dùng chữ cái + màu thương hiệu.
        </p>
      </div>
      <CmsSubnav active="/admin/cms/partners" />
      <PartnersForm initial={partners} />
    </div>
  );
}
