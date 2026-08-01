"use client";

import type { CmsNav } from "@/server/cms/types";
import { CmsSaveForm } from "../CmsSaveForm";

export function NavForm({ initial }: { initial: CmsNav }) {
  return (
    <CmsSaveForm initial={initial} apiKey="nav">
      {(form, setForm) => (
        <div className="space-y-3 rounded-2xl border border-border bg-card p-6">
          {form.items.map((item, idx) => (
            <div key={idx} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
              <input
                className="rounded-lg border border-border px-3 py-2 text-sm"
                value={item.label}
                onChange={(e) => {
                  const items = [...form.items];
                  items[idx] = { ...item, label: e.target.value };
                  setForm({ items });
                }}
              />
              <input
                className="rounded-lg border border-border px-3 py-2 font-mono text-xs"
                value={item.href}
                onChange={(e) => {
                  const items = [...form.items];
                  items[idx] = { ...item, href: e.target.value };
                  setForm({ items });
                }}
              />
              <button
                type="button"
                className="text-sm text-danger"
                onClick={() => setForm({ items: form.items.filter((_, i) => i !== idx) })}
              >
                Xóa
              </button>
            </div>
          ))}
          <button
            type="button"
            className="rounded-lg border border-border px-4 py-2 text-sm"
            onClick={() =>
              setForm({ items: [...form.items, { label: "Mục mới", href: "/" }] })
            }
          >
            + Thêm mục
          </button>
        </div>
      )}
    </CmsSaveForm>
  );
}
