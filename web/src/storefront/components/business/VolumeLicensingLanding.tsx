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
  Rocket,
  ShieldCheck,
  UserRound,
  Wallet,
} from "lucide-react";
import {
  BADGE_CLASS,
  BODY_MUTED_CLASS,
  BREADCRUMB_CLASS,
  BREADCRUMB_CURRENT_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  CTA_COMPACT_CLASS,
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
    body: "Phù hợp nhóm nhỏ, startup và văn phòng quy mô nhỏ.",
    people: 3,
    cta: "quote",
  },
  {
    id: "10",
    name: "Nhóm vừa",
    usersLabel: "10 người dùng",
    body: "Phù hợp doanh nghiệp vừa và nhóm làm việc nhiều người.",
    people: 4,
    cta: "quote",
  },
  {
    id: "50",
    name: "Doanh nghiệp",
    usersLabel: "50 người dùng",
    body: "Phù hợp doanh nghiệp có nhu cầu cấp phép cho nhiều người dùng.",
    people: 5,
    cta: "quote",
  },
  {
    id: "100",
    name: "Doanh nghiệp lớn",
    usersLabel: "100 người dùng",
    body: "Quản lý nhiều license và sản phẩm theo nhu cầu doanh nghiệp.",
    people: 5,
    cta: "quote",
  },
  {
    id: "100+",
    name: "100+ người dùng",
    usersLabel: "",
    body: "Phương án cấp phép và báo giá theo nhu cầu thực tế.",
    people: 4,
    showInfinity: true,
    cta: "consult",
  },
];

const HERO_POINTS: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Tư vấn theo nhu cầu",
    body: "Chọn sản phẩm và hình thức cấp phép phù hợp.",
    Icon: MessageCircle,
  },
  {
    title: "Quản lý license",
    body: "Theo dõi license và thời hạn trong tài khoản KEYON.",
    Icon: LayoutGrid,
  },
  {
    title: "Hỗ trợ kích hoạt",
    body: "Hướng dẫn kích hoạt theo từng sản phẩm.",
    Icon: Rocket,
  },
  {
    title: "Báo giá doanh nghiệp",
    body: "Báo giá theo sản phẩm, số lượng và thời hạn.",
    Icon: FileText,
  },
];

const RELATED_LINKS = [
  { label: "Microsoft 365 & Office", href: "/solutions/microsoft-365-office" },
  { label: "Cloud & Hạ tầng", href: "/solutions/cloud" },
  { label: "Bảo mật", href: "/solutions/security" },
  { label: "Backup & Khôi phục", href: "/solutions/backup" },
  { label: "Giải pháp cho doanh nghiệp", href: "/business" },
] as const;

const WHY: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Tư vấn theo nhu cầu",
    body: "Đề xuất sản phẩm và hình thức cấp phép phù hợp với quy mô và nhu cầu sử dụng.",
    Icon: MessageCircle,
  },
  {
    title: "Thông tin bản quyền rõ ràng",
    body: "Mô tả sản phẩm, điều kiện sử dụng và thời hạn license minh bạch.",
    Icon: ShieldCheck,
  },
  {
    title: "Quản lý license",
    body: "Theo dõi sản phẩm, license và thời hạn sử dụng trong Tài khoản KEYON.",
    Icon: LayoutGrid,
  },
  {
    title: "Hỗ trợ kích hoạt",
    body: "Hướng dẫn cài đặt và kích hoạt theo phạm vi hỗ trợ của từng sản phẩm.",
    Icon: Rocket,
  },
  {
    title: "Hỗ trợ sau mua",
    body: "Hỗ trợ khi gia hạn, thay đổi quy mô hoặc cần xử lý vấn đề liên quan đến license.",
    Icon: Headphones,
  },
  {
    title: "Thanh toán doanh nghiệp",
    body: "Quy trình báo giá, xác nhận và thanh toán phù hợp với nhu cầu tổ chức.",
    Icon: Wallet,
  },
];

const PROCESS: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Tiếp nhận nhu cầu",
    body: "Xác định sản phẩm, số lượng và nhu cầu cấp phép của doanh nghiệp.",
    Icon: ClipboardList,
  },
  {
    title: "Tư vấn giải pháp",
    body: "Tư vấn sản phẩm và hình thức cấp phép phù hợp.",
    Icon: MessageCircle,
  },
  {
    title: "Báo giá",
    body: "Gửi báo giá theo sản phẩm, số lượng và thời hạn sử dụng.",
    Icon: FileText,
  },
  {
    title: "Thanh toán & bàn giao",
    body: "Hoàn tất thanh toán và nhận license theo thỏa thuận.",
    Icon: Rocket,
  },
  {
    title: "Hỗ trợ sau mua",
    body: "Hướng dẫn kích hoạt và hỗ trợ khi cần gia hạn hoặc thay đổi.",
    Icon: Headphones,
  },
];

function quoteHref(volume: VolumeId) {
  const q = new URLSearchParams({
    intent: "volume-quote",
    estimatedUsers: volume,
  });
  return `/contact/quote?${q.toString()}`;
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
        <div className="home-container relative pb-5 pt-5 md:pb-4 md:pt-5 lg:pb-6 lg:pt-8">
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
                Bản quyền doanh nghiệp
              </p>
              <h1 className={`mt-3 ${HERO_TITLE_CLASS}`}>
                Mua bản quyền phần mềm số lượng lớn cho doanh nghiệp
              </h1>
              <p className={`mt-4 max-w-[520px] ${PAGE_LEAD_CLASS}`}>
                Từ nhóm nhỏ đến doanh nghiệp 100+ người dùng — KEYON tư vấn sản phẩm, hình thức cấp
                phép, báo giá và bàn giao theo nhu cầu thực tế.
              </p>

              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {HERO_POINTS.map((p) => (
                  <li key={p.title} className="flex items-start gap-2.5">
                    <span
                      className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent"
                      aria-hidden
                    >
                      <p.Icon {...ICON_SM} />
                    </span>
                    <span className="min-w-0">
                      <span className={`block ${CARD_TITLE_CLASS}`}>{p.title}</span>
                      <span className={`mt-0.5 block ${CARD_META_CLASS}`}>{p.body}</span>
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Link
                  href={quoteHref(volume)}
                  className={`inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
                >
                  Nhận báo giá doanh nghiệp →
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
      <section className="bg-white home-section">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>
              Doanh nghiệp của bạn cần bao nhiêu bản quyền?
            </h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Chọn quy mô sử dụng dự kiến. KEYON sẽ tư vấn số lượng license và sản phẩm phù hợp với
              nhu cầu thực tế.
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
                      <p className={CARD_TITLE_CLASS}>{v.name}</p>
                      <p className={`mt-1 min-h-[1.125rem] ${CARD_META_CLASS}`}>{v.usersLabel}</p>
                      <div className="flex justify-center">
                        <PeopleGlyph count={v.people} infinity={v.showInfinity} />
                      </div>
                      <p className={`mt-3 ${BODY_MUTED_CLASS}`}>{v.body}</p>
                    </button>

                    <Link
                      href={quoteHref(v.id)}
                      onClick={() => setVolume(v.id)}
                      className={`mt-5 inline-flex h-10 w-full items-center justify-center rounded-xl ${CTA_COMPACT_CLASS} ${TRANSITION_UI} ${
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
              <p className={BODY_MUTED_CLASS}>
                Giá phụ thuộc vào sản phẩm, số lượng, thời hạn và hình thức cấp phép. Liên hệ KEYON
                để nhận báo giá theo nhu cầu thực tế.
              </p>
            </div>
            <Link
              href={quoteHref(volume)}
              className={`inline-flex h-10 shrink-0 items-center justify-center rounded-xl border border-accent/40 bg-white px-4 ${CTA_COMPACT_CLASS} text-accent ${TRANSITION_UI} hover:bg-accent-soft`}
            >
              Liên hệ kinh doanh →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why KEYON ────────────────────────────────────────── */}
      <section className="border-y border-border bg-[#F4F8FB] home-section">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Vì sao doanh nghiệp chọn KEYON?</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Tư vấn sản phẩm, báo giá, bàn giao license và hỗ trợ sau mua theo nhu cầu doanh nghiệp.
            </p>
            <nav
              aria-label="Giải pháp liên quan"
              className={`mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 ${BODY_MUTED_CLASS}`}
            >
              {RELATED_LINKS.map((link, i) => (
                <span key={link.href} className="inline-flex items-center gap-3">
                  {i > 0 ? (
                    <span aria-hidden className="text-muted-soft">
                      ·
                    </span>
                  ) : null}
                  <Link href={link.href} className={HOVER_LINK_ACCENT}>
                    {link.label}
                  </Link>
                </span>
              ))}
            </nav>
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
      <section className="bg-white home-section">
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
                  <li
                    key={step.title}
                    className={`group flex flex-col items-center rounded-2xl px-2 py-3 text-center ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} hover:bg-accent-soft/50`}
                  >
                    <span
                      className={`${BADGE_CLASS} mb-2 font-semibold text-muted ${TRANSITION_UI} group-hover:text-accent`}
                    >
                      {n}
                    </span>
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-full border-2 border-accent/40 bg-white text-accent ${ELEVATION_HAIRLINE} ${TRANSITION_UI} ${ELEVATION_CARD_HOVER} group-hover:border-accent group-hover:bg-accent group-hover:text-white`}
                      aria-hidden
                    >
                      <step.Icon {...ICON_MD} />
                    </span>
                    <h3
                      className={`mt-3.5 ${CARD_TITLE_CLASS} ${TRANSITION_UI} group-hover:text-accent`}
                    >
                      {step.title}
                    </h3>
                    <p className={`mt-1.5 max-w-[16rem] ${BODY_MUTED_CLASS}`}>{step.body}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="home-section">
        <div className="home-container">
          <div className="flex flex-col items-stretch gap-5 rounded-2xl bg-navy px-5 py-7 sm:px-8 md:flex-row md:items-center md:justify-between md:px-10 md:py-9">
            <div className="min-w-0 max-w-xl">
              <h2 className={`${SECTION_TITLE_CLASS} !text-white`}>
                Bạn cần báo giá theo nhu cầu riêng?
              </h2>
              <p className={`mt-2 ${SECTION_LEAD_CLASS} !text-slate-300`}>
                Chọn quy mô và sản phẩm bạn cần — KEYON tư vấn phương án cấp phép và báo giá phù hợp.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href={quoteHref(volume)}
                className={`inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
              >
                Nhận báo giá doanh nghiệp →
              </Link>
              <Link
                href="/business/licensing-consulting"
                className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/30 bg-transparent px-5 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:border-accent hover:text-accent`}
              >
                Tư vấn giải pháp
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/** Overlapping user avatars — professional facepile (teal-only). */
function PeopleGlyph({ count, infinity }: { count: number; infinity?: boolean }) {
  const n = Math.min(Math.max(count, 1), 5);
  return (
    <div className="mt-5 flex min-h-[40px] items-center justify-center" aria-hidden>
      <div className="flex items-center">
        {Array.from({ length: n }, (_, i) => (
          <span
            key={i}
            className={`relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-accent-soft text-accent shadow-sm ${
              i > 0 ? "-ml-2.5" : ""
            }`}
            style={{ zIndex: n - i }}
          >
            <UserRound size={16} strokeWidth={1.9} />
          </span>
        ))}
        {infinity ? (
          <span className="relative -ml-2.5 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-accent text-[15px] font-bold leading-none text-white shadow-sm">
            ∞
          </span>
        ) : null}
      </div>
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
              <p className={`${CARD_META_CLASS}`}>Theo dõi trong Tài khoản</p>
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
            Sau khi mua, theo dõi license và thời hạn trong Tài khoản KEYON.
          </p>
        </div>
      </div>

      <ul className="mt-3 flex flex-wrap justify-center gap-2 sm:gap-2.5">
        {["Tư vấn theo nhu cầu", "Báo giá doanh nghiệp", "Hỗ trợ kích hoạt"].map((t) => (
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
