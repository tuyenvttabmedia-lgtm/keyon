"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function UpdatePriceForm({
  variantId,
  priceVnd,
  costVnd,
}: {
  variantId: string;
  priceVnd: number;
  costVnd: number;
}) {
  const router = useRouter();
  const [price, setPrice] = useState(String(priceVnd));
  const [cost, setCost] = useState(String(costVnd));
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/admin/catalog/variant", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        variantId,
        priceVnd: Number(price),
        costVnd: Number(cost),
      }),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <form onSubmit={save} className="flex flex-col gap-1">
      <input
        className="w-28 rounded border border-border bg-background px-2 py-1 text-xs"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        title="Giá bán"
      />
      <input
        className="w-28 rounded border border-border bg-background px-2 py-1 text-xs text-muted"
        value={cost}
        onChange={(e) => setCost(e.target.value)}
        title="Giá vốn"
      />
      <button type="submit" disabled={saving} className="text-xs text-accent">
        {saving ? "…" : "Lưu"}
      </button>
    </form>
  );
}
