"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function MonitoringRefresh() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [at, setAt] = useState<string | null>(null);

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        start(() => {
          router.refresh();
          setAt(new Date().toLocaleTimeString("vi-VN"));
        })
      }
      className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-navy hover:bg-navy-soft disabled:opacity-50"
    >
      {pending ? "Đang tải…" : at ? `Làm mới · ${at}` : "Làm mới"}
    </button>
  );
}
