"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { BrandImageField } from "./brand-image-field";

type SupplierOpt = { id: string; name: string };

export type BrandFormInitial = {
  name: string;
  slug: string;
  supplierId: string | null;
  logoUrl: string | null;
  bannerDesktopUrl: string | null;
  bannerMobileUrl: string | null;
  shortDescription: string | null;
  description: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  ogImageUrl: string | null;
  canonicalUrl: string | null;
  featured: boolean;
  sortOrder: number;
  active: boolean;
};

function slugifyPreview(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export function BrandForm({
  mode,
  brandId,
  initial,
  suppliers,
}: {
  mode: "create" | "edit";
  brandId?: string;
  initial?: BrandFormInitial;
  suppliers: SupplierOpt[];
}) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugLocked, setSlugLocked] = useState(mode === "create");
  const [supplierId, setSupplierId] = useState(initial?.supplierId ?? "");
  const [logoUrl, setLogoUrl] = useState(initial?.logoUrl ?? "");
  const [bannerDesktopUrl, setBannerDesktopUrl] = useState(
    initial?.bannerDesktopUrl ?? "",
  );
  const [bannerMobileUrl, setBannerMobileUrl] = useState(
    initial?.bannerMobileUrl ?? "",
  );
  const [shortDescription, setShortDescription] = useState(
    initial?.shortDescription ?? "",
  );
  const [description, setDescription] = useState(initial?.description ?? "");
  const [seoTitle, setSeoTitle] = useState(initial?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(
    initial?.seoDescription ?? "",
  );
  const [ogImageUrl, setOgImageUrl] = useState(initial?.ogImageUrl ?? "");
  const [canonicalUrl, setCanonicalUrl] = useState(initial?.canonicalUrl ?? "");
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [sortOrder, setSortOrder] = useState(initial?.sortOrder ?? 0);
  const [active, setActive] = useState(initial?.active ?? true);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const previewSlug = useMemo(
    () => (slugLocked ? slugifyPreview(name) || "…" : slug.trim() || "…"),
    [slugLocked, name, slug],
  );

  async function submit() {
    setLoading(true);
    setMsg(null);
    try {
      if (!name.trim()) throw new Error("Nhập tên thương hiệu");
      const payload = {
        name: name.trim(),
        slug: slugLocked ? undefined : slug.trim() || undefined,
        supplierId: supplierId || null,
        logoUrl: logoUrl || null,
        bannerDesktopUrl: bannerDesktopUrl || null,
        bannerMobileUrl: bannerMobileUrl || null,
        shortDescription: shortDescription || null,
        description: description || null,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        ogImageUrl: ogImageUrl || null,
        canonicalUrl: canonicalUrl || null,
        featured,
        sortOrder: Number.isFinite(sortOrder) ? Math.round(sortOrder) : 0,
        active,
      };
      const res =
        mode === "create"
          ? await fetch("/api/admin/brands", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            })
          : await fetch(`/api/admin/brands/${brandId}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lưu thất bại");
      router.push(`/admin/brands/${data.id}`);
      router.refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-semibold text-navy">Cơ bản</h2>
        <label className="block text-sm">
          <span className="font-medium">Tên thương hiệu</span>
          <input
            className="mt-1 w-full rounded-lg border border-border px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <div className="rounded-xl border border-border bg-surface px-3 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-medium text-navy">Slug</p>
              <p className="font-mono text-xs text-muted">/brands/{previewSlug}</p>
            </div>
            {slugLocked ? (
              <button
                type="button"
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-navy"
                onClick={() => {
                  setSlug(slugifyPreview(name));
                  setSlugLocked(false);
                }}
              >
                Chỉnh sửa slug
              </button>
            ) : (
              <button
                type="button"
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted"
                onClick={() => {
                  setSlug("");
                  setSlugLocked(true);
                }}
              >
                Tự động từ tên
              </button>
            )}
          </div>
          {!slugLocked ? (
            <input
              className="mt-2 w-full rounded-lg border border-border px-3 py-2 font-mono text-sm"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          ) : null}
        </div>

        <label className="block text-sm">
          <span className="font-medium">Default Provider</span>
          <select
            className="mt-1 w-full rounded-lg border border-border px-3 py-2"
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
          >
            <option value="">— Chưa gắn —</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>

        <div className="grid gap-3 sm:grid-cols-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            />
            Active (bỏ = Archive)
          </label>
          <label className="block text-sm">
            <span className="font-medium">Thứ tự hiển thị</span>
            <input
              type="number"
              className="mt-1 w-full rounded-lg border border-border px-3 py-2"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
            />
          </label>
        </div>
      </div>

      <div id="media" className="space-y-4 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-semibold text-navy">Media</h2>
        <BrandImageField
          label="Logo"
          url={logoUrl}
          onChange={setLogoUrl}
          aspectClass="h-20 w-20"
        />
        <BrandImageField
          label="Banner Desktop"
          hint="Landing desktop"
          url={bannerDesktopUrl}
          onChange={setBannerDesktopUrl}
          aspectClass="h-28 w-full max-w-md"
        />
        <BrandImageField
          label="Banner Mobile"
          hint="Landing mobile — trống = dùng desktop"
          url={bannerMobileUrl}
          onChange={setBannerMobileUrl}
          aspectClass="h-36 w-28"
        />
      </div>

      <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-semibold text-navy">Nội dung</h2>
        <label className="block text-sm">
          <span className="font-medium">Mô tả ngắn</span>
          <textarea
            rows={2}
            className="mt-1 w-full rounded-lg border border-border px-3 py-2"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Mô tả</span>
          <textarea
            rows={5}
            className="mt-1 w-full rounded-lg border border-border px-3 py-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
      </div>

      <div id="seo" className="space-y-4 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-semibold text-navy">SEO</h2>
        <label className="block text-sm">
          <span className="font-medium">SEO Title</span>
          <input
            className="mt-1 w-full rounded-lg border border-border px-3 py-2"
            placeholder={name || "Tên brand"}
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium">SEO Description</span>
          <textarea
            rows={3}
            className="mt-1 w-full rounded-lg border border-border px-3 py-2"
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
          />
        </label>
        <BrandImageField
          label="OG Image"
          hint="Trống = logo hoặc banner"
          url={ogImageUrl}
          onChange={setOgImageUrl}
        />
        <label className="block text-sm">
          <span className="font-medium">Canonical</span>
          <input
            className="mt-1 w-full rounded-lg border border-border px-3 py-2 font-mono text-sm"
            placeholder={`https://keyon.vn/brands/${previewSlug}`}
            value={canonicalUrl}
            onChange={(e) => setCanonicalUrl(e.target.value)}
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={loading}
          onClick={submit}
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Đang lưu…" : mode === "create" ? "Tạo brand" : "Lưu"}
        </button>
        {msg ? <span className="text-sm text-danger">{msg}</span> : null}
      </div>
    </div>
  );
}
