"use client";

import Image from "next/image";
import { useState } from "react";
import type { CmsFooter } from "@/server/cms/types";
import { resolveMediaUrl } from "@/lib/media-url";
import { MediaPicker } from "@/app/admin/media/MediaPicker";
import { CmsSaveForm } from "../CmsSaveForm";

export function FooterForm({ initial }: { initial: CmsFooter }) {
  return (
    <CmsSaveForm initial={initial} apiKey="footer">
      {(form, setForm) => (
        <div className="space-y-6">
          <BrandSection form={form} setForm={setForm} />

          <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
            <label className="block text-sm">
              <span className="font-medium text-navy">Mô tả thương hiệu</span>
              <textarea
                rows={3}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                value={form.blurb}
                onChange={(e) => setForm({ ...form, blurb: e.target.value })}
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-navy">Copyright</span>
              <input
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                value={form.copyright}
                onChange={(e) => setForm({ ...form, copyright: e.target.value })}
              />
            </label>
            {form.columns.map((col, ci) => (
              <div key={ci} className="space-y-2 rounded-xl border border-border p-4">
                <input
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm font-medium outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                  value={col.title}
                  onChange={(e) => {
                    const columns = [...form.columns];
                    columns[ci] = { ...col, title: e.target.value };
                    setForm({ ...form, columns });
                  }}
                />
                {col.links.map((link, li) => (
                  <div key={li} className="grid gap-2 sm:grid-cols-2">
                    <input
                      className="rounded-lg border border-border px-2 py-1.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                      value={link.label}
                      onChange={(e) => {
                        const columns = [...form.columns];
                        const links = [...col.links];
                        links[li] = { ...link, label: e.target.value };
                        columns[ci] = { ...col, links };
                        setForm({ ...form, columns });
                      }}
                    />
                    <input
                      className="rounded-lg border border-border px-2 py-1.5 font-mono text-xs outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                      value={link.href}
                      onChange={(e) => {
                        const columns = [...form.columns];
                        const links = [...col.links];
                        links[li] = { ...link, href: e.target.value };
                        columns[ci] = { ...col, links };
                        setForm({ ...form, columns });
                      }}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </CmsSaveForm>
  );
}

function BrandSection({
  form,
  setForm,
}: {
  form: CmsFooter;
  setForm: (v: CmsFooter) => void;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const previewUrl = resolveMediaUrl(form.logoUrl);

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
      <div>
        <p className="text-sm font-medium text-navy">Logo footer</p>
        <p className="mt-0.5 text-xs text-muted">
          Wordmark ngang (nên bản sáng/trắng trên nền navy). Trống → dùng logo
          header; không có cả hai → chữ cái + tên.
        </p>
      </div>

      <div className="flex flex-wrap items-start gap-4">
        <div
          className={
            previewUrl
              ? "flex h-12 w-[200px] shrink-0 items-center overflow-hidden rounded-xl border border-border bg-[#0b1f33] px-2"
              : "flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-surface"
          }
        >
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt=""
              width={200}
              height={48}
              className="h-10 w-full object-contain object-left"
              unoptimized
            />
          ) : (
            <span className="text-lg font-extrabold text-accent">
              {(form.brandName || "K").trim().charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="h-9 rounded-lg border border-border bg-white px-3 text-sm font-medium hover:border-accent"
            onClick={() => setPickerOpen(true)}
          >
            {form.logoUrl ? "Đổi logo" : "Upload / chọn logo"}
          </button>
          {form.logoUrl ? (
            <button
              type="button"
              className="h-9 rounded-lg px-3 text-sm text-danger hover:underline"
              onClick={() => setForm({ ...form, logoUrl: undefined })}
            >
              Xóa logo
            </button>
          ) : null}
        </div>
      </div>

      <label className="block text-sm">
        <span className="font-medium text-navy">Tên thương hiệu</span>
        <span className="ml-1 text-xs text-muted">(fallback khi chưa có logo)</span>
        <input
          className="mt-1 h-9 w-full max-w-md rounded-lg border border-border px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          value={form.brandName}
          onChange={(e) => setForm({ ...form, brandName: e.target.value })}
          placeholder="KEYON"
        />
      </label>

      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        title="Chọn logo footer"
        onSelect={(items) => {
          if (items[0]?.url) {
            setForm({ ...form, logoUrl: items[0].url });
          }
          setPickerOpen(false);
        }}
      />
    </div>
  );
}
