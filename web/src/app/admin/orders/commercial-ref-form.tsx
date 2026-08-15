"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CommercialRefForm({
  orderId,
  poNumber,
  contractRef,
}: {
  orderId: string;
  poNumber: string;
  contractRef: string;
}) {
  const router = useRouter();
  const [po, setPo] = useState(poNumber);
  const [contract, setContract] = useState(contractRef);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/admin/orders/commercial-ref", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          poNumber: po.trim(),
          contractRef: contract.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Không lưu được HĐ/PO");
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <p className="text-xs text-muted">
        Tham chiếu trên đơn này — không thay thế Order, không phải cổng ký hợp
        đồng. Lưu thành ghi chú nội bộ.
      </p>
      <label className="block text-xs">
        <span className="font-medium text-navy">Số PO</span>
        <input
          className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
          value={po}
          onChange={(e) => setPo(e.target.value)}
          maxLength={80}
          placeholder="VD. PO-2026-014"
        />
      </label>
      <label className="block text-xs">
        <span className="font-medium text-navy">Số HĐ / contract</span>
        <input
          className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
          value={contract}
          onChange={(e) => setContract(e.target.value)}
          maxLength={80}
          placeholder="VD. HD-KEYON-88"
        />
      </label>
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={busy || (!po.trim() && !contract.trim())}
          className="rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {busy ? "Đang lưu…" : "Lưu HĐ / PO"}
        </button>
        {err ? <p className="text-xs text-danger">{err}</p> : null}
      </div>
    </form>
  );
}
