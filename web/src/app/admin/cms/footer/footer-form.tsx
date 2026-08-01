"use client";

import type { CmsFooter } from "@/server/cms/types";
import { CmsSaveForm } from "../CmsSaveForm";

export function FooterForm({ initial }: { initial: CmsFooter }) {
  return (
    <CmsSaveForm initial={initial} apiKey="footer">
      {(form, setForm) => (
        <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
          <label className="block text-sm">
            <span className="font-medium">Mô tả thương hiệu</span>
            <textarea
              rows={3}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2"
              value={form.blurb}
              onChange={(e) => setForm({ ...form, blurb: e.target.value })}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Copyright</span>
            <input
              className="mt-1 w-full rounded-lg border border-border px-3 py-2"
              value={form.copyright}
              onChange={(e) => setForm({ ...form, copyright: e.target.value })}
            />
          </label>
          {form.columns.map((col, ci) => (
            <div key={ci} className="rounded-xl border border-border p-4 space-y-2">
              <input
                className="w-full rounded-lg border border-border px-3 py-2 text-sm font-medium"
                value={col.title}
                onChange={(e) => {
                  const columns = [...form.columns];
                  columns[ci] = { ...col, title: e.target.value };
                  setForm({ ...form, columns });
                }}
              />
              {col.links.map((link, li) => (
                <div key={li} className="grid gap-2 sm:grid-cols-2">
                  <input
                    className="rounded-lg border border-border px-2 py-1.5 text-sm"
                    value={link.label}
                    onChange={(e) => {
                      const columns = [...form.columns];
                      const links = [...col.links];
                      links[li] = { ...link, label: e.target.value };
                      columns[ci] = { ...col, links };
                      setForm({ ...form, columns });
                    }}
                  />
                  <input
                    className="rounded-lg border border-border px-2 py-1.5 font-mono text-xs"
                    value={link.href}
                    onChange={(e) => {
                      const columns = [...form.columns];
                      const links = [...col.links];
                      links[li] = { ...link, href: e.target.value };
                      columns[ci] = { ...col, links };
                      setForm({ ...form, columns });
                    }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </CmsSaveForm>
  );
}
