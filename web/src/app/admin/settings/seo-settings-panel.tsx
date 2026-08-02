"use client";

import { useMemo, useState } from "react";
import type { PageSeoOverride, SiteSettings } from "@/server/cms/types";
import {
  MAIN_SEO_PAGES,
  SEO_DESC_MAX,
  SEO_TITLE_MAX,
  type MainSeoPageKey,
} from "@/lib/seo-main-pages";
import { MediaPicker } from "@/app/admin/media/MediaPicker";

type Props = {
  form: SiteSettings;
  setForm: (next: SiteSettings) => void;
  siteHostname: string;
  siteOrigin: string;
  indexingAllowed: boolean;
};

function CharCounter({
  length,
  max,
}: {
  length: number;
  max: number;
}) {
  const over = length > max;
  return (
    <span className={`mt-1 block text-xs ${over ? "text-amber-700" : "text-muted"}`}>
      {length} / {max}
      {over ? " — dài hơn khuyến nghị" : ""}
    </span>
  );
}

function patchPageSeo(
  form: SiteSettings,
  path: MainSeoPageKey,
  patch: PageSeoOverride,
): SiteSettings {
  const prev = form.pageSeo?.[path] ?? {};
  const next: PageSeoOverride = {
    title: patch.title !== undefined ? patch.title : prev.title,
    description:
      patch.description !== undefined ? patch.description : prev.description,
    ogImageUrl:
      patch.ogImageUrl !== undefined
        ? patch.ogImageUrl.trim() || undefined
        : prev.ogImageUrl,
  };
  return {
    ...form,
    pageSeo: {
      ...(form.pageSeo ?? {}),
      [path]: next,
    },
  };
}

export function SeoSettingsPanel({
  form,
  setForm,
  siteHostname,
  siteOrigin,
  indexingAllowed,
}: Props) {
  const [mediaOpen, setMediaOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<"global" | MainSeoPageKey>(
    "global",
  );
  const [expandedPage, setExpandedPage] = useState<MainSeoPageKey | null>("/");
  const [manualUrlOpen, setManualUrlOpen] = useState(false);

  const title = form.seoTitle;
  const description = form.seoDescription;
  const og = form.ogImageUrl?.trim() || "";

  const warnings = useMemo(() => {
    const list: string[] = [];
    if (!title.trim()) list.push("Thiếu tiêu đề");
    if (!description.trim()) list.push("Thiếu mô tả");
    if (!og) list.push("Chưa có ảnh chia sẻ");
    if (title.length > SEO_TITLE_MAX) list.push("Title quá dài");
    if (description.length > SEO_DESC_MAX) list.push("Description quá dài");
    return list;
  }, [title, description, og]);

  function openMedia(target: "global" | MainSeoPageKey) {
    setMediaTarget(target);
    setMediaOpen(true);
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-base font-semibold text-navy">SEO</h2>
        <p className="mt-1 text-sm text-muted">
          Cấu hình thông tin hiển thị trên công cụ tìm kiếm và khi chia sẻ
          website.
        </p>
      </div>

      {/* A. SEO mặc định */}
      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-navy">SEO mặc định</h3>
          <p className="mt-0.5 text-xs text-muted">
            Fallback khi trang hoặc sản phẩm / bài viết chưa có SEO riêng.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(260px,340px)]">
          <div className="space-y-4 max-w-xl">
            <label className="block text-sm">
              <span className="font-medium text-navy">Tên website</span>
              <input
                className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                value={form.siteName}
                onChange={(e) => setForm({ ...form, siteName: e.target.value })}
                placeholder="KEYON"
              />
            </label>

            <label className="block text-sm">
              <span className="font-medium text-navy">Tiêu đề mặc định</span>
              <input
                className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                value={form.seoTitle}
                onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                placeholder="KEYON — Phần mềm bản quyền chính hãng"
              />
              <CharCounter length={form.seoTitle.length} max={SEO_TITLE_MAX} />
            </label>

            <label className="block text-sm">
              <span className="font-medium text-navy">Mô tả mặc định</span>
              <textarea
                rows={3}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                value={form.seoDescription}
                onChange={(e) =>
                  setForm({ ...form, seoDescription: e.target.value })
                }
              />
              <CharCounter
                length={form.seoDescription.length}
                max={SEO_DESC_MAX}
              />
            </label>

            <div className="space-y-2">
              <span className="text-sm font-medium text-navy">
                Ảnh chia sẻ mặc định
              </span>
              {og ? (
                <div className="overflow-hidden rounded-xl border border-border bg-[#f8fafc]">
                  <div className="relative aspect-[1.91/1] w-full max-w-md bg-navy-soft">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={og}
                      alt="OG preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 p-3">
                    <button
                      type="button"
                      onClick={() => openMedia("global")}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-navy hover:bg-navy-soft"
                    >
                      Thay ảnh
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setForm({ ...form, ogImageUrl: undefined })
                      }
                      className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => openMedia("global")}
                  className="rounded-lg border border-dashed border-border bg-[#f8fafc] px-4 py-6 text-sm font-medium text-accent hover:border-accent"
                >
                  Chọn từ Thư viện Media
                </button>
              )}
              <button
                type="button"
                className="text-xs text-muted underline"
                onClick={() => setManualUrlOpen((v) => !v)}
              >
                {manualUrlOpen ? "Ẩn URL thủ công" : "Nhập URL thủ công"}
              </button>
              {manualUrlOpen ? (
                <input
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                  placeholder="https://… hoặc /media/…"
                  value={form.ogImageUrl ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      ogImageUrl: e.target.value || undefined,
                    })
                  }
                />
              ) : null}
            </div>

            {warnings.length > 0 ? (
              <ul className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900 space-y-1">
                {warnings.map((w) => (
                  <li key={w}>• {w}</li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-white p-4 text-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                Xem trước trên Google
              </p>
              <p className="mt-2 text-lg leading-snug text-sky-800 line-clamp-2">
                {title || "Tiêu đề mặc định"}
              </p>
              <p className="mt-0.5 text-xs text-emerald-700">{siteHostname}</p>
              <p className="mt-1 text-sm text-muted line-clamp-3">
                {description || "Mô tả mặc định…"}
              </p>
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-white">
              <p className="border-b border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
                Xem trước khi chia sẻ
              </p>
              <div className="relative aspect-[1.91/1] w-full bg-[#e8eef5]">
                {og ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={og}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted">
                    Chưa có ảnh chia sẻ
                  </div>
                )}
              </div>
              <div className="space-y-1 p-4">
                <p className="text-sm font-semibold text-navy line-clamp-2">
                  {title || "Tiêu đề"}
                </p>
                <p className="text-xs text-muted line-clamp-2">
                  {description || "Mô tả…"}
                </p>
                <p className="text-[11px] uppercase tracking-wide text-muted">
                  {siteHostname}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* B. SEO các trang chính */}
      <section className="space-y-3 border-t border-border pt-6">
        <div>
          <h3 className="text-sm font-semibold text-navy">SEO các trang chính</h3>
          <p className="mt-0.5 text-xs text-muted">
            Ghi đè SEO cho listing / trang tĩnh. Chi tiết sản phẩm và bài viết
            vẫn chỉnh tại module riêng.
          </p>
        </div>

        <div className="space-y-2 max-w-2xl">
          {MAIN_SEO_PAGES.map(({ path, label }) => {
            const row = form.pageSeo?.[path] ?? {};
            const open = expandedPage === path;
            const pageTitle = row.title ?? "";
            const pageDesc = row.description ?? "";
            return (
              <div
                key={path}
                className="rounded-xl border border-border bg-[#f8fafc]"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-4 py-3 text-left"
                  onClick={() => setExpandedPage(open ? null : path)}
                >
                  <span>
                    <span className="text-sm font-medium text-navy">{label}</span>
                    <span className="ml-2 text-xs text-muted">{path}</span>
                  </span>
                  <span className="text-xs text-muted">
                    {open ? "Thu gọn" : "Mở"}
                  </span>
                </button>
                {open ? (
                  <div className="space-y-3 border-t border-border px-4 py-3 bg-white rounded-b-xl">
                    <label className="block text-sm">
                      <span className="font-medium text-navy">Meta title</span>
                      <input
                        className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                        value={pageTitle}
                        placeholder={form.seoTitle}
                        onChange={(e) =>
                          setForm(
                            patchPageSeo(form, path, { title: e.target.value }),
                          )
                        }
                      />
                      <CharCounter length={pageTitle.length} max={SEO_TITLE_MAX} />
                    </label>
                    <label className="block text-sm">
                      <span className="font-medium text-navy">
                        Meta description
                      </span>
                      <textarea
                        rows={2}
                        className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                        value={pageDesc}
                        placeholder={form.seoDescription}
                        onChange={(e) =>
                          setForm(
                            patchPageSeo(form, path, {
                              description: e.target.value,
                            }),
                          )
                        }
                      />
                      <CharCounter length={pageDesc.length} max={SEO_DESC_MAX} />
                    </label>
                    <div className="space-y-2">
                      <span className="text-sm font-medium text-navy">
                        Ảnh OG (tuỳ chọn)
                      </span>
                      {row.ogImageUrl ? (
                        <div className="flex items-center gap-3">
                          <div className="relative h-14 w-24 overflow-hidden rounded-lg border border-border">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={row.ogImageUrl}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => openMedia(path)}
                            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium"
                          >
                            Thay ảnh
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setForm(
                                patchPageSeo(form, path, { ogImageUrl: "" }),
                              )
                            }
                            className="text-xs text-rose-700"
                          >
                            Xóa
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openMedia(path)}
                          className="rounded-lg border border-dashed border-border px-3 py-2 text-xs font-medium text-accent"
                        >
                          Chọn từ Thư viện Media
                        </button>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      {/* C. SEO kỹ thuật */}
      <section className="space-y-3 border-t border-border pt-6">
        <div>
          <h3 className="text-sm font-semibold text-navy">SEO kỹ thuật</h3>
          <p className="mt-0.5 text-xs text-muted">
            Tên miền và file công khai — không chỉnh tay để tránh canonical sai.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 max-w-2xl">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted">Tên miền chính</p>
            <p className="mt-1 text-sm font-semibold text-navy break-all">
              {siteOrigin}
            </p>
            <p className="mt-1 text-xs text-muted">
              Lấy từ cấu hình môi trường (NEXT_PUBLIC_APP_URL).
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted">Indexing</p>
            <p
              className={`mt-1 text-sm font-semibold ${
                indexingAllowed ? "text-emerald-700" : "text-amber-800"
              }`}
            >
              {indexingAllowed ? "Cho phép index (production)" : "Không index (dev / staging)"}
            </p>
            <p className="mt-1 text-xs text-muted">
              Tự động theo môi trường — không có nút chặn Google.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs text-muted">Sitemap</p>
                <p className="mt-1 text-sm font-semibold text-emerald-700">
                  Hoạt động
                </p>
                <p className="mt-1 font-mono text-xs text-navy">/sitemap.xml</p>
              </div>
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-navy hover:bg-navy-soft"
              >
                Kiểm tra
              </a>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs text-muted">Robots.txt</p>
                <p className="mt-1 text-sm font-semibold text-emerald-700">
                  Hoạt động
                </p>
                <p className="mt-1 font-mono text-xs text-navy">/robots.txt</p>
              </div>
              <a
                href="/robots.txt"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-navy hover:bg-navy-soft"
              >
                Kiểm tra
              </a>
            </div>
          </div>
        </div>
      </section>

      <MediaPicker
        open={mediaOpen}
        onClose={() => setMediaOpen(false)}
        multiple={false}
        purpose="seo-og"
        title="Chọn ảnh chia sẻ (OG)"
        onSelect={(items) => {
          const url = items[0]?.url;
          if (!url) return;
          if (mediaTarget === "global") {
            setForm({ ...form, ogImageUrl: url });
          } else {
            setForm(patchPageSeo(form, mediaTarget, { ogImageUrl: url }));
          }
          setMediaOpen(false);
        }}
      />
    </div>
  );
}
