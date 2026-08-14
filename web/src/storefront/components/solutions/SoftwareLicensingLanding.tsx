import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Building2,
  Clock,
  KeyRound,
  RefreshCw,
  ShoppingBag,
  Users,
  Zap,
} from "lucide-react";
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

const ICON_SM = { size: 18, strokeWidth: 1.85, "aria-hidden": true as const };
const ICON_MD = { size: 22, strokeWidth: 1.75, "aria-hidden": true as const };

const HERO_POINTS: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Chính hãng",
    body: "Nguồn gốc và loại license ghi rõ trên gói.",
    Icon: BadgeCheck,
  },
  {
    title: "Nhận hàng rõ",
    body: "Key hoặc tài khoản — đúng hình thức đã mua.",
    Icon: Zap,
  },
  {
    title: "Hỗ trợ Việt",
    body: "Kích hoạt và hậu mãi bằng tiếng Việt.",
    Icon: KeyRound,
  },
];

const FORMS: {
  title: string;
  body: string;
  href: string;
  Icon: LucideIcon;
}[] = [
  {
    title: "Perpetual",
    body: "Mua một lần, dùng lâu dài theo điều khoản gói — phù hợp nhu cầu ổn định.",
    href: "/products",
    Icon: ShoppingBag,
  },
  {
    title: "Subscription",
    body: "Thuê bao, luôn cập nhật — theo dõi chu kỳ trên KEYON.",
    href: "/business/subscriptions",
    Icon: RefreshCw,
  },
  {
    title: "Volume",
    body: "Nhiều ghế cho tổ chức — báo giá theo quy mô, triển khai tập trung.",
    href: "/business/volume-licensing",
    Icon: Building2,
  },
];

const STEPS: { n: string; title: string; body: string }[] = [
  {
    n: "01",
    title: "Chọn gói",
    body: "Xem catalog hoặc nhờ KEYON tư vấn đúng loại cấp phép.",
  },
  {
    n: "02",
    title: "Thanh toán",
    body: "VietQR / chuyển khoản — trạng thái đơn rõ trên tài khoản.",
  },
  {
    n: "03",
    title: "Nhận license",
    body: "Key, tài khoản hoặc hướng dẫn kích hoạt — đúng loại đã ghi.",
  },
];

/** Landing `/solutions/software-licensing` — core KEYON outcome, not a shop dump. */
export function SoftwareLicensingLanding() {
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
            <span className={BREADCRUMB_CURRENT_CLASS}>Bản quyền phần mềm</span>
          </nav>

          <div className="max-w-2xl">
            <h1 className={HERO_TITLE_CLASS}>
              Bản quyền phần mềm đúng nhu cầu, đúng giá trị
            </h1>
            <p className={`mt-4 ${PAGE_LEAD_CLASS}`}>
              License chính hãng cho cá nhân, đội nhóm và tổ chức — chọn đúng hình
              thức cấp phép, nhận đúng loại đã mua, quản lý tiếp trong tài khoản
              KEYON.
            </p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-3 sm:gap-3">
              {HERO_POINTS.map((p) => (
                <li key={p.title} className="flex gap-2.5 sm:flex-col sm:items-start">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent"
                    aria-hidden
                  >
                    <p.Icon {...ICON_SM} />
                  </span>
                  <div className="min-w-0">
                    <p className={CARD_TITLE_CLASS}>{p.title}</p>
                    <p className={`mt-0.5 ${BODY_MUTED_CLASS}`}>{p.body}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/products"
                className={`inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white shadow-sm ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
              >
                Khám phá sản phẩm →
              </Link>
              <Link
                href="/business/licensing-consulting"
                className={`inline-flex h-12 items-center justify-center rounded-xl border border-border bg-white px-6 ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
              >
                Tư vấn bản quyền
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F7FAFC] py-10 md:py-12 lg:py-14">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Đa dạng hình thức cấp phép</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Cùng một nhu cầu dùng phần mềm — khác mô hình mua. KEYON ghi rõ loại
              trên từng gói, không gộp chung “bản quyền”.
            </p>
          </header>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {FORMS.map((f) => (
              <li key={f.title}>
                <Link
                  href={f.href}
                  className={`flex h-full flex-col rounded-2xl border border-border bg-white p-5 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER}`}
                >
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent"
                    aria-hidden
                  >
                    <f.Icon {...ICON_MD} />
                  </span>
                  <h3 className={`mt-4 ${CARD_TITLE_CLASS}`}>{f.title}</h3>
                  <p className={`mt-2 flex-1 ${BODY_MUTED_CLASS}`}>{f.body}</p>
                  <span className={`mt-4 ${HOVER_LINK_ACCENT}`}>Tìm hiểu →</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-10 md:py-12 lg:py-14">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Ba bước nhận bản quyền</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Không phải trang cửa hàng — đây là cách KEYON giao license sau khi
              bạn đã chọn đúng gói.
            </p>
          </header>
          <ol className="mt-8 grid gap-6 sm:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.n} className="text-center">
                <p className="text-xs font-semibold tabular-nums text-muted">{s.n}</p>
                <span
                  className="mx-auto mt-2 flex h-11 w-11 items-center justify-center rounded-full border-2 border-accent/40 text-accent"
                  aria-hidden
                >
                  {s.n === "01" ? (
                    <Users {...ICON_MD} />
                  ) : s.n === "02" ? (
                    <Clock {...ICON_MD} />
                  ) : (
                    <KeyRound {...ICON_MD} />
                  )}
                </span>
                <h3 className={`mt-3 ${CARD_TITLE_CLASS}`}>{s.title}</h3>
                <p className={`mt-1.5 ${BODY_MUTED_CLASS}`}>{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <SolutionFinalCta
        title="Chưa chắc nên mua gói nào?"
        subtitle="Tư vấn hình thức cấp phép trước — rồi mua trên Sản phẩm hoặc báo giá doanh nghiệp."
        secondaryHref="/products"
        secondaryLabel="Xem sản phẩm"
      />
    </div>
  );
}
