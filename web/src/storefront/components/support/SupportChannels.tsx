import Link from "next/link";
import { ChevronRight, Clock3, Mail, Phone } from "lucide-react";
import {
  BODY_MUTED_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
} from "@/storefront/typography";
import { TRANSITION_UI } from "@/storefront/effects";
import { SECTION_PAD, type SupportChannel } from "./shared";

const ICONS = {
  email: Mail,
  hotline: Phone,
  hours: Clock3,
} as const;

export function SupportChannels({ channels }: { channels: SupportChannel[] }) {
  if (channels.length === 0) return null;

  return (
    <section className={`bg-white ${SECTION_PAD}`}>
      <div className="home-container">
        <header className="max-w-2xl">
          <h2 className={SECTION_TITLE_CLASS}>Các kênh hỗ trợ</h2>
          <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
            Chỉ hiển thị kênh đã được cấu hình trên hệ thống KEYON.
          </p>
        </header>

        {/* Desktop strip */}
        <ul className="mt-8 hidden gap-4 md:mt-9 md:grid md:grid-cols-2 lg:grid-cols-3">
          {channels.map((ch) => {
            const Icon = ICONS[ch.type];
            const inner = (
              <>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <Icon size={18} strokeWidth={1.85} aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className={`block ${CARD_META_CLASS}`}>{ch.label}</span>
                  <span className={`mt-0.5 block ${CARD_TITLE_CLASS}`}>{ch.value}</span>
                  {ch.hint ? (
                    <span className={`mt-1 block ${BODY_MUTED_CLASS}`}>{ch.hint}</span>
                  ) : null}
                </span>
              </>
            );
            return (
              <li key={`${ch.type}-${ch.value}`}>
                {ch.href ? (
                  <a
                    href={ch.href}
                    className={`flex items-start gap-3 rounded-2xl border border-border bg-[#F7FAFC] p-4 ${TRANSITION_UI} hover:border-accent/40`}
                  >
                    {inner}
                  </a>
                ) : (
                  <div className="flex items-start gap-3 rounded-2xl border border-border bg-[#F7FAFC] p-4">
                    {inner}
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {/* Mobile list rows */}
        <ul className="mt-6 divide-y divide-border rounded-2xl border border-border md:hidden">
          {channels.map((ch) => {
            const Icon = ICONS[ch.type];
            const row = (
              <span className="flex min-h-[64px] items-center gap-3 px-4 py-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <Icon size={16} strokeWidth={1.85} aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block ${CARD_META_CLASS}`}>{ch.label}</span>
                  <span className="block text-[14px] font-semibold text-navy">{ch.value}</span>
                </span>
                {ch.href ? (
                  <ChevronRight size={16} className="shrink-0 text-muted" aria-hidden />
                ) : null}
              </span>
            );
            return (
              <li key={`${ch.type}-${ch.value}`}>
                {ch.href ? (
                  <a href={ch.href} className="block hover:bg-[#F7FAFC]">
                    {row}
                  </a>
                ) : (
                  row
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
