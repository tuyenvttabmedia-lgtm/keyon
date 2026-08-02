"use client";

import Image from "next/image";
import { useState } from "react";
import type { CmsPartnerItem, CmsPartners } from "@/server/cms/types";
import { MediaPicker } from "@/app/admin/media/MediaPicker";
import { CmsSaveForm } from "../CmsSaveForm";

export function PartnersForm({ initial }: { initial: CmsPartners }) {
  return (
    <CmsSaveForm initial={initial} apiKey="partners">
      {(form, setForm) => (
        <div className="space-y-6">
          <label className="block text-sm">
            <span className="font-medium text-navy">Tiêu đề section</span>
            <input
              className="mt-1 w-full rounded-xl border border-border px-3 py-2"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-navy">Badge bảo mật (mỗi dòng một badge)</span>
            <textarea
              rows={3}
              className="mt-1 w-full rounded-xl border border-border px-3 py-2"
              value={form.badges.join("\n")}
              onChange={(e) =>
                setForm({
                  ...form,
                  badges: e.target.value
                    .split("\n")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
            />
          </label>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium text-navy">Danh sách đối tác</p>
              <p className="text-xs text-muted">
                Home: carousel đối tác + tối đa 4 logo trên Hero “Trusted by”
              </p>
            </div>

            {form.items.map((item, idx) => (
              <PartnerRow
                key={item.id}
                item={item}
                index={idx}
                total={form.items.length}
                onChange={(nextItem) => {
                  const next = [...form.items];
                  next[idx] = nextItem;
                  setForm({ ...form, items: next });
                }}
                onRemove={() =>
                  setForm({
                    ...form,
                    items: form.items.filter((_, i) => i !== idx),
                  })
                }
                onMove={(dir) => {
                  const j = idx + dir;
                  if (j < 0 || j >= form.items.length) return;
                  const next = [...form.items];
                  const tmp = next[idx]!;
                  next[idx] = next[j]!;
                  next[j] = tmp;
                  setForm({ ...form, items: next });
                }}
              />
            ))}

            <button
              type="button"
              className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:border-accent"
              onClick={() =>
                setForm({
                  ...form,
                  items: [
                    ...form.items,
                    {
                      id: `p_${Date.now()}`,
                      name: "Đối tác mới",
                      brandColor: "#0EA5A4",
                      visible: true,
                    },
                  ],
                })
              }
            >
              + Thêm đối tác
            </button>
          </div>
        </div>
      )}
    </CmsSaveForm>
  );
}

function PartnerRow({
  item,
  index,
  total,
  onChange,
  onRemove,
  onMove,
}: {
  item: CmsPartnerItem;
  index: number;
  total: number;
  onChange: (item: CmsPartnerItem) => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <div className="grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-2">
      <div className="flex items-start gap-3 sm:col-span-2">
        <div className="flex h-16 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-white p-2">
          {item.logoUrl ? (
            <Image
              src={item.logoUrl}
              alt={item.name}
              width={112}
              height={40}
              className="max-h-10 w-auto object-contain"
              unoptimized
            />
          ) : (
            <span
              className="text-xs font-bold"
              style={{ color: item.brandColor || "#0EA5A4" }}
            >
              {item.name.slice(0, 12) || "Logo"}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-sm font-medium text-navy">Logo / icon</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white"
            >
              Chọn từ Media
            </button>
            {item.logoUrl ? (
              <button
                type="button"
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted hover:border-danger hover:text-danger"
                onClick={() => onChange({ ...item, logoUrl: undefined })}
              >
                Xóa logo
              </button>
            ) : null}
          </div>
          <MediaPicker
            open={pickerOpen}
            onClose={() => setPickerOpen(false)}
            multiple={false}
            purpose="ui"
            title="Chọn logo đối tác"
            onSelect={(items) => {
              if (items[0]?.url) onChange({ ...item, logoUrl: items[0].url });
            }}
          />
        </div>
      </div>

      <label className="block text-sm sm:col-span-2">
        <span className="text-muted">Tên đối tác</span>
        <input
          className="mt-1 w-full rounded-lg border border-border px-3 py-2"
          value={item.name}
          onChange={(e) => onChange({ ...item, name: e.target.value })}
        />
      </label>

      <label className="block text-sm">
        <span className="text-muted">Màu thương hiệu (khi chưa có logo)</span>
        <div className="mt-1 flex gap-2">
          <input
            type="color"
            className="h-10 w-12 cursor-pointer rounded border border-border bg-white p-1"
            value={item.brandColor || "#0EA5A4"}
            onChange={(e) => onChange({ ...item, brandColor: e.target.value })}
          />
          <input
            className="w-full rounded-lg border border-border px-3 py-2"
            value={item.brandColor ?? ""}
            placeholder="#00A4EF"
            onChange={(e) =>
              onChange({ ...item, brandColor: e.target.value || undefined })
            }
          />
        </div>
      </label>

      <label className="block text-sm">
        <span className="text-muted">Link (tuỳ chọn)</span>
        <input
          className="mt-1 w-full rounded-lg border border-border px-3 py-2"
          placeholder="https://..."
          value={item.href ?? ""}
          onChange={(e) =>
            onChange({ ...item, href: e.target.value.trim() || undefined })
          }
        />
      </label>

      <div className="flex flex-wrap items-center justify-between gap-3 sm:col-span-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={item.visible}
            onChange={(e) => onChange({ ...item, visible: e.target.checked })}
          />
          Hiện trên Home
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={index === 0}
            className="rounded-lg border border-border px-2 py-1 text-xs disabled:opacity-40"
            onClick={() => onMove(-1)}
          >
            ↑
          </button>
          <button
            type="button"
            disabled={index >= total - 1}
            className="rounded-lg border border-border px-2 py-1 text-xs disabled:opacity-40"
            onClick={() => onMove(1)}
          >
            ↓
          </button>
          <button type="button" className="text-sm text-danger" onClick={onRemove}>
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}
