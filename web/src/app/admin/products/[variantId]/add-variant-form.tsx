"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  formatIssues,
  validateCatalogDraft,
} from "@/storefront/lib/catalog-validation";
import { linesToPlanSpecs } from "@/storefront/lib/product-cms";
import { INFRA_SPEC_TEMPLATES } from "@/storefront/lib/offering-profile";
import {
  DELIVERABLE_ADMIN_LABELS,
  FULFILLMENT_ADMIN_LABELS,
  LICENSE_MODEL_ADMIN_LABELS,
  LICENSE_MODEL_OPTIONS,
  SALES_MOTION_ADMIN_LABELS,
  SALES_MOTION_OPTIONS,
} from "@/storefront/lib/catalog-admin-labels";
import {
  commerceDefaults,
  deliverableOptionsFor,
  fulfillmentOptionsFor,
  showsLicenseMerchandising,
  type OfferingProfile,
} from "@/storefront/lib/offering-profile";
import {
  VariantLicenseFieldsPanel,
  emptyVariantLicenseFields,
  type VariantLicenseFields,
} from "../LicenseCatalogFields";
import {
  LICENSE_REGIONS,
  LICENSE_REGION_LABELS,
  LICENSE_TERMS,
  LICENSE_TERM_LABELS,
  type LicenseRegion,
  type LicenseTermCode,
} from "@/storefront/lib/license-catalog";

type SupplierOpt = { id: string; name: string };

type Props = {
  productId: string;
  suppliers: SupplierOpt[];
  offeringProfile: OfferingProfile;
};

export function AddVariantForm({
  productId,
  suppliers,
  offeringProfile,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const defaults = commerceDefaults(offeringProfile);
  const [form, setForm] = useState({
    name: "",
    sku: "",
    priceVnd: 499000,
    compareAt: "",
    costVnd: 0,
    licenseModel: defaults.licenseModel,
    fulfillmentStrategy: defaults.fulfillmentStrategy,
    deliverableType: defaults.deliverableType,
    salesMotion: defaults.salesMotion,
    slaPromise: "",
    supplierId: "",
    lowStockThreshold: 10,
    active: true,
    variantLicense: {
      ...emptyVariantLicenseFields(),
      licenseTerm: offeringProfile === "INFRASTRUCTURE" ? ("1_MONTH" as const) : "",
    } as VariantLicenseFields,
    planSpecsText:
      offeringProfile === "INFRASTRUCTURE" ? INFRA_SPEC_TEMPLATES.cloud : "",
  });
  const licenseMerchandising = showsLicenseMerchandising(offeringProfile);
  const fulfillmentChoices = fulfillmentOptionsFor(offeringProfile);
  const deliverableChoices = deliverableOptionsFor(offeringProfile);

  async function submit() {
    setLoading(true);
    setMsg(null);
    try {
      const compareRaw = form.compareAt === "" ? null : Number(form.compareAt);
      const compareAtPriceVnd =
        compareRaw && Number.isFinite(compareRaw) && compareRaw > 0 ? compareRaw : null;

      const issues = validateCatalogDraft({
        name: form.name || "variant",
        sku: form.sku,
        priceVnd: form.priceVnd,
        compareAtPriceVnd,
        costVnd: form.costVnd,
        fulfillmentStrategy: form.fulfillmentStrategy,
        deliverableType: form.deliverableType,
        supplierId: form.supplierId || null,
        publishing: false,
      });
      if (!form.name.trim()) {
        issues.push({ field: "name", message: "Thiếu tên gói" });
      }
      if (issues.length) throw new Error(formatIssues(issues));

      const res = await fetch("/api/admin/catalog/variant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          name: form.name,
          sku: form.sku,
          priceVnd: form.priceVnd,
          compareAtPriceVnd,
          costVnd: form.costVnd,
          licenseModel: form.licenseModel,
          fulfillmentStrategy: form.fulfillmentStrategy,
          deliverableType: form.deliverableType,
          salesMotion: form.salesMotion,
          slaPromise: form.slaPromise || null,
          supplierId: form.supplierId || null,
          lowStockThreshold: form.lowStockThreshold,
          active: form.active,
          licenseChannel: form.variantLicense.licenseChannel || null,
          licenseTerm: form.variantLicense.licenseTerm || null,
          seatsLabel: form.variantLicense.seatsLabel.trim() || null,
          regionCode: form.variantLicense.regionCode || null,
          activationMethod: form.variantLicense.activationMethod || null,
          planSpecs:
            offeringProfile === "INFRASTRUCTURE"
              ? linesToPlanSpecs(form.planSpecsText)
              : [],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lỗi");
      setOpen(false);
      router.push(`/admin/products/${data.variantId}`);
      router.refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-xl border border-dashed border-accent/50 bg-accent/5 px-4 py-3 text-sm font-semibold text-accent hover:bg-accent/10"
      >
        + Thêm gói / variant
      </button>
    );
  }

  return (
    <div className="space-y-4 rounded-2xl border border-accent/30 bg-card p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-navy">Gói mới (cùng sản phẩm)</h3>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm text-muted hover:text-navy"
        >
          Hủy
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium">Tên gói</span>
          <input
            className="mt-1 w-full rounded-lg border border-border px-3 py-2"
            placeholder={
              offeringProfile === "SOFTWARE" ? "Home · Pro · OEM…" : "Gói chuẩn"
            }
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium">SKU</span>
          <input
            className="mt-1 w-full rounded-lg border border-border px-3 py-2 font-mono text-sm"
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Giá bán</span>
          <input
            type="number"
            className="mt-1 w-full rounded-lg border border-border px-3 py-2"
            value={form.priceVnd}
            onChange={(e) => setForm({ ...form, priceVnd: Number(e.target.value) })}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Giá gốc</span>
          <input
            type="number"
            className="mt-1 w-full rounded-lg border border-border px-3 py-2"
            value={form.compareAt}
            onChange={(e) => setForm({ ...form, compareAt: e.target.value })}
          />
        </label>
        {offeringProfile !== "SERVICE" ? (
        <label className="block text-sm">
          <span className="font-medium">Mô hình hệ thống (ops)</span>
          <select
            className="mt-1 w-full rounded-lg border border-border px-3 py-2"
            value={form.licenseModel}
            onChange={(e) =>
              setForm({
                ...form,
                licenseModel: e.target.value as typeof form.licenseModel,
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
        ) : null}
        <label className="block text-sm">
          <span className="font-medium">Fulfillment</span>
          <select
            className="mt-1 w-full rounded-lg border border-border px-3 py-2"
            value={form.fulfillmentStrategy}
            disabled={offeringProfile === "SERVICE"}
            onChange={(e) =>
              setForm({
                ...form,
                fulfillmentStrategy: e.target.value as typeof form.fulfillmentStrategy,
              })
            }
          >
            {fulfillmentChoices.map((k) => (
              <option key={k} value={k}>
                {FULFILLMENT_ADMIN_LABELS[k]}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-medium">Loại nhận</span>
          <select
            className="mt-1 w-full rounded-lg border border-border px-3 py-2"
            value={form.deliverableType}
            disabled={offeringProfile === "SERVICE"}
            onChange={(e) =>
              setForm({
                ...form,
                deliverableType: e.target.value as typeof form.deliverableType,
              })
            }
          >
            {deliverableChoices.map((k) => (
              <option key={k} value={k}>
                {DELIVERABLE_ADMIN_LABELS[k]}
              </option>
            ))}
          </select>
        </label>
        {offeringProfile === "SERVICE" ? null : (
        <label className="block text-sm sm:col-span-2">
          <span className="font-medium">Supplier</span>
          <select
            className="mt-1 w-full rounded-lg border border-border px-3 py-2"
            value={form.supplierId}
            onChange={(e) => setForm({ ...form, supplierId: e.target.value })}
          >
            <option value="">—</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        )}
        <label className="block text-sm sm:col-span-2">
          <span className="font-medium">Hình thức bán</span>
          <select
            className="mt-1 w-full rounded-lg border border-border px-3 py-2"
            value={form.salesMotion}
            onChange={(e) =>
              setForm({
                ...form,
                salesMotion: e.target.value as typeof form.salesMotion,
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
      </div>
      {licenseMerchandising ? (
      <VariantLicenseFieldsPanel
        value={form.variantLicense}
        onChange={(variantLicense) => setForm({ ...form, variantLicense })}
      />
      ) : null}
      {offeringProfile === "INFRASTRUCTURE" ? (
        <>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium">Chu kỳ gói</span>
            <select
              className="mt-1 w-full rounded-lg border border-border px-3 py-2"
              value={form.variantLicense.licenseTerm}
              onChange={(e) =>
                setForm({
                  ...form,
                  variantLicense: {
                    ...form.variantLicense,
                    licenseTerm: e.target.value as LicenseTermCode | "",
                  },
                })
              }
            >
              <option value="">—</option>
              {LICENSE_TERMS.map((k) => (
                <option key={k} value={k}>
                  {LICENSE_TERM_LABELS[k]}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="font-medium">Khu vực</span>
            <select
              className="mt-1 w-full rounded-lg border border-border px-3 py-2"
              value={form.variantLicense.regionCode}
              onChange={(e) =>
                setForm({
                  ...form,
                  variantLicense: {
                    ...form.variantLicense,
                    regionCode: e.target.value as LicenseRegion | "",
                  },
                })
              }
            >
              <option value="">—</option>
              {LICENSE_REGIONS.map((k) => (
                <option key={k} value={k}>
                  {LICENSE_REGION_LABELS[k]}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="block text-sm">
          <span className="font-medium">Cấu hình gói này</span>
          <p className="mt-0.5 text-xs text-muted">
            Mỗi dòng `Nhãn|Giá trị`. Hiện trên bảng chọn gói.
          </p>
          <div className="mt-1 flex flex-wrap gap-1">
            {(
              [
                ["cloud", "Cloud"],
                ["hosting", "Hosting"],
                ["backup", "Backup"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                className="rounded-md border border-border px-2 py-0.5 text-xs font-medium text-navy"
                onClick={() =>
                  setForm({ ...form, planSpecsText: INFRA_SPEC_TEMPLATES[key] })
                }
              >
                {label}
              </button>
            ))}
          </div>
          <textarea
            rows={6}
            className="mt-1 w-full rounded-lg border border-border px-3 py-2 font-mono text-xs"
            value={form.planSpecsText}
            onChange={(e) => setForm({ ...form, planSpecsText: e.target.value })}
          />
        </label>
        </>
      ) : null}
      {msg ? (
        <pre className="whitespace-pre-wrap text-sm text-danger">{msg}</pre>
      ) : null}
      <button
        type="button"
        disabled={loading}
        onClick={submit}
        className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
      >
        {loading ? "Đang tạo…" : "Tạo gói"}
      </button>
    </div>
  );
}
