"use client";

import { useEffect, useMemo, useState } from "react";
import type { CmsFaqCategory, CmsFaqItem } from "@/server/cms/types";
import { FAQ_CATEGORIES } from "@/storefront/content/faq-categories";

const PAGE_SIZE = 20;

type VisibilityFilter = "all" | "home" | "faq" | "hidden";

function categoryLabel(id: CmsFaqCategory) {
  return FAQ_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

function emptyItem(): CmsFaqItem {
  return {
    id: `q_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    question: "",
    answer: "",
    category: "general",
    showOnHome: false,
    showOnFaqPage: true,
  };
}

export function FaqForm({ initial }: { initial: CmsFaqItem[] }) {
  const [items, setItems] = useState<CmsFaqItem[]>(() =>
    initial.map((item) => ({
      ...item,
      category: item.category ?? ("general" as CmsFaqCategory),
    })),
  );
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<"" | CmsFaqCategory>("");
  const [visibility, setVisibility] = useState<VisibilityFilter>("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!editingId) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setEditingId(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editingId]);

  function commit(next: CmsFaqItem[]) {
    setItems(next);
    setDirty(true);
    setMsg(null);
  }

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter((item) => {
      if (category && (item.category ?? "general") !== category) return false;
      if (visibility === "home" && !item.showOnHome) return false;
      if (visibility === "faq" && !item.showOnFaqPage) return false;
      if (visibility === "hidden" && (item.showOnHome || item.showOnFaqPage))
        return false;
      if (!needle) return true;
      return (
        item.question.toLowerCase().includes(needle) ||
        item.answer.toLowerCase().includes(needle)
      );
    });
  }, [items, q, category, visibility]);

  useEffect(() => {
    setPage((p) =>
      Math.min(p, Math.max(1, Math.ceil(filtered.length / PAGE_SIZE) || 1)),
    );
  }, [filtered.length]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const editing = editingId
    ? items.find((i) => i.id === editingId) ?? null
    : null;
  const editingIndex = editing
    ? items.findIndex((i) => i.id === editing.id)
    : -1;

  const stats = useMemo(
    () => ({
      total: items.length,
      home: items.filter((i) => i.showOnHome).length,
      faq: items.filter((i) => i.showOnFaqPage).length,
      hidden: items.filter((i) => !i.showOnHome && !i.showOnFaqPage).length,
    }),
    [items],
  );

  function patchItem(id: string, patch: Partial<CmsFaqItem>) {
    commit(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }

  function moveItem(id: string, dir: -1 | 1) {
    const idx = items.findIndex((i) => i.id === id);
    const target = idx + dir;
    if (idx < 0 || target < 0 || target >= items.length) return;
    const next = [...items];
    const [row] = next.splice(idx, 1);
    next.splice(target, 0, row!);
    commit(next);
  }

  function removeItem(id: string) {
    if (!confirm("Xóa câu hỏi này?")) return;
    commit(items.filter((i) => i.id !== id));
    setSelected((prev) => {
      const n = new Set(prev);
      n.delete(id);
      return n;
    });
    if (editingId === id) setEditingId(null);
  }

  function addNew() {
    const item = emptyItem();
    item.question = "Câu hỏi mới";
    commit([item, ...items]);
    setQ("");
    setCategory("");
    setVisibility("all");
    setPage(1);
    setEditingId(item.id);
    setDirty(true);
  }

  function duplicateItem(id: string) {
    const src = items.find((i) => i.id === id);
    if (!src) return;
    const copy: CmsFaqItem = {
      ...src,
      id: `q_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      question: `${src.question} (bản sao)`,
      showOnHome: false,
    };
    const idx = items.findIndex((i) => i.id === id);
    const next = [...items];
    next.splice(idx + 1, 0, copy);
    commit(next);
    setEditingId(copy.id);
  }

  function bulkSet(
    patch: Partial<Pick<CmsFaqItem, "showOnHome" | "showOnFaqPage" | "category">>,
  ) {
    if (selected.size === 0) return;
    commit(
      items.map((i) => (selected.has(i.id) ? { ...i, ...patch } : i)),
    );
  }

  function bulkDelete() {
    if (selected.size === 0) return;
    if (!confirm(`Xóa ${selected.size} câu hỏi đã chọn?`)) return;
    commit(items.filter((i) => !selected.has(i.id)));
    setSelected(new Set());
    if (editingId && selected.has(editingId)) setEditingId(null);
  }

  function toggleSelectAllOnPage(checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      for (const row of pageItems) {
        if (checked) next.add(row.id);
        else next.delete(row.id);
      }
      return next;
    });
  }

  async function save() {
    setSaving(true);
    setMsg(null);
    try {
      const payload = items.map((i) => ({
        ...i,
        question: i.question.trim(),
        answer: i.answer.trim(),
        category: i.category ?? "general",
      }));
      const blank = payload.find((i) => !i.question);
      if (blank) {
        setEditingId(blank.id);
        throw new Error("Có câu hỏi trống — hãy nhập nội dung hoặc xóa");
      }
      const res = await fetch("/api/admin/cms/faq", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lưu thất bại");
      setItems(payload);
      setDirty(false);
      setMsg(`Đã lưu ${payload.length} câu hỏi`);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setSaving(false);
    }
  }

  const allOnPageSelected =
    pageItems.length > 0 && pageItems.every((r) => selected.has(r.id));

  return (
    <div className="space-y-4">
      {/* Sticky toolbar */}
      <div className="sticky top-0 z-20 -mx-1 space-y-3 rounded-2xl border border-border bg-white/95 p-3 shadow-sm backdrop-blur sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2 text-xs text-muted">
            <span className="rounded-full bg-surface px-2.5 py-1 font-medium text-navy">
              {stats.total} câu
            </span>
            <span className="rounded-full bg-surface px-2.5 py-1">
              Home {stats.home}
            </span>
            <span className="rounded-full bg-surface px-2.5 py-1">
              FAQ {stats.faq}
            </span>
            {stats.hidden > 0 ? (
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-800">
                Ẩn {stats.hidden}
              </span>
            ) : null}
            {dirty ? (
              <span className="rounded-full bg-amber-100 px-2.5 py-1 font-medium text-amber-900">
                Chưa lưu
              </span>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={addNew}
              className="rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-surface"
            >
              + Thêm câu hỏi
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => void save()}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {saving ? "Đang lưu…" : "Lưu và xuất bản"}
            </button>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <input
            className="h-10 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            placeholder="Tìm câu hỏi hoặc câu trả lời…"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
          />
          <select
            className="h-10 w-full rounded-lg border border-border px-3 text-sm"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value as "" | CmsFaqCategory);
              setPage(1);
            }}
          >
            <option value="">Tất cả danh mục</option>
            {FAQ_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
          <select
            className="h-10 w-full rounded-lg border border-border px-3 text-sm"
            value={visibility}
            onChange={(e) => {
              setVisibility(e.target.value as VisibilityFilter);
              setPage(1);
            }}
          >
            <option value="all">Tất cả vị trí</option>
            <option value="home">Hiện trên Home</option>
            <option value="faq">Hiện trang FAQ</option>
            <option value="hidden">Đang ẩn hết</option>
          </select>
          <p className="flex h-10 items-center text-xs text-muted">
            Hiển thị {filtered.length} / {items.length}
            {filtered.length !== items.length ? " (đã lọc)" : ""}
          </p>
        </div>

        {selected.size > 0 ? (
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-accent/20 bg-accent-soft/60 px-3 py-2 text-sm">
            <span className="font-medium text-navy">
              Đã chọn {selected.size}
            </span>
            <button
              type="button"
              className="rounded-md border border-border bg-white px-2 py-1 text-xs"
              onClick={() => bulkSet({ showOnHome: true })}
            >
              Bật Home
            </button>
            <button
              type="button"
              className="rounded-md border border-border bg-white px-2 py-1 text-xs"
              onClick={() => bulkSet({ showOnHome: false })}
            >
              Tắt Home
            </button>
            <button
              type="button"
              className="rounded-md border border-border bg-white px-2 py-1 text-xs"
              onClick={() => bulkSet({ showOnFaqPage: true })}
            >
              Bật FAQ
            </button>
            <button
              type="button"
              className="rounded-md border border-border bg-white px-2 py-1 text-xs"
              onClick={() => bulkSet({ showOnFaqPage: false })}
            >
              Tắt FAQ
            </button>
            <select
              className="rounded-md border border-border bg-white px-2 py-1 text-xs"
              defaultValue=""
              onChange={(e) => {
                const v = e.target.value as CmsFaqCategory | "";
                if (!v) return;
                bulkSet({ category: v });
                e.target.value = "";
              }}
            >
              <option value="">Đổi danh mục…</option>
              {FAQ_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="rounded-md border border-danger/30 bg-white px-2 py-1 text-xs text-danger"
              onClick={bulkDelete}
            >
              Xóa đã chọn
            </button>
            <button
              type="button"
              className="ml-auto text-xs text-muted hover:underline"
              onClick={() => setSelected(new Set())}
            >
              Bỏ chọn
            </button>
          </div>
        ) : null}

        {msg ? (
          <p
            className={`text-sm ${
              msg.startsWith("Đã lưu") ? "text-emerald-700" : "text-danger"
            }`}
          >
            {msg}
          </p>
        ) : null}
      </div>

      {/* Compact list */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-border bg-surface text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="w-10 px-3 py-2.5">
                  <input
                    type="checkbox"
                    checked={allOnPageSelected}
                    onChange={(e) => toggleSelectAllOnPage(e.target.checked)}
                    aria-label="Chọn tất cả trang này"
                  />
                </th>
                <th className="w-12 px-2 py-2.5">#</th>
                <th className="px-3 py-2.5">Câu hỏi</th>
                <th className="w-32 px-3 py-2.5">Danh mục</th>
                <th className="w-20 px-2 py-2.5 text-center">Home</th>
                <th className="w-20 px-2 py-2.5 text-center">FAQ</th>
                <th className="w-36 px-3 py-2.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-muted"
                  >
                    {items.length === 0
                      ? "Chưa có FAQ — bấm “+ Thêm câu hỏi”."
                      : "Không có kết quả khớp bộ lọc."}
                  </td>
                </tr>
              ) : (
                pageItems.map((row) => {
                  const globalIdx = items.findIndex((i) => i.id === row.id);
                  const active = editingId === row.id;
                  return (
                    <tr
                      key={row.id}
                      className={`border-b border-border/80 transition hover:bg-surface/80 ${
                        active ? "bg-accent-soft/40" : ""
                      }`}
                    >
                      <td className="px-3 py-2.5 align-middle">
                        <input
                          type="checkbox"
                          checked={selected.has(row.id)}
                          onChange={() => {
                            setSelected((prev) => {
                              const next = new Set(prev);
                              if (next.has(row.id)) next.delete(row.id);
                              else next.add(row.id);
                              return next;
                            });
                          }}
                        />
                      </td>
                      <td className="px-2 py-2.5 align-middle font-mono text-xs text-muted">
                        {globalIdx + 1}
                      </td>
                      <td className="px-3 py-2.5 align-middle">
                        <button
                          type="button"
                          className="max-w-[42rem] text-left font-medium text-navy hover:text-accent"
                          onClick={() =>
                            setEditingId(active ? null : row.id)
                          }
                        >
                          <span className="line-clamp-2">
                            {row.question || (
                              <span className="italic text-muted">
                                (Chưa có tiêu đề)
                              </span>
                            )}
                          </span>
                        </button>
                        {row.answer ? (
                          <p className="mt-0.5 line-clamp-1 text-xs text-muted">
                            {row.answer}
                          </p>
                        ) : (
                          <p className="mt-0.5 text-xs italic text-amber-700">
                            Chưa có câu trả lời
                          </p>
                        )}
                      </td>
                      <td className="px-3 py-2.5 align-middle text-xs">
                        {categoryLabel(row.category ?? "general")}
                      </td>
                      <td className="px-2 py-2.5 text-center align-middle">
                        <input
                          type="checkbox"
                          checked={row.showOnHome}
                          onChange={(e) =>
                            patchItem(row.id, {
                              showOnHome: e.target.checked,
                            })
                          }
                          title="Hiện trên Home"
                        />
                      </td>
                      <td className="px-2 py-2.5 text-center align-middle">
                        <input
                          type="checkbox"
                          checked={row.showOnFaqPage}
                          onChange={(e) =>
                            patchItem(row.id, {
                              showOnFaqPage: e.target.checked,
                            })
                          }
                          title="Hiện trang FAQ"
                        />
                      </td>
                      <td className="px-3 py-2.5 text-right align-middle">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            className="rounded px-1.5 py-1 text-xs text-muted hover:bg-surface hover:text-navy"
                            title="Lên"
                            disabled={globalIdx <= 0}
                            onClick={() => moveItem(row.id, -1)}
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            className="rounded px-1.5 py-1 text-xs text-muted hover:bg-surface hover:text-navy"
                            title="Xuống"
                            disabled={globalIdx >= items.length - 1}
                            onClick={() => moveItem(row.id, 1)}
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            className="rounded px-2 py-1 text-xs font-medium text-accent hover:bg-accent-soft"
                            onClick={() => setEditingId(row.id)}
                          >
                            Sửa
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 ? (
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-3 py-2.5 text-sm">
            <span className="text-xs text-muted">
              Trang {safePage} / {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={safePage <= 1}
                className="rounded-lg border border-border px-3 py-1.5 text-xs disabled:opacity-40"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                ← Trước
              </button>
              <button
                type="button"
                disabled={safePage >= totalPages}
                className="rounded-lg border border-border px-3 py-1.5 text-xs disabled:opacity-40"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Sau →
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Edit drawer */}
      {editing ? (
        <div className="fixed inset-0 z-40 flex justify-end bg-navy/40">
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Đóng"
            onClick={() => setEditingId(null)}
          />
          <aside className="relative flex h-full w-full max-w-lg flex-col border-l border-border bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-navy">Sửa FAQ</p>
                <p className="text-xs text-muted">
                  Thứ tự #{editingIndex + 1} · ID {editing.id}
                </p>
              </div>
              <button
                type="button"
                className="rounded-lg border border-border px-3 py-1.5 text-sm"
                onClick={() => setEditingId(null)}
              >
                Đóng
              </button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              <label className="block text-xs font-medium text-muted">
                Câu hỏi
                <input
                  className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm font-medium text-navy outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                  value={editing.question}
                  onChange={(e) =>
                    patchItem(editing.id, { question: e.target.value })
                  }
                  placeholder="Nhập câu hỏi…"
                  autoFocus
                />
              </label>
              <label className="block text-xs font-medium text-muted">
                Câu trả lời
                <textarea
                  rows={10}
                  className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm leading-relaxed outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                  value={editing.answer}
                  onChange={(e) =>
                    patchItem(editing.id, { answer: e.target.value })
                  }
                  placeholder="Nhập câu trả lời…"
                />
              </label>
              <label className="block text-xs font-medium text-muted">
                Danh mục
                <select
                  className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
                  value={editing.category ?? "general"}
                  onChange={(e) =>
                    patchItem(editing.id, {
                      category: e.target.value as CmsFaqCategory,
                    })
                  }
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
                    checked={editing.showOnHome}
                    onChange={(e) =>
                      patchItem(editing.id, {
                        showOnHome: e.target.checked,
                      })
                    }
                  />
                  Hiện trên Home
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editing.showOnFaqPage}
                    onChange={(e) =>
                      patchItem(editing.id, {
                        showOnFaqPage: e.target.checked,
                      })
                    }
                  />
                  Hiện trang FAQ
                </label>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 border-t border-border p-4">
              <button
                type="button"
                className="rounded-lg border border-border px-3 py-2 text-sm"
                onClick={() => duplicateItem(editing.id)}
              >
                Nhân bản
              </button>
              <button
                type="button"
                className="rounded-lg border border-danger/30 px-3 py-2 text-sm text-danger"
                onClick={() => removeItem(editing.id)}
              >
                Xóa
              </button>
              <button
                type="button"
                className="ml-auto rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white"
                onClick={() => setEditingId(null)}
              >
                Xong
              </button>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
