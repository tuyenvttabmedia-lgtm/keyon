import { defaultCmsProductivity, readJsonFile } from "@/server/cms/store";
import { CmsSubnav } from "../CmsSubnav";
import { ProductivityCmsForm } from "./productivity-form";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";

export const dynamic = "force-dynamic";

export default async function AdminCmsProductivityPage() {
  const productivity = await readJsonFile("productivity.json", defaultCmsProductivity);
  return (
    <div className="space-y-4">
      <div>
        <h1 className={ADMIN_PAGE_TITLE_CLASS}>CMS · Productivity Landing</h1>
        <p className="text-sm text-muted">
          Ảnh hero / tư vấn / work-scene cho{" "}
          <strong>/solutions/productivity</strong>.
        </p>
      </div>
      <CmsSubnav active="/admin/cms/productivity" />
      <ProductivityCmsForm initial={productivity} />
    </div>
  );
}
