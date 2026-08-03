import { CmsSubnav } from "../CmsSubnav";
import { ProductRatingsForm } from "./ratings-form";
import {
  defaultCmsProductRatings,
  readJsonFile,
  type CmsProductRatings,
} from "@/server/cms/store";

export const dynamic = "force-dynamic";

export default async function CmsRatingsPage() {
  const initial = await readJsonFile<CmsProductRatings>(
    "product-ratings.json",
    defaultCmsProductRatings,
  );

  return (
    <div>
      <CmsSubnav active="/admin/cms/ratings" />
      <h1 className="mb-4 text-xl font-semibold text-navy">Product ratings</h1>
      <ProductRatingsForm initial={initial} />
    </div>
  );
}
