"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CloneProductButton({ variantId }: { variantId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function clone() {
    if (!window.confirm("Nhân bản toàn bộ sản phẩm (mọi gói) thành bản nháp mới?")) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/catalog/product/clone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Clone failed");
      router.push(`/admin/products/${data.variantId}`);
      router.refresh();
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "Lỗi clone");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={clone}
      className="inline-flex h-10 items-center rounded-xl border border-border px-4 text-sm font-semibold text-navy hover:border-accent hover:text-accent disabled:opacity-50"
    >
      {loading ? "Đang clone…" : "Nhân bản sản phẩm"}
    </button>
  );
}
