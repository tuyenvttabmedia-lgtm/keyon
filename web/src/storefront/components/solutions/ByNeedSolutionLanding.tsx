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
import {
  LANDING_HERO_GRID,
  LANDING_HERO_PAD,
} from "@/storefront/components/marketing/hero-shell";
import {
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

const ICON_MD = { size: 22, strokeWidth: 1.75, "aria-hidden": true as const };

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
    body: "Mix theo phòng ban, rồi mua volume / subscription qua KEYON.",
    Icon: Building2,
  },
];

const MIX_ROWS: { label: string; hint: string; Icon: LucideIcon; tone: string }[] = [
  {
    label: "Năng suất & Cộng tác",
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
    label: "Sao lưu & Khôi phục",
    hint: "Backup / DR",
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
          <nav className={`mb-5 flex flex-wrap items-center gap-1.5 ${BREADCRUMB_CLASS}`}>
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

          <div className={LANDING_HERO_GRID}>
            <div className="min-w-0 max-w-[540px]">
              <h1 className={HERO_TITLE_CLASS}>
                Kết hợp đúng sản phẩm với quy mô sử dụng
              </h1>
              <p className={`mt-4 ${PAGE_LEAD_CLASS}`}>
                Không phải trang quản lý license đã mua. Đây là bước chọn mix —
                năng suất, cloud, bảo mật, sao lưu — rồi mới mua hoặc nhờ KEYON
                tư vấn gói.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/business/licensing-consulting"
                  className={`inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white shadow-sm ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
                >
                  Tư vấn mix giải pháp →
                </Link>
                <Link
                  href="/solutions"
                  className={`inline-flex h-12 items-center justify-center rounded-xl border border-border bg-white px-6 ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
                >
                  Tất cả giải pháp
                </Link>
              </div>
            </div>

            <div className="relative min-w-0">
              <ByNeedHeroArt />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F7FAFC] py-10 md:py-12 lg:py-14">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Theo quy mô</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Cùng một bộ giải pháp KEYON — khác số người dùng và cách ghép.
            </p>
          </header>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {SCALES.map((s) => (
              <li
                key={s.title}
                className={`rounded-2xl border border-border bg-white p-5 ${ELEVATION_HAIRLINE}`}
              >
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent"
                  aria-hidden
                >
                  <s.Icon {...ICON_MD} />
                </span>
                <h3 className={`mt-3.5 ${CARD_TITLE_CLASS}`}>{s.title}</h3>
                <p className={`mt-1.5 ${BODY_MUTED_CLASS}`}>{s.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white py-10 md:py-12 lg:py-14">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Các hướng giải pháp</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Chọn một hướng rồi ghép thêm khi cần — hoặc để KEYON tư vấn mix.
            </p>
          </header>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((t) => (
              <li key={t.id}>
                <Link
                  href={t.href}
                  className={`flex h-full flex-col rounded-2xl border border-border bg-white p-5 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER}`}
                >
                  <h3 className={CARD_TITLE_CLASS}>{t.label}</h3>
                  <p className={`mt-1.5 flex-1 ${BODY_MUTED_CLASS}`}>{t.description}</p>
                  <span className={`mt-3 text-sm font-semibold text-accent ${HOVER_LINK_ACCENT}`}>
                    Xem giải pháp →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <SolutionFinalCta
        title="Cần KEYON ghép giúp?"
        subtitle="Tư vấn mix theo số người dùng — khác bước theo dõi license trong tài khoản."
        primaryHref="/business/licensing-consulting"
        primaryLabel="Nhận tư vấn mix"
        secondaryHref="/solutions/license-management"
        secondaryLabel="Quản lý bản quyền"
      />
    </div>
  );
}

/** Mix panel + scale chips — software-licensing mockup language, no fake metrics. */
function ByNeedHeroArt() {
  return (
    <div className="relative mx-auto w-full max-w-[440px] lg:max-w-none">
      <div
        className={`relative rounded-2xl border border-border bg-white p-4 sm:p-5 ${ELEVATION_FLOAT}`}
        aria-hidden
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy text-accent">
              <Layers size={18} strokeWidth={1.8} />
            </span>
            <div>
              <p className={CARD_TITLE_CLASS}>Ghép giải pháp theo nhu cầu</p>
              <p className={CARD_META_CLASS}>Minh họa bước chọn mix</p>
            </div>
          </div>
          <span className="rounded-md bg-accent-soft px-2 py-1 text-[11px] font-semibold text-accent">
            KEYON
          </span>
        </div>

        <ul className="mt-4 space-y-2">
          {MIX_ROWS.map((r) => (
            <li
              key={r.label}
              className="flex items-center gap-3 rounded-xl border border-border/80 bg-[#F7FAFC] px-3 py-2.5"
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
