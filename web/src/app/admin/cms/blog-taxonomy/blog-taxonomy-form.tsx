"use client";

import { useMemo, useState } from "react";
import type {
  CmsBlogSectionId,
  CmsBlogTaxonomy,
  CmsBlogTaxonomyTopic,
} from "@/server/cms/types";
import { slugifyTopicId } from "@/storefront/lib/blog-taxonomy";
import {
  ADMIN_BTN_GHOST,
  ADMIN_BTN_PRIMARY,
  ADMIN_INPUT,
  ADMIN_PANEL,
  ADMIN_TOOLBAR,
} from "@/app/admin/ui/tokens";
import { Z_STICKY } from "@/storefront/effects";

const SECTION_OPTIONS: { id: CmsBlogSectionId; label: string }[] = [
  { id: "insights", label: "Chuyên sâu" },
  { id: "guides", label: "Hướng dẫn" },
  { id: "news", label: "Tin tức" },
];

function newTopic(sortOrder: number): CmsBlogTaxonomyTopic {
  return {
    id: "",
    label: "Chủ đề mới",
    defaultSection: "insights",
    visible: true,
    sortOrder,
  };
}

export function BlogTaxonomyForm({ initial }: { initial: CmsBlogTaxonomy }) {
  const [form, setForm] = useState(initial);
  const [baseline, setBaseline] = useState(() => JSON.stringify(initial));
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const dirty = useMemo(() => JSON.stringify(form) !== baseline, [form, baseline]);

  async function save() {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/cms/blog-taxonomy", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lỗi lưu");
      const next = data.data as CmsBlogTaxonomy;
      setForm(next);
      setBaseline(JSON.stringify(next));
      setMsg("Đã lưu danh mục bài viết");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setSaving(false);
    }
  }

  function patchSection(
    id: CmsBlogSectionId,
    partial: Partial<(typeof form.sections)[number]>,
  ) {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === id ? { ...s, ...partial } : s,
      ),
    }));
  }

  function patchTopic(index: number, partial: Partial<CmsBlogTaxonomyTopic>) {
    setForm((prev) => ({
      ...prev,
      topics: prev.topics.map((t, i) =>
        i === index ? { ...t, ...partial } : t,
      ),
    }));
  }

  return (
    <div className="space-y-6">
      <div
        className={`sticky top-0 flex flex-wrap items-center gap-2 border-b border-border bg-card/95 py-3 backdrop-blur ${Z_STICKY}`}
      >
        <div className={ADMIN_TOOLBAR}>
          <button
            type="button"
            disabled={!dirty || saving}
            onClick={() => void save()}
            className={ADMIN_BTN_PRIMARY}
          >
            {saving ? "Đang lưu…" : "Lưu"}
          </button>
          {msg ? <p className="text-xs text-muted">{msg}</p> : null}
          {dirty ? (
            <p className="text-xs text-amber-800">Có thay đổi chưa lưu</p>
          ) : null}
        </div>
      </div>

      <section className={`${ADMIN_PANEL} space-y-3 p-4`}>
        <h2 className="text-sm font-semibold text-navy">Hub Kiến thức</h2>
        <label className="block text-xs text-muted">
          Tiêu đề hub
          <input
            className={`mt-1 ${ADMIN_INPUT}`}
            value={form.hubTitle}
            onChange={(e) =>
              setForm((p) => ({ ...p, hubTitle: e.target.value }))
            }
          />
        </label>
        <label className="block text-xs text-muted">
          Mô tả hub
          <textarea
            rows={3}
            className={`mt-1 ${ADMIN_INPUT}`}
            value={form.hubLead}
            onChange={(e) =>
              setForm((p) => ({ ...p, hubLead: e.target.value }))
            }
          />
        </label>
      </section>

      <section className={`${ADMIN_PANEL} space-y-4 p-4`}>
        <div>
          <h2 className="text-sm font-semibold text-navy">Chuyên mục</h2>
          <p className="mt-1 text-xs text-muted">
            Ba chuyên mục gắn URL cố định (/kien-thuc/chuyen-sau|huong-dan|tin-tuc).
            Chỉ sửa nhãn và mô tả — không đổi slug.
          </p>
        </div>
        {form.sections.map((s) => (
          <div
            key={s.id}
            className="space-y-2 rounded-xl border border-border p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-navy">
                {SECTION_OPTIONS.find((o) => o.id === s.id)?.label ?? s.id}
                <span className="ml-2 text-xs font-normal text-muted">
                  /kien-thuc/
                  {s.id === "insights"
                    ? "chuyen-sau"
                    : s.id === "guides"
                      ? "huong-dan"
                      : "tin-tuc"}
                </span>
              </p>
              <label className="flex items-center gap-2 text-xs text-navy">
                <input
                  type="checkbox"
                  checked={s.visible}
                  onChange={(e) =>
                    patchSection(s.id, { visible: e.target.checked })
                  }
                />
                Hiện
              </label>
            </div>
            <label className="block text-xs text-muted">
              Nhãn
              <input
                className={`mt-1 ${ADMIN_INPUT}`}
                value={s.label}
                onChange={(e) => patchSection(s.id, { label: e.target.value })}
              />
            </label>
            <label className="block text-xs text-muted">
              Tiêu đề trang
              <input
                className={`mt-1 ${ADMIN_INPUT}`}
                value={s.title}
                onChange={(e) => patchSection(s.id, { title: e.target.value })}
              />
            </label>
            <label className="block text-xs text-muted">
              Mô tả
              <textarea
                rows={2}
                className={`mt-1 ${ADMIN_INPUT}`}
                value={s.subtitle}
                onChange={(e) =>
                  patchSection(s.id, { subtitle: e.target.value })
                }
              />
            </label>
          </div>
        ))}
      </section>

      <section className={`${ADMIN_PANEL} space-y-4 p-4`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-navy">Chủ đề</h2>
            <p className="mt-1 text-xs text-muted">
              Lọc trong chuyên mục và trang /kien-thuc/chu-de/&#123;slug&#125;.
            </p>
          </div>
          <button
            type="button"
            className={ADMIN_BTN_GHOST}
            onClick={() =>
              setForm((p) => ({
                ...p,
                topics: [...p.topics, newTopic(p.topics.length)],
              }))
            }
          >
            + Thêm chủ đề
          </button>
        </div>
        {form.topics.length === 0 ? (
          <p className="text-sm text-muted">Chưa có chủ đề.</p>
        ) : (
          <ul className="space-y-3">
            {form.topics.map((t, index) => (
              <li
                key={`${t.id}-${index}`}
                className="space-y-2 rounded-xl border border-border p-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="flex items-center gap-2 text-xs text-navy">
                    <input
                      type="checkbox"
                      checked={t.visible}
                      onChange={(e) =>
                        patchTopic(index, { visible: e.target.checked })
                      }
                    />
                    Hiện
                  </label>
                  <button
                    type="button"
                    className="text-xs text-red-600 hover:underline"
                    onClick={() =>
                      setForm((p) => ({
                        ...p,
                        topics: p.topics.filter((_, i) => i !== index),
                      }))
                    }
                  >
                    Xóa
                  </button>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <label className="block text-xs text-muted">
                    Nhãn
                    <input
                      className={`mt-1 ${ADMIN_INPUT}`}
                      value={t.label}
                      onChange={(e) => {
                        const label = e.target.value;
                        const next: Partial<CmsBlogTaxonomyTopic> = { label };
                        if (!t.id || t.id.startsWith("chu-de-")) {
                          next.id = slugifyTopicId(label);
                        }
                        patchTopic(index, next);
                      }}
                    />
                  </label>
                  <label className="block text-xs text-muted">
                    Slug URL
                    <input
                      className={`mt-1 ${ADMIN_INPUT}`}
                      value={t.id}
                      onChange={(e) =>
                        patchTopic(index, {
                          id: slugifyTopicId(e.target.value),
                        })
                      }
                      placeholder="windows"
                    />
                  </label>
                </div>
                <label className="block text-xs text-muted">
                  Chuyên mục mặc định khi gán chủ đề
                  <select
                    className={`mt-1 ${ADMIN_INPUT}`}
                    value={t.defaultSection}
                    onChange={(e) =>
                      patchTopic(index, {
                        defaultSection: e.target.value as CmsBlogSectionId,
                      })
                    }
                  >
                    {SECTION_OPTIONS.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </label>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
