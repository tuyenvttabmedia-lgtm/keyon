"use client";

import type { CmsSecuritySolution } from "@/server/cms/types";
import { CmsSaveForm } from "../CmsSaveForm";
import { HeroImageFields } from "../hero-image-fields";

export function SecurityCmsForm({ initial }: { initial: CmsSecuritySolution }) {
  return (
    <CmsSaveForm initial={initial} apiKey="security-solution">
      {(form, setForm) => (
        <HeroImageFields
          pagePath="/solutions/security"
          url={form.heroImageUrl}
          onChange={(heroImageUrl) => setForm({ ...form, heroImageUrl })}
        />
      )}
    </CmsSaveForm>
  );
}
