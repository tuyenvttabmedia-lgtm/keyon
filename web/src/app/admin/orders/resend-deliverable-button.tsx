"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ResendDeliverableButton({
  deliveryId,
}: {
  deliveryId: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function run() {
    if (!confirm("Gửi lại deliverable + email cho khách?")) return;
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/deliveries/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deliveryId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Resend thất bại");
      setMsg(`Đã gửi lại (#${data.resendCount})`);
      router.refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        disabled={busy}
        onClick={run}
        className="rounded-md border border-border px-2 py-1 text-xs font-medium text-navy hover:bg-navy-soft disabled:opacity-50"
      >
        {busy ? "Đang gửi…" : "Gửi lại Deliverable"}
      </button>
      {msg ? <span className="text-xs text-muted">{msg}</span> : null}
    </div>
  );
}
