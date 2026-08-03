"use client";

import { useState } from "react";
import type { CmsHome } from "@/server/cms/types";

function Field({
  label,
  value,
  onChange,
  rows,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium">{label}</span>
      {rows ? (
        <textarea
          rows={rows}
          className="mt-1 w-full rounded-lg border border-border px-3 py-2"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className="mt-1 w-full rounded-lg border border-border px-3 py-2"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

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

  function set<K extends keyof CmsHome>(key: K, value: CmsHome[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="space-y-6 rounded-2xl border border-border bg-card p-6">
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-navy">Hero</h2>
        <Field
          label="Tiêu đề Hero"
          value={form.heroTitle}
          onChange={(v) => set("heroTitle", v)}
        />
        <Field
          label="Phụ đề"
          value={form.heroSubtitle}
          onChange={(v) => set("heroSubtitle", v)}
          rows={3}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Nút CTA"
            value={form.heroCta}
            onChange={(v) => set("heroCta", v)}
          />
          <Field
            label="Liên kết"
            value={form.heroCtaHref}
            onChange={(v) => set("heroCtaHref", v)}
          />
        </div>
      </section>

      <section className="space-y-4 border-t border-border pt-4">
        <h2 className="text-sm font-semibold text-navy">Why KEYON</h2>
        <p className="text-xs text-muted">
          Để trống = giữ copy mặc định từ fixture. Chỉ ghi đè tiêu đề/phụ đề.
        </p>
        <Field
          label="Tiêu đề"
          value={form.whyTitle ?? ""}
          onChange={(v) => set("whyTitle", v)}
        />
        <Field
          label="Phụ đề"
          value={form.whySubtitle ?? ""}
          onChange={(v) => set("whySubtitle", v)}
          rows={2}
        />
      </section>

      <section className="space-y-4 border-t border-border pt-4">
        <h2 className="text-sm font-semibold text-navy">How it works</h2>
        <Field
          label="Tiêu đề"
          value={form.howTitle ?? ""}
          onChange={(v) => set("howTitle", v)}
        />
        <Field
          label="Phụ đề"
          value={form.howSubtitle ?? ""}
          onChange={(v) => set("howSubtitle", v)}
          rows={2}
        />
      </section>

      <section className="space-y-4 border-t border-border pt-4">
        <h2 className="text-sm font-semibold text-navy">Solutions</h2>
        <Field
          label="Tiêu đề"
          value={form.solutionsTitle ?? ""}
          onChange={(v) => set("solutionsTitle", v)}
        />
        <Field
          label="Phụ đề"
          value={form.solutionsSubtitle ?? ""}
          onChange={(v) => set("solutionsSubtitle", v)}
          rows={2}
        />
      </section>

      <section className="space-y-4 border-t border-border pt-4">
        <h2 className="text-sm font-semibold text-navy">CTA banner</h2>
        <Field
          label="Tiêu đề"
          value={form.ctaTitle ?? ""}
          onChange={(v) => set("ctaTitle", v)}
        />
        <Field
          label="Phụ đề"
          value={form.ctaSubtitle ?? ""}
          onChange={(v) => set("ctaSubtitle", v)}
          rows={2}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Nút CTA"
            value={form.ctaLabel ?? ""}
            onChange={(v) => set("ctaLabel", v)}
          />
          <Field
            label="Liên kết"
            value={form.ctaHref ?? ""}
            onChange={(v) => set("ctaHref", v)}
          />
        </div>
      </section>

      <div className="flex flex-wrap gap-3 border-t border-border pt-4">
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
