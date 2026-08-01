import { defaultCmsCheckout, readJsonFile } from "@/server/cms/store";
import { mergeCheckoutCms } from "@/storefront/lib/checkout-cms";
import { CmsSubnav } from "../CmsSubnav";
import { CheckoutCmsForm } from "./checkout-form";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";

export const dynamic = "force-dynamic";

export default async function AdminCmsCheckoutPage() {
  const checkout = mergeCheckoutCms(
    await readJsonFile("checkout.json", defaultCmsCheckout),
  );
  return (
    <div className="space-y-4">
      <div>
        <h1 className={ADMIN_PAGE_TITLE_CLASS}>CMS · Checkout</h1>
        <p className="text-sm text-muted">
          PTTT bật/tắt, hỗ trợ, ghi chú vận hành — không đụng Core Payment / nhãn UI chrome.
        </p>
      </div>
      <CmsSubnav active="/admin/cms/checkout" />
      <CheckoutCmsForm initial={checkout} />
    </div>
  );
}
