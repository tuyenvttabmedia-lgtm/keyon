"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  formatIssues,
  validateCatalogDraft,
} from "@/storefront/lib/catalog-validation";
import {
  DELIVERABLE_ADMIN_LABELS,
  DELIVERABLE_OPTIONS,
  FULFILLMENT_ADMIN_LABELS,
  FULFILLMENT_OPTIONS,
} from "@/storefront/lib/catalog-admin-labels";

type SupplierOpt = { id: string; name: string };

type Props = {
  productId: string;
  suppliers: SupplierOpt[];
};

export function AddVariantForm({ productId, suppliers }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    sku: "",
    priceVnd: 499000,
    compareAt: "",
    costVnd: 0,
    licenseModel: "PERPETUAL" as const,
    fulfillmentStrategy: "MANUAL" as const,
    deliverableType: "KEY" as const,
    salesMotion: "SELF_SERVE" as const,
    slaPromise: "",
    supplierId: "",
    lowStockThreshold: 10,
    active: true,
  });

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
            placeholder="Home · Pro · OEM…"
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
        <label className="block text-sm">
          <span className="font-medium">Fulfillment</span>
          <select
            className="mt-1 w-full rounded-lg border border-border px-3 py-2"
            value={form.fulfillmentStrategy}
            onChange={(e) =>
              setForm({
                ...form,
                fulfillmentStrategy: e.target.value as typeof form.fulfillmentStrategy,
              })
            }
          >
            {FULFILLMENT_OPTIONS.map((k) => (
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
            onChange={(e) =>
              setForm({
                ...form,
                deliverableType: e.target.value as typeof form.deliverableType,
              })
            }
          >
            {DELIVERABLE_OPTIONS.map((k) => (
              <option key={k} value={k}>
                {DELIVERABLE_ADMIN_LABELS[k]}
              </option>
            ))}
          </select>
        </label>
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
      </div>
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
