import { prisma } from "@/lib/db";
import { defaultCmsPartners, readJsonFile } from "@/server/cms/store";
import { resolveMediaUrl } from "@/lib/media-url";
import { resolveStorage } from "@/server/storage/config";
import { CmsSubnav } from "../CmsSubnav";
import { PartnersForm } from "./partners-form";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";

export const dynamic = "force-dynamic";

export default async function AdminCmsPartnersPage() {
  const [partners, brandRows, storage] = await Promise.all([
    readJsonFile("partners.json", defaultCmsPartners),
    prisma.brand.findMany({
      where: { active: true },
      select: { id: true, name: true, slug: true, logoUrl: true, sortOrder: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    }),
    resolveStorage(),
  ]);

  const mediaBase =
    storage.driver === "wasabi"
      ? storage.wasabi.publicBaseUrl ||
        `${storage.wasabi.endpoint.replace(/\/$/, "")}/${storage.wasabi.bucket}`
      : "";

  const brands = brandRows.map((b) => ({
    id: b.id,
    name: b.name,
    slug: b.slug,
    logoUrl: b.logoUrl ? resolveMediaUrl(b.logoUrl, mediaBase) || b.logoUrl : null,
  }));

  return (
    <div className="space-y-4">
      <div>
        <h1 className={ADMIN_PAGE_TITLE_CLASS}>CMS · Đối tác</h1>
        <p className="text-sm text-muted">
          Chọn thương hiệu từ <strong>Catalog · Thương hiệu</strong> để hiện trên Home
          (carousel). Logo và tên lấy từ Catalog — chỉ cần sắp xếp / ẩn hiện tại đây. Sửa
          logo tại trang thương hiệu tương ứng.
        </p>
      </div>
      <CmsSubnav active="/admin/cms/partners" />
      <PartnersForm initial={partners} brands={brands} />
    </div>
  );
}
