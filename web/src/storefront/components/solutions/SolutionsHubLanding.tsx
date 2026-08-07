"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Check,
  Cloud,
  HardDrive,
  Headphones,
  KeyRound,
  LayoutGrid,
  Rocket,
  Shield,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import {
  BODY_MUTED_CLASS,
  CARD_TITLE_CLASS,
  CTA_LABEL_CLASS,
  FONT_DISPLAY,
  PAGE_LEAD_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
} from "@/storefront/typography";
import {
  ELEVATION_CARD_HOVER,
  ELEVATION_CTA_HOVER,
  ELEVATION_FLOAT,
  ELEVATION_FLOAT_HOVER,
  ELEVATION_HAIRLINE,
  HOVER_LIFT_CARD,
  HOVER_LINK_ACCENT,
  TRANSITION_PANEL,
  TRANSITION_UI,
} from "@/storefront/effects";
import { SolutionsIntroVideoCta } from "./SolutionsIntroVideoCta";
import { SolutionFinalCta } from "./SolutionFinalCta";

const ICON_MD = { size: 22, strokeWidth: 1.75 } as const;
const ICON_SM = { size: 16, strokeWidth: 1.85 } as const;

type SolutionCard = {
  id: string;
  title: string;
  body: string;
  href: string;
  features: string[];
  Icon: LucideIcon;
  tone: string;
};

const SOLUTION_CARDS: SolutionCard[] = [
  {
    id: "software-licensing",
    title: "Bản quyền phần mềm",
    body: "Mua và kích hoạt bản quyền chính hãng cho cá nhân, đội nhóm hoặc doanh nghiệp — đúng nhu cầu, đúng giá trị.",
    href: "/solutions/software-licensing",
    features: ["Cá nhân & đội nhóm", "Kích hoạt rõ ràng", "Hỗ trợ tiếng Việt"],
    Icon: KeyRound,
    tone: "bg-accent-soft text-accent",
  },
  {
    id: "productivity",
    title: "Năng suất & Cộng tác",
    body: "Microsoft 365, Office, Teams và công cụ cộng tác chính hãng — làm việc hiệu quả hơn mỗi ngày.",
    href: "/solutions/productivity",
    features: ["Office & Microsoft 365", "Làm việc nhóm", "Chia sẻ an toàn"],
    Icon: Sparkles,
    tone: "bg-orange-100 text-orange-800",
  },
  {
    id: "cloud",
    title: "Cloud",
    body: "Cloud, hạ tầng và tư vấn triển khai — mở rộng theo nhu cầu vận hành của doanh nghiệp.",
    href: "/solutions/cloud",
    features: ["Hạ tầng cloud", "Theo nhu cầu tổ chức", "Tư vấn triển khai"],
    Icon: Cloud,
    tone: "bg-cyan-100 text-cyan-800",
  },
  {
    id: "security",
    title: "Bảo mật",
    body: "Bảo vệ thiết bị, dữ liệu và endpoint với các gói bảo mật phù hợp quy mô doanh nghiệp.",
    href: "/solutions/security",
    features: ["Endpoint & antivirus", "Bảo vệ dữ liệu", "Gói theo quy mô"],
    Icon: Shield,
    tone: "bg-sky-100 text-sky-800",
  },
  {
    id: "backup",
    title: "Backup & Khôi phục",
    body: "Sao lưu linh hoạt và khôi phục nhanh khi sự cố — mã hóa an toàn cho endpoint đến máy chủ.",
    href: "/solutions/backup",
    features: ["Sao lưu endpoint/cloud", "Khôi phục khi sự cố", "Mã hóa an toàn"],
    Icon: HardDrive,
    tone: "bg-emerald-100 text-emerald-800",
  },
  {
    id: "license-management",
    title: "Quản lý bản quyền",
    body: "Theo dõi, phân bổ và tối ưu chi phí license trên một nền tảng — chủ động trước khi hết hạn.",
    href: "/solutions/license-management",
    features: ["Theo dõi license", "Nhắc gia hạn", "Trong tài khoản KEYON"],
    Icon: LayoutGrid,
    tone: "bg-violet-100 text-violet-700",
  },
];

const WHY_POINTS: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Tư vấn chuyên sâu",
    body: "Chọn đúng gói theo quy mô và ngân sách thực tế.",
    Icon: Users,
  },
  {
    title: "Triển khai nhanh chóng",
    body: "Kích hoạt, giao nhận và hướng dẫn rõ ràng.",
    Icon: Rocket,
  },
  {
    title: "Hỗ trợ tận tâm",
    body: "Kênh hỗ trợ tiếng Việt trong giờ làm việc.",
    Icon: Headphones,
  },
  {
    title: "Đồng hành dài hạn",
    body: "Gia hạn, tối ưu chi phí và mở rộng cùng bạn.",
    Icon: ShieldCheck,
  },
];

const HERO_FLOATS: {
  id: string;
  label: string;
  Icon: LucideIcon;
  tone: string;
}[] = [
  {
    id: "tl",
    label: "Bản quyền phần mềm",
    Icon: KeyRound,
    tone: "text-accent",
  },
  {
    id: "tr",
    label: "Quản lý bản quyền",
    Icon: LayoutGrid,
    tone: "text-violet-600",
  },
  {
    id: "ml",
    label: "Bảo mật",
    Icon: Shield,
    tone: "text-sky-700",
  },
  {
    id: "mr",
    label: "Backup & Khôi phục",
    Icon: HardDrive,
    tone: "text-emerald-700",
  },
  {
    id: "bl",
    label: "Năng suất & Cộng tác",
    Icon: Sparkles,
    tone: "text-orange-600",
  },
  {
    id: "br",
    label: "Cloud",
    Icon: Cloud,
    tone: "text-cyan-700",
  },
];

export function SolutionsHubLanding({
  introVideoUrl,
}: {
  introVideoUrl?: string | null;
}) {
  return (
    <div className="bg-white">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-x-clip">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_25%,rgba(14,165,164,0.1),transparent_42%),radial-gradient(ellipse_at_12%_80%,rgba(14,165,233,0.06),transparent_48%)]"
          aria-hidden
        />
        <div className="home-container relative py-8 md:py-9 lg:py-10">
          <div className="grid items-center gap-8 md:grid-cols-[minmax(0,0.46fr)_minmax(0,0.54fr)] md:gap-10 lg:gap-12">
            <div className="min-w-0 w-full max-w-[540px]">
              <h1
                className={`max-w-[520px] ${FONT_DISPLAY} text-[1.75rem] font-bold leading-[1.12] tracking-tight text-navy sm:text-[2.35rem] lg:text-[2.875rem] lg:leading-[1.1] xl:text-[3rem] xl:leading-[1.08]`}
              >
                Giải pháp số cho doanh nghiệp hiện đại
              </h1>
              <p className={`mt-4 max-w-[520px] ${PAGE_LEAD_CLASS}`}>
                KEYON đồng hành chuyển đổi số với bản quyền, bảo mật, backup, cloud và
                quản lý license — đúng nhu cầu, dễ triển khai, hỗ trợ tiếng Việt.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <a
                  href="#danh-muc-giai-phap"
                  className={`inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white shadow-sm ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
                >
                  Khám phá giải pháp →
                </a>
                <SolutionsIntroVideoCta videoUrl={introVideoUrl} />
              </div>
            </div>

            <div className="relative flex w-full min-w-0 justify-center md:justify-start">
              <SolutionsHeroArt />
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────── */}
      <section id="danh-muc-giai-phap" className="scroll-mt-24 py-10 md:py-12 lg:py-14">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Danh mục giải pháp</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Chọn đúng hướng giải quyết — từ bản quyền và bảo mật đến cloud, backup và
              quản lý license.
            </p>
          </header>

          <ul className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {SOLUTION_CARDS.map((card) => (
              <li key={card.id}>
                <article
                  className={`flex h-full flex-col rounded-2xl border border-border bg-white p-6 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} hover:border-border ${ELEVATION_CARD_HOVER}`}
                >
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.tone}`}
                    aria-hidden
                  >
                    <card.Icon {...ICON_MD} />
                  </span>
                  <h3 className={`mt-5 ${CARD_TITLE_CLASS} text-[15px]`}>{card.title}</h3>
                  <p className={`mt-2 ${BODY_MUTED_CLASS}`}>{card.body}</p>
                  <ul className="mt-5 space-y-2.5">
                    {card.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                          <Check size={10} strokeWidth={3} aria-hidden />
                        </span>
                        <span className="text-[13px] leading-snug text-navy">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={card.href}
                    className={`mt-auto inline-flex items-center gap-1 pt-6 text-[13px] font-semibold text-accent ${TRANSITION_UI} ${HOVER_LINK_ACCENT}`}
                  >
                    Tìm hiểu thêm
                    <span aria-hidden>→</span>
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Why KEYON — full-bleed dark ──────────────────────── */}
      <section className="relative overflow-hidden bg-navy">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 55% 80% at 88% 45%, rgba(14,165,164,0.22), transparent 55%), radial-gradient(ellipse 40% 50% at 10% 90%, rgba(14,165,233,0.08), transparent 50%)",
          }}
        />
        <div className="home-container relative py-10 md:py-12 lg:py-14">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center lg:gap-14">
            <div className="min-w-0 max-w-xl">
              <h2 className={`${SECTION_TITLE_CLASS} !text-white`}>
                Chọn KEYON làm đối tác công nghệ của bạn
              </h2>
              <p className={`mt-3 ${SECTION_LEAD_CLASS} !text-white/70`}>
                Từ tư vấn chọn gói đến kích hoạt và hỗ trợ dài hạn — KEYON đồng hành
                doanh nghiệp với quy trình rõ ràng, sản phẩm chính hãng.
              </p>
            </div>

            <ul className="space-y-5 sm:space-y-6">
              {WHY_POINTS.map((p) => (
                <li key={p.title} className="flex gap-3.5">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent"
                    aria-hidden
                  >
                    <p.Icon {...ICON_MD} />
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <p className={`${CARD_TITLE_CLASS} !text-white`}>{p.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-white/60">{p.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <SolutionFinalCta />
    </div>
  );
}

/** Hero visual hub — compact K cluster + mesh + 6 solution cards. */
function SolutionsHeroArt() {
  return (
    <div
      className="hero-solution-visual solutions-hero-hub group/hub"
      role="img"
      aria-label="Hệ sinh thái giải pháp KEYON"
    >
      <div className="solutions-hero-glow" aria-hidden />

      <svg
        className="solutions-hero-mesh"
        viewBox="0 0 580 390"
        fill="none"
        aria-hidden
      >
        <path
          d="M210 55 L290 195 M430 50 L290 195 M70 195 L290 195 M510 195 L290 195 M290 195 L290 330 M180 170 L290 195 M400 165 L290 195"
          stroke="#14BBA6"
          strokeOpacity="0.17"
          strokeWidth="1.2"
        />
        <path
          d="M200 70 C230 110 260 150 290 195 M450 65 C400 110 340 155 290 195 M85 210 C150 205 220 200 290 195 M500 205 C430 200 350 198 290 195 M290 320 C290 270 290 230 290 195"
          stroke="#14BBA6"
          strokeOpacity="0.14"
          strokeWidth="1"
          strokeDasharray="4 7"
        />
        <circle cx="210" cy="55" r="2.2" fill="#14BBA6" fillOpacity="0.32" />
        <circle cx="430" cy="50" r="2.2" fill="#14BBA6" fillOpacity="0.32" />
        <circle cx="70" cy="195" r="2.2" fill="#14BBA6" fillOpacity="0.32" />
        <circle cx="510" cy="195" r="2.2" fill="#14BBA6" fillOpacity="0.32" />
        <circle cx="290" cy="330" r="2.2" fill="#14BBA6" fillOpacity="0.32" />
      </svg>

      <div className={`solutions-hero-k ${ELEVATION_FLOAT}`}>
        <div className="solutions-hero-k-grid" aria-hidden />
        <span className={`solutions-hero-k-letter ${FONT_DISPLAY}`}>K</span>
      </div>

      <div className="solutions-hero-cards-desktop">
        {HERO_FLOATS.map((f) => (
          <div
            key={f.id}
            className={`solutions-hero-card solutions-hero-card--${f.id} ${ELEVATION_FLOAT} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_FLOAT_HOVER} hover:border-accent/40`}
          >
            <span className={`solutions-hero-card-icon ${f.tone}`} aria-hidden>
              <f.Icon {...ICON_SM} />
            </span>
            <span className="solutions-hero-card-label">{f.label}</span>
          </div>
        ))}
      </div>

      <ul className="solutions-hero-cards-mobile">
        {HERO_FLOATS.map((f) => (
          <li
            key={f.id}
            className={`solutions-hero-card ${ELEVATION_FLOAT} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_FLOAT_HOVER} hover:border-accent/40`}
          >
            <span className={`solutions-hero-card-icon ${f.tone}`} aria-hidden>
              <f.Icon {...ICON_SM} />
            </span>
            <span className="solutions-hero-card-label">{f.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
