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
        Ratings CMS (không phải review khách).{" "}
        <code className="text-xs">productKey</code> = id sản phẩm catalog hoặc
        featured id. Tab Đánh giá trên PDP chỉ hiện khi reviewCount &gt; 0.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[32rem] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted">
              <th className="py-2 pr-2 font-medium">productKey</th>
              <th className="py-2 pr-2 font-medium">ratingAvg</th>
              <th className="py-2 pr-2 font-medium">reviewCount</th>
              <th className="py-2 font-medium" />
            </tr>
          </thead>
          <tbody>
            {items.map((row, i) => (
              <tr key={i} className="border-b border-border/60">
                <td className="py-2 pr-2">
                  <input
                    className="w-full rounded-lg border border-border px-2 py-1.5 font-mono text-xs"
                    value={row.productKey}
                    onChange={(e) => update(i, { productKey: e.target.value })}
                    placeholder="product-id"
                  />
                </td>
                <td className="py-2 pr-2">
                  <input
                    type="number"
                    min={0}
                    max={5}
                    step={0.1}
                    className="w-24 rounded-lg border border-border px-2 py-1.5"
                    value={row.ratingAvg}
                    onChange={(e) =>
                      update(i, { ratingAvg: Number(e.target.value) })
                    }
                  />
                </td>
                <td className="py-2 pr-2">
                  <input
                    type="number"
                    min={0}
                    step={1}
                    className="w-24 rounded-lg border border-border px-2 py-1.5"
                    value={row.reviewCount}
                    onChange={(e) =>
                      update(i, { reviewCount: Number(e.target.value) })
                    }
                  />
                </td>
                <td className="py-2">
                  <button
                    type="button"
                    onClick={() => removeRow(i)}
                    className="text-xs text-danger"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={addRow}
          className="rounded-lg border border-border px-4 py-2 text-sm"
        >
          Thêm dòng
        </button>
        <button
          type="button"
          onClick={() => void save()}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Lưu
        </button>
        {msg ? <span className="self-center text-sm text-muted">{msg}</span> : null}
      </div>
    </div>
  );
}
