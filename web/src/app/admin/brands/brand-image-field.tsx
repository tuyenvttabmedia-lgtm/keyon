"use client";

import Image from "next/image";
import { useState } from "react";
import { MediaPicker } from "@/app/admin/media/MediaPicker";

export function BrandImageField({
  label,
  hint,
  url,
  onChange,
  aspectClass = "h-24 w-40",
}: {
  label: string;
  hint?: string;
  url: string;
  onChange: (url: string) => void;
  aspectClass?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      {hint ? <p className="text-xs text-muted">{hint}</p> : null}
      {url ? (
        <div className="flex items-start gap-3 rounded-xl border border-border bg-white p-2">
          <div
            className={`relative shrink-0 overflow-hidden rounded-lg bg-surface ${aspectClass}`}
          >
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
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-danger"
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
          className="rounded-lg border border-dashed border-border px-3 py-6 text-sm font-semibold text-muted hover:bg-navy-soft"
        >
          Chọn từ Media
        </button>
      )}
      <MediaPicker
        open={open}
        onClose={() => setOpen(false)}
        multiple={false}
        purpose="brand"
        title="Chọn ảnh thương hiệu"
        onSelect={(items) => {
          if (items[0]?.url) onChange(items[0].url);
          setOpen(false);
        }}
      />
    </div>
  );
}
