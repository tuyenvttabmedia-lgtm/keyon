"use client";

import { useState } from "react";

export function LicenseRevealButton({ id }: { id: string }) {
  const [plain, setPlain] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (plain) {
      setPlain(null);
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/stock/items/${id}/reveal`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Reveal thất bại");
      setPlain(data.plain as string);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="text-right">
      <button
        type="button"
        disabled={busy}
        onClick={toggle}
        className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-navy hover:bg-navy-soft disabled:opacity-40"
      >
        {plain ? "Ẩn key" : "Hiện đầy đủ"}
      </button>
      {plain ? (
        <p className="mt-2 break-all font-mono text-sm text-navy">{plain}</p>
      ) : null}
    </div>
  );
}
