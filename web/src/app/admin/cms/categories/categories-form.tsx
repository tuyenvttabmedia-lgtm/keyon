"use client";

import Image from "next/image";
import { useCallback, useMemo, useRef, useState } from "react";
import type {
  CmsCategories,
  CmsCategoryIconKey,
  CmsCategoryItem,
} from "@/server/cms/types";
import { MediaPicker } from "@/app/admin/media/MediaPicker";
import {
  ADMIN_BTN_GHOST,
  ADMIN_BTN_PRIMARY,
  ADMIN_INPUT,
  ADMIN_PANEL,
  ADMIN_TOOLBAR,
} from "@/app/admin/ui/tokens";
import { Z_STICKY } from "@/storefront/effects";

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

function newItem(sortOrder: number): CmsCategoryItem {
  return {
    id: `c_${Date.now()}`,
    title: "Danh mục mới",
    countLabel: "0 sản phẩm",
    href: "/products",
    iconKey: "other",
    accentColor: "#0EA5A4",
    visible: true,
    sortOrder,
  };
}

export function CategoriesForm({ initial }: { initial: CmsCategories }) {
  const [form, setForm] = useState(initial);
  const [baseline, setBaseline] = useState(() => JSON.stringify(initial));
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const dirty = useMemo(() => JSON.stringify(form) !== baseline, [form, baseline]);
  const visibleCount = form.items.filter((i) => i.visible).length;

  const addItem = useCallback(() => {
    if (form.items.length >= MAX_ITEMS) return;
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, newItem(prev.items.length)],
    }));
    setMsg(null);
    requestAnimationFrame(() => {
      listRef.current
        ?.querySelector<HTMLElement>("[data-category-row]:last-of-type")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, [form.items.length]);

  async function save() {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/cms/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lỗi");
      setBaseline(JSON.stringify(form));
      setMsg("Đã lưu và xuất bản");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div
        className={`sticky top-0 ${Z_STICKY} ${ADMIN_TOOLBAR} flex flex-wrap items-center justify-between gap-3 bg-white/95 backdrop-blur`}
      >
        <div className="min-w-0">
          <p className="text-sm font-semibold text-navy">
            Danh mục Home · {form.items.length}/{MAX_ITEMS}
          </p>
          <p className="text-xs text-muted">
            {visibleCount} đang hiện trên Home
            {dirty ? " · có thay đổi chưa lưu" : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={saving || form.items.length >= MAX_ITEMS}
            onClick={addItem}
            className={`${ADMIN_BTN_GHOST} disabled:opacity-40`}
          >
            + Thêm danh mục
          </button>
          <button
            type="button"
            disabled={saving || !dirty}
            onClick={() => void save()}
            className={`${ADMIN_BTN_PRIMARY} disabled:opacity-50`}
          >
            {saving ? "Đang lưu…" : dirty ? "Lưu và xuất bản" : "Đã lưu"}
          </button>
          {msg ? <span className="text-sm text-muted">{msg}</span> : null}
        </div>
      </div>

      <section className={`${ADMIN_PANEL} space-y-3 p-4`}>
        <p className="text-sm font-medium text-navy">Section trên Home</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="block text-sm">
            <span className="text-muted">Tiêu đề</span>
            <input
              className={`mt-1 ${ADMIN_INPUT}`}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </label>
          <label className="block text-sm">
            <span className="text-muted">Nhãn “Xem tất cả”</span>
            <input
              className={`mt-1 ${ADMIN_INPUT}`}
              value={form.viewAllLabel}
              onChange={(e) =>
                setForm({ ...form, viewAllLabel: e.target.value })
              }
            />
          </label>
          <label className="block text-sm">
            <span className="text-muted">Link “Xem tất cả”</span>
            <input
              className={`mt-1 ${ADMIN_INPUT}`}
              value={form.viewAllHref}
              onChange={(e) =>
                setForm({ ...form, viewAllHref: e.target.value })
              }
            />
          </label>
        </div>
      </section>

      <section className="space-y-2">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-sm font-medium text-navy">Danh sách</p>
            <p className="text-xs text-muted">
              Icon Media ưu tiên hơn SVG fallback. Số lượng SP nhập tay
              (`countLabel`).
            </p>
          </div>
          <button
            type="button"
            disabled={saving || form.items.length >= MAX_ITEMS}
            onClick={addItem}
            className="text-sm font-medium text-accent hover:underline disabled:opacity-40"
          >
            + Thêm danh mục
          </button>
        </div>

        {form.items.length === 0 ? (
          <div
            className={`${ADMIN_PANEL} flex flex-col items-center gap-3 px-4 py-10 text-center`}
          >
            <p className="text-sm font-medium text-navy">Chưa có danh mục</p>
            <p className="max-w-sm text-xs text-muted">
              Thêm tối đa {MAX_ITEMS} mục để hiện trên Home.
            </p>
            <button
              type="button"
              onClick={addItem}
              className={ADMIN_BTN_PRIMARY}
            >
              + Thêm danh mục đầu tiên
            </button>
          </div>
        ) : (
          <div ref={listRef} className="space-y-2">
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
          </div>
        )}
      </section>
    </div>
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
    <div
      data-category-row
      className={`${ADMIN_PANEL} p-3 sm:p-3.5`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-2.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-surface text-xs font-semibold text-muted">
            {index + 1}
          </span>
          <p className="truncate text-sm font-semibold text-navy">
            {item.title || "Chưa đặt tên"}
          </p>
          {!item.visible ? (
            <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[11px] font-semibold text-amber-800">
              Ẩn
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-1.5">
          <label className="mr-1 flex items-center gap-1.5 text-xs text-navy">
            <input
              type="checkbox"
              checked={item.visible}
              onChange={(e) => onChange({ ...item, visible: e.target.checked })}
            />
            Hiện trên Home
          </label>
          <button
            type="button"
            disabled={index === 0}
            title="Lên"
            className="rounded-md border border-border px-2 py-1 text-xs disabled:opacity-40"
            onClick={() => onMove(-1)}
          >
            ↑
          </button>
          <button
            type="button"
            disabled={index >= total - 1}
            title="Xuống"
            className="rounded-md border border-border px-2 py-1 text-xs disabled:opacity-40"
            onClick={() => onMove(1)}
          >
            ↓
          </button>
          <button
            type="button"
            className="rounded-md px-2 py-1 text-xs font-medium text-danger hover:bg-rose-50"
            onClick={onRemove}
          >
            Xóa
          </button>
        </div>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-[auto_minmax(0,1fr)]">
        <div className="flex items-start gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-white p-1.5">
            {item.iconUrl ? (
              <Image
                src={item.iconUrl}
                alt={item.title}
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
                unoptimized
              />
            ) : (
              <span
                className="text-[10px] font-bold uppercase"
                style={{ color: item.accentColor || "#0EA5A4" }}
              >
                {(item.iconKey || "other").slice(0, 3)}
              </span>
            )}
          </div>
          <div className="space-y-1.5">
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="rounded-md bg-accent px-2.5 py-1 text-xs font-semibold text-white"
              >
                Media
              </button>
              {item.iconUrl ? (
                <button
                  type="button"
                  className="rounded-md border border-border px-2.5 py-1 text-xs font-medium text-muted hover:border-danger hover:text-danger"
                  onClick={() => onChange({ ...item, iconUrl: undefined })}
                >
                  Xóa icon
                </button>
              ) : null}
            </div>
            <label className="block text-xs text-muted">
              SVG fallback
              <select
                className={`mt-1 ${ADMIN_INPUT}`}
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
            <MediaPicker
              open={pickerOpen}
              onClose={() => setPickerOpen(false)}
              multiple={false}
              purpose="ui"
              title="Chọn icon danh mục"
              onSelect={(items) => {
                if (items[0]?.url) onChange({ ...item, iconUrl: items[0].url });
              }}
            />
          </div>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
          <label className="block text-xs text-muted">
            Tiêu đề (max 24)
            <input
              maxLength={24}
              className={`mt-1 ${ADMIN_INPUT}`}
              value={item.title}
              onChange={(e) => onChange({ ...item, title: e.target.value })}
            />
          </label>
          <label className="block text-xs text-muted">
            Số lượng
            <input
              className={`mt-1 ${ADMIN_INPUT}`}
              value={item.countLabel}
              onChange={(e) => onChange({ ...item, countLabel: e.target.value })}
            />
          </label>
          <label className="block text-xs text-muted sm:col-span-2 xl:col-span-1">
            Link
            <input
              className={`mt-1 ${ADMIN_INPUT}`}
              value={item.href}
              onChange={(e) => onChange({ ...item, href: e.target.value })}
            />
          </label>
          <label className="block text-xs text-muted sm:col-span-2 xl:col-span-1">
            Màu accent
            <div className="mt-1 flex gap-2">
              <input
                type="color"
                className="h-9 w-10 cursor-pointer rounded-lg border border-border bg-white p-1"
                value={item.accentColor || "#0EA5A4"}
                onChange={(e) =>
                  onChange({ ...item, accentColor: e.target.value })
                }
              />
              <input
                className={ADMIN_INPUT}
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
        </div>
      </div>
    </div>
  );
}
