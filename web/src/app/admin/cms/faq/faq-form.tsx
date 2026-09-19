"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  CmsFaqCategoryDef,
  CmsFaqDocument,
  CmsFaqItem,
} from "@/server/cms/types";
import { groupCategoriesForSidebar } from "@/storefront/content/faq-groups";
import { ELEVATION_MODAL, ELEVATION_NONE, Z_MODAL, Z_STICKY } from "@/storefront/effects";

const PAGE_SIZE = 20;

type VisibilityFilter = "all" | "home" | "faq" | "hidden";
type FaqWorkspace = "questions" | "categories";

function slugify(raw: string): string {
  const s = raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return s || "general";
}

function emptyItem(defaultCategory: string): CmsFaqItem {
  return {
    id: `q_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    question: "",
    answer: "",
    category: defaultCategory,
    showOnHome: false,
    showOnFaqPage: true,
  };
}

function categoryOptionGroups(categories: CmsFaqCategoryDef[]) {
  return groupCategoriesForSidebar(categories).map(({ group, categories: cats }) => (
    <optgroup key={`${group.id}-${group.label}`} label={group.label}>
      {cats.map((cat) => (
        <option key={cat.id} value={cat.id}>
          {cat.label}
        </option>
      ))}
    </optgroup>
  ));
}

export function FaqForm({ initial }: { initial: CmsFaqDocument }) {
  const [categories, setCategories] = useState<CmsFaqCategoryDef[]>(
    () => initial.categories,
  );
  const [items, setItems] = useState<CmsFaqItem[]>(() =>
    initial.items.map((item) => ({
      ...item,
      category: item.category || "general",
    })),
  );
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [visibility, setVisibility] = useState<VisibilityFilter>("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  const [newCatLabel, setNewCatLabel] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");
  const [workspace, setWorkspace] = useState<FaqWorkspace>("questions");
  const [catQuery, setCatQuery] = useState("");
  const [expandedCatId, setExpandedCatId] = useState<string | null>(null);

  useEffect(() => {
    if (!editingId) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setEditingId(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editingId]);

  useEffect(() => {
    if (!dirty) return;
    function onBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = "";
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  function markDirty() {
    setDirty(true);
    setMsg(null);
  }

  function commitItems(next: CmsFaqItem[]) {
    setItems(next);
    markDirty();
  }

  function commitCategories(next: CmsFaqCategoryDef[]) {
    setCategories(next);
    markDirty();
  }

  const categoryLabel = (id: string) =>
    categories.find((c) => c.id === id)?.label ?? id;

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
    ? (items.find((i) => i.id === editingId) ?? null)
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
      cats: categories.length,
    }),
    [items, categories],
  );

  function patchItem(id: string, patch: Partial<CmsFaqItem>) {
    commitItems(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }

  function moveItem(id: string, dir: -1 | 1) {
    const idx = items.findIndex((i) => i.id === id);
    const target = idx + dir;
    if (idx < 0 || target < 0 || target >= items.length) return;
    const next = [...items];
    const [row] = next.splice(idx, 1);
    next.splice(target, 0, row!);
    commitItems(next);
  }

  function moveCategory(id: string, dir: -1 | 1) {
    const idx = categories.findIndex((c) => c.id === id);
    const target = idx + dir;
    if (idx < 0 || target < 0 || target >= categories.length) return;
    const next = [...categories];
    const [row] = next.splice(idx, 1);
    next.splice(target, 0, row!);
    commitCategories(next);
  }

  function removeItem(id: string) {
    if (!confirm("Xóa câu hỏi này?")) return;
    commitItems(items.filter((i) => i.id !== id));
    setSelected((prev) => {
      const n = new Set(prev);
      n.delete(id);
      return n;
    });
    if (editingId === id) setEditingId(null);
  }

  function addNew() {
    const defaultCat = category || categories[0]?.id || "mua-hang";
    const item = emptyItem(defaultCat);
    item.question = "Câu hỏi mới";
    if (visibility === "home") item.showOnHome = true;
    if (visibility === "hidden") item.showOnFaqPage = false;
    commitItems([item, ...items]);
    setQ("");
    setPage(1);
    setWorkspace("questions");
    setEditingId(item.id);
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
    commitItems(next);
    setEditingId(copy.id);
  }

  function bulkSet(
    patch: Partial<Pick<CmsFaqItem, "showOnHome" | "showOnFaqPage" | "category">>,
  ) {
    if (selected.size === 0) return;
    commitItems(items.map((i) => (selected.has(i.id) ? { ...i, ...patch } : i)));
  }

  function bulkDelete() {
    if (selected.size === 0) return;
    if (!confirm(`Xóa ${selected.size} câu hỏi đã chọn?`)) return;
    commitItems(items.filter((i) => !selected.has(i.id)));
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

  function addCategory() {
    const label = newCatLabel.trim();
    if (!label) {
      setMsg("Nhập tên danh mục");
      return;
    }
    const id = slugify(newCatSlug.trim() || label);
    if (categories.some((c) => c.id === id)) {
      setMsg(`Slug "${id}" đã tồn tại`);
      return;
    }
    commitCategories([
      ...categories,
      {
        id,
        label,
        description: newCatDesc.trim() || undefined,
      },
    ]);
    setNewCatLabel("");
    setNewCatDesc("");
    setNewCatSlug("");
    setExpandedCatId(id);
    setCatQuery("");
    setMsg(`Đã thêm danh mục "${label}" — nhớ Lưu và xuất bản`);
    requestAnimationFrame(() => {
      document.getElementById(`faq-cat-${id}`)?.scrollIntoView({ block: "nearest" });
    });
  }

  function patchCategory(id: string, patch: Partial<CmsFaqCategoryDef>) {
    commitCategories(
      categories.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    );
  }

  function removeCategory(id: string) {
    if (id === "general") {
      setMsg("Không xóa được danh mục Chung (general)");
      return;
    }
    const used = items.filter((i) => i.category === id).length;
    const fallbackId = categories.find((c) => c.id !== id)?.id ?? "mua-hang";
    const fallbackLabel =
      categories.find((c) => c.id === fallbackId)?.label ?? fallbackId;
    if (used > 0) {
      if (
        !confirm(
          `Danh mục đang có ${used} câu hỏi. Chuyển chúng sang "${fallbackLabel}" rồi xóa danh mục?`,
        )
      ) {
        return;
      }
      commitItems(
        items.map((i) =>
          i.category === id ? { ...i, category: fallbackId } : i,
        ),
      );
    } else if (!confirm("Xóa danh mục này?")) {
      return;
    }
    commitCategories(categories.filter((c) => c.id !== id));
    if (category === id) setCategory("");
    if (expandedCatId === id) setExpandedCatId(null);
  }

  async function save() {
    if (saving) return;
    setSaving(true);
    setMsg(null);
    // Snapshot state at click — avoid races if edits happen mid-request
    const catsSnap = categories;
    const itemsSnap = items;
    try {
      if (catsSnap.length === 0) {
        throw new Error("Cần ít nhất một danh mục");
      }
      const payload: CmsFaqDocument = {
        categories: catsSnap.map((c) => ({
          id: slugify(c.id),
          label: c.label.trim(),
          description: c.description?.trim() || undefined,
        })),
        items: itemsSnap.map((i) => ({
          ...i,
          question: i.question.trim(),
          answer: i.answer.trim(),
          category: slugify(i.category || "general"),
        })),
      };
      const blank = payload.items.find((i) => !i.question);
      if (blank) {
        setEditingId(blank.id);
        throw new Error("Có câu hỏi trống — hãy nhập nội dung hoặc xóa");
      }
      const blankCat = payload.categories.find((c) => !c.label);
      if (blankCat) throw new Error("Có danh mục thiếu tên");

      const catIds = new Set(payload.categories.map((c) => c.id));
      for (const item of payload.items) {
        if (!catIds.has(item.category)) {
          throw new Error(
            `Câu hỏi "${item.question.slice(0, 40)}" gắn danh mục không tồn tại (${item.category}). Chọn lại danh mục rồi lưu.`,
          );
        }
      }

      const res = await fetch("/api/admin/cms/faq", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      let data: { error?: string; data?: CmsFaqDocument } = {};
      try {
        data = await res.json();
      } catch {
        throw new Error(
          res.ok ? "Phản hồi lưu không hợp lệ" : `Lưu thất bại (HTTP ${res.status})`,
        );
      }
      if (!res.ok) throw new Error(data.error ?? "Lưu thất bại");

      const saved = data.data ?? payload;
      setCategories(saved.categories);
      setItems(saved.items);
      setDirty(false);
      setMsg(
        `Đã lưu & xuất bản: ${saved.categories.length} danh mục · ${saved.items.length} câu hỏi — đã hiện trên /faq`,
      );
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
      <div className={`sticky top-0 ${Z_STICKY} -mx-1 space-y-3 rounded-2xl border border-border bg-white/95 p-3 backdrop-blur sm:p-4 ${ELEVATION_NONE}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div
            className="inline-flex rounded-lg border border-border bg-surface p-0.5"
            role="tablist"
            aria-label="Không gian FAQ"
          >
            <button
              type="button"
              role="tab"
              aria-selected={workspace === "questions"}
              onClick={() => setWorkspace("questions")}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                workspace === "questions"
                  ? "bg-white text-navy"
                  : "text-muted hover:text-navy"
              }`}
            >
              Câu hỏi ({stats.total})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={workspace === "categories"}
              onClick={() => {
                setEditingId(null);
                setWorkspace("categories");
              }}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                workspace === "categories"
                  ? "bg-white text-navy"
                  : "text-muted hover:text-navy"
              }`}
            >
              Danh mục ({stats.cats})
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {workspace === "questions" ? (
              <button
                type="button"
                onClick={addNew}
                disabled={saving}
                className="rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-surface disabled:opacity-50"
              >
                + Thêm câu hỏi
              </button>
            ) : null}
            <button
              type="button"
              disabled={saving || !dirty}
              onClick={() => void save()}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {saving ? "Đang lưu…" : dirty ? "Lưu và xuất bản" : "Đã lưu"}
            </button>
          </div>
        </div>

        {workspace === "questions" ? (
          <>
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
              setCategory(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Tất cả danh mục</option>
            {categoryOptionGroups(categories)}
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
          </p>
        </div>

        {selected.size > 0 ? (
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-accent/20 bg-accent-soft/60 px-3 py-2 text-sm">
            <span className="font-medium text-navy">Đã chọn {selected.size}</span>
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
                const v = e.target.value;
                if (!v) return;
                bulkSet({ category: v });
                e.target.value = "";
              }}
            >
              <option value="">Đổi danh mục…</option>
              {categoryOptionGroups(categories)}
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
          </>
        ) : null}

        <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
          <span className="rounded-full bg-surface px-2.5 py-1">
            Home {stats.home}
          </span>
          <span className="rounded-full bg-surface px-2.5 py-1">
            FAQ {stats.faq}
          </span>
          {dirty ? (
            <span className="rounded-full bg-amber-100 px-2.5 py-1 font-medium text-amber-900">
              Chưa lưu — /faq chưa thấy thay đổi
            </span>
          ) : null}
        </div>

        {msg ? (
          <p
            className={`text-sm ${
              msg.startsWith("Đã lưu") || msg.startsWith("Đã thêm")
                ? "text-emerald-700"
                : "text-danger"
            }`}
          >
            {msg}
          </p>
        ) : null}
      </div>

      {workspace === "questions" ? (
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
                  <td colSpan={7} className="px-4 py-12 text-center text-muted">
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
                          onClick={() => setEditingId(active ? null : row.id)}
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
                            patchItem(row.id, { showOnHome: e.target.checked })
                          }
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
                        />
                      </td>
                      <td className="px-3 py-2.5 text-right align-middle">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            className="rounded px-1.5 py-1 text-xs text-muted hover:bg-surface"
                            disabled={globalIdx <= 0}
                            onClick={() => moveItem(row.id, -1)}
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            className="rounded px-1.5 py-1 text-xs text-muted hover:bg-surface"
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
      ) : (
        <CategoryPanel
          categories={categories}
          items={items}
          query={catQuery}
          onQuery={setCatQuery}
          expandedId={expandedCatId}
          onToggle={(id) =>
            setExpandedCatId((cur) => (cur === id ? null : id))
          }
          newLabel={newCatLabel}
          newSlug={newCatSlug}
          newDesc={newCatDesc}
          onNewLabel={(value) => {
            setNewCatLabel(value);
            if (!newCatSlug) setNewCatSlug(slugify(value));
          }}
          onNewSlug={(value) => setNewCatSlug(slugify(value))}
          onNewDesc={setNewCatDesc}
          onAdd={addCategory}
          onPatch={patchCategory}
          onMove={moveCategory}
          onRemove={removeCategory}
          notice={msg}
          onView={(id) => {
            setCategory(id);
            setPage(1);
            setQ("");
            setWorkspace("questions");
          }}
        />
      )}

      {editing ? (
        <div className={`fixed inset-0 ${Z_MODAL} flex justify-end bg-navy/40`}>
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Đóng"
            onClick={() => setEditingId(null)}
          />
          <aside className={`relative flex h-full w-full max-w-lg flex-col border-l border-border bg-white ${ELEVATION_MODAL}`}>
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
                />
                <span className="mt-1.5 block text-[11px] font-normal leading-relaxed text-muted">
                  Danh sách: mỗi ý một dòng sau câu kết thúc bằng &quot;:&quot; —
                  hoặc gõ <code className="rounded bg-surface px-1">- ý</code> /{" "}
                  <code className="rounded bg-surface px-1">1. ý</code>
                </span>
              </label>
              <label className="block text-xs font-medium text-muted">
                Danh mục
                <select
                  className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
                  value={editing.category ?? "general"}
                  onChange={(e) =>
                    patchItem(editing.id, { category: e.target.value })
                  }
                >
                  {categoryOptionGroups(categories)}
                </select>
              </label>
              <div className="flex flex-wrap gap-4 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editing.showOnHome}
                    onChange={(e) =>
                      patchItem(editing.id, { showOnHome: e.target.checked })
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

function CategoryPanel({
  categories,
  items,
  query,
  onQuery,
  expandedId,
  onToggle,
  newLabel,
  newSlug,
  newDesc,
  onNewLabel,
  onNewSlug,
  onNewDesc,
  onAdd,
  onPatch,
  onMove,
  onRemove,
  notice,
  onView,
}: {
  categories: CmsFaqCategoryDef[];
  items: CmsFaqItem[];
  query: string;
  onQuery: (value: string) => void;
  expandedId: string | null;
  onToggle: (id: string) => void;
  newLabel: string;
  newSlug: string;
  newDesc: string;
  onNewLabel: (value: string) => void;
  onNewSlug: (value: string) => void;
  onNewDesc: (value: string) => void;
  onAdd: () => void;
  onPatch: (id: string, patch: Partial<CmsFaqCategoryDef>) => void;
  onMove: (id: string, dir: -1 | 1) => void;
  onRemove: (id: string) => void;
  notice: string | null;
  onView: (id: string) => void;
}) {
  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of items) {
      const id = item.category || "general";
      map.set(id, (map.get(id) ?? 0) + 1);
    }
    return map;
  }, [items]);

  const groups = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return groupCategoriesForSidebar(categories)
      .map(({ group, categories: cats }) => ({
        group,
        categories: cats.filter((cat) => {
          if (!needle) return true;
          return (
            cat.label.toLowerCase().includes(needle) ||
            cat.id.toLowerCase().includes(needle) ||
            (cat.description ?? "").toLowerCase().includes(needle)
          );
        }),
      }))
      .filter((group) => group.categories.length > 0);
  }, [categories, query]);

  const field =
    "mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20";

  return (
    <section className="space-y-4 rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div>
        <h2 className="text-sm font-semibold text-navy">
          Danh mục ({categories.length})
        </h2>
        <p className="mt-0.5 text-xs text-muted">
          Cùng 5 cụm với trang FAQ. Bấm một dòng để sửa, rồi quay lại tab Câu hỏi.
        </p>
      </div>

      <div className="grid gap-2 lg:grid-cols-[1fr_12rem_1.4fr_auto]">
        <input
          className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm"
          placeholder="Tên danh mục"
          value={newLabel}
          onChange={(e) => onNewLabel(e.target.value)}
        />
        <input
          className="h-10 w-full rounded-lg border border-border bg-white px-3 font-mono text-sm"
          placeholder="Slug"
          value={newSlug}
          onChange={(e) => onNewSlug(e.target.value)}
        />
        <input
          className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm"
          placeholder="Mô tả (tuỳ chọn)"
          value={newDesc}
          onChange={(e) => onNewDesc(e.target.value)}
        />
        <button
          type="button"
          onClick={onAdd}
          className="h-10 rounded-lg border border-border bg-white px-4 text-sm font-medium hover:border-accent"
        >
          + Thêm danh mục
        </button>
      </div>
      {notice ? (
        <p
          className={`text-sm ${
            notice.startsWith("Đã lưu") || notice.startsWith("Đã thêm")
              ? "text-emerald-700"
              : "text-danger"
          }`}
        >
          {notice}
        </p>
      ) : null}

      <input
        className="h-10 w-full max-w-md rounded-lg border border-border px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
        placeholder="Tìm danh mục…"
        value={query}
        onChange={(e) => onQuery(e.target.value)}
      />

      {groups.length === 0 ? (
        <p className="text-sm text-muted">Không có danh mục khớp.</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {groups.map(({ group, categories: cats }) => (
              <section key={`${group.id}-${group.label}`} className="space-y-1 rounded-xl border border-border p-3">
                <h3 className="px-1 text-xs font-semibold uppercase tracking-wide text-muted">
                  {group.label}
                </h3>
                <ul className="space-y-1">
                  {cats.map((cat) => {
                    const open = expandedId === cat.id;
                    const index = categories.findIndex((row) => row.id === cat.id);
                    const count = counts.get(cat.id) ?? 0;
                    return (
                      <li key={cat.id} id={`faq-cat-${cat.id}`}>
                        <button
                          type="button"
                          className={`flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2 text-left hover:bg-surface ${
                            open ? "bg-accent-soft/50" : ""
                          }`}
                          onClick={() => onToggle(cat.id)}
                          aria-expanded={open}
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-medium text-navy">
                              {cat.label || "(Chưa đặt tên)"}
                            </span>
                            <span className="block truncate font-mono text-xs text-muted">
                              {cat.id}
                            </span>
                          </span>
                          <span className="shrink-0 text-xs tabular-nums text-muted">
                            {count} câu
                          </span>
                        </button>
                        {open ? (
                          <div className="mb-2 space-y-2 rounded-xl border border-border p-3">
                            <label className="block text-xs font-medium text-muted">
                              Tên
                              <input
                                className={field}
                                value={cat.label}
                                onChange={(e) =>
                                  onPatch(cat.id, { label: e.target.value })
                                }
                              />
                            </label>
                            <label className="block text-xs font-medium text-muted">
                              Mô tả
                              <input
                                className={field}
                                value={cat.description ?? ""}
                                placeholder="Mô tả ngắn"
                                onChange={(e) =>
                                  onPatch(cat.id, {
                                    description: e.target.value,
                                  })
                                }
                              />
                            </label>
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                className="rounded-lg border border-border px-3 py-1.5 text-xs disabled:opacity-30"
                                disabled={index <= 0}
                                onClick={() => onMove(cat.id, -1)}
                              >
                                Lên
                              </button>
                              <button
                                type="button"
                                className="rounded-lg border border-border px-3 py-1.5 text-xs disabled:opacity-30"
                                disabled={index < 0 || index >= categories.length - 1}
                                onClick={() => onMove(cat.id, 1)}
                              >
                                Xuống
                              </button>
                              <button
                                type="button"
                                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-accent"
                                onClick={() => onView(cat.id)}
                              >
                                Xem câu hỏi
                              </button>
                              <button
                                type="button"
                                className="rounded-lg border border-danger/30 px-3 py-1.5 text-xs text-danger disabled:opacity-30"
                                disabled={cat.id === "general"}
                                onClick={() => onRemove(cat.id)}
                              >
                                Xóa
                              </button>
                            </div>
                          </div>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
        </div>
      )}
    </section>
  );
}
