import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Cloud,
  HardDrive,
  Layers,
  Shield,
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
  HERO_TITLE_CLASS,
  BREADCRUMB_CURRENT_CLASS,
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
  shield: Shield,
  stack: Wallet,
  cloud: Cloud,
  backup: HardDrive,
};

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

const HERO_CHIP_LABEL: Record<string, string> = {
  security: "Bảo mật & An toàn",
  productivity: "Năng suất & Cộng tác",
  cloud: "Cloud & Hạ tầng",
  "license-management": "Quản lý bản quyền",
  backup: "Sao lưu & Khôi phục",
  "by-need": "Theo nhu cầu",
};

/** Hero right — stable 3-row orbit (no fragile absolute seats). */
function SolutionsHeroArt() {
  const byId = Object.fromEntries(SOLUTION_TOPICS.map((t) => [t.id, t]));
  const rowTop = [byId.security!, byId.productivity!] as const;
  const rowMid = [byId.cloud!, byId["license-management"]!] as const;
  const rowBot = [byId.backup!, byId["by-need"]!] as const;

  return (
    <div
      className="relative mx-auto w-full max-w-[420px] lg:max-w-none lg:justify-self-end"
      aria-label="Sáu hướng giải pháp KEYON"
    >
      {/* Ambient rings + glow (behind composition) */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-1/2 top-[46%] h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/15 blur-3xl" />
        <div className="absolute left-1/2 top-[46%] h-[68%] w-[68%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/25" />
        <div className="absolute left-1/2 top-[46%] h-[48%] w-[48%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-accent/30" />
        <div className="absolute left-1/2 top-[46%] h-[28%] w-[28%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/20" />
      </div>

      <div className="relative flex flex-col gap-3 sm:gap-3.5">
        <div className="flex items-stretch justify-between gap-2 sm:gap-3">
          {rowTop.map((t) => (
            <OrbitChip key={t.id} topic={t} />
          ))}
        </div>

        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <OrbitChip topic={rowMid[0]} />
          <div className="relative z-10 shrink-0 px-1">
            <div
              className="pointer-events-none absolute left-1/2 top-[88%] h-8 w-24 -translate-x-1/2 rounded-[100%] bg-accent/35 blur-md"
              aria-hidden
            />
            <div
              className={`relative flex h-[4.75rem] w-[4.75rem] items-center justify-center rounded-[1.25rem] bg-navy sm:h-[5.5rem] sm:w-[5.5rem] sm:rounded-[1.4rem] ${ELEVATION_FLOAT}`}
              aria-hidden
            >
              <span className="text-[2.1rem] font-extrabold leading-none tracking-tight text-accent sm:text-[2.45rem]">
                K
              </span>
              <span className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-accent/45" />
              <span className="pointer-events-none absolute inset-[3px] rounded-[calc(1.25rem-3px)] sm:rounded-[calc(1.4rem-3px)] bg-gradient-to-br from-white/10 to-transparent" />
            </div>
          </div>
          <OrbitChip topic={rowMid[1]} />
        </div>

        <div className="flex items-stretch justify-between gap-2 sm:gap-3">
          {rowBot.map((t) => (
            <OrbitChip key={t.id} topic={t} />
          ))}
        </div>
      </div>
    </div>
  );
}

function OrbitChip({
  topic,
}: {
  topic: (typeof SOLUTION_TOPICS)[number];
}) {
  const Icon = ICON[topic.art];
  const label = HERO_CHIP_LABEL[topic.id] ?? topic.label;
  return (
    <Link
      href={topic.href}
      className={`group z-20 flex min-w-0 max-w-[48%] flex-1 items-center gap-2 rounded-xl border border-border bg-white/95 px-2.5 py-2 backdrop-blur-sm ${ELEVATION_HAIRLINE} ${TRANSITION_UI} hover:border-accent/45 hover:bg-white`}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
        <Icon size={15} strokeWidth={1.85} aria-hidden />
      </span>
      <span className={`min-w-0 text-left leading-snug ${BREADCRUMB_CURRENT_CLASS}`}>
        {label}
      </span>
    </Link>
  );
}
