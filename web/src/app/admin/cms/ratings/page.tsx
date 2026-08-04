import { CmsSubnav } from "../CmsSubnav";
import { ProductRatingsForm } from "./ratings-form";
import {
  defaultCmsProductRatings,
  readJsonFile,
  type CmsProductRatings,
} from "@/server/cms/store";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";

export const dynamic = "force-dynamic";

export default async function CmsRatingsPage() {
  const initial = await readJsonFile<CmsProductRatings>(
    "product-ratings.json",
    defaultCmsProductRatings,
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className={ADMIN_PAGE_TITLE_CLASS}>CMS · Ratings</h1>
        <p className="text-sm text-muted">
          Điểm / số lượng đánh giá hiển thị trên PDP (không phải review khách gửi)
        </p>
      </div>
      <CmsSubnav active="/admin/cms/ratings" />
      <ProductRatingsForm initial={initial} />
    </div>
  );
}
