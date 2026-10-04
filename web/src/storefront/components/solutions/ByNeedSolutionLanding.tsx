import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Check,
  Cloud,
  HardDrive,
  Layers,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";
import { SOLUTION_TOPICS } from "@/storefront/nav/ia";
import { LANDING_CRUMB_GAP, LANDING_HERO_PAD } from "@/storefront/components/marketing/hero-shell";
import {
  BADGE_CLASS,
  BODY_MUTED_CLASS,
  BREADCRUMB_CLASS,
  BREADCRUMB_CURRENT_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  CTA_LABEL_CLASS,
  HERO_TITLE_CLASS,
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
import { SolutionFinalCta } from "./SolutionFinalCta";

const TOPIC_MARK: Record<string, { Icon: LucideIcon; tone: string }> = {
  "microsoft-365-office": { Icon: TrendingUp, tone: "bg-sky-100 text-sky-800" },
  cloud: { Icon: Cloud, tone: "bg-violet-100 text-violet-800" },
  security: { Icon: Shield, tone: "bg-emerald-100 text-emerald-800" },
  backup: { Icon: HardDrive, tone: "bg-amber-100 text-amber-800" },
  "license-management": { Icon: Layers, tone: "bg-accent-soft text-accent" },
};

const SCALES: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Đội nhỏ",
    body: "Vài ghế Office / bảo mật — chọn đúng gói, không mua thừa.",
    Icon: Users,
  },
  {
    title: "Doanh nghiệp đang lớn",
    body: "Ghép năng suất + hạ tầng + backup khi số người dùng tăng.",
    Icon: Layers,
  },
  {
    title: "Tổ chức",
    body: "Kết hợp theo phòng ban, rồi mua số lượng lớn hoặc gói đăng ký qua KEYON.",
    Icon: Building2,
  },
];

const MIX_ROWS: { label: string; hint: string; Icon: LucideIcon; tone: string }[] = [
  {
    label: "Microsoft 365 & Office",
    hint: "Office / Microsoft 365",
    Icon: TrendingUp,
    tone: "bg-sky-100 text-sky-800",
  },
  {
    label: "Cloud & Hạ tầng",
    hint: "Server / storage",
    Icon: Cloud,
    tone: "bg-violet-100 text-violet-800",
  },
  {
    label: "Bảo mật",
    hint: "Endpoint / email",
    Icon: Shield,
    tone: "bg-emerald-100 text-emerald-800",
  },
  {
    label: "Backup & Khôi phục",
    hint: "PC, server, Cloud",
    Icon: HardDrive,
    tone: "bg-amber-100 text-amber-800",
  },
];

/** `/solutions/by-need` — compose mix by scale; not license-asset tracking. */
export function ByNeedSolutionLanding() {
  const others = SOLUTION_TOPICS.filter((t) => t.id !== "by-need");

  return (
    <div className="bg-white">
      <section className="relative overflow-x-clip border-b border-border bg-[#F7FAFC]">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_88%_18%,rgba(14,165,164,0.12),transparent_42%),radial-gradient(ellipse_at_10%_90%,rgba(14,165,233,0.05),transparent_48%)]"
          aria-hidden
        />
        <div className={`home-container relative ${LANDING_HERO_PAD}`}>
          <nav className={`${LANDING_CRUMB_GAP} flex flex-wrap items-center gap-1.5 ${BREADCRUMB_CLASS}`}>
            <Link href="/" className={HOVER_LINK_ACCENT}>
              Trang chủ
            </Link>
            <span aria-hidden className="text-muted-soft">
              ›
            </span>
            <Link href="/solutions" className={HOVER_LINK_ACCENT}>
              Giải pháp
            </Link>
            <span aria-hidden className="text-muted-soft">
              ›
            </span>
            <span className={BREADCRUMB_CURRENT_CLASS}>Giải pháp theo nhu cầu</span>
          </nav>

          <div className="grid w-full min-w-0 items-stretch gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10 xl:gap-12">
            <div className="flex min-w-0 max-w-full flex-col lg:h-full lg:max-w-[540px]">
              <h1 className={`max-w-full break-words ${HERO_TITLE_CLASS}`}>
                Kết hợp đúng sản phẩm với quy mô sử dụng
              </h1>
              <p className={`mt-4 max-w-full break-words ${PAGE_LEAD_CLASS}`}>
                Kết hợp nhiều sản phẩm theo nhu cầu thực tế của cá nhân, đội nhóm hoặc
                doanh nghiệp. KEYON hỗ trợ chọn theo số người dùng, nhu cầu và ngân sách.
              </p>
              <ul className="mt-6 grid min-w-0 gap-3">
                {SCALES.map((s) => (
                  <li key={s.title} className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                      <s.Icon size={16} strokeWidth={1.8} aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className={`block break-words ${CARD_TITLE_CLASS}`}>{s.title}</span>
                      <span className={`mt-0.5 block break-words ${BODY_MUTED_CLASS}`}>{s.body}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex w-full min-w-0 flex-col gap-3 sm:flex-row lg:mt-auto">
                <Link
                  href="/business/licensing-consulting"
                  className={`inline-flex h-12 w-full min-w-0 items-center justify-center rounded-xl bg-accent px-6 sm:w-auto ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
                >
                  Liên hệ tư vấn →
                </Link>
                <Link
                  href="/solutions"
                  className={`inline-flex h-12 w-full min-w-0 items-center justify-center rounded-xl border border-border bg-white px-6 sm:w-auto ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
                >
                  Tất cả giải pháp
                </Link>
              </div>
            </div>

            <div className="hidden h-full min-w-0 lg:flex lg:flex-col">
              <ByNeedHeroArt />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F7FAFC] home-section">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Theo quy mô</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Cùng một bộ giải pháp KEYON — khác số người dùng và cách ghép.
            </p>
          </header>
          <ul className="mt-7 grid min-w-0 grid-cols-2 gap-2.5 sm:gap-3.5 md:grid-cols-3">
            {SCALES.map((s, index) => (
              <li
                key={s.title}
                className={`min-w-0 ${index === SCALES.length - 1 ? "col-span-2 md:col-span-1" : ""}`}
              >
                <article
                  className={`flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-white p-3.5 sm:p-4 ${ELEVATION_HAIRLINE}`}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent"
                      aria-hidden
                    >
                      <s.Icon size={18} strokeWidth={1.8} />
                    </span>
                    <h3 className={`min-w-0 break-words ${CARD_TITLE_CLASS}`}>{s.title}</h3>
                  </span>
                  <p className={`mt-2 break-words ${BODY_MUTED_CLASS}`}>{s.body}</p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white home-section">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Các hướng giải pháp</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Chọn một hướng, rồi bổ sung sản phẩm khác khi cần — hoặc nhờ KEYON tư vấn.
            </p>
          </header>
          <ul className="mt-7 grid min-w-0 grid-cols-2 gap-2.5 sm:gap-3.5 lg:grid-cols-3">
            {others.map((t) => {
              const topic = TOPIC_MARK[t.id];
              const TopicIcon = topic?.Icon ?? Layers;
              return (
                <li key={t.id} className="min-w-0 last:col-span-2 lg:last:col-span-1">
                  <Link
                    href={t.href}
                    className={`flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-white p-3 sm:p-4 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER}`}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${topic?.tone ?? "bg-accent-soft text-accent"}`}
                        aria-hidden
                      >
                        <TopicIcon size={16} strokeWidth={1.8} />
                      </span>
                      <h3 className={`min-w-0 break-words ${CARD_TITLE_CLASS}`}>{t.label}</h3>
                    </span>
                    <p className={`mt-2 flex-1 break-words ${BODY_MUTED_CLASS}`}>{t.description}</p>
                    <span className={`mt-3 text-sm font-semibold text-accent ${HOVER_LINK_ACCENT}`}>
                      Xem giải pháp →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <SolutionFinalCta
        title="Cần KEYON tư vấn cách kết hợp?"
        subtitle="KEYON hỗ trợ chọn sản phẩm theo số người dùng, nhu cầu và ngân sách."
        primaryHref="/business/licensing-consulting"
        primaryLabel="Liên hệ tư vấn"
        secondaryHref="/solutions/license-management"
        secondaryLabel="Quản lý bản quyền"
      />
    </div>
  );
}

/** Mix panel + scale chips — software-licensing mockup language, no fake metrics. */
function ByNeedHeroArt() {
  return (
    <div className="relative mx-auto flex h-full w-full max-w-[440px] flex-col lg:max-w-none">
      <div
        className={`relative flex min-h-0 flex-1 flex-col rounded-2xl border border-border bg-white p-4 sm:p-5 ${ELEVATION_FLOAT}`}
        aria-hidden
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-navy text-accent">
              <Layers size={18} strokeWidth={1.8} />
            </span>
            <div className="min-w-0">
              <p className={CARD_TITLE_CLASS}>Ghép giải pháp theo nhu cầu</p>
              <p className={CARD_META_CLASS}>Chọn theo nhu cầu</p>
            </div>
          </div>
          <span className={`shrink-0 rounded-md bg-accent-soft px-2 py-1 text-accent ${BADGE_CLASS}`}>
            KEYON
          </span>
        </div>

        <ul className="mt-4 flex flex-1 flex-col justify-between gap-2">
          {MIX_ROWS.map((r) => (
            <li
              key={r.label}
              className="flex flex-1 items-center gap-3 rounded-xl border border-border/80 bg-[#F7FAFC] px-3 py-2.5"
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${r.tone}`}
              >
                <r.Icon size={15} strokeWidth={1.85} />
              </span>
              <div className="min-w-0 flex-1">
                <p className={`${CARD_TITLE_CLASS} truncate`}>{r.label}</p>
                <p className={CARD_META_CLASS}>{r.hint}</p>
              </div>
              <Check size={14} className="shrink-0 text-accent" strokeWidth={2.5} />
            </li>
          ))}
        </ul>
      </div>

      <ul className="mt-3 flex flex-wrap justify-center gap-2">
        {["Đội nhỏ", "Doanh nghiệp", "Tổ chức"].map((t) => (
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
