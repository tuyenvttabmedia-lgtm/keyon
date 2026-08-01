"use client";

import Image from "next/image";
import { useState } from "react";
import { MediaPicker } from "./MediaPicker";

type Props = {
  urls: string[];
  onChange: (urls: string[]) => void;
};

export function GalleryEditor({ urls, onChange }: Props) {
  const [pickerOpen, setPickerOpen] = useState(false);

  function move(index: number, dir: -1 | 1) {
    const j = index + dir;
    if (j < 0 || j >= urls.length) return;
    const next = [...urls];
    const tmp = next[index]!;
    next[index] = next[j]!;
    next[j] = tmp;
    onChange(next);
  }

  function remove(index: number) {
    onChange(urls.filter((_, i) => i !== index));
  }

  function addUrls(incoming: string[]) {
    const set = new Set(urls);
    const merged = [...urls];
    for (const u of incoming) {
      if (!set.has(u)) {
        set.add(u);
        merged.push(u);
      }
    }
    onChange(merged);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="inline-flex h-9 items-center rounded-xl bg-accent px-3 text-sm font-semibold text-white"
        >
          Chọn từ Media
        </button>
        <a
          href="/admin/media"
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium text-accent hover:underline"
        >
          Mở Media ↗
        </a>
        <span className="text-xs text-muted">Ảnh đầu = ảnh chính PDP</span>
      </div>

      {urls.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-surface px-3 py-6 text-center text-sm text-muted">
          Chưa có ảnh — chọn từ Media hoặc dán URL bên dưới
        </p>
      ) : (
        <ul className="space-y-2">
          {urls.map((url, i) => (
            <li
              key={`${url}-${i}`}
              className="flex items-center gap-3 rounded-xl border border-border bg-white p-2"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-surface">
                <Image src={url} alt="" fill className="object-cover" unoptimized />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-mono text-[11px] text-muted">{url}</p>
                {i === 0 ? (
                  <p className="text-[11px] font-semibold text-accent">Ảnh chính</p>
                ) : (
                  <p className="text-[11px] text-muted">Thumb #{i + 1}</p>
                )}
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  disabled={i === 0}
                  onClick={() => move(i, -1)}
                  className="rounded-lg border border-border px-2 py-1 text-xs disabled:opacity-30"
                  aria-label="Lên"
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={i === urls.length - 1}
                  onClick={() => move(i, 1)}
                  className="rounded-lg border border-border px-2 py-1 text-xs disabled:opacity-30"
                  aria-label="Xuống"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="rounded-lg border border-border px-2 py-1 text-xs text-danger"
                >
                  Xóa
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <label className="block text-sm">
        <span className="font-medium text-muted">Hoặc dán URL (mỗi dòng 1)</span>
        <textarea
          rows={3}
          className="mt-1 w-full rounded-lg border border-border px-3 py-2 font-mono text-xs"
          value={urls.join("\n")}
          onChange={(e) =>
            onChange(
              e.target.value
                .split(/\r?\n/)
                .map((l) => l.trim())
                .filter(Boolean),
            )
          }
        />
      </label>

      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        purpose="product"
        title="Chọn ảnh sản phẩm"
        onSelect={addUrls}
      />
    </div>
  );
}
