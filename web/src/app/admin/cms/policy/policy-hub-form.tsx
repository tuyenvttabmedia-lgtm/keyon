"use client";

import type { CmsPolicy } from "@/server/cms/types";
import { CmsSaveForm } from "../CmsSaveForm";

const field =
  "mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm";
const label = "block text-sm font-medium text-navy";
const section =
  "space-y-3 rounded-2xl border border-border bg-card p-5 sm:p-6";

/** Hub chrome only — page bodies live in Static Pages CMS. */
export function PolicyHubForm({ initial }: { initial: CmsPolicy }) {
  return (
    <CmsSaveForm initial={initial} apiKey="policy">
      {(form, setForm) => (
        <div className="space-y-4">
          <section className={section}>
            <h2 className="text-sm font-semibold text-navy">Hero hub</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-sm">
                <span className={label}>Tiêu đề</span>
                <input
                  className={field}
                  value={form.heroTitle}
                  onChange={(e) =>
                    setForm({ ...form, heroTitle: e.target.value })
                  }
                />
              </label>
              <label className="block text-sm">
                <span className={label}>Accent</span>
                <input
                  className={field}
                  value={form.heroTitleAccent}
                  onChange={(e) =>
                    setForm({ ...form, heroTitleAccent: e.target.value })
                  }
                />
              </label>
            </div>
            <label className="block text-sm">
              <span className={label}>Mô tả</span>
              <textarea
                rows={2}
                className={field}
                value={form.heroLead}
                onChange={(e) => setForm({ ...form, heroLead: e.target.value })}
              />
            </label>
            <label className="block text-sm">
              <span className={label}>CTA trên card</span>
              <input
                className={field}
                value={form.cardCta}
                onChange={(e) => setForm({ ...form, cardCta: e.target.value })}
              />
            </label>
          </section>

          <section className={section}>
            <h2 className="text-sm font-semibold text-navy">Thanh hỗ trợ hub</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {(
                [
                  ["supportTitle", "Tiêu đề"],
                  ["supportCta", "Nút CTA"],
                  ["supportCtaHref", "Link CTA"],
                  ["supportPhone", "Hotline"],
                  ["supportPhoneHint", "Hotline — gợi ý"],
                  ["supportEmail", "Email"],
                  ["supportEmailHint", "Email — gợi ý"],
                ] as const
              ).map(([key, title]) => (
                <label key={key} className="block text-sm">
                  <span className={label}>{title}</span>
                  <input
                    className={
                      key.includes("Href") || key.includes("Email")
                        ? `${field} font-mono text-xs`
                        : field
                    }
                    value={String(form[key])}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                  />
                </label>
              ))}
            </div>
            <label className="block text-sm">
              <span className={label}>Mô tả hỗ trợ</span>
              <textarea
                rows={2}
                className={field}
                value={form.supportBody}
                onChange={(e) =>
                  setForm({ ...form, supportBody: e.target.value })
                }
              />
            </label>
          </section>

          <section className={section}>
            <h2 className="text-sm font-semibold text-navy">Trang chi tiết</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {(
                [
                  ["sidebarTitle", "Tiêu đề sidebar"],
                  ["detailSupportTitle", "Hộp hỗ trợ — tiêu đề"],
                  ["detailUpdatedLabel", "Nhãn ngày cập nhật"],
                  ["detailPdfLabel", "Nhãn nút PDF"],
                ] as const
              ).map(([key, title]) => (
                <label key={key} className="block text-sm">
                  <span className={label}>{title}</span>
                  <input
                    className={field}
                    value={String(form[key] ?? "")}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                  />
                </label>
              ))}
            </div>
            <label className="block text-sm">
              <span className={label}>Hộp hỗ trợ — mô tả</span>
              <input
                className={field}
                value={form.detailSupportBody}
                onChange={(e) =>
                  setForm({ ...form, detailSupportBody: e.target.value })
                }
              />
            </label>
            <label className="block text-sm">
              <span className={label}>
                Số mục mở sẵn (phần còn lại = accordion)
              </span>
              <input
                type="number"
                min={0}
                max={20}
                className={field}
                value={form.openSectionCount}
                onChange={(e) =>
                  setForm({
                    ...form,
                    openSectionCount: Number(e.target.value) || 0,
                  })
                }
              />
            </label>
          </section>
        </div>
      )}
    </CmsSaveForm>
  );
}
