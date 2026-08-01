import Link from "next/link";
import { defaultCmsPolicy, readJsonFile } from "@/server/cms/store";
import { CmsSubnav } from "../CmsSubnav";
import { PolicyHubForm } from "./policy-hub-form";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";

export const dynamic = "force-dynamic";

export default async function AdminCmsPolicyHubPage() {
  const raw = await readJsonFile("policy-page.json", defaultCmsPolicy);
  const policy = { ...defaultCmsPolicy, ...raw };
  return (
    <div className="space-y-4">
      <div>
        <h1 className={ADMIN_PAGE_TITLE_CLASS}>CMS · Hub Chính sách</h1>
        <p className="text-sm text-muted">
          Hero / thanh hỗ trợ của{" "}
          <Link href="/policy" className="text-accent hover:underline">
            /policy
          </Link>
          . Nội dung từng trang →{" "}
          <Link href="/admin/cms/pages" className="text-accent hover:underline">
            Trang tĩnh
          </Link>
          .
        </p>
      </div>
      <CmsSubnav active="/admin/cms/policy" />
      <PolicyHubForm initial={policy} />
    </div>
  );
}
