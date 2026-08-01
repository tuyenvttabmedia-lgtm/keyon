"use client";

import { useState } from "react";
import type { FaqItem } from "@/storefront/content/types";

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="divide-y divide-border rounded-2xl border border-border bg-card">
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <div key={item.id}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left text-sm font-medium text-foreground md:px-5 md:text-base"
              aria-expanded={open}
              onClick={() => setOpenId(open ? null : item.id)}
            >
              <span>{item.question}</span>
              <span className="shrink-0 text-muted" aria-hidden>
                {open ? "−" : "+"}
              </span>
            </button>
            {open ? (
              <div className="px-4 pb-4 text-sm leading-relaxed text-muted md:px-5">
                {item.answer}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
