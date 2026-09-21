"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { BlogPost } from "@/server/cms/types";
import {
  estimateReadingMinutes,
  legacyBodyToHtml,
  slugifyTitle,
  uniqueBlogSlug,
} from "@/server/cms/blog-utils";
import {
  resourcePostHref,
  resolveResourceSection,
  suggestedSectionForTopic,
} from "@/storefront/lib/resources";
import { ADMIN_BLOG_TOPICS, CATEGORY_LABEL, SECTION_LABEL } from "@/storefront/lib/blog";
import { sanitizeBlogHtml } from "@/lib/sanitize-blog-html";
import { MediaPicker } from "@/app/admin/media/MediaPicker";
import { RichTextEditor } from "./rich-text-editor";
import {
  ADMIN_PAGE_TITLE_CLASS,
  INPUT_TEXT_CLASS,
} from "@/storefront/typography";

type Props = {
  initial: BlogPost;
  allPosts: BlogPost[];
  isNew: boolean;
  defaultAuthor: string;
  /** Visible topics from CMS taxonomy */
  topics?: { id: string; label: string }[];
};

function snapshot(p: BlogPost) {
  return JSON.stringify(p);
}

function toDatetimeLocalValue(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function statusLabel(status: BlogPost["status"]): string {
  if (status === "published") return "Đã xuất bản";
  if (status === "scheduled") return "Đã lên lịch";
  return "Bản nháp";
}

export function BlogEditor({
  initial,
  allPosts,
  isNew,
  defaultAuthor,
  topics = ADMIN_BLOG_TOPICS,
}: Props) {
  const router = useRouter();
  const seeded = useMemo(() => {
    const author = initial.author?.trim() || defaultAuthor;
    const bodyHtml = legacyBodyToHtml(initial.body);
    let slug = initial.slug;
    if (isNew && (!slug || slug.startsWith("bai-viet-"))) {
      slug = "";
    }
    return { ...initial, author, body: bodyHtml, slug, section: initial.section ?? "news" };
  }, [initial, defaultAuthor, isNew]);

  const [form, setForm] = useState<BlogPost>(seeded);
  const [slugTouched, setSlugTouched] = useState(!isNew && !!initial.slug);
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [seoOpen, setSeoOpen] = useState(true);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [socialOpen, setSocialOpen] = useState(false);
  const [coverPicker, setCoverPicker] = useState(false);
  const [ogPicker, setOgPicker] = useState(false);
  const [scheduleLocal, setScheduleLocal] = useState(() =>
    toDatetimeLocalValue(seeded.scheduledAt),
  );
  const savedSnap = useRef(snapshot(seeded));
  const dirty = snapshot(form) !== savedSnap.current;

  const readingMins = estimateReadingMinutes(form.body);
  const seoTitleLen = (form.metaTitle || form.title).length;
  const metaDescLen = (form.metaDescription || form.excerpt).length;

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  function patch(partial: Partial<BlogPost>) {
    setForm((prev) => ({ ...prev, ...partial }));
  }

  function onTitleChange(title: string) {
    setForm((prev) => {
      const next = { ...prev, title };
      if (!slugTouched) {
        next.slug = title.trim()
          ? uniqueBlogSlug(slugifyTitle(title), allPosts, prev.id)
          : "";
      }
      return next;
    });
  }

  async function save(
    status: "draft" | "published" | "scheduled",
    opts?: { preview?: boolean },
  ) {
    setSaving(true);
    setMsg(null);
    try {
      let slug = form.slug.trim() || slugifyTitle(form.title);
      if (!slug) {
        setMsg("Cần tiêu đề hoặc slug");
        setSaving(false);
        return;
      }
      slug = uniqueBlogSlug(slug, allPosts, form.id);
      const body = sanitizeBlogHtml(form.body);

      let scheduledAt = form.scheduledAt;
      let publishedAt = form.publishedAt;

      if (status === "scheduled") {
        if (!scheduleLocal.trim()) {
          setMsg("Chọn ngày giờ xuất bản");
          setSaving(false);
          return;
        }
        const when = new Date(scheduleLocal);
        if (Number.isNaN(when.getTime())) {
          setMsg("Ngày giờ không hợp lệ");
          setSaving(false);
          return;
        }
        if (when.getTime() <= Date.now() + 30_000) {
          setMsg("Lịch xuất bản phải sau thời điểm hiện tại");
          setSaving(false);
          return;
        }
        scheduledAt = when.toISOString();
        publishedAt = scheduledAt;
      } else if (status === "published") {
        publishedAt = form.publishedAt ?? new Date().toISOString();
        scheduledAt = undefined;
      } else {
        // draft — keep scheduledAt only if still planning; clear on explicit draft
        scheduledAt = undefined;
      }

      const next: BlogPost = {
        ...form,
        slug,
        body,
        status,
        section: form.section ?? resolveResourceSection(form),
        author: form.author?.trim() || defaultAuthor,
        readMinutes: estimateReadingMinutes(body),
        robotsIndex: form.robotsIndex !== false,
        robotsFollow: form.robotsFollow !== false,
        updatedAt: new Date().toISOString(),
        publishedAt,
        scheduledAt,
        metaTitle: form.metaTitle.trim() || form.title.trim(),
        metaDescription: form.metaDescription.trim() || form.excerpt.trim(),
      };

      const others = allPosts.filter((p) => p.id !== next.id);
      const res = await fetch("/api/admin/cms/blog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([...others, next]),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lỗi");

      setForm(next);
      setScheduleLocal(toDatetimeLocalValue(next.scheduledAt));
      savedSnap.current = snapshot(next);
      setSlugTouched(true);
      setMsg(
        status === "published"
          ? "Đã xuất bản"
          : status === "scheduled"
            ? `Đã lên lịch ${new Date(next.scheduledAt!).toLocaleString("vi-VN")}`
            : opts?.preview
              ? "Đã lưu — đang mở xem trước"
              : "Đã lưu nháp",
      );
      router.refresh();
      if (opts?.preview) {
        router.push(`/admin/blog/${next.id}/preview`);
      } else if (isNew) {
        router.replace(`/admin/blog/${next.id}`);
      }
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setSaving(false);
    }
  }

  async function preview() {
    if (dirty || isNew) {
      if (
        !confirm(
          "Cần lưu nháp trước khi xem trước. Lưu và tiếp tục?",
        )
      ) {
        return;
      }
      await save("draft", { preview: true });
      return;
    }
    router.push(`/admin/blog/${form.id}/preview`);
  }

  const previewTitle = form.metaTitle.trim() || form.title || "Tiêu đề SEO";
  const previewDesc =
    form.metaDescription.trim() || form.excerpt || "Mô tả meta…";
  const ogTitle =
    form.ogTitle?.trim() || form.metaTitle.trim() || form.title || "OG Title";
  const ogDesc =
    form.ogDescription?.trim() ||
    form.metaDescription.trim() ||
    form.excerpt ||
    "";
  const ogImg = form.ogImageUrl?.trim() || form.coverUrl;

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(18.5rem,21rem)] lg:items-start">
      <div className="min-w-0 space-y-4">
        {dirty ? (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            Bạn có thay đổi chưa lưu
          </p>
        ) : null}

        <div className="min-w-0 space-y-4 rounded-2xl border border-border bg-card p-4 sm:p-5">
          <input
            className={`w-full border-0 border-b border-border bg-transparent pb-2 outline-none ${ADMIN_PAGE_TITLE_CLASS}`}
            value={form.title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Tiêu đề bài viết"
          />
          <p className="text-xs text-muted">
            URL:{" "}
            <span className="font-medium text-navy">
              keyon.vn{resourcePostHref(form)}
            </span>
          </p>

          <label className="block text-xs text-muted">
            Tóm tắt bài viết
            <textarea
              rows={3}
              className={`mt-1 w-full rounded-lg border border-border px-3 py-2 ${INPUT_TEXT_CLASS}`}
              value={form.excerpt}
              onChange={(e) => patch({ excerpt: e.target.value })}
              placeholder="Tóm tắt ngắn gọn"
            />
            <span className="mt-1 flex justify-between">
              <span>
                Hiển thị tại danh sách bài viết và có thể dùng làm mô tả mặc
                định.
              </span>
              <span>{form.excerpt.length} ký tự</span>
            </span>
          </label>

          <div className="min-w-0">
            <p className="mb-2 text-xs font-medium text-muted">
              Nội dung{" "}
              <span className="font-normal text-muted/80">
                — Alt từng ảnh nằm ngay dưới ảnh trong bài
              </span>
            </p>
            <RichTextEditor
              value={form.body}
              onChange={(html) => patch({ body: html })}
            />
          </div>
        </div>
      </div>

      <aside className="min-w-0 space-y-4 lg:sticky lg:top-4 lg:self-start">
        {/* Publish */}
        <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Xuất bản
          </p>
          <p className="text-sm text-navy">
            Trạng thái:{" "}
            <strong>{statusLabel(form.status)}</strong>
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={() => void save("draft")}
              className="rounded-lg border border-border px-3 py-2 text-sm font-medium"
            >
              Lưu nháp
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => void preview()}
              className="rounded-lg border border-border px-3 py-2 text-sm font-medium"
            >
              Xem trước
            </button>
            {form.status === "published" ? (
              <button
                type="button"
                disabled={saving}
                onClick={() => void save("published")}
                className="col-span-2 rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-white"
              >
                Lưu thay đổi
              </button>
            ) : (
              <button
                type="button"
                disabled={saving}
                onClick={() => void save("published")}
                className="col-span-2 rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-white"
              >
                Xuất bản ngay
              </button>
            )}
          </div>
          <div className="space-y-2 rounded-xl border border-border bg-surface/60 p-3">
            <p className="text-xs font-semibold text-navy">Đặt lịch xuất bản</p>
            <label className="block text-xs text-muted">
              Ngày &amp; giờ
              <input
                type="datetime-local"
                className="mt-1 w-full rounded-lg border border-border bg-white px-2 py-1.5 text-sm text-navy"
                value={scheduleLocal}
                onChange={(e) => setScheduleLocal(e.target.value)}
              />
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={saving || !scheduleLocal}
                onClick={() => void save("scheduled")}
                className="flex-1 rounded-lg border border-accent bg-white px-3 py-1.5 text-sm font-semibold text-accent disabled:opacity-40"
              >
                Lưu &amp; lên lịch
              </button>
              {form.status === "scheduled" ? (
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => {
                    setScheduleLocal("");
                    void save("draft");
                  }}
                  className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted"
                >
                  Hủy lịch
                </button>
              ) : null}
            </div>
            {form.status === "scheduled" && form.scheduledAt ? (
              <p className="text-[11px] text-accent">
                Sẽ đăng lúc {new Date(form.scheduledAt).toLocaleString("vi-VN")}
              </p>
            ) : (
              <p className="text-[11px] text-muted">
                Bài vẫn là nháp cho đến thời điểm đã chọn — tự hiện trên storefront khi đến giờ.
              </p>
            )}
          </div>
          <div className="space-y-1 text-xs text-muted">
            <p>
              Ngày xuất bản:{" "}
              {form.publishedAt
                ? new Date(form.publishedAt).toLocaleString("vi-VN")
                : "—"}
            </p>
            <p>
              Ngày cập nhật:{" "}
              {new Date(form.updatedAt).toLocaleString("vi-VN")}
            </p>
            <p>Thời gian đọc ước tính: {readingMins} phút</p>
          </div>
          {msg ? <p className="text-xs text-accent">{msg}</p> : null}
        </div>

        {/* Classification — Kiến thức = blog: chuyên mục (URL) + chủ đề (filter) */}
        <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Phân loại Kiến thức
          </p>
          <p className="text-[11px] leading-relaxed text-muted">
            Chuyên mục gắn URL (/kien-thuc/…). Chủ đề có trang riêng (/kien-thuc/chu-de/…).
            Cùng một engine bài viết với blog.
          </p>
          <label className="block text-xs text-muted">
            Chuyên mục <span className="text-accent">*</span>
            <select
              className="mt-1 w-full rounded-lg border border-border px-2 py-1.5 text-sm text-navy"
              value={form.section ?? resolveResourceSection(form)}
              onChange={(e) =>
                patch({
                  section: e.target.value as BlogPost["section"],
                })
              }
            >
              <option value="insights">{SECTION_LABEL.insights}</option>
              <option value="guides">{SECTION_LABEL.guides}</option>
              <option value="news">{SECTION_LABEL.news}</option>
            </select>
          </label>
          <label className="block text-xs text-muted">
            Chủ đề
            <select
              className="mt-1 w-full rounded-lg border border-border px-2 py-1.5 text-sm text-navy"
              value={form.category ?? ""}
              onChange={(e) => {
                const topic = (e.target.value ||
                  undefined) as BlogPost["category"];
                const suggested = suggestedSectionForTopic(topic);
                patch({
                  category: topic,
                  ...(suggested && !form.section && isNew
                    ? { section: suggested }
                    : {}),
                });
              }}
            >
              <option value="">— Không chọn —</option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
              {form.category &&
              !topics.some((t) => t.id === form.category) ? (
                <option value={form.category}>
                  {CATEGORY_LABEL[form.category] ?? form.category} (cũ)
                </option>
              ) : null}
            </select>
          </label>
          <label className="block text-xs text-muted">
            Tác giả
            <input
              className="mt-1 w-full rounded-lg border border-border px-2 py-1.5 text-sm text-navy"
              value={form.author ?? ""}
              onChange={(e) => patch({ author: e.target.value })}
            />
          </label>
          <label className="flex items-center gap-2 text-xs text-navy">
            <input
              type="checkbox"
              checked={!!form.featured}
              onChange={(e) => patch({ featured: e.target.checked })}
            />
            Bài nổi bật
          </label>
        </div>

        {/* Featured image — sidebar (cover only; body images use TipTap alt bar) */}
        <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Ảnh đại diện
          </p>
          {form.coverUrl ? (
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-surface">
              <Image
                src={form.coverUrl}
                alt={form.coverAlt || ""}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="flex aspect-[16/9] items-center justify-center rounded-xl border border-dashed border-border bg-surface text-xs text-muted">
              Chưa chọn ảnh
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCoverPicker(true)}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium"
            >
              Chọn từ Media
            </button>
            {form.coverUrl ? (
              <button
                type="button"
                onClick={() =>
                  patch({
                    coverUrl: undefined,
                    coverAlt: undefined,
                    coverCaption: undefined,
                  })
                }
                className="rounded-lg border border-border px-3 py-1.5 text-xs"
              >
                Gỡ ảnh
              </button>
            ) : null}
          </div>
          <label className="block text-xs text-muted">
            Alt text
            <input
              className="mt-1 w-full rounded-lg border border-border px-2 py-1.5 text-sm"
              value={form.coverAlt ?? ""}
              onChange={(e) => patch({ coverAlt: e.target.value })}
            />
          </label>
          <label className="block text-xs text-muted">
            Caption (optional)
            <input
              className="mt-1 w-full rounded-lg border border-border px-2 py-1.5 text-sm"
              value={form.coverCaption ?? ""}
              onChange={(e) => patch({ coverCaption: e.target.value })}
            />
          </label>
        </div>

        {/* SEO */}
        <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <button
            type="button"
            className="flex w-full items-center justify-between text-left"
            onClick={() => setSeoOpen((v) => !v)}
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-muted">
              SEO
            </span>
            <span className="text-xs text-muted">{seoOpen ? "Thu gọn" : "Mở"}</span>
          </button>
          {seoOpen ? (
            <div className="space-y-3">
              <p className="text-[11px] font-semibold text-navy">SEO cơ bản</p>
              <label className="block text-xs text-muted">
                Focus keyword
                <input
                  className="mt-1 w-full rounded-lg border border-border px-2 py-1.5 text-sm"
                  value={form.focusKeyword ?? ""}
                  onChange={(e) => patch({ focusKeyword: e.target.value })}
                />
              </label>
              <label className="block text-xs text-muted">
                Slug
                <input
                  className="mt-1 w-full rounded-lg border border-border px-2 py-1.5 text-sm"
                  value={form.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    patch({
                      slug: slugifyTitle(e.target.value) || e.target.value,
                    });
                  }}
                />
              </label>
              <label className="block text-xs text-muted">
                SEO title
                <input
                  className="mt-1 w-full rounded-lg border border-border px-2 py-1.5 text-sm"
                  value={form.metaTitle}
                  onChange={(e) => patch({ metaTitle: e.target.value })}
                  placeholder={form.title || "Fallback tiêu đề bài"}
                />
                <span
                  className={`mt-1 block ${
                    seoTitleLen > 60 ? "text-amber-700" : ""
                  }`}
                >
                  {seoTitleLen} / ~60
                  {seoTitleLen > 60 ? " — hơi dài" : ""}
                </span>
              </label>
              <label className="block text-xs text-muted">
                Meta description
                <textarea
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-border px-2 py-1.5 text-sm"
                  value={form.metaDescription}
                  onChange={(e) => patch({ metaDescription: e.target.value })}
                  placeholder={form.excerpt || "Fallback tóm tắt"}
                />
                <span
                  className={`mt-1 block ${
                    metaDescLen > 160 ? "text-amber-700" : ""
                  }`}
                >
                  {metaDescLen} / ~160
                  {metaDescLen > 160 ? " — hơi dài" : ""}
                </span>
              </label>

              <div className="rounded-lg border border-border bg-[#f8fafc] p-3 space-y-1">
                <p className="text-[11px] font-semibold text-muted">
                  Google Search Preview
                </p>
                <p className="text-xs text-navy">KEYON</p>
                <p className="truncate text-[11px] text-emerald-700">
                  keyon.vn › resources › {resolveResourceSection(form)} ›{" "}
                  {form.slug || "slug"}
                </p>
                <p className="text-sm font-medium text-sky-800 line-clamp-2">
                  {previewTitle}
                </p>
                <p className="text-xs text-muted line-clamp-3">{previewDesc}</p>
              </div>

              <button
                type="button"
                className="flex w-full items-center justify-between text-left text-xs font-semibold text-navy"
                onClick={() => setAdvancedOpen((v) => !v)}
              >
                SEO nâng cao
                <span className="font-normal text-muted">
                  {advancedOpen ? "Thu gọn" : "Mở"}
                </span>
              </button>
              {advancedOpen ? (
                <div className="space-y-3 border-t border-border pt-3">
                  <label className="block text-xs text-muted">
                    Canonical URL
                    <input
                      className="mt-1 w-full rounded-lg border border-border px-2 py-1.5 text-sm"
                      value={form.canonicalUrl ?? ""}
                      onChange={(e) => patch({ canonicalUrl: e.target.value })}
                      placeholder="https://keyon.vn/kien-thuc/..."
                    />
                  </label>
                  <div className="flex gap-4 text-xs text-navy">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={form.robotsIndex !== false}
                        onChange={(e) =>
                          patch({ robotsIndex: e.target.checked })
                        }
                      />
                      Index
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={form.robotsFollow !== false}
                        onChange={(e) =>
                          patch({ robotsFollow: e.target.checked })
                        }
                      />
                      Follow
                    </label>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        {/* Social */}
        <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <button
            type="button"
            className="flex w-full items-center justify-between text-left"
            onClick={() => setSocialOpen((v) => !v)}
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-muted">
              Chia sẻ mạng xã hội
            </span>
            <span className="text-xs text-muted">
              {socialOpen ? "Thu gọn" : "Mở"}
            </span>
          </button>
          {socialOpen ? (
            <div className="space-y-3">
              <label className="block text-xs text-muted">
                OG Title
                <input
                  className="mt-1 w-full rounded-lg border border-border px-2 py-1.5 text-sm"
                  value={form.ogTitle ?? ""}
                  onChange={(e) => patch({ ogTitle: e.target.value })}
                  placeholder={previewTitle}
                />
              </label>
              <label className="block text-xs text-muted">
                OG Description
                <textarea
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-border px-2 py-1.5 text-sm"
                  value={form.ogDescription ?? ""}
                  onChange={(e) => patch({ ogDescription: e.target.value })}
                  placeholder={previewDesc}
                />
              </label>
              <div>
                <p className="text-xs text-muted">OG Image</p>
                {ogImg ? (
                  <div className="relative mt-1 aspect-[1.91/1] overflow-hidden rounded-lg bg-surface">
                    <Image
                      src={ogImg}
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : null}
                <button
                  type="button"
                  onClick={() => setOgPicker(true)}
                  className="mt-2 rounded-lg border border-border px-3 py-1.5 text-xs font-medium"
                >
                  Chọn ảnh
                </button>
              </div>
              <div className="rounded-lg border border-border bg-[#f8fafc] p-3">
                <p className="text-[11px] font-semibold text-muted">
                  Social preview
                </p>
                <p className="mt-1 text-sm font-medium text-navy line-clamp-2">
                  {ogTitle}
                </p>
                <p className="text-xs text-muted line-clamp-2">{ogDesc}</p>
              </div>
            </div>
          ) : null}
        </div>
      </aside>

      <MediaPicker
        open={coverPicker}
        onClose={() => setCoverPicker(false)}
        multiple={false}
        purpose="blog"
        title="Chọn ảnh đại diện"
        onSelect={(items) => {
          const item = items[0];
          if (!item?.url) return;
          patch({
            coverUrl: item.url,
            coverAlt: item.altText?.trim() || form.coverAlt || "",
          });
        }}
      />
      <MediaPicker
        open={ogPicker}
        onClose={() => setOgPicker(false)}
        multiple={false}
        purpose="blog"
        title="Chọn ảnh Open Graph"
        onSelect={(items) => {
          if (items[0]?.url) patch({ ogImageUrl: items[0].url });
        }}
      />
    </div>
  );
}
