"use client";

import Image from "next/image";
import { useState } from "react";
import type { CmsBanner } from "@/server/cms/types";
import { MediaPicker } from "@/app/admin/products/MediaPicker";
import { CmsSaveForm } from "../CmsSaveForm";

export function BannerForm({ initial }: { initial: CmsBanner }) {
  return (
    <CmsSaveForm initial={initial} apiKey="banner">
      {(form, setForm) => (
        <BannerFields form={form} setForm={setForm} />
      )}
    </CmsSaveForm>
  );
}

function BannerFields({
  form,
  setForm,
}: {
  form: CmsBanner;
  setForm: (v: CmsBanner) => void;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
      <p className="rounded-xl bg-accent-soft/60 px-3 py-2 text-sm text-navy">
        Banner này hiện ở cột vuông bên phải section <strong>Vì sao chọn KEYON</strong> trên
        Home. Nên dùng ảnh tỉ lệ gần <strong>1:1</strong> (khoảng 560×560).
      </p>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="relative mx-auto aspect-square w-full max-w-[200px] overflow-hidden rounded-2xl border border-border bg-surface sm:mx-0">
          {form.imageUrl ? (
            <Image
              src={form.imageUrl}
              alt={form.title || "Banner preview"}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-full items-center justify-center p-4 text-center text-xs text-muted">
              Chưa có ảnh — chọn từ Thư viện Media
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <p className="text-sm font-medium text-navy">Ảnh banner</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white"
            >
              Chọn từ Media
            </button>
            {form.imageUrl ? (
              <button
                type="button"
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted hover:border-danger hover:text-danger"
                onClick={() => setForm({ ...form, imageUrl: "" })}
              >
                Xóa ảnh
              </button>
            ) : null}
          </div>
          <p className="text-xs text-muted">
            URL (tùy chọn / tương thích):{" "}
            <span className="font-mono text-navy">{form.imageUrl || "—"}</span>
          </p>
        </div>
      </div>

      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        multiple={false}
        purpose="ui"
        title="Chọn ảnh banner"
        onSelect={(urls) => {
          if (urls[0]) setForm({ ...form, imageUrl: urls[0] });
        }}
      />

      <label className="block text-sm">
        <span className="font-medium">Tiêu đề trên banner</span>
        <input
          className="mt-1 w-full rounded-lg border border-border px-3 py-2"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium">CTA</span>
          <input
            className="mt-1 w-full rounded-lg border border-border px-3 py-2"
            value={form.ctaLabel}
            onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Link</span>
          <input
            className="mt-1 w-full rounded-lg border border-border px-3 py-2"
            value={form.ctaHref}
            onChange={(e) => setForm({ ...form, ctaHref: e.target.value })}
          />
        </label>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.visible}
          onChange={(e) => setForm({ ...form, visible: e.target.checked })}
        />
        Hiển thị banner (cột vuông Why KEYON)
      </label>
    </div>
  );
}
