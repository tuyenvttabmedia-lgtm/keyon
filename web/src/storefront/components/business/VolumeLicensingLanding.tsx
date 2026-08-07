"use client";

import Link from "next/link";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Check,
  ClipboardList,
  FileText,
  Headphones,
  LayoutGrid,
  MessageCircle,
  Phone,
  Rocket,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import {
  BADGE_CLASS,
  BODY_MUTED_CLASS,
  BREADCRUMB_CLASS,
  BREADCRUMB_CURRENT_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  CTA_LABEL_CLASS,
  HERO_TITLE_CLASS,
  OVERLINE_CLASS,
  PAGE_LEAD_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
} from "@/storefront/typography";
import {
  ELEVATION_CARD_HOVER,
  ELEVATION_CTA_HOVER,
  ELEVATION_FLOAT,
  ELEVATION_HAIRLINE,
  HOVER_LIFT_CARD,
  HOVER_LINK_ACCENT,
  TRANSITION_PANEL,
  TRANSITION_UI,
} from "@/storefront/effects";

const ICON_SM = { size: 16, strokeWidth: 1.85 } as const;
const ICON_MD = { size: 20, strokeWidth: 1.75 } as const;
const HOTLINE = "1900 636 248";

type VolumeId = "5" | "10" | "50" | "100" | "100+";

const VOLUMES: {
  id: VolumeId;
  name: string;
  usersLabel: string;
  body: string;
  people: number;
  showInfinity?: boolean;
  cta: "quote" | "consult";
}[] = [
  {
    id: "5",
    name: "Nhóm nhỏ",
    usersLabel: "5 người dùng",
    body: "Phù hợp startup, nhóm làm việc nhỏ",
    people: 4,
    cta: "quote",
  },
  {
    id: "10",
    name: "Nhóm vừa",
    usersLabel: "10 người dùng",
    body: "Phù hợp doanh nghiệp vừa và nhỏ",
    people: 6,
    cta: "quote",
  },
  {
    id: "50",
    name: "Doanh nghiệp",
    usersLabel: "50 người dùng",
    body: "Tối ưu cho doanh nghiệp quy mô vừa",
    people: 12,
    cta: "quote",
  },
  {
    id: "100",
    name: "Doanh nghiệp lớn",
    usersLabel: "100 người dùng",
    body: "Quản lý tập trung, triển khai nhanh",
    people: 15,
    cta: "quote",
  },
  {
    id: "100+",
    name: "Enterprise",
    usersLabel: "100+ người dùng",
    body: "Giải pháp tùy chỉnh theo nhu cầu",
    people: 14,
    showInfinity: true,
    cta: "consult",
  },
];

const HERO_POINTS: { title: string; Icon: LucideIcon }[] = [
  { title: "Tư vấn theo nhu cầu", Icon: MessageCircle },
  { title: "Quản lý tập trung", Icon: LayoutGrid },
  { title: "Hỗ trợ triển khai", Icon: Rocket },
  { title: "Báo giá doanh nghiệp", Icon: FileText },
];

const WHY: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Tư vấn theo nhu cầu",
    body: "Đề xuất hình thức cấp phép phù hợp quy mô và ngân sách thực tế.",
    Icon: MessageCircle,
  },
  {
    title: "Thông tin bản quyền rõ ràng",
    body: "Mô tả gói, điều kiện sử dụng và quy trình giao nhận minh bạch.",
    Icon: ShieldCheck,
  },
  {
    title: "Quản lý tập trung",
    body: "Theo dõi và phân bổ license trên nền tảng KEYON sau khi mua.",
    Icon: LayoutGrid,
  },
  {
    title: "Hỗ trợ triển khai",
    body: "Hướng dẫn kích hoạt và triển khai cho đội IT / người dùng.",
    Icon: Rocket,
  },
  {
    title: "Hỗ trợ sau mua",
    body: "Đồng hành khi gia hạn, thay đổi quy mô hoặc cần hỗ trợ kỹ thuật.",
    Icon: Headphones,
  },
  {
    title: "Thanh toán doanh nghiệp",
    body: "Quy trình báo giá → chấp thuận → thanh toán phù hợp tổ chức.",
    Icon: Wallet,
  },
];

const PROCESS: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Tiếp nhận nhu cầu",
    body: "Thu thập quy mô người dùng, sản phẩm quan tâm và ngân sách dự kiến.",
    Icon: ClipboardList,
  },
  {
    title: "Tư vấn giải pháp",
    body: "Đề xuất hình thức cấp phép và phương án triển khai phù hợp.",
    Icon: MessageCircle,
  },
  {
    title: "Báo giá",
    body: "Gửi báo giá theo sản phẩm và số lượng — rõ ràng trước khi chốt.",
    Icon: FileText,
  },
  {
    title: "Thanh toán & triển khai",
    body: "Thanh toán theo thỏa thuận, cấp license và hỗ trợ kích hoạt.",
    Icon: Rocket,
  },
  {
    title: "Hỗ trợ sau mua",
    body: "Đồng hành gia hạn, mở rộng quy mô và hỗ trợ vận hành.",
    Icon: Headphones,
  },
];

function quoteHref(volume: VolumeId) {
  const q = new URLSearchParams({
    intent: "volume-quote",
    estimatedUsers: volume,
  });
  return `/contact/sales?${q.toString()}`;
}

export function VolumeLicensingLanding() {
  const [volume, setVolume] = useState<VolumeId>("10");

  return (
    <div className="bg-white">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-x-clip border-b border-border bg-[#F7FAFC]">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_88%_20%,rgba(14,165,164,0.08),transparent_42%),radial-gradient(ellipse_at_10%_90%,rgba(14,165,233,0.05),transparent_48%)]"
          aria-hidden
        />
        <div className="home-container relative py-8 md:py-10 lg:py-11">
          <nav className={`mb-6 flex flex-wrap items-center gap-1.5 ${BREADCRUMB_CLASS}`}>
            <Link href="/" className={HOVER_LINK_ACCENT}>
              Trang chủ
            </Link>
            <span aria-hidden className="text-muted-soft">
              ›
            </span>
            <Link href="/business" className={HOVER_LINK_ACCENT}>
              Doanh nghiệp
            </Link>
            <span aria-hidden className="text-muted-soft">
              ›
            </span>
            <span className={BREADCRUMB_CURRENT_CLASS}>Mua bản quyền số lượng lớn</span>
          </nav>

          <div className="grid items-center gap-8 md:grid-cols-[minmax(0,0.48fr)_minmax(0,0.52fr)] md:gap-10 lg:gap-12">
            <div className="min-w-0 max-w-[540px]">
              <p className={`${OVERLINE_CLASS} tracking-[0.18em] text-accent`}>
                Bản quyền số lượng lớn
              </p>
              <h1 className={`mt-3 max-w-[18ch] ${HERO_TITLE_CLASS}`}>
                Bản quyền phù hợp cho mọi quy mô doanh nghiệp
              </h1>
              <p className={`mt-4 max-w-[520px] ${PAGE_LEAD_CLASS}`}>
                Phù hợp 5 / 10 / 50 / 100+ người dùng — nhận tư vấn và báo giá theo nhu cầu.
              </p>

              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {HERO_POINTS.map((p) => (
                  <li key={p.title} className="flex items-center gap-2.5">
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent"
                      aria-hidden
                    >
                      <p.Icon {...ICON_SM} />
                    </span>
                    <span className={`${CARD_TITLE_CLASS}`}>{p.title}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Link
                  href={quoteHref(volume)}
                  className={`inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white shadow-sm ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
                >
                  Nhận báo giá →
                </Link>
                <Link
                  href="/business/licensing-consulting"
                  className={`inline-flex h-12 items-center justify-center rounded-xl border border-border bg-white px-6 ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
                >
                  Tư vấn giải pháp
                </Link>
              </div>
            </div>

            <div className="relative w-full min-w-0">
              <VolumeHeroArt />
            </div>
          </div>
        </div>
      </section>

      {/* ── Volume scale cards (mockup layout, no fake discounts) ─ */}
      <section className="bg-white py-10 md:py-12 lg:py-14">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>
              Doanh nghiệp của bạn cần bao nhiêu bản quyền?
            </h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Chọn quy mô phù hợp số lượng người dùng của doanh nghiệp. KEYON sẽ tư vấn hình thức
              cấp phép và gửi báo giá theo nhu cầu thực tế.
            </p>
          </header>

          <ul className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3">
            {VOLUMES.map((v) => {
              const active = v.id === volume;
              return (
                <li key={v.id}>
                  <article
                    className={`flex h-full flex-col items-center rounded-2xl border bg-white px-4 py-5 text-center sm:px-5 sm:py-6 ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER} ${
                      active
                        ? `border-accent bg-accent-soft/30 ring-1 ring-accent/20 ${ELEVATION_HAIRLINE}`
                        : `border-border ${ELEVATION_HAIRLINE} hover:border-accent/35`
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setVolume(v.id)}
                      className="w-full"
                      aria-pressed={active}
                    >
                      <p className={`${CARD_TITLE_CLASS} text-[15px]`}>{v.name}</p>
                      <p className={`mt-1 ${CARD_META_CLASS}`}>{v.usersLabel}</p>
                      <div className="flex justify-center">
                        <PeopleGlyph count={v.people} infinity={v.showInfinity} />
                      </div>
                      <p className={`mt-3 ${BODY_MUTED_CLASS}`}>{v.body}</p>
                    </button>

                    <Link
                      href={quoteHref(v.id)}
                      onClick={() => setVolume(v.id)}
                      className={`mt-5 inline-flex h-10 w-full items-center justify-center rounded-xl text-[13px] font-semibold ${TRANSITION_UI} ${
                        v.cta === "consult"
                          ? `bg-accent text-white hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`
                          : "border border-border bg-white text-navy hover:border-accent hover:text-accent"
                      }`}
                    >
                      {v.cta === "consult" ? "Liên hệ tư vấn" : "Nhận báo giá"}
                    </Link>
                  </article>
                </li>
              );
            })}
          </ul>

          {/* Bottom note bar (mockup) */}
          <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-border bg-[#F4F8FB] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-5">
            <div className="flex min-w-0 items-start gap-3">
              <span
                className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent"
                aria-hidden
              >
                <Building2 size={18} strokeWidth={1.8} />
              </span>
              <p className="text-[13px] leading-relaxed text-muted">
                Giá cuối cùng phụ thuộc vào sản phẩm, thời hạn và nhu cầu triển khai của doanh
                nghiệp. Liên hệ KEYON để nhận báo giá chi tiết theo quy mô thực tế.
              </p>
            </div>
            <Link
              href={quoteHref(volume)}
              className={`inline-flex h-10 shrink-0 items-center justify-center rounded-xl border border-accent/40 bg-white px-4 text-[13px] font-semibold text-accent ${TRANSITION_UI} hover:bg-accent-soft`}
            >
              Liên hệ kinh doanh →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why KEYON ────────────────────────────────────────── */}
      <section className="border-y border-border bg-[#F4F8FB] py-10 md:py-12 lg:py-14">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Vì sao doanh nghiệp chọn KEYON?</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Tập trung vào tư vấn, triển khai và quản lý — phù hợp nhu cầu thực tế của tổ chức.
            </p>
          </header>

          <ul className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {WHY.map((w) => (
              <li key={w.title}>
                <article
                  className={`flex h-full gap-3.5 rounded-2xl border border-border bg-white p-5 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER}`}
                >
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-accent/40 text-accent"
                    aria-hidden
                  >
                    <w.Icon {...ICON_MD} />
                  </span>
                  <div className="min-w-0">
                    <h3 className={CARD_TITLE_CLASS}>{w.title}</h3>
                    <p className={`mt-1.5 ${BODY_MUTED_CLASS}`}>{w.body}</p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Process ──────────────────────────────────────────── */}
      <section className="bg-white py-10 md:py-12 lg:py-14">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Quy trình mua bản quyền số lượng lớn</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Từ tiếp nhận nhu cầu đến hỗ trợ sau mua — rõ ràng từng bước.
            </p>
          </header>

          <div className="relative mt-10">
            <div
              className="pointer-events-none absolute left-[10%] right-[10%] top-[1.85rem] z-0 hidden h-px border-t border-dashed border-border lg:block"
              aria-hidden
            />
            <ol className="relative z-[1] grid gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
              {PROCESS.map((step, i) => {
                const n = String(i + 1).padStart(2, "0");
                return (
                  <li key={step.title} className="flex flex-col items-center text-center">
                    <span className={`${BADGE_CLASS} mb-2 font-semibold text-muted`}>{n}</span>
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-full border-2 border-accent/40 bg-white text-accent ${ELEVATION_HAIRLINE}`}
                      aria-hidden
                    >
                      <step.Icon {...ICON_MD} />
                    </span>
                    <h3 className={`mt-3.5 ${CARD_TITLE_CLASS}`}>{step.title}</h3>
                    <p className={`mt-1.5 max-w-[16rem] ${BODY_MUTED_CLASS}`}>{step.body}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="pb-10 pt-2 md:pb-12 lg:pb-14">
        <div className="home-container">
          <div className="flex flex-col items-stretch gap-5 rounded-2xl bg-navy px-5 py-7 sm:px-8 md:flex-row md:items-center md:justify-between md:px-10 md:py-9">
            <div className="min-w-0 max-w-xl">
              <h2 className={`${SECTION_TITLE_CLASS} !text-white`}>
                Bạn cần báo giá theo nhu cầu riêng?
              </h2>
              <p className={`mt-2 ${SECTION_LEAD_CLASS} !text-slate-300`}>
                Chọn quy mô dự kiến và gửi yêu cầu — KEYON sẽ liên hệ tư vấn và báo giá phù hợp.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href={quoteHref(volume)}
                className={`inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white shadow-sm ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
              >
                Tư vấn miễn phí →
              </Link>
              <a
                href={`tel:${HOTLINE.replace(/\s/g, "")}`}
                className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/30 bg-transparent px-5 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:border-accent hover:text-accent`}
              >
                <Phone size={16} strokeWidth={2} aria-hidden />
                {HOTLINE}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/** Stick-figure people grid — teal-only (no rainbow), mockup-style. */
function PeopleGlyph({ count, infinity }: { count: number; infinity?: boolean }) {
  const n = Math.min(Math.max(count, 1), 15);
  return (
    <div
      className="mt-4 flex min-h-[56px] max-w-[140px] flex-wrap content-center justify-center gap-x-1.5 gap-y-1.5"
      aria-hidden
    >
      {Array.from({ length: n }, (_, i) => (
        <span
          key={i}
          className="inline-flex h-[22px] w-[14px] flex-col items-center text-accent"
          style={{ opacity: 0.45 + ((i * 7) % 40) / 100 }}
        >
          <span className="h-[7px] w-[7px] rounded-full bg-current" />
          <span className="mt-[3px] h-[11px] w-[11px] rounded-[3px] bg-current" />
        </span>
      ))}
      {infinity ? (
        <span className="ml-0.5 self-center text-[17px] font-bold leading-none text-accent">
          ∞
        </span>
      ) : null}
    </div>
  );
}

/** Neutral license-management UI — labels only, no fake metrics. */
function VolumeHeroArt() {
  const rows = [
    { label: "License đang quản lý", tone: "bg-accent/15 text-accent" },
    { label: "Đang sử dụng", tone: "bg-sky-100 text-sky-800" },
    { label: "Sắp gia hạn", tone: "bg-amber-100 text-amber-800" },
    { label: "Phòng ban", tone: "bg-violet-100 text-violet-800" },
  ] as const;

  return (
    <div className="relative mx-auto w-full max-w-[480px] lg:max-w-none">
      <div
        className={`relative rounded-2xl border border-border bg-white p-4 sm:p-5 ${ELEVATION_FLOAT}`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy text-accent">
              <Building2 size={18} strokeWidth={1.8} aria-hidden />
            </span>
            <div>
              <p className={`${CARD_TITLE_CLASS}`}>Quản lý license doanh nghiệp</p>
              <p className={`${CARD_META_CLASS}`}>Tổng quan vận hành</p>
            </div>
          </div>
          <span className={`${BADGE_CLASS} rounded-md bg-accent-soft px-2 py-1 font-semibold text-accent`}>
            KEYON
          </span>
        </div>

        <ul className="mt-4 grid grid-cols-2 gap-2.5">
          {rows.map((r) => (
            <li
              key={r.label}
              className={`rounded-xl border border-border/80 bg-surface/80 px-3 py-3 ${TRANSITION_PANEL}`}
            >
              <span
                className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold ${r.tone}`}
              >
                Trạng thái
              </span>
              <p className={`mt-2 ${CARD_TITLE_CLASS}`}>{r.label}</p>
              <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-border/80">
                <span className="block h-full w-[58%] rounded-full bg-accent/50" aria-hidden />
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-4 rounded-xl border border-dashed border-border bg-surface/60 px-3 py-3">
          <p className={`${CARD_META_CLASS}`}>
            Minh họa giao diện quản lý — không phải số liệu vận hành thực tế của KEYON.
          </p>
        </div>
      </div>

      <ul className="mt-3 flex flex-wrap justify-center gap-2 sm:gap-2.5">
        {["Tư vấn theo nhu cầu", "Báo giá rõ ràng", "Hỗ trợ triển khai"].map((t) => (
          <li
            key={t}
            className={`inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 ${CARD_META_CLASS} font-medium text-navy ${ELEVATION_HAIRLINE}`}
          >
            <Check size={12} className="text-accent" strokeWidth={2.5} aria-hidden />
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
