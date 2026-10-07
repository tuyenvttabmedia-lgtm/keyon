"use client";

import type { CmsSecurityDeploymentService } from "@/server/cms/types";
import { CmsSaveForm } from "../CmsSaveForm";
import { HeroImageFields } from "../hero-image-fields";

export function SecurityDeploymentCmsForm({ initial }: { initial: CmsSecurityDeploymentService }) {
  return (
    <CmsSaveForm initial={initial} apiKey="security-deployment-service">
      {(form, setForm) => (
        <HeroImageFields
          pagePath="/services/security-deployment"
          url={form.heroImageUrl}
          onChange={(heroImageUrl) => setForm({ ...form, heroImageUrl })}
          lead="Ảnh nền nửa phải hero desktop /services/security-deployment. Mobile không hiện ảnh. Bốn thẻ Endpoint, Email, Data và Network vẫn nằm đè trên ảnh."
          spec="Khung desktop cao bằng cột chữ, khoảng 560 × 400 px. Xuất file 1400 × 1000 px (JPG hoặc WebP), đặt chủ thể ở giữa và chừa bốn góc cho các thẻ. Để trống thì còn khung và các thẻ."
        />
      )}
    </CmsSaveForm>
  );
}
