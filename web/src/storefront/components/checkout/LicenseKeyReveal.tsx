"use client";

import { useState } from "react";
import { CTA_COMPACT_CLASS, FIELD_CAPTION_CLASS, MONO_VALUE_CLASS } from "@/storefront/typography";
import { ELEVATION_NONE, TRANSITION_UI } from "@/storefront/effects";

function maskKey(value: string) {
  if (value.length <= 8) return "••••••••";
  const head = value.slice(0, 5);
  const tail = value.slice(-5);
  return `${head}${"•".repeat(Math.min(12, value.length - 10))}${tail}`;
}

export function LicenseKeyReveal({
  value,
  label,
  showLabel,
  hideLabel,
  copyLabel,
}: {
  value: string;
  label: string;
  showLabel: string;
  hideLabel: string;
  copyLabel: string;
}) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="rounded-xl bg-surface px-3.5 py-3 sm:px-4">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <KeyIcon />
        <div className="min-w-0 flex-1">
          <p className={FIELD_CAPTION_CLASS}>{label}</p>
          <p className={`mt-0.5 ${MONO_VALUE_CLASS}`}>
            {visible ? value : maskKey(value)}
          </p>
        </div>
        <div className="flex shrink-0 gap-1.5">
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className={`inline-flex h-8 items-center gap-1.5 rounded-lg px-2 ${CTA_COMPACT_CLASS} text-accent ${TRANSITION_UI} hover:bg-accent hover:text-white`}
          >
            <EyeIcon />
            {visible ? hideLabel : showLabel}
          </button>
          <button
            type="button"
            onClick={copy}
            className={`inline-flex h-8 items-center gap-1.5 rounded-lg px-2 ${CTA_COMPACT_CLASS} text-accent ${TRANSITION_UI} hover:bg-accent hover:text-white`}
          >
            <CopyIcon />
            {copied ? "Đã chép" : copyLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function KeyIcon() {
  return (
    <span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-accent ${ELEVATION_NONE}`}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="8" cy="14" r="3" stroke="currentColor" strokeWidth="2" />
        <path
          d="M11 14h10v3M18 14v3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

function EyeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
      <path
        d="M5 15V5a2 2 0 0 1 2-2h10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
