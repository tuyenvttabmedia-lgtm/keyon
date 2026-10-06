"use client";

import type { CmsSolutions } from "@/server/cms/types";
import { CmsSaveForm } from "../CmsSaveForm";
import { HeroImageFields } from "../hero-image-fields";

export function SolutionsCmsForm({ initial }: { initial: CmsSolutions }) {
  return (
    <CmsSaveForm initial={initial} apiKey="solutions">
      {(form, setForm) => (
        <div className="space-y-6">
          <HeroImageFields
            pagePath="/solutions"
            url={form.heroImageUrl}
            onChange={(heroImageUrl) => setForm({ ...form, heroImageUrl })}
          />
          <label className="block space-y-2 rounded-2xl border border-border bg-card p-5">
            <span className="text-sm font-medium text-navy">Video giới thiệu</span>
            <span className="block text-xs text-muted">
              YouTube hoặc Vimeo. Để trống thì nút video trỏ về Cách KEYON hoạt động.
            </span>
            <input
              value={form.introVideoUrl}
              onChange={(e) => setForm({ ...form, introVideoUrl: e.target.value })}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm text-navy"
              placeholder="https://"
            />
          </label>
        </div>
      )}
    </CmsSaveForm>
  );
}
