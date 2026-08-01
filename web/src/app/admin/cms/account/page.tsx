import { defaultCmsAccount, readJsonFile } from "@/server/cms/store";
import { pickAccountOps } from "@/storefront/lib/account-cms";
import { CmsSubnav } from "../CmsSubnav";
import { AccountCmsForm } from "./account-form";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";

export const dynamic = "force-dynamic";

export default async function AdminCmsAccountPage() {
  const raw = await readJsonFile("account.json", defaultCmsAccount);
  const account = {
    ...defaultCmsAccount,
    ...pickAccountOps(raw as Record<string, unknown>),
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className={ADMIN_PAGE_TITLE_CLASS}>CMS · Account</h1>
        <p className="text-sm text-muted">
          Nội dung vận hành portal — liên hệ, promo, banner (không chỉnh UI chrome).
        </p>
      </div>
      <CmsSubnav active="/admin/cms/account" />
      <AccountCmsForm initial={account} />
    </div>
  );
}
