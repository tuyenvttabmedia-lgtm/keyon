"use client";

import Image from "next/image";
import Link from "next/link";
import type { CmsPartnerItem, CmsPartners } from "@/server/cms/types";
import { CmsSaveForm } from "../CmsSaveForm";

export type PartnerBrandOption = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
};

export function PartnersForm({
  initial,
  brands,
}: {
  initial: CmsPartners;
  brands: PartnerBrandOption[];
}) {
  const brandById = new Map(brands.map((b) => [b.id, b]));

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
              <p className="text-sm font-medium text-navy">Thương hiệu trên Home</p>
              <p className="text-xs text-muted">
                Chọn từ Catalog · Thương hiệu — logo/tên lấy tự động
              </p>
            </div>

            {brands.length === 0 ? (
              <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                Chưa có thương hiệu active trong Catalog.{" "}
                <Link href="/admin/brands/new" className="font-semibold underline">
                  Thêm thương hiệu
                </Link>{" "}
                trước, rồi quay lại chọn cho Home.
              </p>
            ) : null}

            {form.items.map((item, idx) => (
              <PartnerRow
                key={item.id}
                item={item}
                index={idx}
                total={form.items.length}
                brands={brands}
                brandById={brandById}
                usedBrandIds={form.items
                  .map((x) => x.brandId)
                  .filter((id): id is string => Boolean(id && id !== item.brandId))}
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
              disabled={brands.length === 0}
              className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:border-accent disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() => {
                const used = new Set(form.items.map((x) => x.brandId).filter(Boolean));
                const firstFree = brands.find((b) => !used.has(b.id));
                setForm({
                  ...form,
                  items: [
                    ...form.items,
                    {
                      id: `p_${Date.now()}`,
                      brandId: firstFree?.id,
                      visible: true,
                    },
                  ],
                });
              }}
            >
              + Thêm thương hiệu
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
  brands,
  brandById,
  usedBrandIds,
  onChange,
  onRemove,
  onMove,
}: {
  item: CmsPartnerItem;
  index: number;
  total: number;
  brands: PartnerBrandOption[];
  brandById: Map<string, PartnerBrandOption>;
  usedBrandIds: string[];
  onChange: (item: CmsPartnerItem) => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
}) {
  const brand = item.brandId ? brandById.get(item.brandId) : undefined;
  const used = new Set(usedBrandIds);
  const displayName = brand?.name || item.name || "Chưa chọn";
  const displayLogo = brand?.logoUrl || item.logoUrl;
  const defaultHref = brand ? `/brands/${brand.slug}` : undefined;

  return (
    <div className="grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-2">
      <div className="flex items-start gap-3 sm:col-span-2">
        <div className="flex h-16 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-white p-2">
          {displayLogo ? (
            <Image
              src={displayLogo}
              alt={displayName}
              width={112}
              height={40}
              className="max-h-10 w-auto object-contain"
              unoptimized
            />
          ) : (
            <span className="text-xs font-bold text-muted">{displayName.slice(0, 12)}</span>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-sm font-medium text-navy">{displayName}</p>
          <p className="text-xs text-muted">
            Logo lấy từ Catalog
            {brand ? (
              <>
                {" · "}
                <Link
                  href={`/admin/brands/${brand.id}`}
                  className="font-medium text-accent hover:underline"
                >
                  Sửa thương hiệu
                </Link>
              </>
            ) : null}
          </p>
          {!item.brandId && item.name ? (
            <p className="text-xs text-amber-700">
              Mục cũ (chưa gắn Catalog). Chọn thương hiệu bên dưới rồi Lưu.
            </p>
          ) : null}
        </div>
      </div>

      <label className="block text-sm sm:col-span-2">
        <span className="text-muted">Thương hiệu (Catalog)</span>
        <select
          className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2"
          value={item.brandId ?? ""}
          onChange={(e) => {
            const brandId = e.target.value || undefined;
            const selected = brandId ? brandById.get(brandId) : undefined;
            onChange({
              id: item.id,
              brandId,
              visible: item.visible,
              href: item.href,
              // Clear legacy fields once linked
              name: undefined,
              logoUrl: undefined,
              brandColor: undefined,
              ...(selected ? {} : {}),
            });
          }}
        >
          <option value="">— Chọn thương hiệu —</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id} disabled={used.has(b.id)}>
              {b.name}
              {used.has(b.id) ? " (đã chọn)" : ""}
              {!b.logoUrl ? " · chưa có logo" : ""}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm sm:col-span-2">
        <span className="text-muted">
          Link (tuỳ chọn — mặc định {defaultHref || "/brands/…"})
        </span>
        <input
          className="mt-1 w-full rounded-lg border border-border px-3 py-2"
          placeholder={defaultHref || "/brands/..."}
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
