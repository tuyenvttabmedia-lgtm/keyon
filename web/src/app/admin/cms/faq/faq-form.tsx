"use client";

import type { CmsFaqCategory, CmsFaqItem } from "@/server/cms/types";
import { FAQ_CATEGORIES } from "@/storefront/content/faq-categories";
import { CmsSaveForm } from "../CmsSaveForm";

export function FaqForm({ initial }: { initial: CmsFaqItem[] }) {
  const normalized = initial.map((item) => ({
    ...item,
    category: item.category ?? ("general" as CmsFaqCategory),
  }));

  return (
    <CmsSaveForm initial={normalized} apiKey="faq">
      {(form, setForm) => (
        <div className="space-y-4">
          {form.map((item, idx) => (
            <div key={item.id} className="space-y-3 rounded-2xl border border-border bg-card p-4">
              <input
                className="w-full rounded-lg border border-border px-3 py-2 text-sm font-medium"
                value={item.question}
                onChange={(e) => {
                  const next = [...form];
                  next[idx] = { ...item, question: e.target.value };
                  setForm(next);
                }}
              />
              <textarea
                rows={3}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                value={item.answer}
                onChange={(e) => {
                  const next = [...form];
                  next[idx] = { ...item, answer: e.target.value };
                  setForm(next);
                }}
              />
              <label className="block text-sm">
                <span className="text-muted">Danh mục</span>
                <select
                  className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                  value={item.category ?? "general"}
                  onChange={(e) => {
                    const next = [...form];
                    next[idx] = {
                      ...item,
                      category: e.target.value as CmsFaqCategory,
                    };
                    setForm(next);
                  }}
                >
                  {FAQ_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex flex-wrap gap-4 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={item.showOnHome}
                    onChange={(e) => {
                      const next = [...form];
                      next[idx] = { ...item, showOnHome: e.target.checked };
                      setForm(next);
                    }}
                  />
                  Hiện trên Home
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={item.showOnFaqPage}
                    onChange={(e) => {
                      const next = [...form];
                      next[idx] = { ...item, showOnFaqPage: e.target.checked };
                      setForm(next);
                    }}
                  />
                  Hiện trang FAQ
                </label>
                <button
                  type="button"
                  className="text-danger"
                  onClick={() => setForm(form.filter((_, i) => i !== idx))}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="rounded-lg border border-border px-4 py-2 text-sm"
            onClick={() =>
              setForm([
                ...form,
                {
                  id: `q_${Date.now()}`,
                  question: "Câu hỏi mới",
                  answer: "",
                  category: "general",
                  showOnHome: false,
                  showOnFaqPage: true,
                },
              ])
            }
          >
            + Thêm câu hỏi
          </button>
        </div>
      )}
    </CmsSaveForm>
  );
}
