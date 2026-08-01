import Link from "next/link";
import { notFound } from "next/navigation";
import {
  defaultStaticPages,
  emptyStaticPage,
  readJsonFile,
  type CmsStaticPage,
} from "@/server/cms/store";
import { CmsSubnav } from "../../CmsSubnav";
import { StaticPageEditor } from "../page-editor";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";

export const dynamic = "force-dynamic";

export default async function AdminStaticPageEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pages = await readJsonFile<CmsStaticPage[]>(
    "static-pages.json",
    defaultStaticPages,
  );

  let page: CmsStaticPage;
  const isNew = id === "new";
  if (isNew) {
    page = emptyStaticPage();
  } else {
    const found = pages.find((p) => p.id === id);
    if (!found) notFound();
    page = found;
  }

  return (
    <div className="space-y-4">
      <div>
        <Link
          href="/admin/cms/pages"
          className="text-sm text-accent hover:underline"
        >
          ← Trang tĩnh
        </Link>
        <h1 className={`mt-1 ${ADMIN_PAGE_TITLE_CLASS}`}>
          {isNew ? "Tạo trang tĩnh" : "Sửa trang tĩnh"}
        </h1>
      </div>
      <CmsSubnav active="/admin/cms/pages" />
      <StaticPageEditor initial={page} allPages={pages} isNew={isNew} />
    </div>
  );
}
