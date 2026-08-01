"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  csvToKeysText,
  type StockPreviewCounts,
  type StockPreviewLine,
} from "@/lib/stock-import-preview";

export type ImportVariantOpt = {
  id: string;
  sku: string;
  productId: string;
  productName: string;
  variantName: string;
  brandName: string;
  supplierName: string | null;
  deliverableLabel: string;
};

function resolveInitialSelection(
  variants: ImportVariantOpt[],
  initialProductId?: string,
  initialVariantId?: string,
): { productId: string; variantId: string } {
  if (initialVariantId) {
    const byVariant = variants.find((v) => v.id === initialVariantId);
    if (byVariant) {
      return { productId: byVariant.productId, variantId: byVariant.id };
    }
  }
  if (initialProductId) {
    const first = variants.find((v) => v.productId === initialProductId);
    if (first) {
      return { productId: first.productId, variantId: first.id };
    }
  }
  const fallback = variants[0];
  return {
    productId: fallback?.productId ?? "",
    variantId: fallback?.id ?? "",
  };
}

export function ImportPanel({
  variants,
  initialProductId,
  initialVariantId,
}: {
  variants: ImportVariantOpt[];
  initialProductId?: string;
  initialVariantId?: string;
}) {
  const router = useRouter();
  const products = useMemo(() => {
    const map = new Map<string, { id: string; name: string; brandName: string }>();
    for (const v of variants) {
      if (!map.has(v.productId)) {
        map.set(v.productId, {
          id: v.productId,
          name: v.productName,
          brandName: v.brandName,
        });
      }
    }
    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name, "vi"),
    );
  }, [variants]);

  const initial = resolveInitialSelection(
    variants,
    initialProductId,
    initialVariantId,
  );
  const [productId, setProductId] = useState(initial.productId);
  const productVariants = useMemo(
    () => variants.filter((v) => v.productId === productId),
    [variants, productId],
  );
  const [variantId, setVariantId] = useState(initial.variantId);
  const selected = variants.find((v) => v.id === variantId) ?? null;

  useEffect(() => {
    const next = resolveInitialSelection(
      variants,
      initialProductId,
      initialVariantId,
    );
    setProductId(next.productId);
    setVariantId(next.variantId);
  }, [variants, initialProductId, initialVariantId]);

  const [keysText, setKeysText] = useState("");
  const [lines, setLines] = useState<StockPreviewLine[] | null>(null);
  const [counts, setCounts] = useState<StockPreviewCounts | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  function resetPreview() {
    setLines(null);
    setCounts(null);
  }

  function onProductChange(id: string) {
    setProductId(id);
    const first = variants.find((v) => v.productId === id);
    setVariantId(first?.id ?? "");
    resetPreview();
    setMsg(null);
  }

  async function onFile(file: File | null) {
    if (!file) return;
    const text = await file.text();
    const name = file.name.toLowerCase();
    const next = name.endsWith(".csv") ? csvToKeysText(text) : text;
    setKeysText(next);
    resetPreview();
    setMsg(null);
  }

  async function runPreview() {
    if (!selected || !keysText.trim()) return;
    setPreviewLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/stock/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId: selected.id, keysText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Preview thất bại");
      setLines(data.lines as StockPreviewLine[]);
      setCounts(data.counts as StockPreviewCounts);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Lỗi");
      resetPreview();
    } finally {
      setPreviewLoading(false);
    }
  }

  async function importKeys() {
    if (!selected || !counts || counts.ok === 0 || !lines) return;
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId: selected.id, keysText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Nhập kho thất bại");
      setKeysText("");
      resetPreview();
      setMsg(
        `Đã nhập ${data.added} · trùng file ${data.duplicate_file ?? 0} · trùng DB ${data.duplicate_db ?? 0} · invalid ${data.invalid ?? 0}`,
      );
      router.refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  if (variants.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted">
        Chưa có variant Instant đang bán — tạo gói Instant trong Catalog trước.
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
      <div>
        <h3 className="font-semibold text-navy">Nhập kho</h3>
        <p className="text-xs text-muted">
          Preview server · chặn trùng file + trùng DB trong SKU
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium">Product</span>
          <select
            className="mt-1 w-full rounded-lg border border-border px-3 py-2"
            value={productId}
            onChange={(e) => onProductChange(e.target.value)}
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.brandName} · {p.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-medium">Variant</span>
          <select
            className="mt-1 w-full rounded-lg border border-border px-3 py-2"
            value={variantId}
            onChange={(e) => {
              setVariantId(e.target.value);
              resetPreview();
            }}
          >
            {productVariants.map((v) => (
              <option key={v.id} value={v.id}>
                {v.sku} — {v.variantName}
              </option>
            ))}
          </select>
        </label>
      </div>

      {selected ? (
        <dl className="grid gap-2 rounded-xl border border-border bg-surface px-3 py-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs text-muted">Provider</dt>
            <dd className="font-medium">{selected.supplierName ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Delivery</dt>
            <dd className="font-medium">{selected.deliverableLabel}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">SKU</dt>
            <dd className="font-mono text-xs">{selected.sku}</dd>
          </div>
        </dl>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <label className="cursor-pointer rounded-lg border border-border px-3 py-2 text-xs font-semibold text-navy hover:bg-navy-soft">
          Upload TXT
          <input
            type="file"
            accept=".txt,text/plain"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0] ?? null)}
          />
        </label>
        <label className="cursor-pointer rounded-lg border border-border px-3 py-2 text-xs font-semibold text-navy hover:bg-navy-soft">
          Upload CSV
          <input
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0] ?? null)}
          />
        </label>
      </div>

      <label className="block text-sm">
        <span className="font-medium">Paste (mỗi dòng một key)</span>
        <textarea
          rows={6}
          className="mt-1 w-full rounded-lg border border-border px-3 py-2 font-mono text-sm"
          placeholder={"KEY-001\nKEY-002"}
          value={keysText}
          onChange={(e) => {
            setKeysText(e.target.value);
            resetPreview();
          }}
        />
      </label>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={previewLoading || !keysText.trim() || !variantId}
          onClick={runPreview}
          className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-navy disabled:opacity-40"
        >
          {previewLoading ? "Đang preview…" : "Preview Import"}
        </button>
        <button
          type="button"
          disabled={loading || !counts || counts.ok === 0 || !variantId}
          onClick={importKeys}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
        >
          {loading ? "Đang nhập…" : `Import ${counts?.ok ?? 0} key`}
        </button>
      </div>

      {lines && counts ? (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-emerald-800">
              Sẽ nhập: {counts.ok}
            </span>
            <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-amber-900">
              Trùng file: {counts.duplicate_file}
            </span>
            <span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-orange-900">
              Trùng DB: {counts.duplicate_db}
            </span>
            <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-red-700">
              Invalid: {counts.invalid}
            </span>
          </div>
          <div className="max-h-56 overflow-auto rounded-xl border border-border">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-[#f8fafc] text-muted">
                <tr>
                  <th className="px-2 py-1.5">#</th>
                  <th className="px-2 py-1.5">Key</th>
                  <th className="px-2 py-1.5">Status</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((p) => (
                  <tr key={`${p.line}-${p.raw}`} className="border-t border-border/60">
                    <td className="px-2 py-1 font-mono">{p.line}</td>
                    <td className="px-2 py-1 font-mono">{p.raw}</td>
                    <td className="px-2 py-1">
                      {p.status === "ok"
                        ? "OK"
                        : p.status === "duplicate_file"
                          ? `Trùng file · ${p.reason}`
                          : p.status === "duplicate_db"
                            ? `Trùng DB · ${p.reason}`
                            : `Invalid · ${p.reason}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {msg ? <p className="text-sm text-accent">{msg}</p> : null}
    </div>
  );
}
