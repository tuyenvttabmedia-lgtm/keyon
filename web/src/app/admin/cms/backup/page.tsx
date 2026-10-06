import { defaultCmsBackupSolution, readJsonFile } from "@/server/cms/store";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";
import { CmsSubnav } from "../CmsSubnav";
import { BackupCmsForm } from "./backup-form";

export const dynamic = "force-dynamic";

export default async function AdminCmsBackupPage() {
  const backup = await readJsonFile("backup-solution.json", defaultCmsBackupSolution);
  return (
    <div className="space-y-4">
      <div>
        <h1 className={ADMIN_PAGE_TITLE_CLASS}>CMS · Sao lưu và khôi phục</h1>
        <p className="text-sm text-muted">
          Ảnh nền hero desktop cho <strong>/solutions/backup</strong>.
        </p>
      </div>
      <CmsSubnav active="/admin/cms/backup" />
      <BackupCmsForm initial={backup} />
    </div>
  );
}
