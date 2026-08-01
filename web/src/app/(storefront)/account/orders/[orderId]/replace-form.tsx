"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  CTA_COMPACT_CLASS,
  FORM_LABEL_CLASS,
  FORM_SUCCESS_CLASS,
  INPUT_TEXT_CLASS,
} from "@/storefront/typography";

export function ReplaceDeliveryForm({ deliveryId }: { deliveryId: string }) {
  const router = useRouter();
  const [payload, setPayload] = useState("");
  const [reason, setReason] = useState("warranty_replace");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const res = await fetch("/api/admin/deliveries/replace", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deliveryId, plainPayload: payload, reason }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setMsg(data.error ?? "Lỗi");
      return;
    }
    setPayload("");
    setMsg("Đã replace — khách nhận email (Mailpit)");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="mt-3 space-y-2 border-t border-border pt-3">
      <p className={FORM_LABEL_CLASS}>Replace delivery (staff)</p>
      <input
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className={`w-full rounded border border-border bg-background px-2 py-1 ${INPUT_TEXT_CLASS}`}
        placeholder="Lý do"
      />
      <textarea
        value={payload}
        onChange={(e) => setPayload(e.target.value)}
        required
        rows={3}
        className={`w-full rounded border border-border bg-background px-2 py-1 font-mono ${INPUT_TEXT_CLASS}`}
        placeholder="Key/account mới"
      />
      {msg && <p className={FORM_SUCCESS_CLASS}>{msg}</p>}
      <button
        type="submit"
        disabled={loading}
        className={`rounded-lg bg-accent px-3 py-1.5 ${CTA_COMPACT_CLASS} text-white`}
      >
        Replace
      </button>
    </form>
  );
}
