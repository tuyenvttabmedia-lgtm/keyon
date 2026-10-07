"use client";

import type { CmsM365ManagementService } from "@/server/cms/types";
import { CmsSaveForm } from "../CmsSaveForm";
import { HeroImageFields } from "../hero-image-fields";

export function M365ManagementCmsForm({ initial }: { initial: CmsM365ManagementService }) {
  return (
    <CmsSaveForm initial={initial} apiKey="m365-management-service">
      {(form, setForm) => (
        <HeroImageFields
          pagePath="/services/microsoft-365-management"
          url={form.heroImageUrl}
          onChange={(heroImageUrl) => setForm({ ...form, heroImageUrl })}
          lead="Ảnh nền nửa phải hero desktop /services/microsoft-365-management. Mobile không hiện ảnh. Thẻ Microsoft 365 và bốn thẻ quản lý vẫn nằm đè trên ảnh."
          spec="Khung desktop cao bằng cột chữ, khoảng 560 × 400 px. Xuất file 1400 × 1000 px (JPG hoặc WebP), đặt chủ thể ở giữa, chừa góc trái trên và cột phải cho các thẻ. Để trống thì còn khung và các thẻ."
        />
      )}
    </CmsSaveForm>
  );
}
