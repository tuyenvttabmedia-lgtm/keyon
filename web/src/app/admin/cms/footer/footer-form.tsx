"use client";

import Image from "next/image";
import { useState } from "react";
import type { CmsFooter, CmsFooterCompanyInfo } from "@/server/cms/types";
import { defaultCmsFooterCompanyInfo } from "@/server/cms/types";
import { resolveMediaUrl } from "@/lib/media-url";
import { MediaPicker } from "@/app/admin/media/MediaPicker";
import { CmsSaveForm } from "../CmsSaveForm";

function companyInfoOf(form: CmsFooter): CmsFooterCompanyInfo {
  return {
    ...defaultCmsFooterCompanyInfo,
    ...(form.companyInfo ?? {}),
  };
}

export function FooterForm({ initial }: { initial: CmsFooter }) {
  const initialForm: CmsFooter = {
    ...initial,
    companyInfo: companyInfoOf(initial),
    legalLinks: [],
  };

  return (
    <CmsSaveForm initial={initialForm} apiKey="footer">
      {(form, setForm) => {
        const company = companyInfoOf(form);
        const setCompany = (patch: Partial<CmsFooterCompanyInfo>) =>
          setForm({
            ...form,
            companyInfo: { ...company, ...patch },
          });

        return (
          <div className="space-y-6">
            <p className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-950">
              Thông tin CTy (tên, địa chỉ, MST…) nằm cột thương hiệu. Badge BCT /
              DMCA hiện ở thanh dưới footer — cạnh copyright.
            </p>

            <BrandSection form={form} setForm={setForm} />
            <ComplianceBadgesSection form={form} setForm={setForm} />

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

              <div className="space-y-3 rounded-xl border border-border bg-surface/40 p-4">
                <div>
                  <p className="text-sm font-medium text-navy">
                    Thông tin công ty (cột thương hiệu)
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    Để trống trường nào thì ẩn trường đó trên storefront.
                  </p>
                </div>
                <label className="block text-sm">
                  <span className="font-medium text-navy">Tên công ty</span>
                  <input
                    className="mt-1 h-9 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                    value={company.companyName}
                    onChange={(e) =>
                      setCompany({ companyName: e.target.value })
                    }
                    placeholder="Công ty TNHH …"
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-navy">Địa chỉ</span>
                  <textarea
                    rows={2}
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                    value={company.address}
                    onChange={(e) => setCompany({ address: e.target.value })}
                    placeholder="Số nhà, đường, quận/huyện, tỉnh/thành"
                  />
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block text-sm">
                    <span className="font-medium text-navy">MST</span>
                    <input
                      className="mt-1 h-9 w-full rounded-lg border border-border px-3 font-mono text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                      value={company.taxCode}
                      onChange={(e) => setCompany({ taxCode: e.target.value })}
                      placeholder="0XXXXXXXXX"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="font-medium text-navy">Điện thoại</span>
                    <input
                      className="mt-1 h-9 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                      value={company.phone}
                      onChange={(e) => setCompany({ phone: e.target.value })}
                      placeholder="0xxx xxx xxx"
                    />
                  </label>
                </div>
                <label className="block text-sm">
                  <span className="font-medium text-navy">Email</span>
                  <input
                    className="mt-1 h-9 w-full max-w-md rounded-lg border border-border px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                    value={company.email}
                    onChange={(e) => setCompany({ email: e.target.value })}
                    placeholder="support@keyon.vn"
                  />
                </label>
              </div>

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
                  <div>
                    <p className="text-sm font-medium text-navy">Cột menu</p>
                    <p className="mt-0.5 text-xs text-muted">
                      Gợi ý: thêm Điều khoản / Bảo mật /… vào cột Công ty (hoặc
                      cột bạn muốn).
                    </p>
                  </div>
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
          </div>
        );
      }}
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

function ComplianceBadgesSection({
  form,
  setForm,
}: {
  form: CmsFooter;
  setForm: (v: CmsFooter) => void;
}) {
  const [bctPickerOpen, setBctPickerOpen] = useState(false);
  const [dmcaPickerOpen, setDmcaPickerOpen] = useState(false);
  const bctPreview =
    resolveMediaUrl(form.bctImageUrl) || "/brand/bct-thong-bao.svg";
  const dmcaPreview =
    resolveMediaUrl(form.dmcaImageUrl) || "/brand/dmca-protected.svg";

  return (
    <div className="space-y-6 rounded-2xl border border-border bg-card p-6">
      <div>
        <p className="text-sm font-medium text-navy">
          Badge thanh dưới footer
        </p>
        <p className="mt-0.5 text-xs text-muted">
          BCT và DMCA nằm cùng hàng copyright / liên hệ nhanh — không còn dưới
          cột thương hiệu.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3 rounded-xl border border-border p-4">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium text-navy">Bộ Công Thương</p>
            <label className="flex items-center gap-2 text-sm font-medium text-navy">
              <input
                type="checkbox"
                checked={Boolean(form.bctVisible)}
                onChange={(e) =>
                  setForm({ ...form, bctVisible: e.target.checked })
                }
              />
              Hiện
            </label>
          </div>
          <div className="flex h-[56px] w-[140px] items-center justify-center overflow-hidden rounded-lg border border-border bg-white p-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={bctPreview}
              alt={form.bctAlt || "BCT"}
              className="h-full w-full object-contain object-left"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="h-9 rounded-lg border border-border bg-white px-3 text-sm font-medium hover:border-accent"
              onClick={() => setBctPickerOpen(true)}
            >
              {form.bctImageUrl ? "Đổi ảnh" : "Chọn từ Media"}
            </button>
            {form.bctImageUrl ? (
              <button
                type="button"
                className="h-9 rounded-lg px-3 text-sm text-danger hover:underline"
                onClick={() => setForm({ ...form, bctImageUrl: "" })}
              >
                Ảnh mặc định
              </button>
            ) : null}
          </div>
          <label className="block text-sm">
            <span className="font-medium text-navy">Link</span>
            <input
              className="mt-1 h-9 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              value={form.bctHref ?? ""}
              onChange={(e) => setForm({ ...form, bctHref: e.target.value })}
              placeholder="https://online.gov.vn/…"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-navy">Alt</span>
            <input
              className="mt-1 h-9 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              value={form.bctAlt ?? ""}
              onChange={(e) => setForm({ ...form, bctAlt: e.target.value })}
              placeholder="Đã thông báo Bộ Công Thương"
            />
          </label>
        </div>

        <div className="space-y-3 rounded-xl border border-border p-4">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium text-navy">DMCA</p>
            <label className="flex items-center gap-2 text-sm font-medium text-navy">
              <input
                type="checkbox"
                checked={Boolean(form.dmcaVisible)}
                onChange={(e) =>
                  setForm({ ...form, dmcaVisible: e.target.checked })
                }
              />
              Hiện
            </label>
          </div>
          <div className="flex h-[56px] w-[140px] items-center justify-center overflow-hidden rounded-lg border border-border bg-white p-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={dmcaPreview}
              alt={form.dmcaAlt || "DMCA"}
              className="h-full w-full object-contain object-left"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="h-9 rounded-lg border border-border bg-white px-3 text-sm font-medium hover:border-accent"
              onClick={() => setDmcaPickerOpen(true)}
            >
              {form.dmcaImageUrl ? "Đổi ảnh" : "Chọn từ Media"}
            </button>
            {form.dmcaImageUrl ? (
              <button
                type="button"
                className="h-9 rounded-lg px-3 text-sm text-danger hover:underline"
                onClick={() => setForm({ ...form, dmcaImageUrl: "" })}
              >
                Ảnh mặc định
              </button>
            ) : null}
          </div>
          <label className="block text-sm">
            <span className="font-medium text-navy">Link</span>
            <input
              className="mt-1 h-9 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              value={form.dmcaHref ?? ""}
              onChange={(e) => setForm({ ...form, dmcaHref: e.target.value })}
              placeholder="https://www.dmca.com/…"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-navy">Alt</span>
            <input
              className="mt-1 h-9 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              value={form.dmcaAlt ?? ""}
              onChange={(e) => setForm({ ...form, dmcaAlt: e.target.value })}
              placeholder="DMCA protected"
            />
          </label>
        </div>
      </div>

      <MediaPicker
        open={bctPickerOpen}
        onClose={() => setBctPickerOpen(false)}
        title="Chọn logo thông báo BCT"
        onSelect={(items) => {
          if (items[0]?.url) {
            setForm({ ...form, bctImageUrl: items[0].url });
          }
          setBctPickerOpen(false);
        }}
      />
      <MediaPicker
        open={dmcaPickerOpen}
        onClose={() => setDmcaPickerOpen(false)}
        title="Chọn badge DMCA"
        onSelect={(items) => {
          if (items[0]?.url) {
            setForm({ ...form, dmcaImageUrl: items[0].url });
          }
          setDmcaPickerOpen(false);
        }}
      />
    </div>
  );
}
