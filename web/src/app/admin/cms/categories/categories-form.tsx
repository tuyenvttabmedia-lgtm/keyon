"use client";

import Image from "next/image";
import { useState } from "react";
import type {
  CmsCategories,
  CmsCategoryIconKey,
  CmsCategoryItem,
} from "@/server/cms/types";
import { MediaPicker } from "@/app/admin/products/MediaPicker";
import { CmsSaveForm } from "../CmsSaveForm";

const ICON_KEYS: CmsCategoryIconKey[] = [
  "windows",
  "office",
  "adobe",
  "cloud",
  "security",
  "autodesk",
  "backup",
  "other",
];

const MAX_ITEMS = 8;

export function CategoriesForm({ initial }: { initial: CmsCategories }) {
  return (
    <CmsSaveForm initial={initial} apiKey="categories">
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

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="font-medium text-navy">Nhãn “Xem tất cả”</span>
              <input
                className="mt-1 w-full rounded-xl border border-border px-3 py-2"
                value={form.viewAllLabel}
                onChange={(e) =>
                  setForm({ ...form, viewAllLabel: e.target.value })
                }
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-navy">Link “Xem tất cả”</span>
              <input
                className="mt-1 w-full rounded-xl border border-border px-3 py-2"
                value={form.viewAllHref}
                onChange={(e) =>
                  setForm({ ...form, viewAllHref: e.target.value })
                }
              />
            </label>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium text-navy">
                Danh sách danh mục ({form.items.length}/{MAX_ITEMS})
              </p>
              <p className="text-xs text-muted">
                Số lượng SP nhập tay (`countLabel`). Icon upload ưu tiên hơn SVG
                fallback.
              </p>
            </div>

            {form.items.map((item, idx) => (
              <CategoryRow
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
                    items: form.items
                      .filter((_, i) => i !== idx)
                      .map((it, i) => ({ ...it, sortOrder: i })),
                  })
                }
                onMove={(dir) => {
                  const j = idx + dir;
                  if (j < 0 || j >= form.items.length) return;
                  const next = [...form.items];
                  const tmp = next[idx]!;
                  next[idx] = next[j]!;
                  next[j] = tmp;
                  setForm({
                    ...form,
                    items: next.map((it, i) => ({ ...it, sortOrder: i })),
                  });
                }}
              />
            ))}

            <button
              type="button"
              disabled={form.items.length >= MAX_ITEMS}
              className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:border-accent disabled:opacity-40"
              onClick={() =>
                setForm({
                  ...form,
                  items: [
                    ...form.items,
                    {
                      id: `c_${Date.now()}`,
                      title: "Danh mục mới",
                      countLabel: "0 sản phẩm",
                      href: "/products",
                      iconKey: "other",
                      accentColor: "#0EA5A4",
                      visible: true,
                      sortOrder: form.items.length,
                    },
                  ],
                })
              }
            >
              + Thêm danh mục
            </button>
          </div>
        </div>
      )}
    </CmsSaveForm>
  );
}

function CategoryRow({
  item,
  index,
  total,
  onChange,
  onRemove,
  onMove,
}: {
  item: CmsCategoryItem;
  index: number;
  total: number;
  onChange: (item: CmsCategoryItem) => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <div className="grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-2">
      <div className="flex items-start gap-3 sm:col-span-2">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-white p-2">
          {item.iconUrl ? (
            <Image
              src={item.iconUrl}
              alt={item.title}
              width={48}
              height={48}
              className="h-12 w-12 object-contain"
              unoptimized
            />
          ) : (
            <span
              className="text-xs font-bold"
              style={{ color: item.accentColor || "#0EA5A4" }}
            >
              {(item.iconKey || "other").slice(0, 3)}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-sm font-medium text-navy">Icon</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white"
            >
              Chọn từ Media
            </button>
            {item.iconUrl ? (
              <button
                type="button"
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted hover:border-danger hover:text-danger"
                onClick={() => onChange({ ...item, iconUrl: undefined })}
              >
                Xóa icon
              </button>
            ) : null}
          </div>
          <MediaPicker
            open={pickerOpen}
            onClose={() => setPickerOpen(false)}
            multiple={false}
            purpose="ui"
            title="Chọn icon danh mục"
            onSelect={(urls) => {
              if (urls[0]) onChange({ ...item, iconUrl: urls[0] });
            }}
          />
        </div>
      </div>

      <label className="block text-sm">
        <span className="text-muted">Tiêu đề (max 24)</span>
        <input
          maxLength={24}
          className="mt-1 w-full rounded-lg border border-border px-3 py-2"
          value={item.title}
          onChange={(e) => onChange({ ...item, title: e.target.value })}
        />
      </label>

      <label className="block text-sm">
        <span className="text-muted">Số lượng (vd. 18 sản phẩm)</span>
        <input
          className="mt-1 w-full rounded-lg border border-border px-3 py-2"
          value={item.countLabel}
          onChange={(e) => onChange({ ...item, countLabel: e.target.value })}
        />
      </label>

      <label className="block text-sm">
        <span className="text-muted">Link</span>
        <input
          className="mt-1 w-full rounded-lg border border-border px-3 py-2"
          value={item.href}
          onChange={(e) => onChange({ ...item, href: e.target.value })}
        />
      </label>

      <label className="block text-sm">
        <span className="text-muted">Màu accent (glow)</span>
        <div className="mt-1 flex gap-2">
          <input
            type="color"
            className="h-10 w-12 cursor-pointer rounded border border-border bg-white p-1"
            value={item.accentColor || "#0EA5A4"}
            onChange={(e) =>
              onChange({ ...item, accentColor: e.target.value })
            }
          />
          <input
            className="w-full rounded-lg border border-border px-3 py-2"
            value={item.accentColor ?? ""}
            placeholder="#0EA5A4"
            onChange={(e) =>
              onChange({
                ...item,
                accentColor: e.target.value || undefined,
              })
            }
          />
        </div>
      </label>

      <label className="block text-sm sm:col-span-2">
        <span className="text-muted">Icon SVG fallback (khi chưa upload)</span>
        <select
          className="mt-1 w-full rounded-lg border border-border px-3 py-2"
          value={item.iconKey ?? "other"}
          onChange={(e) =>
            onChange({
              ...item,
              iconKey: e.target.value as CmsCategoryIconKey,
            })
          }
        >
          {ICON_KEYS.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
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
          <button
            type="button"
            className="text-sm text-danger"
            onClick={onRemove}
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}
