"use client";

import type { CmsBackupDrService } from "@/server/cms/types";
import { CmsSaveForm } from "../CmsSaveForm";
import { HeroImageFields } from "../hero-image-fields";

export function BackupDrCmsForm({ initial }: { initial: CmsBackupDrService }) {
  return (
    <CmsSaveForm initial={initial} apiKey="backup-dr-service">
      {(form, setForm) => (
        <HeroImageFields
          pagePath="/services/backup-disaster-recovery"
          url={form.heroImageUrl}
          onChange={(heroImageUrl) => setForm({ ...form, heroImageUrl })}
          lead="Ảnh nền nửa phải hero desktop /services/backup-disaster-recovery. Mobile không hiện ảnh. Thẻ danh sách vẫn nằm đè bên phải."
          spec="Khung desktop cao 460px, thẻ danh sách rộng 320px đè mép phải. Xuất file 1600 × 1000 px (JPG hoặc WebP), đặt chủ thể lệch trái. Mobile không hiện ảnh. Để trống thì chỉ còn thẻ."
        />
      )}
    </CmsSaveForm>
  );
}
