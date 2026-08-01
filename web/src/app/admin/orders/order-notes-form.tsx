"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function OrderNotesForm({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/admin/orders/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, body: body.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Không lưu được ghi chú");
      setBody("");
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <textarea
        rows={3}
        className="w-full rounded-lg border border-border px-3 py-2 text-sm"
        placeholder="Ghi chú nội bộ (chỉ nhân viên thấy)…"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        maxLength={2000}
      />
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={busy || !body.trim()}
          className="rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {busy ? "Đang lưu…" : "Thêm ghi chú"}
        </button>
        {err ? <p className="text-xs text-danger">{err}</p> : null}
      </div>
    </form>
  );
}
