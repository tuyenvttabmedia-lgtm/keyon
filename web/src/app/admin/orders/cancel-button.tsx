"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CancelOrderButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function cancel() {
    if (!confirm("Hủy đơn chờ thanh toán? Reserve license (nếu có) sẽ được giải phóng.")) {
      return;
    }
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/admin/orders/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Hủy thất bại");
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <span className="inline-flex flex-col items-end gap-0.5">
      <button
        type="button"
        disabled={loading}
        onClick={cancel}
        className="rounded-lg border border-danger px-2 py-1 text-xs font-medium text-danger disabled:opacity-50"
      >
        {loading ? "…" : "Hủy"}
      </button>
      {err && <span className="max-w-[140px] text-right text-[10px] text-danger">{err}</span>}
    </span>
  );
}
