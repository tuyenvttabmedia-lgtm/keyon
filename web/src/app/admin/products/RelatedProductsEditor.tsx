"use client";

import { useMemo, useState } from "react";

export type RelatedProductOpt = {
  id: string;
  name: string;
  brandName: string;
  slug: string;
  active: boolean;
};

type Props = {
  currentProductId: string;
  options: RelatedProductOpt[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
};

const MAX = 8;

export function RelatedProductsEditor({
  currentProductId,
  options,
  selectedIds,
  onChange,
}: Props) {
  const [q, setQ] = useState("");

  const available = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return options
      .filter((o) => o.id !== currentProductId)
      .filter((o) => {
        if (!needle) return true;
        return (
          o.name.toLowerCase().includes(needle) ||
          o.brandName.toLowerCase().includes(needle) ||
          o.slug.toLowerCase().includes(needle)
        );
      });
  }, [options, currentProductId, q]);

  const selected = selectedIds
    .map((id) => options.find((o) => o.id === id))
    .filter(Boolean) as RelatedProductOpt[];

  function add(id: string) {
    if (selectedIds.includes(id) || selectedIds.length >= MAX) return;
    onChange([...selectedIds, id]);
  }

  function remove(id: string) {
    onChange(selectedIds.filter((x) => x !== id));
  }

  function move(index: number, dir: -1 | 1) {
    const j = index + dir;
    if (j < 0 || j >= selectedIds.length) return;
    const next = [...selectedIds];
    const tmp = next[index]!;
    next[index] = next[j]!;
    next[j] = tmp;
    onChange(next);
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted">
        Tối đa {MAX} SP · thứ tự = thứ tự PDP. Trống = hệ thống tự gợi ý theo brand/danh mục.
      </p>

      {selected.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-surface px-3 py-4 text-center text-sm text-muted">
          Chưa chọn — PDP dùng gợi ý tự động
        </p>
      ) : (
        <ul className="space-y-2">
          {selected.map((p, i) => (
            <li
              key={p.id}
              className="flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2 text-sm"
            >
              <span className="min-w-0 flex-1 truncate font-medium text-navy">
                {p.brandName} · {p.name}
                {!p.active ? (
                  <span className="ml-1 text-xs font-normal text-amber-700">(nháp)</span>
                ) : null}
              </span>
              <button
                type="button"
                disabled={i === 0}
                onClick={() => move(i, -1)}
                className="rounded-lg border border-border px-2 py-1 text-xs disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                disabled={i === selectedIds.length - 1}
                onClick={() => move(i, 1)}
                className="rounded-lg border border-border px-2 py-1 text-xs disabled:opacity-30"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => remove(p.id)}
                className="rounded-lg border border-border px-2 py-1 text-xs text-danger"
              >
                Xóa
              </button>
            </li>
          ))}
        </ul>
      )}

      <input
        className="w-full rounded-lg border border-border px-3 py-2 text-sm"
        placeholder="Tìm sản phẩm để thêm…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <ul className="max-h-48 overflow-y-auto rounded-xl border border-border divide-y divide-border">
        {available.slice(0, 40).map((p) => {
          const on = selectedIds.includes(p.id);
          return (
            <li key={p.id}>
              <button
                type="button"
                disabled={on || selectedIds.length >= MAX}
                onClick={() => add(p.id)}
                className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-surface disabled:opacity-40"
              >
                <span className="truncate">
                  {p.brandName} · {p.name}
                </span>
                <span className="shrink-0 text-xs text-accent">
                  {on ? "Đã chọn" : "+ Thêm"}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
