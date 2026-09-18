"use client";

import Image from "next/image";
import { useState } from "react";
import type { SiteSettings } from "@/server/cms/types";
import { resolveMediaUrl } from "@/lib/media-url";
import { MediaPicker } from "@/app/admin/media/MediaPicker";

type Props = {
  initial: SiteSettings;
};

type IconTarget = "favicon" | "apple";

export function BrandIconsForm({ initial }: Props) {
  const [form, setForm] = useState(initial);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<IconTarget>("favicon");

  const faviconPreview =
    resolveMediaUrl(form.faviconUrl) || "/brand/keyon-k.png";
  const applePreview =
    resolveMediaUrl(form.appleTouchIconUrl) ||
    resolveMediaUrl(form.faviconUrl) ||
    "/brand/keyon-k.png";

  async function save() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/cms/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lỗi");
      if (data.data) setForm(data.data);
      setMsg("Đã lưu favicon");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  function openPicker(target: IconTarget) {
    setPickerTarget(target);
    setPickerOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
        <div>
          <p className="text-sm font-medium text-navy">Favicon (tab trình duyệt)</p>
          <p className="mt-0.5 text-xs text-muted">
            Khuyến nghị PNG hoặc ICO vuông (32×32 / 48×48 / 512×512). Không chọn →
            dùng mặc định KEYON K.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-white p-2">
            <Image
              src={faviconPreview}
              alt=""
              width={48}
              height={48}
              className="h-10 w-10 object-contain"
              unoptimized
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:border-accent"
              onClick={() => openPicker("favicon")}
            >
              {form.faviconUrl ? "Đổi favicon" : "Upload / chọn favicon"}
            </button>
            {form.faviconUrl ? (
              <button
                type="button"
                className="rounded-lg px-3 py-2 text-sm font-medium text-danger hover:underline"
                onClick={() => setForm({ ...form, faviconUrl: undefined })}
              >
                Xóa (về mặc định)
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
        <div>
          <p className="text-sm font-medium text-navy">Apple touch icon</p>
          <p className="mt-0.5 text-xs text-muted">
            Tùy chọn — PNG ≈ 180×180 khi thêm KEYON ra màn hình chính iOS. Trống →
            dùng favicon / mặc định.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-white p-2">
            <Image
              src={applePreview}
              alt=""
              width={64}
              height={64}
              className="h-14 w-14 object-contain"
              unoptimized
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:border-accent"
              onClick={() => openPicker("apple")}
            >
              {form.appleTouchIconUrl ? "Đổi Apple icon" : "Upload / chọn Apple icon"}
            </button>
            {form.appleTouchIconUrl ? (
              <button
                type="button"
                className="rounded-lg px-3 py-2 text-sm font-medium text-danger hover:underline"
                onClick={() =>
                  setForm({ ...form, appleTouchIconUrl: undefined })
                }
              >
                Xóa
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={loading}
          onClick={save}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Đang lưu…" : "Lưu và xuất bản"}
        </button>
        {msg ? <span className="text-sm text-muted">{msg}</span> : null}
      </div>

      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        multiple={false}
        purpose="brand"
        title={
          pickerTarget === "favicon"
            ? "Chọn favicon"
            : "Chọn Apple touch icon"
        }
        onSelect={(items) => {
          const url = items[0]?.url;
          if (!url) return;
          if (pickerTarget === "favicon") {
            setForm({ ...form, faviconUrl: url });
          } else {
            setForm({ ...form, appleTouchIconUrl: url });
          }
          setPickerOpen(false);
        }}
      />
    </div>
  );
}
