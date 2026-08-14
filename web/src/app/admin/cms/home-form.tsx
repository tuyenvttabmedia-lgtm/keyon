"use client";

import Link from "next/link";
import { useState } from "react";
import type { CmsHome } from "@/server/cms/types";

function Field({
  label,
  value,
  onChange,
  rows,
  hint,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  hint?: string;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-navy">{label}</span>
      {rows ? (
        <textarea
          rows={rows}
          className="mt-1 w-full rounded-lg border border-border px-3 py-2 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className="mt-1 w-full rounded-lg border border-border px-3 py-2 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </label>
  );
}

function SectionCard({
  step,
  title,
  source,
  editHref,
  editLabel,
  children,
}: {
  step: number;
  title: string;
  source: string;
  editHref?: string;
  editLabel?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border bg-surface/60 px-4 py-3 sm:px-5">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
            Section {step} · Home
          </p>
          <h2 className="text-sm font-semibold text-navy">{title}</h2>
          <p className="mt-0.5 text-xs text-muted">{source}</p>
        </div>
        {editHref ? (
          <Link
            href={editHref}
            className="shrink-0 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium text-accent hover:border-accent"
          >
            {editLabel ?? "Mở CMS liên quan →"}
          </Link>
        ) : null}
      </div>
      {children ? <div className="space-y-3 p-4 sm:p-5">{children}</div> : null}
    </section>
  );
}

/** Thứ tự khớp `HomeView` trên storefront. */
export function CmsHomeForm({ initial }: { initial: CmsHome }) {
  const [form, setForm] = useState(initial);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function save(publish: boolean) {
    setBusy(true);
    setMsg(null);
    try {
      const payload = { ...form, published: publish ? true : form.published };
      const res = await fetch("/api/admin/cms/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lỗi");
      setForm(payload);
      setMsg(publish ? "Đã lưu và xuất bản" : "Đã lưu nháp");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setBusy(false);
    }
  }

  function set<K extends keyof CmsHome>(key: K, value: CmsHome[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
        <div>
          <p className="text-sm font-semibold text-navy">
            Bản đồ section trang chủ
          </p>
          <p className="text-xs text-muted">
            Thứ tự giống frontend · để trống = giữ copy mặc định (fixture)
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-border px-3 py-2 text-sm"
          >
            Xem Home ↗
          </a>
          <button
            type="button"
            disabled={busy}
            onClick={() => void save(false)}
            className="rounded-lg border border-border px-3 py-2 text-sm font-medium disabled:opacity-50"
          >
            Lưu
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void save(true)}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {busy ? "Đang lưu…" : "Lưu & xuất bản"}
          </button>
        </div>
        {msg ? (
          <p className="w-full text-sm text-emerald-700 sm:w-auto">{msg}</p>
        ) : null}
      </div>

      <SectionCard
        step={1}
        title="Hero"
        source="Chỉnh tại đây · thống kê runtime (không CMS)"
      >
        <Field
          label="Tiêu đề"
          value={form.heroTitle}
          onChange={(v) => set("heroTitle", v)}
        />
        <Field
          label="Chữ accent (teal)"
          value={form.heroTitleAccent ?? ""}
          onChange={(v) => set("heroTitleAccent", v)}
          hint='Ví dụ: "toàn diện". Để trống = không hiện accent.'
        />
        <Field
          label="Phụ đề"
          value={form.heroSubtitle}
          onChange={(v) => set("heroSubtitle", v)}
          rows={3}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Nút CTA chính"
            value={form.heroCta}
            onChange={(v) => set("heroCta", v)}
          />
          <Field
            label="Link CTA"
            value={form.heroCtaHref}
            onChange={(v) => set("heroCtaHref", v)}
            placeholder="/products"
          />
        </div>
      </SectionCard>

      <SectionCard
        step={2}
        title="Đối tác / Trust"
        source="Logo thương hiệu hiển thị trên Home"
        editHref="/admin/cms/partners"
        editLabel="Sửa Đối tác →"
      />

      <SectionCard
        step={3}
        title="Danh mục sản phẩm"
        source="Ô danh mục + số lượng live từ catalog"
        editHref="/admin/cms/categories"
        editLabel="Sửa Danh mục →"
      />

      <SectionCard
        step={4}
        title="Giải pháp"
        source="Card lấy từ IA (SOLUTION_TOPICS) · chỉ ghi đè tiêu đề/phụ đề"
      >
        <Field
          label="Tiêu đề section"
          value={form.solutionsTitle ?? ""}
          onChange={(v) => set("solutionsTitle", v)}
          placeholder="Giải pháp"
        />
        <Field
          label="Phụ đề"
          value={form.solutionsSubtitle ?? ""}
          onChange={(v) => set("solutionsSubtitle", v)}
          rows={2}
        />
      </SectionCard>

      <SectionCard
        step={5}
        title="Sản phẩm nổi bật"
        source="Danh sách = catalog + ratings · tiêu đề đang từ fixture"
        editHref="/admin/cms/ratings"
        editLabel="Sửa Ratings →"
      />

      <SectionCard
        step={6}
        title="Cách KEYON hoạt động"
        source="Các bước (steps) từ fixture · chỉ ghi đè tiêu đề/phụ đề"
      >
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
      </SectionCard>

      <SectionCard
        step={7}
        title="Vì sao chọn KEYON"
        source="Nội dung cards từ fixture · ảnh cạnh phải = Banner Why"
        editHref="/admin/cms/banner"
        editLabel="Sửa Banner Why →"
      >
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
      </SectionCard>

      <SectionCard
        step={8}
        title="Tin tức / Bài viết"
        source="Lấy bài đã xuất bản · tối đa vài card trên Home"
        editHref="/admin/blog"
        editLabel="Quản lý bài viết →"
      />

      <SectionCard
        step={9}
        title="FAQ trên Home"
        source="Chỉ hiện câu hỏi bật “Hiện trên Home”"
        editHref="/admin/cms/faq"
        editLabel="Sửa FAQ →"
      />

      <SectionCard
        step={10}
        title="CTA banner cuối trang"
        source="Khối kêu gọi hành động trước footer"
      >
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
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Nút CTA"
            value={form.ctaLabel ?? ""}
            onChange={(v) => set("ctaLabel", v)}
          />
          <Field
            label="Link"
            value={form.ctaHref ?? ""}
            onChange={(v) => set("ctaHref", v)}
            placeholder="/contact/quote"
          />
        </div>
      </SectionCard>

      <SectionCard
        step={11}
        title="Footer + Legal (BCT)"
        source="Cột menu · copyright · thanh chính sách dưới footer"
        editHref="/admin/cms/footer"
        editLabel="Sửa Footer →"
      />

      <p className="rounded-xl border border-border bg-surface px-4 py-3 text-xs text-muted">
        Header / menu site:{" "}
        <Link href="/admin/cms/nav" className="font-medium text-accent hover:underline">
          Điều hướng
        </Link>
        {" · "}
        Chính sách đầy đủ:{" "}
        <Link href="/admin/cms/policy" className="font-medium text-accent hover:underline">
          Hub Chính sách
        </Link>
        {" / "}
        <Link href="/admin/cms/pages" className="font-medium text-accent hover:underline">
          Trang tĩnh
        </Link>
      </p>
    </div>
  );
}
