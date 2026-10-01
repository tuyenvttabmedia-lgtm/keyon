"use client";

import { useState } from "react";

export function CopyButton({
  value,
  label = "Sao chép",
  copiedLabel = "Đã chép",
}: {
  value: string;
  label?: string;
  copiedLabel?: string;
}) {
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
    <button
      type="button"
      onClick={copy}
      className="rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent-hover"
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
