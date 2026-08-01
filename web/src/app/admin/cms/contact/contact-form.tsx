"use client";

import type { CmsContact } from "@/server/cms/types";
import { CmsSaveForm } from "../CmsSaveForm";

const field =
  "mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm";
const label = "block text-sm font-medium text-navy";
const section =
  "space-y-3 rounded-2xl border border-border bg-card p-5 sm:p-6";

export function ContactForm({ initial }: { initial: CmsContact }) {
  return (
    <CmsSaveForm initial={initial} apiKey="contact">
      {(form, setForm) => (
        <div className="space-y-4">
          <p className="rounded-xl bg-accent-soft/60 px-3 py-2 text-sm text-navy">
            Trang{" "}
            <a href="/contact" className="font-semibold text-accent underline">
              /contact
            </a>
            — nội dung vận hành (địa chỉ, hotline, giờ, form topics). Nhãn field
            form (Họ tên / Email…) hardcode trên storefront. Chat CTA = link
            (Zalo / tickets), chưa widget live chat.
          </p>

          <section className={section}>
            <h2 className="text-sm font-semibold text-navy">Hero</h2>
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
                <span className={label}>Accent (KEYON)</span>
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
          </section>

          <section className={section}>
            <h2 className="text-sm font-semibold text-navy">Bản đồ</h2>
            <label className="block text-sm">
              <span className={label}>Công ty</span>
              <input
                className={field}
                value={form.mapCompany}
                onChange={(e) =>
                  setForm({ ...form, mapCompany: e.target.value })
                }
              />
            </label>
            <label className="block text-sm">
              <span className={label}>Địa chỉ</span>
              <textarea
                rows={2}
                className={field}
                value={form.mapAddress}
                onChange={(e) =>
                  setForm({ ...form, mapAddress: e.target.value })
                }
              />
            </label>
            <label className="block text-sm">
              <span className={label}>URL Google Maps (nút mở)</span>
              <input
                className={`${field} font-mono text-xs`}
                value={form.mapMapsUrl}
                onChange={(e) =>
                  setForm({ ...form, mapMapsUrl: e.target.value })
                }
              />
            </label>
            <label className="block text-sm">
              <span className={label}>Mã nhúng bản đồ (iframe src)</span>
              <textarea
                rows={3}
                className={`${field} font-mono text-xs`}
                placeholder="https://www.openstreetmap.org/export/embed.html?... hoặc src từ Google Maps Embed"
                value={form.mapEmbedUrl}
                onChange={(e) =>
                  setForm({ ...form, mapEmbedUrl: e.target.value })
                }
              />
              <span className="mt-1 block text-xs text-muted">
                Dán URL trong thuộc tính <code>src</code> của iframe (không dán
                cả thẻ HTML). Để trống = nền placeholder.
              </span>
            </label>
          </section>

          <section className={section}>
            <h2 className="text-sm font-semibold text-navy">
              Thông tin liên hệ (cột trái)
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {(
                [
                  ["infoTitle", "Tiêu đề"],
                  ["hotlineValue", "Hotline"],
                  ["hotlineHint", "Hotline — gợi ý"],
                  ["emailValue", "Email"],
                  ["emailHint", "Email — gợi ý"],
                  ["chatValue", "Live chat — giá trị"],
                  ["chatHint", "Live chat — gợi ý"],
                  ["chatHref", "Live chat — link"],
                  ["hoursValue", "Giờ làm việc"],
                  ["hoursHint", "Giờ — gợi ý"],
                ] as const
              ).map(([key, title]) => (
                <label key={key} className="block text-sm">
                  <span className={label}>{title}</span>
                  <input
                    className={key.includes("Href") ? `${field} font-mono text-xs` : field}
                    value={String(form[key] ?? "")}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                  />
                </label>
              ))}
            </div>
            <label className="block text-sm">
              <span className={label}>Mô tả cột</span>
              <input
                className={field}
                value={form.infoLead}
                onChange={(e) => setForm({ ...form, infoLead: e.target.value })}
              />
            </label>
          </section>

          <section className={section}>
            <h2 className="text-sm font-semibold text-navy">
              Hỗ trợ tức thì (ô Chat ngay)
            </h2>
            <label className="block text-sm">
              <span className={label}>Tiêu đề</span>
              <input
                className={field}
                value={form.instantTitle}
                onChange={(e) =>
                  setForm({ ...form, instantTitle: e.target.value })
                }
              />
            </label>
            <label className="block text-sm">
              <span className={label}>Mô tả</span>
              <textarea
                rows={2}
                className={field}
                value={form.instantBody}
                onChange={(e) =>
                  setForm({ ...form, instantBody: e.target.value })
                }
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-sm">
                <span className={label}>Nút CTA</span>
                <input
                  className={field}
                  value={form.instantCta}
                  onChange={(e) =>
                    setForm({ ...form, instantCta: e.target.value })
                  }
                />
              </label>
              <label className="block text-sm">
                <span className={label}>Link CTA</span>
                <input
                  className={`${field} font-mono text-xs`}
                  placeholder="https://zalo.me/... hoặc /account/tickets"
                  value={form.instantCtaHref}
                  onChange={(e) =>
                    setForm({ ...form, instantCtaHref: e.target.value })
                  }
                />
              </label>
            </div>
            <label className="block text-sm">
              <span className={label}>Ưu điểm (mỗi dòng một mục)</span>
              <textarea
                rows={4}
                className={field}
                value={form.instantPerks.join("\n")}
                onChange={(e) =>
                  setForm({
                    ...form,
                    instantPerks: e.target.value
                      .split("\n")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
              />
            </label>
          </section>

          <section className={section}>
            <h2 className="text-sm font-semibold text-navy">Form gửi tin</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-sm sm:col-span-2">
                <span className={label}>Tiêu đề form</span>
                <input
                  className={field}
                  value={form.formTitle}
                  onChange={(e) =>
                    setForm({ ...form, formTitle: e.target.value })
                  }
                />
              </label>
              <label className="block text-sm sm:col-span-2">
                <span className={label}>Lead form</span>
                <input
                  className={field}
                  value={form.formLead}
                  onChange={(e) =>
                    setForm({ ...form, formLead: e.target.value })
                  }
                />
              </label>
              <label className="block text-sm sm:col-span-2">
                <span className={label}>Link chính sách bảo mật</span>
                <input
                  className={`${field} font-mono text-xs`}
                  value={form.formPrivacyHref}
                  onChange={(e) =>
                    setForm({ ...form, formPrivacyHref: e.target.value })
                  }
                />
              </label>
            </div>
            <label className="block text-sm">
              <span className={label}>Chủ đề (id|nhãn, mỗi dòng)</span>
              <textarea
                rows={5}
                className={`${field} font-mono text-xs`}
                value={form.formTopics
                  .map((t) => `${t.id}|${t.label}`)
                  .join("\n")}
                onChange={(e) =>
                  setForm({
                    ...form,
                    formTopics: e.target.value
                      .split("\n")
                      .map((line) => line.trim())
                      .filter(Boolean)
                      .map((line) => {
                        const [id, ...rest] = line.split("|");
                        return {
                          id: (id || "topic").trim(),
                          label: (rest.join("|") || id || "").trim(),
                        };
                      }),
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
