"use client";

import Image from "next/image";
import { useState } from "react";
import { MediaPicker } from "./MediaPicker";

type Props = {
  url: string;
  onChange: (url: string) => void;
  /** Hint when empty — e.g. gallery[0] */
  fallbackHint?: string;
};

export function OgImagePicker({ url, onChange, fallbackHint }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted">
        Ảnh chia sẻ Facebook / Zalo / OG. Trống = dùng ảnh gallery đầu (nếu có).
        {fallbackHint ? ` Hiện fallback: ${fallbackHint}` : ""}
      </p>
      {url ? (
        <div className="flex items-start gap-3 rounded-xl border border-border bg-white p-2">
          <div className="relative h-24 w-40 shrink-0 overflow-hidden rounded-lg bg-surface">
            <Image src={url} alt="" fill className="object-cover" unoptimized />
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <p className="truncate font-mono text-[11px] text-muted">{url}</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold"
              >
                Đổi ảnh
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="rounded-lg border border-border px-3 py-1.5 text-xs text-danger"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface px-4 py-8 text-sm text-muted hover:border-accent"
        >
          Chọn OG image từ Media
        </button>
      )}
      <label className="block text-sm">
        <span className="font-medium text-muted">Hoặc dán URL</span>
        <input
          className="mt-1 w-full rounded-lg border border-border px-3 py-2 font-mono text-xs"
          value={url}
          onChange={(e) => onChange(e.target.value.trim())}
          placeholder="/uploads/og-win11.png"
        />
      </label>
      <MediaPicker
        open={open}
        onClose={() => setOpen(false)}
        multiple={false}
        purpose="product"
        title="Chọn ảnh Open Graph"
        onSelect={(urls) => {
          if (urls[0]) onChange(urls[0]);
        }}
      />
    </div>
  );
}
