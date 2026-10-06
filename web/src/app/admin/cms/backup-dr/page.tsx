import { defaultCmsBackupDrService, readJsonFile } from "@/server/cms/store";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";
import { CmsSubnav } from "../CmsSubnav";
import { BackupDrCmsForm } from "./backup-dr-form";

export const dynamic = "force-dynamic";

export default async function AdminCmsBackupDrPage() {
  const backup = await readJsonFile("backup-dr-service.json", defaultCmsBackupDrService);
  return (
    <div className="space-y-4">
      <div>
        <h1 className={ADMIN_PAGE_TITLE_CLASS}>CMS · Backup & Disaster Recovery</h1>
        <p className="text-sm text-muted">
          Ảnh nền hero desktop cho <strong>/services/backup-disaster-recovery</strong>.
        </p>
      </div>
      <CmsSubnav active="/admin/cms/backup-dr" />
      <BackupDrCmsForm initial={backup} />
    </div>
  );
}
