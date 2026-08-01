"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  BODY_MUTED_CLASS,
  CTA_COMPACT_CLASS,
  FORM_ERROR_CLASS,
} from "@/storefront/typography";

export function ResendButton({ deliveryId }: { deliveryId: string }) {
  const router = useRouter();
  const [msg, setMsg] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function resend() {
    setMsg(null);
    setOk(false);
    const res = await fetch("/api/deliveries/resend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deliveryId }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.error ?? "Lỗi");
      return;
    }
    setOk(true);
    setMsg(`Đã resend #${data.resendCount} — kiểm tra Mailpit`);
    router.refresh();
  }

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={resend}
        className={`rounded-lg border border-accent px-3 py-1.5 ${CTA_COMPACT_CLASS} text-accent`}
      >
        Resend
      </button>
      {msg && (
        <p className={ok ? BODY_MUTED_CLASS : FORM_ERROR_CLASS}>{msg}</p>
      )}
    </div>
  );
}
