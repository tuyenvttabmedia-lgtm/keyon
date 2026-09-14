import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Cloud,
  Database,
  HardDrive,
  KeyRound,
  Layers,
  Settings2,
  ShieldCheck,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { SolutionPageChrome } from "@/storefront/components/solutions/SolutionPageChrome";
import { SolutionFinalCta } from "@/storefront/components/solutions/SolutionFinalCta";
import { SolutionsIntroVideoButton } from "@/storefront/components/solutions/SolutionsIntroVideoButton";
import { SOLUTION_PAGES } from "@/storefront/nav/ia-pages";
import { SOLUTION_TOPICS, type SolutionTopicArt } from "@/storefront/nav/ia";
import { QUOTE_HREF, QUOTE_LABEL } from "@/storefront/lib/cta";
import {
  BODY_MUTED_CLASS,
  CARD_TITLE_CLASS,
  CTA_COMPACT_CLASS,
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
  ELEVATION_FLOAT_HOVER,
  ELEVATION_HAIRLINE,
  HOVER_LIFT_CARD,
  TRANSITION_PANEL,
  TRANSITION_UI,
} from "@/storefront/effects";
import {
  LANDING_HERO_GRID,
  LANDING_HERO_PAD,
} from "@/storefront/components/marketing/hero-shell";

const ICON: Record<SolutionTopicArt, LucideIcon> = {
  bars: Layers,
  trend: TrendingUp,
  shield: ShieldCheck,
  stack: Wallet,
  cloud: Cloud,
  backup: HardDrive,
};

const ICON_SM = { size: 15, strokeWidth: 1.9 } as const;

const HERO_CHIP_ICON: Record<string, LucideIcon> = {
  security: ShieldCheck,
  productivity: TrendingUp,
  cloud: Cloud,
  "license-management": KeyRound,
  backup: Database,
  "by-need": Settings2,
};

const HERO_CHIP_LABEL: Record<string, string> = {
  security: "Bảo mật & An toàn",
  productivity: "Năng suất & Cộng tác",
  cloud: "Cloud & Hạ tầng",
  "license-management": "Quản lý bản quyền",
  backup: "Sao lưu & Khôi phục",
  "by-need": "Theo nhu cầu",
};

/** Mockup orbit seats around the K cube. */
const HERO_ORBIT: { id: string; seat: string }[] = [
  { id: "security", seat: "tl" },
  { id: "productivity", seat: "tr" },
  { id: "cloud", seat: "ml" },
  { id: "license-management", seat: "mr" },
  { id: "backup", seat: "bl" },
  { id: "by-need", seat: "br" },
];

const TRUST: { title: string; body: string }[] = [
  { title: "Chính hãng", body: "License đúng nguồn, ghi rõ loại nhận trên gói." },
  { title: "Giao sau thanh toán", body: "Key / tài khoản / hồ sơ vào Tài khoản." },
  { title: "Hỗ trợ tiếng Việt", body: "Tư vấn chọn gói trước và sau khi mua." },
  { title: "Cá nhân & tổ chức", body: "Mua lẻ trên Sản phẩm, volume ở Doanh nghiệp." },
];

type Props = {
  introEmbedUrl: string | null;
};

/** Hub `/solutions` — mockup layout, locked SOLUTION_TOPICS, no fake stats. */
export function SolutionsHubLanding({ introEmbedUrl }: Props) {
  return (
    <div className="bg-white">
      <section className="relative overflow-x-clip border-b border-border bg-[#F7FAFC]">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_88%_12%,rgba(14,165,164,0.12),transparent_42%),radial-gradient(ellipse_at_8%_88%,rgba(15,23,42,0.05),transparent_48%)]"
          aria-hidden
        />
        <div className={`home-container relative ${LANDING_HERO_PAD}`}>
          <SolutionPageChrome
            kicker="Giải pháp"
            crumbs={[
              { label: "Trang chủ", href: "/" },
              { label: "Giải pháp" },
            ]}
          />
          <div className={`${LANDING_HERO_GRID} mt-2`}>
            <div className="min-w-0 max-w-[540px]">
              <p className={`${OVERLINE_CLASS} tracking-[0.18em] text-accent`}>
                Giải pháp toàn diện
              </p>
              <h1 className={`mt-3 max-w-3xl ${HERO_TITLE_CLASS}`}>
                Giải pháp số cho doanh nghiệp hiện đại
              </h1>
              <p className={`mt-4 max-w-2xl ${PAGE_LEAD_CLASS}`}>
                Chọn hướng theo việc cần giải quyết — năng suất, hạ tầng, bảo mật,
                sao lưu, quản lý bản quyền — rồi chốt gói trên Sản phẩm. Mua số
                lượng lớn và gia hạn nằm ở Doanh nghiệp.
              </p>
              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center">
                <a
                  href="#solution-catalog"
                  className={`inline-flex h-11 items-center justify-center rounded-xl bg-accent px-5 ${CTA_LABEL_CLASS} text-white shadow-sm ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
                >
                  Khám phá giải pháp →
                </a>
                <SolutionsIntroVideoButton embedUrl={introEmbedUrl} />
              </div>
            </div>
            <SolutionsHeroArt />
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-white py-6 md:py-7">
        <div className="home-container">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST.map((t) => (
              <li
                key={t.title}
                className={`rounded-2xl border border-border bg-[#F7FAFC] px-4 py-3.5 ${ELEVATION_HAIRLINE}`}
              >
                <p className={CARD_TITLE_CLASS}>{t.title}</p>
                <p className={`mt-1 ${BODY_MUTED_CLASS}`}>{t.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="solution-catalog" className="scroll-mt-24 py-10 md:py-12 lg:py-14">
        <div className="home-container">
          <header className="mb-6 max-w-2xl md:mb-8">
            <h2 className={SECTION_TITLE_CLASS}>Danh mục giải pháp</h2>
            <p className={`mt-2 ${SECTION_LEAD_CLASS}`}>
              Sáu hướng đã khóa trên mega Giải pháp — không phải danh mục SKU.
            </p>
          </header>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
            {SOLUTION_TOPICS.map((topic) => {
              const page = SOLUTION_PAGES[topic.id];
              const bullets = (page?.bullets ?? [topic.description]).slice(0, 3);
              const Icon = ICON[topic.art];
              return (
                <li key={topic.id}>
                  <Link
                    href={topic.href}
                    className={`group flex h-full flex-col rounded-2xl border border-border bg-white p-5 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER} hover:border-accent/35`}
                  >
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                      <Icon size={20} strokeWidth={1.85} aria-hidden />
                    </span>
                    <h3 className={`mt-4 ${CARD_TITLE_CLASS}`}>{topic.label}</h3>
                    <p className={`mt-1.5 ${BODY_MUTED_CLASS}`}>
                      {page?.subtitle ?? topic.description}
                    </p>
                    <ul className={`mt-3 flex-1 space-y-1.5 ${BODY_MUTED_CLASS}`}>
                      {bullets.map((b) => (
                        <li key={b} className="flex gap-2">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    <span
                      className={`mt-4 ${CTA_COMPACT_CLASS} text-accent ${TRANSITION_UI} group-hover:underline`}
                    >
                      Tìm hiểu →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <SolutionFinalCta
        title="Chọn KEYON làm đối tác công nghệ"
        subtitle="Tư vấn chọn gói, triển khai bàn giao và hỗ trợ tiếng Việt — không thay thế Order bằng hợp đồng trên landing."
        primaryHref={QUOTE_HREF}
        primaryLabel={`${QUOTE_LABEL} →`}
        secondaryHref="/business"
        secondaryLabel="Dành cho doanh nghiệp"
      />
    </div>
  );
}

/** Hero right — mockup: K cube on cyan platform + 6 floating pills. */
function SolutionsHeroArt() {
  const byId = Object.fromEntries(SOLUTION_TOPICS.map((t) => [t.id, t]));
  const floats = HERO_ORBIT.map((seat) => {
    const topic = byId[seat.id]!;
    return {
      ...seat,
      href: topic.href,
      label: HERO_CHIP_LABEL[seat.id] ?? topic.label,
      Icon: HERO_CHIP_ICON[seat.id] ?? ICON[topic.art],
    };
  });

  return (
    <div
      className="solutions-hero-visual group/sol"
      role="img"
      aria-label="Sáu hướng giải pháp KEYON"
    >
      <div className="solutions-hero-aura" aria-hidden>
        <span className="solutions-hero-blob solutions-hero-blob--a" />
        <span className="solutions-hero-blob solutions-hero-blob--b" />
        <span className="solutions-hero-blob solutions-hero-blob--c" />
      </div>

      <svg
        className="solutions-hero-rays"
        viewBox="0 0 560 420"
        fill="none"
        aria-hidden
      >
        <ellipse
          cx="280"
          cy="210"
          rx="168"
          ry="148"
          stroke="#14BBA6"
          strokeOpacity="0.22"
          strokeWidth="1.2"
          strokeDasharray="5 9"
        />
        <ellipse
          cx="280"
          cy="210"
          rx="118"
          ry="98"
          stroke="#38BDF8"
          strokeOpacity="0.18"
          strokeWidth="1"
          strokeDasharray="3 8"
        />
        <path
          d="M280 78 C320 120 340 160 280 210 C220 160 240 120 280 78"
          stroke="#14BBA6"
          strokeOpacity="0.16"
          strokeWidth="1.2"
        />
        <path
          d="M96 210 C150 180 210 170 280 210 C350 250 410 250 464 210"
          stroke="#38BDF8"
          strokeOpacity="0.14"
          strokeWidth="1.1"
        />
        <path
          d="M120 120 C180 150 230 180 280 210 M440 120 C380 150 330 180 280 210 M130 300 C190 270 240 240 280 210 M430 300 C370 270 320 240 280 210"
          stroke="#14BBA6"
          strokeOpacity="0.12"
          strokeWidth="1"
          strokeDasharray="4 7"
        />
      </svg>

      <div className="solutions-hero-core">
        <div className="solutions-hero-platform" aria-hidden />
        <div className={`solutions-hero-k ${ELEVATION_FLOAT}`} aria-hidden>
          <span className={`solutions-hero-k-letter ${FONT_DISPLAY}`}>K</span>
          <span className="solutions-hero-k-sheen" />
        </div>
      </div>

      <div className="solutions-hero-cards-desktop">
        {floats.map((f) => (
          <Link
            key={f.id}
            href={f.href}
            className={`solutions-hero-card solutions-hero-card--${f.seat} ${ELEVATION_FLOAT} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_FLOAT_HOVER}`}
          >
            <span className="solutions-hero-card-icon" aria-hidden>
              <f.Icon {...ICON_SM} />
            </span>
            <span className="solutions-hero-card-label">{f.label}</span>
          </Link>
        ))}
      </div>

      <ul className="solutions-hero-cards-mobile">
        {floats.map((f) => (
          <li key={f.id}>
            <Link
              href={f.href}
              className={`solutions-hero-card ${ELEVATION_FLOAT} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_FLOAT_HOVER}`}
            >
              <span className="solutions-hero-card-icon" aria-hidden>
                <f.Icon {...ICON_SM} />
              </span>
              <span className="solutions-hero-card-label">{f.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
