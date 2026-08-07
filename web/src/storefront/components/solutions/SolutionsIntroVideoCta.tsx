"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { Play, X } from "lucide-react";
import { CTA_LABEL_CLASS } from "@/storefront/typography";
import { ELEVATION_MODAL, TRANSITION_UI } from "@/storefront/effects";
import { toVideoEmbedUrl } from "./intro-video";

type Props = {
  /** Raw watch/share URL from ENV or CMS — converted to embed. */
  videoUrl?: string | null;
};

/**
 * Opens intro video in a modal when URL is configured.
 * Without URL: falls back to How it works (no fake video duration).
 */
export function SolutionsIntroVideoCta({ videoUrl }: Props) {
  const titleId = useId();
  const embed = toVideoEmbedUrl(videoUrl);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!embed) {
    return (
      <Link
        href="/#how-it-works"
        className={`inline-flex h-12 items-center justify-center gap-2.5 rounded-xl border border-border bg-white px-4 ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
      >
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white">
          <Play size={12} fill="currentColor" strokeWidth={0} />
        </span>
        <span>Cách KEYON hoạt động</span>
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex h-12 items-center justify-center gap-2.5 rounded-xl border border-border bg-white px-4 ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
      >
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white">
          <Play size={12} fill="currentColor" strokeWidth={0} />
        </span>
        <span>Xem video giới thiệu</span>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-navy/70 p-4 backdrop-blur-[2px]"
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={`relative w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-black ${ELEVATION_MODAL}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-navy px-4 py-3">
              <h2 id={titleId} className="text-[15px] font-semibold text-white">
                Video giới thiệu KEYON
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-white/80 hover:bg-white/10 hover:text-white"
                aria-label="Đóng video"
              >
                <X size={18} />
              </button>
            </div>
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`${embed}${embed.includes("?") ? "&" : "?"}autoplay=1`}
                title="Video giới thiệu KEYON"
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
