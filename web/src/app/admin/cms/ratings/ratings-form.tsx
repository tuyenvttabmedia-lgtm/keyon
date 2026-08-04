"use client";

import { useState } from "react";
import type { CmsProductRating, CmsProductRatings } from "@/server/cms/types";

export function ProductRatingsForm({ initial }: { initial: CmsProductRatings }) {
  const [items, setItems] = useState<CmsProductRating[]>(
    initial.items?.length ? initial.items : [],
  );
  const [msg, setMsg] = useState<string | null>(null);

  function update(i: number, patch: Partial<CmsProductRating>) {
    setItems((prev) =>
      prev.map((row, idx) => (idx === i ? { ...row, ...patch } : row)),
    );
  }

  function addRow() {
    setItems((prev) => [
      ...prev,
      { productKey: "", ratingAvg: 4.5, reviewCount: 0 },
    ]);
  }

  function removeRow(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function save() {
    setMsg(null);
    const cleaned = items
      .map((r) => ({
        productKey: r.productKey.trim(),
        ratingAvg: Number(r.ratingAvg),
        reviewCount: Math.max(0, Math.floor(Number(r.reviewCount) || 0)),
      }))
      .filter((r) => r.productKey.length > 0);

    const res = await fetch("/api/admin/cms/product-ratings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cleaned }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.error ?? "Lỗi");
      return;
    }
    setItems(cleaned);
    setMsg(`Đã lưu ${cleaned.length} dòng`);
  }

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
      <p className="text-sm text-muted">
        <code className="rounded bg-surface px-1 text-xs">productKey</code> =
        id sản phẩm catalog hoặc featured id. Tab Đánh giá trên PDP chỉ hiện khi{" "}
        <code className="rounded bg-surface px-1 text-xs">reviewCount</code>{" "}
        &gt; 0.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[32rem] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
              <th className="py-2.5 pr-3 font-semibold">productKey</th>
              <th className="py-2.5 pr-3 font-semibold">ratingAvg</th>
              <th className="py-2.5 pr-3 font-semibold">reviewCount</th>
              <th className="py-2.5 font-semibold" />
            </tr>
          </thead>
          <tbody>
            {items.map((row, i) => (
              <tr key={i} className="border-b border-border/60">
                <td className="py-2.5 pr-3">
                  <input
                    className="h-9 w-full rounded-lg border border-border bg-white px-2.5 font-mono text-xs text-navy outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                    value={row.productKey}
                    onChange={(e) => update(i, { productKey: e.target.value })}
                    placeholder="product-id"
                  />
                </td>
                <td className="py-2.5 pr-3">
                  <input
                    type="number"
                    min={0}
                    max={5}
                    step={0.1}
                    className="h-9 w-24 rounded-lg border border-border bg-white px-2.5 text-sm text-navy outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                    value={row.ratingAvg}
                    onChange={(e) =>
                      update(i, { ratingAvg: Number(e.target.value) })
                    }
                  />
                </td>
                <td className="py-2.5 pr-3">
                  <input
                    type="number"
                    min={0}
                    step={1}
                    className="h-9 w-24 rounded-lg border border-border bg-white px-2.5 text-sm text-navy outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                    value={row.reviewCount}
                    onChange={(e) =>
                      update(i, { reviewCount: Number(e.target.value) })
                    }
                  />
                </td>
                <td className="py-2.5">
                  <button
                    type="button"
                    onClick={() => removeRow(i)}
                    className="text-xs font-medium text-danger hover:underline"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-surface/60 px-4 py-8 text-center text-sm text-muted">
          Chưa có dòng rating — nhấn Thêm dòng để bắt đầu.
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
        <button
          type="button"
          onClick={addRow}
          className="inline-flex h-9 items-center rounded-lg border border-border bg-white px-4 text-sm font-medium text-navy transition hover:border-accent hover:bg-accent-soft hover:text-accent"
        >
          Thêm dòng
        </button>
        <button
          type="button"
          onClick={() => void save()}
          className="inline-flex h-9 items-center rounded-lg bg-accent px-4 text-sm font-semibold text-white transition hover:bg-accent-hover"
        >
          Lưu
        </button>
        {msg ? <span className="text-sm text-muted">{msg}</span> : null}
      </div>
    </div>
  );
}
