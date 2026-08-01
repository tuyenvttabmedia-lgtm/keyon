"use client";

import { useState } from "react";
import type { CmsHome } from "@/server/cms/types";

export function CmsHomeForm({ initial }: { initial: CmsHome }) {
  const [form, setForm] = useState(initial);
  const [msg, setMsg] = useState<string | null>(null);

  async function save(publish: boolean) {
    setMsg(null);
    const payload = { ...form, published: publish ? true : form.published };
    const res = await fetch("/api/admin/cms/home", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.error ?? "Lỗi");
      return;
    }
    setForm(payload);
    setMsg(publish ? "Đã lưu và xuất bản" : "Đã lưu");
  }

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
      <label className="block text-sm">
        <span className="font-medium">Tiêu đề Hero</span>
        <input
          className="mt-1 w-full rounded-lg border border-border px-3 py-2"
          value={form.heroTitle}
          onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
        />
      </label>
      <label className="block text-sm">
        <span className="font-medium">Phụ đề</span>
        <textarea
          rows={3}
          className="mt-1 w-full rounded-lg border border-border px-3 py-2"
          value={form.heroSubtitle}
          onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium">Nút CTA</span>
          <input
            className="mt-1 w-full rounded-lg border border-border px-3 py-2"
            value={form.heroCta}
            onChange={(e) => setForm({ ...form, heroCta: e.target.value })}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Liên kết</span>
          <input
            className="mt-1 w-full rounded-lg border border-border px-3 py-2"
            value={form.heroCtaHref}
            onChange={(e) => setForm({ ...form, heroCtaHref: e.target.value })}
          />
        </label>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => save(false)}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium"
        >
          Lưu
        </button>
        <button
          type="button"
          onClick={() => save(true)}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Lưu và xuất bản
        </button>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-border px-4 py-2 text-sm"
        >
          Xem trang
        </a>
        {msg && <span className="self-center text-sm text-muted">{msg}</span>}
      </div>
    </div>
  );
}
