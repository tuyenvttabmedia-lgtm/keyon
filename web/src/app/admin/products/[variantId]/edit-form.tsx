"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { GalleryEditor } from "../GalleryEditor";
import { OgImagePicker } from "../OgImagePicker";
import {
  RelatedProductsEditor,
  type RelatedProductOpt,
} from "../RelatedProductsEditor";
import {
  faqsToLines,
  linesToFaqs,
  linesToList,
  linesToSpecs,
  PRODUCT_CATEGORY_KEYS,
  specsToLines,
  type ProductCategoryKey,
  type ProductFaqRow,
  type ProductSpecRow,
} from "@/storefront/lib/product-cms";
import {
  formatIssues,
  catalogPublishWarnings,
  validateCatalogPublish,
} from "@/storefront/lib/catalog-validation";
import {
  CATEGORY_ADMIN_LABELS,
  SALES_MOTION_ADMIN_LABELS,
  SALES_MOTION_OPTIONS,
} from "@/storefront/lib/catalog-admin-labels";

type Props = {
  variantId: string;
  productId: string;
  productSlug: string;
  productName: string;
  productDescription: string;
  productShortDescription: string;
  productActive: boolean;
  categoryKey: ProductCategoryKey | "";
  badgeLabel: string;
  galleryUrls: string[];
  features: string[];
  specs: ProductSpecRow[];
  faqs: ProductFaqRow[];
  seoTitle: string;
  seoDescription: string;
  ogImageUrl: string;
  relatedProductIds: string[];
  relatedOptions: RelatedProductOpt[];
  variantName: string;
  priceVnd: number;
  compareAtPriceVnd: number | null;
  costVnd: number;
  slaPromise: string;
  lowStockThreshold: number;
  active: boolean;
  salesMotion: "SELF_SERVE" | "QUOTE_REQUIRED";
  strategyLabel: string;
  receiveLabel: string;
  sku: string;
  fulfillmentStrategy: string;
  deliverableType: string;
  supplierId: string | null;
};

export function ProductEditForm(props: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    ...props,
    galleryUrls: props.galleryUrls,
    relatedProductIds: props.relatedProductIds,
    featuresText: props.features.join("\n"),
    specsText: specsToLines(props.specs),
    faqsText: faqsToLines(props.faqs),
    compareAt: props.compareAtPriceVnd ?? ("" as string | number),
  });
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function save() {
    setLoading(true);
    setMsg(null);
    try {
      const compareRaw =
        form.compareAt === "" || form.compareAt === null
          ? null
          : Number(form.compareAt);
      const compareAtPriceVnd =
        compareRaw && Number.isFinite(compareRaw) && compareRaw > 0
          ? compareRaw
          : null;

      const issues = validateCatalogPublish({
        name: form.productName,
        sku: form.sku,
        priceVnd: form.priceVnd,
        compareAtPriceVnd,
        costVnd: form.costVnd,
        fulfillmentStrategy: form.fulfillmentStrategy,
        supplierId: form.supplierId,
        categoryKey: form.categoryKey || null,
        galleryUrls: form.galleryUrls,
        publishing: form.productActive,
      });
      if (issues.length) throw new Error(formatIssues(issues));

      const warnings = catalogPublishWarnings({
        name: form.productName,
        sku: form.sku,
        priceVnd: form.priceVnd,
        galleryUrls: form.galleryUrls,
        fulfillmentStrategy: form.fulfillmentStrategy,
        deliverableType: form.deliverableType,
        salesMotion: form.salesMotion,
        publishing: form.productActive,
      });
      if (warnings.length && form.productActive) {
        const ok = window.confirm(
          `${formatIssues(warnings)}\n\nVẫn xuất bản / lưu?`,
        );
        if (!ok) return;
      }

      const res = await fetch("/api/admin/catalog/variant", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantId: form.variantId,
          productName: form.productName,
          productDescription: form.productDescription || null,
          productShortDescription: form.productShortDescription || null,
          productActive: form.productActive,
          categoryKey: form.categoryKey || null,
          badgeLabel: form.badgeLabel || null,
          galleryUrls: form.galleryUrls,
          features: linesToList(form.featuresText),
          specs: linesToSpecs(form.specsText),
          faqs: linesToFaqs(form.faqsText),
          seoTitle: form.seoTitle.trim() || null,
          seoDescription: form.seoDescription.trim() || null,
          ogImageUrl: form.ogImageUrl.trim() || null,
          relatedProductIds: form.relatedProductIds,
          name: form.variantName,
          priceVnd: form.priceVnd,
          compareAtPriceVnd,
          costVnd: form.costVnd,
          slaPromise: form.slaPromise || null,
          lowStockThreshold: form.lowStockThreshold,
          active: form.active,
          salesMotion: form.salesMotion,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lỗi");
      setMsg(
        form.productActive
          ? "Đã lưu & xuất bản — PDP / SEO đã cập nhật"
          : "Đã lưu nháp — chưa hiện cửa hàng",
      );
      router.refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4 rounded-2xl border border-border bg-card p-6 lg:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-navy">Trạng thái xuất bản</h2>
            <p className="text-xs text-muted">
              Nháp = không hiện shop. Xuất bản cần danh mục; gallery trống sẽ cảnh báo.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm">
              <input
                type="checkbox"
                checked={form.productActive}
                onChange={(e) =>
                  setForm({ ...form, productActive: e.target.checked })
                }
              />
              <span className="font-semibold text-navy">
                {form.productActive ? "Đang xuất bản" : "Đang nháp"}
              </span>
            </label>
            <a
              href={`/products/${props.productSlug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center rounded-xl border border-border px-4 text-sm font-semibold text-navy hover:border-accent hover:text-accent"
            >
              Xem PDP ↗
            </a>
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-semibold text-navy">Sản phẩm</h2>
        <label className="block text-sm">
          <span className="font-medium">Tên sản phẩm</span>
          <input
            className="mt-1 w-full rounded-lg border border-border px-3 py-2"
            value={form.productName}
            onChange={(e) => setForm({ ...form, productName: e.target.value })}
          />
        </label>
        <p className="text-xs text-muted">
          Slug: <code className="font-mono">{props.productSlug}</code>
        </p>
        <label className="block text-sm">
          <span className="font-medium">Mô tả ngắn (PDP lead)</span>
          <textarea
            rows={2}
            className="mt-1 w-full rounded-lg border border-border px-3 py-2"
            value={form.productShortDescription}
            onChange={(e) =>
              setForm({ ...form, productShortDescription: e.target.value })
            }
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Mô tả đầy đủ</span>
          <textarea
            rows={4}
            className="mt-1 w-full rounded-lg border border-border px-3 py-2"
            value={form.productDescription}
            onChange={(e) => setForm({ ...form, productDescription: e.target.value })}
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium">Danh mục</span>
            <select
              className="mt-1 w-full rounded-lg border border-border px-3 py-2"
              value={form.categoryKey}
              onChange={(e) =>
                setForm({
                  ...form,
                  categoryKey: e.target.value as ProductCategoryKey | "",
                })
              }
            >
              <option value="">— Chọn danh mục —</option>
              {PRODUCT_CATEGORY_KEYS.map((k) => (
                <option key={k} value={k}>
                  {CATEGORY_ADMIN_LABELS[k]}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="font-medium">Badge tùy chỉnh</span>
            <input
              className="mt-1 w-full rounded-lg border border-border px-3 py-2"
              placeholder="HỆ ĐIỀU HÀNH"
              value={form.badgeLabel}
              onChange={(e) => setForm({ ...form, badgeLabel: e.target.value })}
            />
          </label>
        </div>
      </div>

      <div id="variant" className="space-y-4 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-semibold text-navy">Variant / gói đang sửa</h2>
        <p className="text-xs text-muted">
          SKU <code className="font-mono">{form.sku}</code> · {form.receiveLabel} ·{" "}
          {form.strategyLabel}
        </p>
        <label className="block text-sm">
          <span className="font-medium">Tên gói</span>
          <input
            className="mt-1 w-full rounded-lg border border-border px-3 py-2"
            value={form.variantName}
            onChange={(e) => setForm({ ...form, variantName: e.target.value })}
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block text-sm">
            <span className="font-medium">Giá bán (đ)</span>
            <input
              type="number"
              className="mt-1 w-full rounded-lg border border-border px-3 py-2"
              value={form.priceVnd}
              onChange={(e) => setForm({ ...form, priceVnd: Number(e.target.value) })}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Giá gốc / gạch (đ)</span>
            <input
              type="number"
              className="mt-1 w-full rounded-lg border border-border px-3 py-2"
              placeholder="Để trống = không giảm"
              value={form.compareAt}
              onChange={(e) => setForm({ ...form, compareAt: e.target.value })}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Giá vốn (đ)</span>
            <input
              type="number"
              className="mt-1 w-full rounded-lg border border-border px-3 py-2"
              value={form.costVnd}
              onChange={(e) => setForm({ ...form, costVnd: Number(e.target.value) })}
            />
          </label>
        </div>
        <label className="block text-sm">
          <span className="font-medium">SLA / thời gian giao (text khách)</span>
          <input
            className="mt-1 w-full rounded-lg border border-border px-3 py-2"
            value={form.slaPromise}
            onChange={(e) => setForm({ ...form, slaPromise: e.target.value })}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Ngưỡng tồn thấp</span>
          <input
            type="number"
            className="mt-1 w-full rounded-lg border border-border px-3 py-2"
            value={form.lowStockThreshold}
            onChange={(e) =>
              setForm({ ...form, lowStockThreshold: Number(e.target.value) })
            }
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Hình thức bán</span>
          <select
            className="mt-1 w-full rounded-lg border border-border px-3 py-2"
            value={form.salesMotion}
            onChange={(e) =>
              setForm({
                ...form,
                salesMotion: e.target.value as "SELF_SERVE" | "QUOTE_REQUIRED",
              })
            }
          >
            {SALES_MOTION_OPTIONS.map((k) => (
              <option key={k} value={k}>
                {SALES_MOTION_ADMIN_LABELS[k]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
          />
          Gói này đang bán (variant active)
        </label>
      </div>

      <div id="seo" className="space-y-4 rounded-2xl border border-border bg-card p-6 lg:col-span-2">
        <h2 className="font-semibold text-navy">SEO</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium">Meta title</span>
            <input
              className="mt-1 w-full rounded-lg border border-border px-3 py-2"
              placeholder={form.productName || "Tên sản phẩm"}
              value={form.seoTitle}
              onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Meta description</span>
            <textarea
              rows={3}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2"
              placeholder="Mô tả ngắn cho Google (150–160 ký tự)"
              value={form.seoDescription}
              onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
            />
          </label>
        </div>
        <div className="rounded-xl border border-border bg-surface px-3 py-2 text-sm">
          <p className="text-xs text-muted">Preview SERP</p>
          <p className="text-sky-700">
            {form.seoTitle.trim() || form.productName || "—"}
          </p>
          <p className="text-muted line-clamp-2">
            {form.seoDescription.trim() ||
              form.productShortDescription ||
              form.productDescription ||
              "—"}
          </p>
        </div>
        <div className="pt-2">
          <h3 className="mb-2 text-sm font-semibold text-navy">OG image</h3>
          <OgImagePicker
            url={form.ogImageUrl}
            onChange={(ogImageUrl) => setForm({ ...form, ogImageUrl })}
            fallbackHint={form.galleryUrls[0]}
          />
        </div>
      </div>

      <div id="media" className="space-y-4 rounded-2xl border border-border bg-card p-6 lg:col-span-2">
        <h2 className="font-semibold text-navy">Gallery PDP</h2>
        <GalleryEditor
          urls={form.galleryUrls}
          onChange={(galleryUrls) => setForm({ ...form, galleryUrls })}
        />
      </div>

      <div className="space-y-4 rounded-2xl border border-border bg-card p-6 lg:col-span-2">
        <h2 className="font-semibold text-navy">Sản phẩm liên quan (PDP)</h2>
        <RelatedProductsEditor
          currentProductId={props.productId}
          options={props.relatedOptions}
          selectedIds={form.relatedProductIds}
          onChange={(relatedProductIds) => setForm({ ...form, relatedProductIds })}
        />
      </div>

      <div className="space-y-4 rounded-2xl border border-border bg-card p-6 lg:col-span-2">
        <h2 className="font-semibold text-navy">Nội dung PDP</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          <label className="block text-sm">
            <span className="font-medium">Features (bullets)</span>
            <textarea
              rows={8}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
              value={form.featuresText}
              onChange={(e) => setForm({ ...form, featuresText: e.target.value })}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Specs</span>
            <textarea
              rows={8}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 font-mono text-xs"
              placeholder={"Nhà phát hành|Microsoft\nThiết bị|1 thiết bị"}
              value={form.specsText}
              onChange={(e) => setForm({ ...form, specsText: e.target.value })}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">FAQ</span>
            <textarea
              rows={8}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
              placeholder={"Sản phẩm này là gì?||...\nCách kích hoạt?||..."}
              value={form.faqsText}
              onChange={(e) => setForm({ ...form, faqsText: e.target.value })}
            />
          </label>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 lg:col-span-2">
        <button
          type="button"
          disabled={loading}
          onClick={save}
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Đang lưu…" : "Lưu thay đổi"}
        </button>
        {msg && (
          <pre className="whitespace-pre-wrap text-sm text-muted">{msg}</pre>
        )}
      </div>
    </div>
  );
}
