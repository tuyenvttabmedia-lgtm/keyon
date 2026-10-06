"use client";

import type { CmsBackupSolution } from "@/server/cms/types";
import { CmsSaveForm } from "../CmsSaveForm";
import { HeroImageFields } from "../hero-image-fields";

export function BackupCmsForm({ initial }: { initial: CmsBackupSolution }) {
  return (
    <CmsSaveForm initial={initial} apiKey="backup-solution">
      {(form, setForm) => (
        <HeroImageFields
          pagePath="/solutions/backup"
          url={form.heroImageUrl}
          onChange={(heroImageUrl) => setForm({ ...form, heroImageUrl })}
          extra="Phía dưới cột phải có thẻ ghi chú. Đặt chủ thể ở nửa trên của ảnh."
        />
      )}
    </CmsSaveForm>
  );
}
