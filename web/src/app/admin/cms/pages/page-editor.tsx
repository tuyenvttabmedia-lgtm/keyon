"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { CmsStaticPage } from "@/server/cms/types";
import { legacyBodyToHtml } from "@/server/cms/blog-utils";
import { sanitizeBlogHtml } from "@/lib/sanitize-blog-html";
import { RichTextEditor } from "@/app/admin/blog/rich-text-editor";
import {
  ADMIN_PAGE_TITLE_CLASS,
  FORM_LABEL_CLASS,
  INPUT_TEXT_CLASS,
} from "@/storefront/typography";

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function StaticPageEditor({
  initial,
  allPages,
  isNew,
}: {
  initial: CmsStaticPage;
  allPages: CmsStaticPage[];
  isNew: boolean;
}) {
  const router = useRouter();
  const seeded = useMemo(
    () => ({
      ...initial,
      body: legacyBodyToHtml(initial.body),
    }),
    [initial],
  );
  const [form, setForm] = useState(seeded);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [slugLocked, setSlugLocked] = useState(!isNew);

  const publicPath =
    form.collection === "policy"
      ? `/policy/${form.slug || "…"}`
      : `/pages/${form.slug || "…"}`;

  async function persist(next: CmsStaticPage[], toast: string) {
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/cms/pages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lưu thất bại");
      setMsg(toast);
      router.refresh();
      if (isNew) {
        router.replace(`/admin/cms/pages/${form.id}`);
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setBusy(false);
    }
  }

  async function save(status: CmsStaticPage["status"]) {
    const title = form.title.trim();
    const slug = form.slug.trim();
    if (!title) {
      setErr("Nhập tiêu đề trang");
      return;
    }
    if (!slug) {
      setErr("Nhập slug");
      return;
    }
    const now = new Date().toISOString();
    const nextPage: CmsStaticPage = {
      ...form,
      title,
      slug,
      description: form.description.trim(),
      body: sanitizeBlogHtml(form.body),
      status,
      updatedAt: now,
      publishedAt:
        status === "published"
          ? form.publishedAt ?? now
          : form.publishedAt,
      metaTitle: form.metaTitle?.trim() || title,
      metaDescription:
        form.metaDescription?.trim() || form.description.trim(),
    };
    const others = allPages.filter((p) => p.id !== nextPage.id);
    setForm(nextPage);
    await persist(
      [...others, nextPage],
      status === "published" ? "Đã xuất bản" : "Đã lưu nháp",
    );
  }

  async function remove() {
    if (!confirm(`Xóa trang “${form.title || form.slug}”?`)) return;
    const others = allPages.filter((p) => p.id !== form.id);
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/admin/cms/pages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(others),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Xóa thất bại");
      router.push("/admin/cms/pages");
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Lỗi");
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="space-y-4 rounded-2xl border border-border bg-card p-5 sm:p-6">
        <input
          className={`w-full border-0 border-b border-border bg-transparent pb-2 outline-none ${ADMIN_PAGE_TITLE_CLASS}`}
          value={form.title}
          onChange={(e) => {
            const title = e.target.value;
            setForm((prev) => ({
              ...prev,
              title,
              slug: slugLocked ? prev.slug : slugify(title) || prev.slug,
            }));
          }}
          placeholder="Tiêu đề trang"
        />
        <label className="block">
          <span className={FORM_LABEL_CLASS}>Mô tả ngắn (hero / SEO)</span>
          <textarea
            rows={2}
            className={`mt-1 w-full rounded-lg border border-border px-3 py-2 ${INPUT_TEXT_CLASS}`}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Một–hai câu mô tả trang"
          />
        </label>
        <div>
          <p className={`${FORM_LABEL_CLASS} mb-2`}>Nội dung</p>
          <RichTextEditor
            value={form.body}
            onChange={(html) => setForm((prev) => ({ ...prev, body: html }))}
          />
        </div>
      </div>

      <aside className="space-y-4">
        <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
          <p className="font-semibold text-navy">Xuất bản</p>
          <p className="text-xs text-muted">
            URL công khai:{" "}
            <Link
              href={publicPath}
              className="font-mono text-accent hover:underline"
              target="_blank"
            >
              {publicPath}
            </Link>
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => save("draft")}
              className="flex-1 rounded-lg border border-border py-2 text-sm disabled:opacity-50"
            >
              Lưu nháp
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => save("published")}
              className="flex-1 rounded-lg bg-accent py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              Xuất bản
            </button>
          </div>
          {msg ? <p className="text-xs text-emerald-700">{msg}</p> : null}
          {err ? <p className="text-xs text-danger">{err}</p> : null}
          {!isNew ? (
            <button
              type="button"
              disabled={busy}
              onClick={remove}
              className="w-full rounded-lg border border-danger/30 py-2 text-sm text-danger hover:bg-danger/5 disabled:opacity-50"
            >
              Xóa trang
            </button>
          ) : null}
        </div>

        <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
          <p className="font-semibold text-navy">Định danh</p>
          <label className="block text-xs">
            Slug
            <div className="mt-1 flex gap-2">
              <input
                className="w-full rounded-lg border border-border px-2 py-1.5 font-mono text-sm"
                value={form.slug}
                disabled={slugLocked && !isNew}
                onChange={(e) =>
                  setForm({
                    ...form,
                    slug: e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, ""),
                  })
                }
              />
            </div>
            <button
              type="button"
              className="mt-1.5 text-[11px] font-medium text-accent hover:underline"
              onClick={() => setSlugLocked((v) => !v)}
            >
              {slugLocked ? "Mở khóa slug" : "Khóa slug"}
            </button>
          </label>
          <label className="block text-xs">
            Nhóm
            <select
              className="mt-1 w-full rounded-lg border border-border px-2 py-1.5 text-sm"
              value={form.collection}
              onChange={(e) =>
                setForm({
                  ...form,
                  collection: e.target.value as CmsStaticPage["collection"],
                  template:
                    e.target.value === "policy" ? "policy" : form.template,
                })
              }
            >
              <option value="policy">Chính sách (/policy/…)</option>
              <option value="legal">Pháp lý (/pages/…)</option>
              <option value="general">Chung (/pages/…)</option>
            </select>
          </label>
          <label className="block text-xs">
            Template
            <select
              className="mt-1 w-full rounded-lg border border-border px-2 py-1.5 text-sm"
              value={form.template}
              onChange={(e) =>
                setForm({
                  ...form,
                  template: e.target.value as CmsStaticPage["template"],
                })
              }
            >
              <option value="policy">Policy (sidebar + accordion)</option>
              <option value="simple">Simple (bài viết đơn)</option>
            </select>
          </label>
          <label className="block text-xs">
            Icon (sidebar chính sách)
            <select
              className="mt-1 w-full rounded-lg border border-border px-2 py-1.5 text-sm"
              value={form.iconKey ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  iconKey: (e.target.value ||
                    undefined) as CmsStaticPage["iconKey"],
                })
              }
            >
              <option value="">—</option>
              <option value="terms">terms</option>
              <option value="delivery">delivery</option>
              <option value="refund">refund</option>
              <option value="warranty">warranty</option>
              <option value="privacy">privacy</option>
              <option value="payment">payment</option>
              <option value="support">support</option>
              <option value="complaint">complaint</option>
            </select>
          </label>
          <label className="block text-xs">
            Thứ tự
            <input
              type="number"
              className="mt-1 w-full rounded-lg border border-border px-2 py-1.5 text-sm"
              value={form.sortOrder}
              onChange={(e) =>
                setForm({ ...form, sortOrder: Number(e.target.value) || 0 })
              }
            />
          </label>
          <label className="block text-xs">
            PDF URL (tuỳ chọn)
            <input
              className="mt-1 w-full rounded-lg border border-border px-2 py-1.5 font-mono text-xs"
              value={form.pdfUrl ?? ""}
              onChange={(e) =>
                setForm({ ...form, pdfUrl: e.target.value || undefined })
              }
            />
          </label>
        </div>

        <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
          <p className="font-semibold text-navy">SEO</p>
          <label className="block text-xs">
            Meta title
            <input
              className="mt-1 w-full rounded-lg border border-border px-2 py-1.5 text-sm"
              value={form.metaTitle ?? ""}
              onChange={(e) =>
                setForm({ ...form, metaTitle: e.target.value })
              }
            />
          </label>
          <label className="block text-xs">
            Meta description
            <textarea
              rows={3}
              className="mt-1 w-full rounded-lg border border-border px-2 py-1.5 text-sm"
              value={form.metaDescription ?? ""}
              onChange={(e) =>
                setForm({ ...form, metaDescription: e.target.value })
              }
            />
          </label>
        </div>
      </aside>
    </div>
  );
}
