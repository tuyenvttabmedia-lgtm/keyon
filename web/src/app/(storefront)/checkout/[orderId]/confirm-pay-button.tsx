"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CARD_META_CLASS, CTA_LABEL_CLASS } from "@/storefront/typography";
import { CTA_PRIMARY_EFFECT, OPACITY_DISABLED } from "@/storefront/effects";

export function ConfirmPayButton({
  paymentReference,
  orderId,
  label = "Tôi đã chuyển khoản",
  hint = "Dev/stub: bấm để giả lập webhook thanh toán thành công.",
}: {
  paymentReference: string;
  orderId: string;
  label?: string;
  hint?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirm() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/payments/stub-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentReference }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Confirm failed");
      router.push(`/checkout/${orderId}/success`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      {error && <p className="text-sm text-danger">{error}</p>}
      <button
        type="button"
        disabled={loading}
        onClick={confirm}
        className={`inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-navy px-5 ${CTA_LABEL_CLASS} text-white ${CTA_PRIMARY_EFFECT} disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-navy disabled:hover:shadow-none`}
      >
        <LockIcon />
        {loading ? "Đang xử lý…" : label}
      </button>
      <p className={`text-center ${CARD_META_CLASS}`}>{hint}</p>
    </div>
  );
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 11V8a5 5 0 0 1 10 0v3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
