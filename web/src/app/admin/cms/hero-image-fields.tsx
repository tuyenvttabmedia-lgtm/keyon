"use client";

import Image from "next/image";
import { useState } from "react";
import { MediaPicker } from "@/app/admin/media/MediaPicker";

export function HeroImageFields({
  pagePath,
  url,
  onChange,
  extra,
  lead,
  spec,
}: {
  pagePath: string;
  url: string;
  onChange: (url: string) => void;
  extra?: string;
  lead?: string;
  spec?: string;
}) {
  const [picker, setPicker] = useState(false);

  return (
    <div className="space-y-6">
      <p className="rounded-xl bg-accent-soft/60 px-3 py-2 text-sm text-navy">
        {lead ?? (
          <>
            Ảnh chỉ hiện trên desktop, cột phải hero <strong>{pagePath}</strong>. Mobile không hiện
            ảnh. Nền trắng của file sẽ liền với nền trang.
          </>
        )}
      </p>

      <div className="space-y-3 rounded-2xl border border-border bg-card p-5">
        <div>
          <p className="text-sm font-medium text-navy">Ảnh nền hero</p>
          <p className="mt-1 text-xs text-muted">
            {spec ?? (
              <>
                Xuất file <strong>1296 × 1156 px</strong> (JPG hoặc WebP, nền trắng). Để trống thì
                trang giữ minh họa hiện tại.
              </>
            )}
            {extra ? ` ${extra}` : ""}
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="relative mx-auto aspect-[648/578] w-full max-w-[220px] overflow-hidden rounded-2xl border border-border bg-surface sm:mx-0">
            {url ? (
              <Image src={url} alt="" fill className="object-cover" unoptimized />
            ) : (
              <div className="flex h-full items-center justify-center p-4 text-center text-xs text-muted">
                Chưa có ảnh — chọn từ Media
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setPicker(true)}
                className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white"
              >
                Chọn từ Media
              </button>
              {url ? (
                <button
                  type="button"
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted hover:border-danger hover:text-danger"
                  onClick={() => onChange("")}
                >
                  Xóa ảnh
                </button>
              ) : null}
            </div>
            <p className="break-all text-xs text-muted">
              URL: <span className="font-mono text-navy">{url || "—"}</span>
            </p>
          </div>
        </div>
      </div>

      <MediaPicker
        open={picker}
        onClose={() => setPicker(false)}
        multiple={false}
        purpose="ui"
        title="Chọn ảnh nền hero"
        onSelect={(items) => {
          const next = items[0]?.url ?? "";
          if (!next) return;
          onChange(next);
          setPicker(false);
        }}
      />
    </div>
  );
}
