"use client";

import type { CmsManagedItService } from "@/server/cms/types";
import { CmsSaveForm } from "../CmsSaveForm";
import { HeroImageFields } from "../hero-image-fields";

export function ManagedItCmsForm({ initial }: { initial: CmsManagedItService }) {
  return (
    <CmsSaveForm initial={initial} apiKey="managed-it-service">
      {(form, setForm) => (
        <HeroImageFields
          pagePath="/services/managed-it"
          url={form.heroImageUrl}
          onChange={(heroImageUrl) => setForm({ ...form, heroImageUrl })}
          lead="Ảnh nền nửa phải hero desktop /services/managed-it. Mobile không hiện ảnh. Thẻ Managed IT và bốn thẻ giám sát, bảo mật, vận hành, chi phí vẫn nằm đè trên ảnh."
          spec="Khung desktop cao bằng cột chữ, khoảng 560 × 400 px. Xuất file 1400 × 1000 px (JPG hoặc WebP), đặt chủ thể ở giữa, chừa góc trái trên và cột phải cho các thẻ. Để trống thì còn khung và các thẻ."
        />
      )}
    </CmsSaveForm>
  );
}
