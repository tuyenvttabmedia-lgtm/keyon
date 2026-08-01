"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type Props = {
  placeholder?: string;
  className?: string;
};

export function SearchBox({
  placeholder = "Tìm sản phẩm…",
  className = "",
}: Props) {
  const router = useRouter();
  const [q, setQ] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    router.push(`/products?q=${encodeURIComponent(query)}`);
  }

  return (
    <form
      role="search"
      onSubmit={onSubmit}
      className={`flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 ${className}`}
    >
      <label htmlFor="storefront-search" className="sr-only">
        Tìm kiếm
      </label>
      <input
        id="storefront-search"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        maxLength={120}
        className="w-full min-w-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
      />
      <button
        type="submit"
        className="shrink-0 text-sm font-medium text-accent hover:opacity-80"
      >
        Tìm
      </button>
    </form>
  );
}
