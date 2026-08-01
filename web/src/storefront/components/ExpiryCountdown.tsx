"use client";

import { useEffect, useState } from "react";

function msLeft(iso: string) {
  return new Date(iso).getTime() - Date.now();
}

function formatMmSs(left: number) {
  const m = Math.floor(left / 60000);
  const s = Math.floor((left % 60000) / 1000);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function ExpiryCountdown({
  expiresAt,
  variant = "full",
}: {
  expiresAt: string;
  /** compact = MM:SS only (confirm page timer) */
  variant?: "full" | "compact";
}) {
  const [left, setLeft] = useState(() => msLeft(expiresAt));

  useEffect(() => {
    const t = setInterval(() => setLeft(msLeft(expiresAt)), 1000);
    return () => clearInterval(t);
  }, [expiresAt]);

  if (left <= 0) {
    return (
      <span
        className={
          variant === "compact"
            ? "font-bold tabular-nums text-danger"
            : "font-medium text-danger"
        }
      >
        {variant === "compact" ? "00:00" : "Đã hết hạn"}
      </span>
    );
  }

  if (variant === "compact") {
    return (
      <span className="font-bold tabular-nums text-danger">{formatMmSs(left)}</span>
    );
  }

  return (
    <span className="font-medium text-amber-700">
      Đơn hàng sẽ hết hạn sau {formatMmSs(left)}
    </span>
  );
}
