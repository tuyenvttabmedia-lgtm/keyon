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
  LICENSE_MODEL_ADMIN_LABELS,
  LICENSE_MODEL_OPTIONS,
  SALES_MOTION_ADMIN_LABELS,
  SALES_MOTION_OPTIONS,
} from "@/storefront/lib/catalog-admin-labels";
import {
  ProductLicenseDefaultsPanel,
  VariantLicenseFieldsPanel,
  type ProductLicenseDefaults,
  type VariantLicenseFields,
} from "../LicenseCatalogFields";
import { parseSeoKeywords } from "@/storefront/lib/license-catalog";
import { listToLines } from "@/storefront/lib/product-cms";
import { RichTextEditor } from "@/app/admin/blog/rich-text-editor";
import {
  isHtmlBody,
  legacyBodyToHtml,
  stripHtml,
} from "@/server/cms/blog-utils";
import {
  confirmPermanentDeletePhrase,
  PERMANENT_DELETE_PROMPT_HINT,
} from "@/app/admin/catalog/confirm-permanent-delete";
import { ELEVATION_NONE, TRANSITION_UI, Z_STICKY } from "@/storefront/effects";

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
  usageGuideHtml: string;
  seoTitle: string;
  seoDescription: string;
  ogImageUrl: string;
  focusKeyword: string;
  seoKeywords: string[];
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  licenseDefaults: ProductLicenseDefaults;
  variantLicense: VariantLicenseFields;
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
  licenseModel: "PERPETUAL" | "SUBSCRIPTION" | "MAINTENANCE";
  strategyLabel: string;
  receiveLabel: string;
  sku: string;
  fulfillmentStrategy: string;
  deliverableType: string;
  supplierId: string | null;
};

const EDIT_TABS = [
  { id: "basics", label: "Cơ bản" },
  { id: "description", label: "Mô tả" },
  { id: "guide", label: "Hướng dẫn" },
  { id: "media", label: "Media" },
  { id: "content", label: "Features · Specs" },
  { id: "seo", label: "SEO" },
  { id: "variant", label: "Gói / Giá" },
  { id: "related", label: "Liên quan" },
] as const;

type EditTabId = (typeof EDIT_TABS)[number]["id"];

function Panel({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div>
        <h2 className="font-semibold text-navy">{title}</h2>
        {hint ? <p className="mt-0.5 text-xs text-muted">{hint}</p> : null}
      </div>
      {children}
    </div>
  );
}

export function ProductEditForm(props: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<EditTabId>("basics");
  const [form, setForm] = useState({
    ...props,
    galleryUrls: props.galleryUrls,
    relatedProductIds: props.relatedProductIds,
    featuresText: props.features.join("\n"),
    specsText: specsToLines(props.specs),
    faqsText: faqsToLines(props.faqs),
    seoKeywordsText: listToLines(props.seoKeywords),
    licenseDefaults: props.licenseDefaults,
    variantLicense: props.variantLicense,
    productDescription: props.productDescription.trim()
      ? isHtmlBody(props.productDescription)
        ? props.productDescription
        : legacyBodyToHtml(props.productDescription)
      : "<p></p>",
    usageGuideHtml: props.usageGuideHtml.trim()
      ? isHtmlBody(props.usageGuideHtml)
        ? props.usageGuideHtml
        : legacyBodyToHtml(props.usageGuideHtml)
      : "<p></p>",
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
          usageGuideHtml: form.usageGuideHtml || null,
          seoTitle: form.seoTitle.trim() || null,
          seoDescription: form.seoDescription.trim() || null,
          ogImageUrl: form.ogImageUrl.trim() || null,
          focusKeyword: form.focusKeyword.trim() || null,
          seoKeywords: parseSeoKeywords(form.seoKeywordsText),
          canonicalUrl: form.canonicalUrl.trim() || null,
          ogTitle: form.ogTitle.trim() || null,
          ogDescription: form.ogDescription.trim() || null,
          platforms: form.licenseDefaults.platforms,
          language: form.licenseDefaults.language || null,
          licenseChannelDefault:
            form.licenseDefaults.licenseChannelDefault || null,
          licenseTermDefault: form.licenseDefaults.licenseTermDefault || null,
          seatsDefault: form.licenseDefaults.seatsDefault.trim() || null,
          activationMethodDefault:
            form.licenseDefaults.activationMethodDefault || null,
          transferPolicy: form.licenseDefaults.transferPolicy.trim() || null,
          upgradePolicy: form.licenseDefaults.upgradePolicy.trim() || null,
          accountRequired: form.licenseDefaults.accountRequired.trim() || null,
          licenseChannel: form.variantLicense.licenseChannel || null,
          licenseTerm: form.variantLicense.licenseTerm || null,
          seatsLabel: form.variantLicense.seatsLabel.trim() || null,
          regionCode: form.variantLicense.regionCode || null,
          activationMethod: form.variantLicense.activationMethod || null,
          relatedProductIds: form.relatedProductIds,
          name: form.variantName,
          priceVnd: form.priceVnd,
          compareAtPriceVnd,
          costVnd: form.costVnd,
          slaPromise: form.slaPromise || null,
          lowStockThreshold: form.lowStockThreshold,
          active: form.active,
          salesMotion: form.salesMotion,
          licenseModel: form.licenseModel,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lỗi");
      setMsg(
        form.productActive
          ? "Đã lưu & xuất bản — sản phẩm đang bán trên cửa hàng"
          : "Đã lưu trữ — ẩn cửa hàng, đã tắt mọi gói (không xóa dữ liệu)",
      );
      router.refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  async function permanentlyDelete() {
    const typed = window.prompt(
      `XÓA VĨNH VIỄN «${form.productName}»?\n\nChỉ khi chưa có đơn và không có key RESERVED/CONSUMED.\n${PERMANENT_DELETE_PROMPT_HINT}`,
    );
    const check = confirmPermanentDeletePhrase(typed);
    if (check.cancelled) return;
    if (!check.ok) {
      alert("Chưa xóa. Bạn cần gõ đúng DELETE để xác nhận.");
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(
        `/api/admin/catalog/product/${encodeURIComponent(props.productId)}`,
        { method: "DELETE" },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          (data as { error?: string }).error ??
            `Xóa thất bại (HTTP ${res.status})`,
        );
      }
      router.push("/admin/catalog");
      router.refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Lỗi xóa");
      setLoading(false);
    }
  }

  const serpDesc =
    form.seoDescription.trim() ||
    form.productShortDescription.trim() ||
    stripHtml(form.productDescription).slice(0, 160) ||
    "—";

  return (
    <div className="space-y-4">
      {/* Sticky actions — always reachable while editing long editors */}
      <div
        className={`sticky top-[var(--admin-topbar-h,3.5rem)] ${Z_STICKY} space-y-3 rounded-2xl border border-border bg-white/95 px-4 py-3 backdrop-blur ${ELEVATION_NONE}`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                form.productActive
                  ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200"
                  : "bg-amber-50 text-amber-900 ring-1 ring-amber-200"
              }`}
            >
              {form.productActive ? "Đang bán" : "Đã lưu trữ"}
            </span>
            <span className="truncate text-sm text-muted">
              <span className="font-medium text-navy">{form.productName}</span>
              <span className="mx-1.5 text-border">·</span>
              <code className="font-mono text-[11px]">{props.productSlug}</code>
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`/products/${props.productSlug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center rounded-xl border border-border px-3 text-sm font-semibold text-navy hover:border-accent hover:text-accent"
            >
              Xem PDP ↗
            </a>
            {form.productActive ? (
              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  if (
                    !confirm(
                      "Ngừng bán / lưu trữ sản phẩm này?\nẨn khỏi cửa hàng và tắt mọi gói. Không xóa dữ liệu.",
                    )
                  ) {
                    return;
                  }
                  setForm({ ...form, productActive: false, active: false });
                }}
                className="inline-flex h-9 items-center rounded-xl border border-amber-300 bg-amber-50 px-3 text-sm font-semibold text-amber-900 hover:bg-amber-100 disabled:opacity-40"
              >
                Lưu trữ
              </button>
            ) : (
              <button
                type="button"
                disabled={loading}
                onClick={() => setForm({ ...form, productActive: true })}
                className="inline-flex h-9 items-center rounded-xl bg-accent/10 px-3 text-sm font-semibold text-accent hover:bg-accent/20 disabled:opacity-40"
              >
                Xuất bản lại
              </button>
            )}
            <button
              type="button"
              disabled={loading}
              onClick={() => void permanentlyDelete()}
              className="inline-flex h-9 items-center rounded-xl border border-red-200 px-3 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-40"
            >
              Xóa…
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => void save()}
              className="inline-flex h-9 items-center rounded-xl bg-accent px-4 text-sm font-semibold text-white disabled:opacity-50"
            >
              {loading ? "Đang lưu…" : "Lưu thay đổi"}
            </button>
          </div>
        </div>
        {msg ? (
          <p
            className={`text-sm ${
              msg.startsWith("Đã") ? "text-emerald-700" : "text-danger"
            }`}
          >
            {msg}
          </p>
        ) : null}

        <nav
          className="-mx-1 flex gap-1 overflow-x-auto pb-0.5"
          aria-label="Mục chỉnh sửa sản phẩm"
        >
          {EDIT_TABS.map((t) => {
            const on = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium ${TRANSITION_UI} ${
                  on
                    ? "bg-accent text-white"
                    : "text-muted hover:bg-surface hover:text-navy"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </nav>
      </div>

      {tab === "basics" ? (
        <Panel
          title="Thông tin cơ bản"
          hint="Tên, lead PDP, danh mục — license defaults áp dụng khi tạo gói mới."
        >
          <label className="block text-sm">
            <span className="font-medium">Tên sản phẩm</span>
            <input
              className="mt-1 w-full rounded-lg border border-border px-3 py-2"
              value={form.productName}
              onChange={(e) =>
                setForm({ ...form, productName: e.target.value })
              }
            />
          </label>
          <p className="text-xs text-muted">
            Slug: <code className="font-mono">{props.productSlug}</code> (không
            đổi tại đây)
          </p>
          <label className="block text-sm">
            <span className="font-medium">Mô tả ngắn (lead PDP)</span>
            <p className="mt-0.5 text-[11px] text-muted">
              1–2 câu dưới tiêu đề — không dán bài dài.
            </p>
            <textarea
              rows={2}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2"
              value={form.productShortDescription}
              onChange={(e) =>
                setForm({ ...form, productShortDescription: e.target.value })
              }
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
                onChange={(e) =>
                  setForm({ ...form, badgeLabel: e.target.value })
                }
              />
            </label>
          </div>
          <ProductLicenseDefaultsPanel
            value={form.licenseDefaults}
            onChange={(licenseDefaults) =>
              setForm({ ...form, licenseDefaults })
            }
          />
          <p className="rounded-xl border border-border bg-surface px-3 py-2 text-xs text-muted">
            Lưu trữ ẩn cửa hàng + tắt mọi gói — không xóa đơn / kho key. Nhấn{" "}
            <strong>Lưu thay đổi</strong> để áp dụng trạng thái.
          </p>
        </Panel>
      ) : null}

      {tab === "description" ? (
        <Panel
          title="Mô tả đầy đủ (tab PDP)"
          hint="Tiêu đề, đoạn, danh sách, bảng, ảnh. Dán Word/Docs được làm sạch."
        >
          <RichTextEditor
            value={form.productDescription || "<p></p>"}
            onChange={(html) =>
              setForm({ ...form, productDescription: html })
            }
            mediaPurpose="product"
            placeholder="Viết mô tả sản phẩm…"
          />
        </Panel>
      ) : null}

      {tab === "guide" ? (
        <Panel
          title="Hướng dẫn sử dụng / kích hoạt (tab PDP)"
          hint="Nội dung riêng theo sản phẩm — không phải hướng dẫn thanh toán chung."
        >
          <RichTextEditor
            value={form.usageGuideHtml || "<p></p>"}
            onChange={(html) => setForm({ ...form, usageGuideHtml: html })}
            mediaPurpose="product"
            placeholder="Viết hướng dẫn kích hoạt / sử dụng phần mềm…"
          />
        </Panel>
      ) : null}

      {tab === "media" ? (
        <div className="space-y-4">
          <Panel
            title="Gallery PDP"
            hint="Chọn / tải nhiều ảnh một lần · ảnh đầu = ảnh chính."
          >
            <GalleryEditor
              urls={form.galleryUrls}
              onChange={(galleryUrls) => setForm({ ...form, galleryUrls })}
            />
          </Panel>
          <Panel
            title="OG image (chia sẻ MXH)"
            hint="Để trống = dùng ảnh gallery đầu tiên."
          >
            <OgImagePicker
              url={form.ogImageUrl}
              onChange={(ogImageUrl) => setForm({ ...form, ogImageUrl })}
              fallbackHint={form.galleryUrls[0]}
            />
          </Panel>
        </div>
      ) : null}

      {tab === "content" ? (
        <Panel
          title="Features · Specs · FAQ"
          hint="Bullets / thông số / hỏi đáp hiển thị trên PDP."
        >
          <div className="grid gap-4 lg:grid-cols-3">
            <label className="block text-sm">
              <span className="font-medium">Features (bullets)</span>
              <textarea
                rows={10}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
                value={form.featuresText}
                onChange={(e) =>
                  setForm({ ...form, featuresText: e.target.value })
                }
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium">Specs</span>
              <p className="mt-0.5 text-[11px] text-muted">
                `Label|Value` · hệ thống: `system|Label|Value`
              </p>
              <textarea
                rows={10}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 font-mono text-xs"
                placeholder={"Nhà phát hành|Microsoft\nsystem|RAM|4 GB"}
                value={form.specsText}
                onChange={(e) =>
                  setForm({ ...form, specsText: e.target.value })
                }
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium">FAQ (Q||A)</span>
              <textarea
                rows={10}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
                placeholder={"Sản phẩm này là gì?||...\nCách kích hoạt?||..."}
                value={form.faqsText}
                onChange={(e) =>
                  setForm({ ...form, faqsText: e.target.value })
                }
              />
            </label>
          </div>
        </Panel>
      ) : null}

      {tab === "seo" ? (
        <Panel title="SEO" hint="Meta / Open Graph cho trang sản phẩm.">
          <div className="grid gap-4 lg:grid-cols-2">
            <label className="block text-sm">
              <span className="font-medium">Meta title</span>
              <input
                className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                placeholder={form.productName || "Tên sản phẩm"}
                value={form.seoTitle}
                onChange={(e) =>
                  setForm({ ...form, seoTitle: e.target.value })
                }
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium">Focus keyword</span>
              <input
                className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                value={form.focusKeyword}
                onChange={(e) =>
                  setForm({ ...form, focusKeyword: e.target.value })
                }
              />
            </label>
            <label className="block text-sm lg:col-span-2">
              <span className="font-medium">Meta description</span>
              <textarea
                rows={3}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                placeholder="Mô tả ngắn cho Google (150–160 ký tự)"
                value={form.seoDescription}
                onChange={(e) =>
                  setForm({ ...form, seoDescription: e.target.value })
                }
              />
            </label>
            <label className="block text-sm lg:col-span-2">
              <span className="font-medium">
                Keywords phụ (mỗi dòng hoặc cách bằng dấu phẩy)
              </span>
              <textarea
                rows={2}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                value={form.seoKeywordsText}
                onChange={(e) =>
                  setForm({ ...form, seoKeywordsText: e.target.value })
                }
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium">Canonical URL</span>
              <input
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 font-mono text-xs"
                value={form.canonicalUrl}
                onChange={(e) =>
                  setForm({ ...form, canonicalUrl: e.target.value })
                }
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium">OG title</span>
              <input
                className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                value={form.ogTitle}
                onChange={(e) => setForm({ ...form, ogTitle: e.target.value })}
              />
            </label>
            <label className="block text-sm lg:col-span-2">
              <span className="font-medium">OG description</span>
              <textarea
                rows={2}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                value={form.ogDescription}
                onChange={(e) =>
                  setForm({ ...form, ogDescription: e.target.value })
                }
              />
            </label>
          </div>
          <div className="rounded-xl border border-border bg-surface px-3 py-2 text-sm">
            <p className="text-xs text-muted">Preview SERP</p>
            <p className="text-sky-700">
              {form.seoTitle.trim() || form.productName || "—"}
            </p>
            <p className="line-clamp-2 text-muted">{serpDesc}</p>
          </div>
        </Panel>
      ) : null}

      {tab === "variant" ? (
        <Panel
          title="Gói đang sửa"
          hint={`SKU ${form.sku} · ${form.receiveLabel} · ${form.strategyLabel}`}
        >
          <label className="block text-sm">
            <span className="font-medium">Tên gói</span>
            <input
              className="mt-1 w-full rounded-lg border border-border px-3 py-2"
              value={form.variantName}
              onChange={(e) =>
                setForm({ ...form, variantName: e.target.value })
              }
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block text-sm">
              <span className="font-medium">Giá bán (đ)</span>
              <input
                type="number"
                className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                value={form.priceVnd}
                onChange={(e) =>
                  setForm({ ...form, priceVnd: Number(e.target.value) })
                }
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium">Giá gốc / gạch (đ)</span>
              <input
                type="number"
                className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                placeholder="Để trống = không giảm"
                value={form.compareAt}
                onChange={(e) =>
                  setForm({ ...form, compareAt: e.target.value })
                }
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium">Giá vốn (đ)</span>
              <input
                type="number"
                className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                value={form.costVnd}
                onChange={(e) =>
                  setForm({ ...form, costVnd: Number(e.target.value) })
                }
              />
            </label>
          </div>
          <label className="block text-sm">
            <span className="font-medium">SLA / thời gian giao (text khách)</span>
            <input
              className="mt-1 w-full rounded-lg border border-border px-3 py-2"
              value={form.slaPromise}
              onChange={(e) =>
                setForm({ ...form, slaPromise: e.target.value })
              }
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Ngưỡng tồn thấp</span>
            <input
              type="number"
              className="mt-1 w-full rounded-lg border border-border px-3 py-2"
              value={form.lowStockThreshold}
              onChange={(e) =>
                setForm({
                  ...form,
                  lowStockThreshold: Number(e.target.value),
                })
              }
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Mô hình hệ thống (ops)</span>
            <p className="mt-0.5 text-[11px] text-muted">
              Khác kênh Retail/OEM trên PDP — dùng cho fulfillment / báo cáo nội
              bộ.
            </p>
            <select
              className="mt-1 w-full rounded-lg border border-border px-3 py-2"
              value={form.licenseModel}
              onChange={(e) =>
                setForm({
                  ...form,
                  licenseModel: e.target.value as
                    | "PERPETUAL"
                    | "SUBSCRIPTION"
                    | "MAINTENANCE",
                })
              }
            >
              {LICENSE_MODEL_OPTIONS.map((k) => (
                <option key={k} value={k}>
                  {LICENSE_MODEL_ADMIN_LABELS[k]}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="font-medium">Hình thức bán</span>
            <select
              className="mt-1 w-full rounded-lg border border-border px-3 py-2"
              value={form.salesMotion}
              onChange={(e) =>
                setForm({
                  ...form,
                  salesMotion: e.target.value as
                    | "SELF_SERVE"
                    | "QUOTE_REQUIRED",
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
              onChange={(e) =>
                setForm({ ...form, active: e.target.checked })
              }
            />
            Gói này đang bán (variant active)
          </label>
          <VariantLicenseFieldsPanel
            value={form.variantLicense}
            onChange={(variantLicense) =>
              setForm({ ...form, variantLicense })
            }
          />
        </Panel>
      ) : null}

      {tab === "related" ? (
        <Panel
          title="Sản phẩm liên quan (PDP)"
          hint="Tối đa ~8 sản phẩm gợi ý dưới trang."
        >
          <RelatedProductsEditor
            currentProductId={props.productId}
            options={props.relatedOptions}
            selectedIds={form.relatedProductIds}
            onChange={(relatedProductIds) =>
              setForm({ ...form, relatedProductIds })
            }
          />
        </Panel>
      ) : null}
    </div>
  );
}
