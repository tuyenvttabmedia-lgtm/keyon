"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function BuyButton({
  variantId,
  defaultEmail,
  loggedIn,
}: {
  variantId: string;
  defaultEmail: string;
  loggedIn: boolean;
}) {
  const router = useRouter();
  const [email, setEmail] = useState(defaultEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onBuy() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");
      router.push(`/checkout/${data.orderId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 space-y-3">
      {!loggedIn && (
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email nhận license"
          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        />
      )}
      {error && <p className="text-sm text-danger">{error}</p>}
      <button
        type="button"
        disabled={loading || !email}
        onClick={onBuy}
        className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
      >
        {loading ? "Đang tạo đơn…" : "Mua ngay"}
      </button>
    </div>
  );
}
