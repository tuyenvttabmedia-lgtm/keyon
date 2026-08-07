"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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
  Users,
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
  FONT_DISPLAY,
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

type VolumeId = "5" | "10" | "50" | "100+";

const VOLUMES: {
  id: VolumeId;
  label: string;
  title: string;
  body: string;
}[] = [
  {
    id: "5",
    label: "5",
    title: "5 người dùng",
    body: "Phù hợp nhóm nhỏ hoặc doanh nghiệp đang bắt đầu chuẩn hóa bản quyền phần mềm.",
  },
  {
    id: "10",
    label: "10",
    title: "10 người dùng",
    body: "Phù hợp đội nhóm cần triển khai đồng bộ phần mềm và quản lý license thuận tiện hơn.",
  },
  {
    id: "50",
    label: "50",
    title: "50 người dùng",
    body: "Phù hợp doanh nghiệp có nhiều người dùng, phòng ban hoặc nhu cầu quản lý bản quyền tập trung.",
  },
  {
    id: "100+",
    label: "100+",
    title: "100+ người dùng",
    body: "Phù hợp triển khai quy mô lớn cần tư vấn cấp phép, triển khai và quản lý tập trung.",
  },
];

const VOLUME_BENEFITS = [
  "Tư vấn hình thức cấp phép phù hợp",
  "Báo giá theo sản phẩm và số lượng",
  "Hỗ trợ triển khai",
  "Quản lý license tập trung",
] as const;

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
  const selected = useMemo(
    () => VOLUMES.find((v) => v.id === volume) ?? VOLUMES[1]!,
    [volume],
  );

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

      {/* ── Volume selector ──────────────────────────────────── */}
      <section className="bg-white py-10 md:py-12 lg:py-14">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>
              Doanh nghiệp của bạn cần bao nhiêu bản quyền?
            </h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Chọn quy mô dự kiến để KEYON hiểu nhu cầu và chuẩn bị phương án cấp phép phù hợp.
            </p>
          </header>

          <div
            role="radiogroup"
            aria-label="Quy mô người dùng dự kiến"
            className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:justify-center sm:gap-3"
          >
            {VOLUMES.map((v) => {
              const active = v.id === volume;
              return (
                <button
                  key={v.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setVolume(v.id)}
                  className={`inline-flex h-12 min-w-0 flex-1 items-center justify-center rounded-xl border px-4 text-[15px] font-semibold tabular-nums sm:min-w-[5.5rem] sm:flex-none ${TRANSITION_UI} ${
                    active
                      ? "border-accent bg-accent-soft text-accent shadow-sm"
                      : "border-border bg-white text-navy hover:border-accent/50"
                  }`}
                >
                  {v.label}
                </button>
              );
            })}
          </div>

          <div
            className={`mx-auto mt-7 max-w-3xl rounded-2xl border border-border bg-[#F7FAFC] p-5 sm:p-6 md:p-7 ${ELEVATION_HAIRLINE}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className={`${BADGE_CLASS} font-semibold uppercase tracking-wide text-accent`}>
                  Quy mô đã chọn
                </p>
                <h3 className={`mt-1.5 ${FONT_DISPLAY} text-xl font-bold text-navy sm:text-2xl`}>
                  {selected.title}
                </h3>
                <p className={`mt-2 max-w-xl ${BODY_MUTED_CLASS}`}>{selected.body}</p>
              </div>
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent"
                aria-hidden
              >
                <Users {...ICON_MD} />
              </span>
            </div>

            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {VOLUME_BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                    <Check size={10} strokeWidth={3} aria-hidden />
                  </span>
                  <span className="text-[13px] leading-snug text-navy">{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <Link
                href={quoteHref(volume)}
                className={`inline-flex h-12 w-full items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white shadow-sm sm:w-auto ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
              >
                Nhận báo giá →
              </Link>
            </div>
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
