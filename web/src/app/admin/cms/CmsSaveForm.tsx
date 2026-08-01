"use client";

import { useState } from "react";

type Props<T> = {
  initial: T;
  apiKey: string;
  children: (form: T, setForm: (v: T) => void) => React.ReactNode;
};

export function CmsSaveForm<T>({ initial, apiKey, children }: Props<T>) {
  const [form, setForm] = useState(initial);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function save() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/cms/${apiKey}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lỗi");
      setMsg("Đã lưu");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {children(form, setForm)}
      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={loading}
          onClick={save}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Đang lưu…" : "Lưu và xuất bản"}
        </button>
        {msg && <span className="text-sm text-muted">{msg}</span>}
      </div>
    </div>
  );
}
