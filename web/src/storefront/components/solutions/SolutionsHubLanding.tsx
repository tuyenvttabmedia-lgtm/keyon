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
  BREADCRUMB_CURRENT_CLASS,
  CARD_TITLE_CLASS,
  CTA_COMPACT_CLASS,
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
  TRANSITION_PANEL,
  TRANSITION_UI,
} from "@/storefront/effects";

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
        <div className="home-container relative py-10 md:py-12 lg:py-14">
          <SolutionPageChrome
            kicker="Giải pháp"
            crumbs={[
              { label: "Trang chủ", href: "/" },
              { label: "Giải pháp" },
            ]}
          />
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-12">
            <div>
              <h1 className={`max-w-3xl ${HERO_TITLE_CLASS}`}>
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
            <HubOrbit />
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

function HubOrbit() {
  const chips = SOLUTION_TOPICS.slice(0, 5);
  return (
    <div className="relative mx-auto hidden min-h-[280px] max-w-md lg:block">
      <div
        className={`absolute left-1/2 top-1/2 flex h-[7.5rem] w-[7.5rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[1.75rem] bg-navy text-[2.5rem] font-bold text-white ${ELEVATION_FLOAT}`}
        aria-hidden
      >
        K
      </div>
      {chips.map((t, i) => {
        const Icon = ICON[t.art];
        const pos = CHIP_POS[i];
        return (
          <span
            key={t.id}
            className={`absolute flex items-center gap-2 rounded-xl border border-border bg-white px-2.5 py-2 ${ELEVATION_HAIRLINE} ${pos}`}
          >
            <Icon size={16} strokeWidth={1.85} className="text-accent" aria-hidden />
            <span className={`max-w-[9.5rem] truncate ${BREADCRUMB_CURRENT_CLASS}`}>
              {t.label}
            </span>
          </span>
        );
      })}
    </div>
  );
}

const CHIP_POS = [
  "left-0 top-[8%]",
  "right-0 top-[12%]",
  "left-[-4%] bottom-[28%]",
  "right-[-2%] bottom-[22%]",
  "left-1/2 bottom-[4%] -translate-x-1/2",
] as const;
