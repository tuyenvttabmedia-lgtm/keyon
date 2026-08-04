"use client";

import Image from "next/image";
import { useState } from "react";
import type { CmsNav } from "@/server/cms/types";
import { resolveMediaUrl } from "@/lib/media-url";
import { MediaPicker } from "@/app/admin/media/MediaPicker";
import { CmsSaveForm } from "../CmsSaveForm";

export function NavForm({ initial }: { initial: CmsNav }) {
  return (
    <CmsSaveForm initial={initial} apiKey="nav">
      {(form, setForm) => (
        <div className="space-y-6">
          <BrandSection form={form} setForm={setForm} />

          <div className="space-y-3 rounded-2xl border border-border bg-card p-6">
            <p className="text-sm font-medium text-navy">Menu header</p>
            {form.items.map((item, idx) => (
              <div key={idx} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                <input
                  className="h-9 rounded-lg border border-border px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                  value={item.label}
                  onChange={(e) => {
                    const items = [...form.items];
                    items[idx] = { ...item, label: e.target.value };
                    setForm({ ...form, items });
                  }}
                  placeholder="Nhãn"
                />
                <input
                  className="h-9 rounded-lg border border-border px-3 font-mono text-xs outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                  value={item.href}
                  onChange={(e) => {
                    const items = [...form.items];
                    items[idx] = { ...item, href: e.target.value };
                    setForm({ ...form, items });
                  }}
                  placeholder="/path"
                />
                <button
                  type="button"
                  className="text-sm font-medium text-danger hover:underline"
                  onClick={() =>
                    setForm({
                      ...form,
                      items: form.items.filter((_, i) => i !== idx),
                    })
                  }
                >
                  Xóa
                </button>
              </div>
            ))}
            <button
              type="button"
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:border-accent"
              onClick={() =>
                setForm({
                  ...form,
                  items: [...form.items, { label: "Mục mới", href: "/" }],
                })
              }
            >
              + Thêm mục
            </button>
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
  form: CmsNav;
  setForm: (v: CmsNav) => void;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const previewUrl = resolveMediaUrl(form.logoUrl);

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
      <div>
        <p className="text-sm font-medium text-navy">Logo & thương hiệu header</p>
        <p className="mt-0.5 text-xs text-muted">
          Hiện trên storefront header. Không upload → dùng chữ cái đầu của tên
          thương hiệu.
        </p>
      </div>

      <div className="flex flex-wrap items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-surface">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt=""
              width={64}
              height={64}
              className="h-full w-full object-contain p-1"
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
        <input
          className="mt-1 h-9 w-full max-w-md rounded-lg border border-border px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          value={form.brandName}
          onChange={(e) => setForm({ ...form, brandName: e.target.value })}
          placeholder="KEYON"
        />
      </label>

      <label className="block text-sm">
        <span className="font-medium text-navy">Tagline</span>
        <input
          className="mt-1 h-9 w-full max-w-lg rounded-lg border border-border px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          value={form.tagline}
          onChange={(e) => setForm({ ...form, tagline: e.target.value })}
          placeholder="Digital License Platform"
        />
      </label>

      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        title="Chọn logo header"
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
