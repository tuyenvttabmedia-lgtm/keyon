import Link from "next/link";
import { defaultStaticPages, readJsonFile } from "@/server/cms/store";
import { CmsSubnav } from "../CmsSubnav";
import { StaticPagesList } from "./pages-list";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";

export const dynamic = "force-dynamic";

export default async function AdminStaticPagesPage() {
  const pages = await readJsonFile("static-pages.json", defaultStaticPages);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className={ADMIN_PAGE_TITLE_CLASS}>CMS · Trang tĩnh</h1>
          <p className="text-sm text-muted">
            Quản lý nội dung chính sách, pháp lý và trang tĩnh khác
          </p>
        </div>
        <Link
          href="/admin/cms/pages/new"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          + Tạo trang mới
        </Link>
      </div>
      <CmsSubnav active="/admin/cms/pages" />
      <StaticPagesList initial={pages} />
    </div>
  );
}
