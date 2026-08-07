"use client";

import type { CmsSolutions } from "@/server/cms/types";
import { CmsSaveForm } from "../CmsSaveForm";
import { toVideoEmbedUrl } from "@/storefront/components/solutions/intro-video";

export function SolutionsCmsForm({ initial }: { initial: CmsSolutions }) {
  return (
    <CmsSaveForm initial={initial} apiKey="solutions">
      {(form, setForm) => <SolutionsFields form={form} setForm={setForm} />}
    </CmsSaveForm>
  );
}

function SolutionsFields({
  form,
  setForm,
}: {
  form: CmsSolutions;
  setForm: (v: CmsSolutions) => void;
}) {
  const embedOk = Boolean(toVideoEmbedUrl(form.introVideoUrl));
  const hasValue = form.introVideoUrl.trim().length > 0;

  return (
    <div className="space-y-6">
      <p className="rounded-xl bg-accent-soft/60 px-3 py-2 text-sm text-navy">
        Cấu hình nút <strong>Xem video giới thiệu</strong> trên{" "}
        <strong>/solutions</strong>. Dán link YouTube hoặc Vimeo. Để trống thì nút
        chuyển thành “Cách KEYON hoạt động”.
      </p>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-navy">URL video giới thiệu</span>
        <input
          type="url"
          value={form.introVideoUrl}
          onChange={(e) => setForm({ ...form, introVideoUrl: e.target.value })}
          placeholder="https://www.youtube.com/watch?v=…"
          className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-navy outline-none focus:border-accent"
        />
        <span className="block text-xs text-muted">
          Hỗ trợ youtube.com/watch, youtu.be, youtube.com/shorts, vimeo.com.
        </span>
        {hasValue && !embedOk ? (
          <span className="block text-xs text-red-600" role="alert">
            URL chưa nhận diện được — kiểm tra lại link trước khi lưu.
          </span>
        ) : null}
        {hasValue && embedOk ? (
          <span className="block text-xs text-accent">URL hợp lệ — sẽ mở modal embed trên trang.</span>
        ) : null}
      </label>
    </div>
  );
}
