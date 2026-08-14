import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Building2, Layers, Users } from "lucide-react";
import { SOLUTION_TOPICS } from "@/storefront/nav/ia";
import {
  BODY_MUTED_CLASS,
  BREADCRUMB_CLASS,
  BREADCRUMB_CURRENT_CLASS,
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

/** `/solutions/by-need` — compose mix by scale; not license-asset tracking. */
export function ByNeedSolutionLanding() {
  const others = SOLUTION_TOPICS.filter((t) => t.id !== "by-need");

  return (
    <div className="bg-white">
      <section className="relative overflow-x-clip border-b border-border">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_88%_18%,rgba(14,165,164,0.12),transparent_42%),radial-gradient(ellipse_at_10%_90%,rgba(14,165,233,0.05),transparent_48%)]"
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
            <Link href="/solutions" className={HOVER_LINK_ACCENT}>
              Giải pháp
            </Link>
            <span aria-hidden className="text-muted-soft">
              ›
            </span>
            <span className={BREADCRUMB_CURRENT_CLASS}>Giải pháp theo nhu cầu</span>
          </nav>

          <div className="max-w-2xl">
            <h1 className={HERO_TITLE_CLASS}>
              Kết hợp đúng sản phẩm với quy mô sử dụng
            </h1>
            <p className={`mt-4 ${PAGE_LEAD_CLASS}`}>
              Không phải trang quản lý license đã mua. Đây là bước chọn mix —
              năng suất, cloud, bảo mật, sao lưu — rồi mới mua hoặc nhờ KEYON
              tư vấn gói.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
                <h3 className={`mt-4 ${CARD_TITLE_CLASS}`}>{s.title}</h3>
                <p className={`mt-2 ${BODY_MUTED_CLASS}`}>{s.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-10 md:py-12 lg:py-14">
        <div className="home-container">
          <header className="mb-6 max-w-2xl md:mb-8">
            <h2 className={SECTION_TITLE_CLASS}>Chọn hướng rồi ghép</h2>
            <p className={`mt-2 ${SECTION_LEAD_CLASS}`}>
              Năm hướng sẵn có. Mix theo nhu cầu — quản lý license sau khi mua
              nằm ở trang riêng.
            </p>
          </header>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((t) => (
              <li key={t.id}>
                <Link
                  href={t.href}
                  className={`flex h-full flex-col rounded-2xl border border-border bg-[#F7FAFC] p-4 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER}`}
                >
                  <h3 className={CARD_TITLE_CLASS}>{t.label}</h3>
                  <p className={`mt-1.5 flex-1 ${BODY_MUTED_CLASS}`}>
                    {t.description}
                  </p>
                  <span className={`mt-3 ${HOVER_LINK_ACCENT}`}>Tìm hiểu →</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <SolutionFinalCta
        title="Cần KEYON ghép giúp?"
        subtitle="Tư vấn mix theo số người dùng — khác bước theo dõi license trong tài khoản."
        secondaryHref="/solutions/license-management"
        secondaryLabel="Quản lý bản quyền"
      />
    </div>
  );
}
