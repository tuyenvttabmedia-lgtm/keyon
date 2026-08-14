"use client";

import Image from "next/image";
import { useState } from "react";
import type { CmsFooter } from "@/server/cms/types";
import { resolveMediaUrl } from "@/lib/media-url";
import { MediaPicker } from "@/app/admin/media/MediaPicker";
import { CmsSaveForm } from "../CmsSaveForm";

export function FooterForm({ initial }: { initial: CmsFooter }) {
  return (
    <CmsSaveForm initial={initial} apiKey="footer">
      {(form, setForm) => (
        <div className="space-y-6">
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            Frontend sẽ tự gọn cột Doanh nghiệp (bỏ /solutions), đổi tên “Thông
            tin…” → “Công ty”, và sửa legal link trỏ nhầm vào /policy. Sau khi
            lưu, hard-refresh trang chủ để xem.
          </p>

          <BrandSection form={form} setForm={setForm} />
          <BctSection form={form} setForm={setForm} />

          <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
            <label className="block text-sm">
              <span className="font-medium text-navy">Mô tả thương hiệu</span>
              <textarea
                rows={3}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                value={form.blurb}
                onChange={(e) => setForm({ ...form, blurb: e.target.value })}
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-navy">Copyright</span>
              <input
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                value={form.copyright}
                onChange={(e) =>
                  setForm({ ...form, copyright: e.target.value })
                }
              />
            </label>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-navy">Cột menu</p>
                <button
                  type="button"
                  className="text-xs font-medium text-accent hover:underline"
                  onClick={() =>
                    setForm({
                      ...form,
                      columns: [
                        ...form.columns,
                        {
                          title: "Cột mới",
                          links: [{ label: "Link", href: "/" }],
                        },
                      ],
                    })
                  }
                >
                  + Thêm cột
                </button>
              </div>

              {form.columns.map((col, ci) => (
                <div
                  key={ci}
                  className="space-y-2 rounded-xl border border-border p-4"
                >
                  <div className="flex gap-2">
                    <input
                      className="w-full rounded-lg border border-border px-3 py-2 text-sm font-medium outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                      value={col.title}
                      onChange={(e) => {
                        const columns = [...form.columns];
                        columns[ci] = { ...col, title: e.target.value };
                        setForm({ ...form, columns });
                      }}
                      placeholder="Tiêu đề cột"
                    />
                    <button
                      type="button"
                      className="shrink-0 px-2 text-xs text-danger hover:underline"
                      onClick={() => {
                        if (!confirm(`Xóa cột “${col.title}”?`)) return;
                        setForm({
                          ...form,
                          columns: form.columns.filter((_, i) => i !== ci),
                        });
                      }}
                    >
                      Xóa cột
                    </button>
                  </div>
                  <p className="text-[11px] text-muted">
                    Label · đường dẫn (vd. /about hoặc mailto:support@keyon.vn)
                  </p>
                  {col.links.map((link, li) => (
                    <div key={li} className="flex gap-2">
                      <input
                        className="min-w-0 flex-1 rounded-lg border border-border px-2 py-1.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                        value={link.label}
                        onChange={(e) => {
                          const columns = [...form.columns];
                          const links = [...col.links];
                          links[li] = { ...link, label: e.target.value };
                          columns[ci] = { ...col, links };
                          setForm({ ...form, columns });
                        }}
                        placeholder="Nhãn"
                      />
                      <input
                        className="min-w-0 flex-[1.2] rounded-lg border border-border px-2 py-1.5 font-mono text-xs outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                        value={link.href}
                        onChange={(e) => {
                          const columns = [...form.columns];
                          const links = [...col.links];
                          links[li] = { ...link, href: e.target.value };
                          columns[ci] = { ...col, links };
                          setForm({ ...form, columns });
                        }}
                        placeholder="/path hoặc mailto:"
                      />
                      <button
                        type="button"
                        className="shrink-0 px-1 text-xs text-danger"
                        onClick={() => {
                          const columns = [...form.columns];
                          columns[ci] = {
                            ...col,
                            links: col.links.filter((_, i) => i !== li),
                          };
                          setForm({ ...form, columns });
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="text-xs font-medium text-accent hover:underline"
                    onClick={() => {
                      const columns = [...form.columns];
                      columns[ci] = {
                        ...col,
                        links: [
                          ...col.links,
                          { label: "Link mới", href: "/" },
                        ],
                      };
                      setForm({ ...form, columns });
                    }}
                  >
                    + Thêm link
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-border bg-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-navy">
                  Legal links (thanh dưới footer)
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  Nên hiện đủ chính sách bắt buộc (BCT): điều khoản, bảo mật,
                  thanh toán, giao hàng, hoàn tiền, khiếu nại + hub /policy.
                  Không chỉ 1 link hub — khó kiểm tra khi đăng ký.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="rounded-lg border border-accent/30 bg-accent-soft px-3 py-1.5 text-xs font-medium text-accent"
                  onClick={() =>
                    setForm({
                      ...form,
                      legalLinks: [
                        { label: "Điều khoản", href: "/policy/terms" },
                        { label: "Bảo mật", href: "/policy/privacy" },
                        { label: "Thanh toán", href: "/policy/payment" },
                        { label: "Giao hàng", href: "/policy/delivery" },
                        { label: "Hoàn tiền", href: "/policy/refund" },
                        { label: "Khiếu nại", href: "/policy/complaint" },
                        { label: "Tất cả chính sách", href: "/policy" },
                      ],
                    })
                  }
                >
                  Áp dụng bộ BCT
                </button>
                <button
                  type="button"
                  className="text-xs font-medium text-accent hover:underline"
                  onClick={() =>
                    setForm({
                      ...form,
                      legalLinks: [
                        ...form.legalLinks,
                        { label: "Chính sách", href: "/policy/privacy" },
                      ],
                    })
                  }
                >
                  + Thêm
                </button>
              </div>
            </div>
            {form.legalLinks.map((link, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className="min-w-0 flex-1 rounded-lg border border-border px-2 py-1.5 text-sm"
                  value={link.label}
                  onChange={(e) => {
                    const legalLinks = [...form.legalLinks];
                    legalLinks[i] = { ...link, label: e.target.value };
                    setForm({ ...form, legalLinks });
                  }}
                />
                <input
                  className="min-w-0 flex-[1.2] rounded-lg border border-border px-2 py-1.5 font-mono text-xs"
                  value={link.href}
                  onChange={(e) => {
                    const legalLinks = [...form.legalLinks];
                    legalLinks[i] = { ...link, href: e.target.value };
                    setForm({ ...form, legalLinks });
                  }}
                />
                <button
                  type="button"
                  className="px-1 text-xs text-danger"
                  onClick={() =>
                    setForm({
                      ...form,
                      legalLinks: form.legalLinks.filter((_, j) => j !== i),
                    })
                  }
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </CmsSaveForm>
  );
}

function BrandSection({
  form,
  setForm,
}: {
  form: CmsFooter;
  setForm: (v: CmsFooter) => void;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const previewUrl = resolveMediaUrl(form.logoUrl);

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
      <div>
        <p className="text-sm font-medium text-navy">Logo footer</p>
        <p className="mt-0.5 text-xs text-muted">
          Wordmark ngang (nên bản sáng/trắng trên nền navy). Trống → dùng logo
          header; không có cả hai → chữ cái + tên.
        </p>
      </div>

      <div className="flex flex-wrap items-start gap-4">
        <div
          className={
            previewUrl
              ? "flex h-12 w-[200px] shrink-0 items-center overflow-hidden rounded-xl border border-border bg-[#0b1f33] px-2"
              : "flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-surface"
          }
        >
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt=""
              width={200}
              height={48}
              className="h-10 w-full object-contain object-left"
              unoptimized
            />
          ) : (
            <span className="text-lg font-extrabold text-accent">
              {(form.brandName || "K").trim().charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="h-9 rounded-lg border border-border bg-white px-3 text-sm font-medium hover:border-accent"
            onClick={() => setPickerOpen(true)}
          >
            {form.logoUrl ? "Đổi logo" : "Upload / chọn logo"}
          </button>
          {form.logoUrl ? (
            <button
              type="button"
              className="h-9 rounded-lg px-3 text-sm text-danger hover:underline"
              onClick={() => setForm({ ...form, logoUrl: undefined })}
            >
              Xóa logo
            </button>
          ) : null}
        </div>
      </div>

      <label className="block text-sm">
        <span className="font-medium text-navy">Tên thương hiệu</span>
        <span className="ml-1 text-xs text-muted">
          (fallback khi chưa có logo)
        </span>
        <input
          className="mt-1 h-9 w-full max-w-md rounded-lg border border-border px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          value={form.brandName}
          onChange={(e) => setForm({ ...form, brandName: e.target.value })}
          placeholder="KEYON"
        />
      </label>

      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        title="Chọn logo footer"
        onSelect={(items) => {
          if (items[0]?.url) {
            setForm({ ...form, logoUrl: items[0].url });
          }
          setPickerOpen(false);
        }}
      />
    </div>
  );
}

function BctSection({
  form,
  setForm,
}: {
  form: CmsFooter;
  setForm: (v: CmsFooter) => void;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const preview =
    resolveMediaUrl(form.bctImageUrl) || "/brand/bct-thong-bao.svg";

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-navy">
            Logo thông báo Bộ Công Thương
          </p>
          <p className="mt-0.5 text-xs text-muted">
            Hiện dưới cột thương hiệu footer (chỗ icon mạng xã hội cũ). Tắt khi
            chưa có mã đăng ký; bật và dán URL hồ sơ trên online.gov.vn khi đã
            thông báo.
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm font-medium text-navy">
          <input
            type="checkbox"
            checked={Boolean(form.bctVisible)}
            onChange={(e) =>
              setForm({ ...form, bctVisible: e.target.checked })
            }
          />
          Hiện trên footer
        </label>
      </div>

      <div className="flex flex-wrap items-start gap-4">
        <div className="flex h-16 w-[176px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-white p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt={form.bctAlt || "Đã thông báo Bộ Công Thương"}
            className="h-full w-full object-contain object-left"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="h-9 rounded-lg border border-border bg-white px-3 text-sm font-medium hover:border-accent"
            onClick={() => setPickerOpen(true)}
          >
            {form.bctImageUrl ? "Đổi ảnh BCT" : "Chọn ảnh từ Media"}
          </button>
          {form.bctImageUrl ? (
            <button
              type="button"
              className="h-9 rounded-lg px-3 text-sm text-danger hover:underline"
              onClick={() => setForm({ ...form, bctImageUrl: "" })}
            >
              Dùng ảnh mặc định
            </button>
          ) : null}
        </div>
      </div>

      <label className="block text-sm">
        <span className="font-medium text-navy">Link hồ sơ BCT</span>
        <input
          className="mt-1 h-9 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          value={form.bctHref ?? ""}
          onChange={(e) => setForm({ ...form, bctHref: e.target.value })}
          placeholder="https://online.gov.vn/Home/WebDetails?id=…"
        />
      </label>
      <label className="block text-sm">
        <span className="font-medium text-navy">Alt text</span>
        <input
          className="mt-1 h-9 w-full max-w-md rounded-lg border border-border px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          value={form.bctAlt ?? ""}
          onChange={(e) => setForm({ ...form, bctAlt: e.target.value })}
          placeholder="Đã thông báo Bộ Công Thương"
        />
      </label>

      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        title="Chọn logo thông báo BCT"
        onSelect={(items) => {
          if (items[0]?.url) {
            setForm({ ...form, bctImageUrl: items[0].url });
          }
          setPickerOpen(false);
        }}
      />
    </div>
  );
}
