import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Check,
  CloudUpload,
  CreditCard,
  Download,
  FileSpreadsheet,
  Headphones,
  LayoutDashboard,
  LayoutGrid,
  Lock,
  PieChart,
  ShieldCheck,
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
  HERO_TITLE_CLASS,
  LINK_ACCENT_CLASS,
  OVERLINE_CLASS,
  PAGE_LEAD_CLASS,
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

const ICON_SM = { size: 18, strokeWidth: 1.85, "aria-hidden": true as const };

const HERO_POINTS: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Tập trung",
    body: "Quản lý mọi license trên một nơi.",
    Icon: LayoutGrid,
  },
  {
    title: "Minh bạch",
    body: "Theo dõi sử dụng & chi phí rõ ràng.",
    Icon: BarChart3,
  },
  {
    title: "Chủ động",
    body: "Cảnh báo & gia hạn tự động.",
    Icon: Bell,
  },
  {
    title: "Tiết kiệm",
    body: "Tối ưu chi phí bản quyền.",
    Icon: Wallet,
  },
];

const FEATURES: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Quản lý tập trung",
    body: "Lưu trữ và theo dõi toàn bộ license trên một nền tảng duy nhất.",
    Icon: LayoutGrid,
  },
  {
    title: "Cảnh báo thông minh",
    body: "Nhắc trước khi hết hạn — giảm gián đoạn và mất bản quyền.",
    Icon: Bell,
  },
  {
    title: "Theo dõi sử dụng",
    body: "Xem phân bổ theo phòng ban / người dùng để kiểm soát rõ ràng.",
    Icon: BarChart3,
  },
  {
    title: "Tối ưu chi phí",
    body: "Gợi ý số lượng seat phù hợp — tránh thừa hoặc thiếu license.",
    Icon: Wallet,
  },
  {
    title: "Báo cáo linh hoạt",
    body: "Báo cáo realtime và xuất dữ liệu khi cần kiểm toán.",
    Icon: Download,
  },
];

const STEPS: { n: string; title: string; body: string; Icon: LucideIcon }[] = [
  {
    n: "01",
    title: "Thêm license",
    body: "Đồng bộ hoặc nhập license chỉ trong vài phút.",
    Icon: CloudUpload,
  },
  {
    n: "02",
    title: "Phân bổ & theo dõi",
    body: "Gán cho user / team và theo dõi trạng thái sử dụng.",
    Icon: PieChart,
  },
  {
    n: "03",
    title: "Cảnh báo & gia hạn",
    body: "Hệ thống nhắc trước kỳ renew để bạn chủ động xử lý.",
    Icon: Bell,
  },
  {
    n: "04",
    title: "Gia hạn & tối ưu",
    body: "Gia hạn nhanh và tối ưu chi phí theo nhu cầu thực tế.",
    Icon: ShieldCheck,
  },
];

type BrandId = "m365" | "windows" | "adobe" | "acronis" | "autodesk";

const BRANDS: {
  id: BrandId;
  name: string;
  body: string;
  href: string;
}[] = [
  {
    id: "m365",
    name: "Microsoft 365",
    body: "Theo dõi seat, gia hạn và phân bổ cho đội nhóm.",
    href: "/products?q=microsoft+365",
  },
  {
    id: "windows",
    name: "Windows",
    body: "Quản lý bản quyền OS theo thiết bị và chu kỳ.",
    href: "/products?q=windows",
  },
  {
    id: "adobe",
    name: "Adobe",
    body: "Creative Cloud và ứng dụng — renewal rõ ràng.",
    href: "/products?q=adobe",
  },
  {
    id: "acronis",
    name: "Acronis",
    body: "Backup & cyber protect license tập trung.",
    href: "/products?q=acronis",
  },
  {
    id: "autodesk",
    name: "Autodesk",
    body: "Theo dõi subscription thiết kế / kỹ thuật.",
    href: "/products?q=autodesk",
  },
];

const CTA_PERKS = [
  "Không cần thẻ tín dụng",
  "Thiết lập nhanh trong 5 phút",
  "Hỗ trợ chuyên gia 1:1",
  "Bảo mật đạt chuẩn quốc tế",
] as const;

export function LicenseManagementSolutionLanding() {
  return (
    <div className="bg-white">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-x-clip border-b border-border">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_90%_12%,rgba(14,165,164,0.12),transparent_42%),radial-gradient(ellipse_at_8%_88%,rgba(14,165,233,0.06),transparent_48%)]"
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
            <span className={BREADCRUMB_CURRENT_CLASS}>Quản lý bản quyền</span>
          </nav>

          <div className="grid items-center gap-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-8 xl:gap-10">
            <div className="min-w-0">
              <p className={`${OVERLINE_CLASS} text-accent`}>Quản lý bản quyền</p>
              <h1 className={`mt-2.5 max-w-[18ch] ${HERO_TITLE_CLASS}`}>
                Kiểm soát toàn bộ license. Đơn giản, chủ động, hiệu quả.
              </h1>
              <p className={`mt-4 max-w-xl ${PAGE_LEAD_CLASS}`}>
                KEYON giúp doanh nghiệp tập trung quản lý bản quyền phần mềm và
                subscription trên một nền tảng — minh bạch, chủ động gia hạn và sẵn
                sàng khi kiểm toán.
              </p>

              <ul className="mt-6 grid gap-3.5 sm:grid-cols-2">
                {HERO_POINTS.map((p) => (
                  <li key={p.title} className="flex gap-3">
                    <span
                      className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent"
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
                  href="/account"
                  className={`inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white shadow-sm ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
                >
                  Khám phá giải pháp →
                </Link>
                <Link
                  href="/contact/sales"
                  className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-accent/40 bg-white px-6 ${CTA_LABEL_CLASS} text-accent ${TRANSITION_UI} hover:border-accent hover:bg-accent-soft`}
                >
                  <Headphones {...ICON_SM} />
                  Tư vấn miễn phí
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[560px] overflow-visible lg:max-w-none">
              <LicenseMgmtHeroArt />
            </div>
          </div>
        </div>
      </section>

      {/* ── Smart features ───────────────────────────────────── */}
      <section className="py-9 md:py-11">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Quản lý bản quyền thông minh</h2>
            <div className="mx-auto mt-2.5 h-1 w-14 rounded-full bg-accent" aria-hidden />
          </header>

          <ul className="mt-7 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3.5">
            {FEATURES.map((f) => (
              <li key={f.title}>
                <article
                  className={`flex h-full flex-col items-center rounded-2xl border border-border bg-white p-4 text-center sm:p-5 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER}`}
                >
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent"
                    aria-hidden
                  >
                    <f.Icon size={20} strokeWidth={1.8} />
                  </span>
                  <h3 className={`mt-3 ${CARD_TITLE_CLASS}`}>{f.title}</h3>
                  <p className={`mt-1.5 ${BODY_MUTED_CLASS}`}>{f.body}</p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 4 steps ──────────────────────────────────────────── */}
      <section className="pb-9 md:pb-11">
        <div className="home-container">
          <div className="relative overflow-hidden rounded-2xl bg-navy px-5 py-9 sm:px-8 sm:py-10 lg:px-10">
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "radial-gradient(ellipse at 20% 30%, rgba(14,165,164,0.28), transparent 45%), radial-gradient(ellipse at 85% 70%, rgba(56,189,248,0.12), transparent 40%)",
              }}
              aria-hidden
            />
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.12]"
              preserveAspectRatio="none"
              aria-hidden
            >
              <path
                d="M0 120 Q180 40 360 130 T720 100 T1080 140 T1440 90"
                fill="none"
                stroke="#5eead4"
                strokeWidth="1.5"
              />
              <path
                d="M0 200 Q220 280 440 190 T880 220 T1320 180 T1600 240"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="1.2"
              />
            </svg>

            <header className="relative mx-auto max-w-2xl text-center">
              <h2 className={`${SECTION_TITLE_CLASS} text-white`}>
                Quy trình quản lý bản quyền chỉ trong 4 bước
              </h2>
            </header>

            <ol className="relative mt-9 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
              <span
                className="pointer-events-none absolute left-[8%] right-[8%] top-7 hidden border-t border-dashed border-white/25 lg:block"
                aria-hidden
              />
              {STEPS.map((s) => (
                <li key={s.n} className="relative z-[1] flex flex-col items-center text-center">
                  <span
                    className={`flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white ${ELEVATION_FLOAT}`}
                    aria-hidden
                  >
                    <s.Icon size={22} strokeWidth={1.8} />
                  </span>
                  <p className={`mt-3.5 ${CARD_TITLE_CLASS} text-white`}>
                    <span className="text-accent">{s.n}.</span> {s.title}
                  </p>
                  <p className="mt-1.5 max-w-[22ch] text-sm leading-relaxed text-slate-300">
                    {s.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── Popular brands ───────────────────────────────────── */}
      <section className="pb-9 md:pb-11">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Quản lý mọi loại bản quyền phổ biến</h2>
            <div className="mx-auto mt-2.5 h-1 w-14 rounded-full bg-accent" aria-hidden />
          </header>

          <ul className="mt-7 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {BRANDS.map((b) => (
              <li key={b.id}>
                <Link
                  href={b.href}
                  className={`flex h-full flex-col rounded-2xl border border-border bg-white p-4 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER} ${HOVER_LINK_ACCENT}`}
                >
                  <BrandMark brand={b.id} size={40} />
                  <h3 className={`mt-3 ${CARD_TITLE_CLASS}`}>{b.name}</h3>
                  <p className={`mt-1 ${BODY_MUTED_CLASS}`}>{b.body}</p>
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/products"
                className={`flex h-full flex-col items-start justify-between rounded-2xl border border-dashed border-accent/40 bg-accent-soft/40 p-4 ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER}`}
              >
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-accent"
                  aria-hidden
                >
                  <LayoutGrid size={20} strokeWidth={1.8} />
                </span>
                <div className="mt-3">
                  <p className={`${CARD_TITLE_CLASS} text-accent`}>Xem tất cả</p>
                  <p className={`mt-1 ${CARD_META_CLASS}`}>Toàn bộ catalog bản quyền</p>
                </div>
                <span className={`mt-3 ${LINK_ACCENT_CLASS}`}>Duyệt sản phẩm →</span>
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="pb-9 md:pb-11">
        <div className="home-container">
          <div className="relative overflow-hidden rounded-2xl bg-accent px-5 py-8 sm:px-8 sm:py-9 lg:px-10">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_50%,rgba(255,255,255,0.14),transparent_40%),radial-gradient(ellipse_at_90%_20%,rgba(11,31,51,0.18),transparent_45%)]"
              aria-hidden
            />

            <div className="relative grid items-center gap-8 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-10">
              <div className="mx-auto hidden w-[120px] shrink-0 lg:block" aria-hidden>
                <CtaShieldArt />
              </div>

              <div className="min-w-0 text-center lg:text-left">
                <h2 className={`${SECTION_TITLE_CLASS} text-white`}>
                  Sẵn sàng kiểm soát bản quyền hiệu quả hơn?
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-white/85 md:text-[15px]">
                  Tối ưu chi phí, giảm rủi ro hết hạn và nắm rõ toàn bộ license trên một
                  nền tảng KEYON.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                  <Link
                    href="/account"
                    className={`inline-flex h-12 items-center justify-center rounded-xl bg-white px-6 ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} hover:bg-white/95`}
                  >
                    Dùng thử miễn phí →
                  </Link>
                  <Link
                    href="/contact/sales"
                    className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/50 bg-transparent px-6 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:border-white hover:bg-white/10`}
                  >
                    <Headphones {...ICON_SM} />
                    Liên hệ tư vấn
                  </Link>
                </div>
              </div>

              <ul className="mx-auto w-full max-w-xs space-y-2.5 lg:mx-0">
                {CTA_PERKS.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-white">
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20"
                      aria-hidden
                    >
                      <Check size={14} strokeWidth={2.6} />
                    </span>
                    <span className="text-sm font-medium leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function LicenseMgmtHeroArt() {
  const stats = [
    { label: "Tổng license", value: "523", tone: "text-navy" },
    { label: "Đang dùng", value: "398", tone: "text-accent" },
    { label: "Sắp hết hạn", value: "27", tone: "text-amber-600" },
    { label: "Hết hạn", value: "4", tone: "text-rose-600" },
  ];

  const alerts = [
    { name: "Microsoft 365", meta: "Hết hạn sau 12 ngày", tone: "warn" as const },
    { name: "Adobe Acrobat", meta: "Hết hạn sau 5 ngày", tone: "danger" as const },
    { name: "Acronis Cyber", meta: "Hết hạn sau 21 ngày", tone: "warn" as const },
  ];

  const nav = [
    { Icon: LayoutDashboard, active: true },
    { Icon: FileSpreadsheet, active: false },
    { Icon: CreditCard, active: false },
    { Icon: Bell, active: false },
    { Icon: ShieldCheck, active: false },
  ];

  return (
    <div className="hero-dashboard-scene pb-10 sm:pb-9 lg:pb-8">
      {/* Radial teal glow — background decoration behind panel */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[78%] w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(14,165,164,0.22)_0%,rgba(14,165,164,0.08)_42%,transparent_70%)] blur-2xl"
        aria-hidden
      />

      <div className="hero-dashboard-panel">
        <div
          className="hero-dashboard-surface relative overflow-hidden rounded-[1.35rem] border border-slate-200/90 bg-[#f1f5f9]"
          role="img"
          aria-label="Bảng điều khiển quản lý license KEYON: tổng quan, biểu đồ trạng thái và cảnh báo gia hạn"
        >
          <div className="flex min-h-[300px] sm:min-h-[340px] lg:min-h-[360px]">
            {/* Sidebar */}
            <aside className="flex w-11 shrink-0 flex-col items-center gap-2 border-r border-slate-200/80 bg-white py-3 sm:w-12 sm:gap-2.5 sm:py-3.5">
              <span
                className="mb-1 flex h-7 w-7 items-center justify-center rounded-lg bg-navy font-display text-[11px] font-extrabold text-accent sm:h-8 sm:w-8"
                aria-hidden
              >
                K
              </span>
              {nav.map(({ Icon, active }, i) => (
                <span
                  key={i}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    active ? "bg-accent-soft text-accent" : "text-slate-400"
                  }`}
                  aria-hidden
                >
                  <Icon size={15} strokeWidth={1.85} />
                </span>
              ))}
            </aside>

            {/* Main */}
            <div className="min-w-0 flex-1 p-2.5 sm:p-3.5">
              <div className="mb-2.5 flex items-center justify-between gap-2">
                <div>
                  <p className={`${BADGE_CLASS} text-slate-400`}>License Hub</p>
                  <p className={`${CARD_TITLE_CLASS} text-[13px] sm:text-sm`}>Tổng quan</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
                  Live
                </span>
              </div>

              <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl border border-slate-200/80 bg-white px-1.5 py-2 text-center sm:px-2 sm:py-2.5"
                  >
                    <p
                      className={`font-display text-sm font-bold tabular-nums leading-none sm:text-base ${s.tone}`}
                    >
                      {s.value}
                    </p>
                    <p className="mt-1 text-[8px] font-semibold leading-tight text-slate-500 sm:text-[9px]">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-2.5 grid gap-2.5 sm:mt-3 sm:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
                <div className="rounded-xl border border-slate-200/80 bg-white p-2.5 sm:p-3">
                  <p className={`${BADGE_CLASS} mb-2 font-semibold text-slate-500`}>
                    Phân bố trạng thái
                  </p>
                  <div className="flex items-center gap-3">
                    <svg
                      viewBox="0 0 120 120"
                      className="h-[88px] w-[88px] shrink-0 sm:h-[100px] sm:w-[100px]"
                      aria-hidden
                    >
                      <circle cx="60" cy="60" r="38" fill="#f8fafc" />
                      <circle
                        cx="60"
                        cy="60"
                        r="34"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="12"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="34"
                        fill="none"
                        stroke="#0ea5a4"
                        strokeWidth="12"
                        strokeDasharray={`${2 * Math.PI * 34 * 0.76} ${2 * Math.PI * 34}`}
                        strokeLinecap="round"
                        transform="rotate(-90 60 60)"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="34"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="12"
                        strokeDasharray={`${2 * Math.PI * 34 * 0.08} ${2 * Math.PI * 34}`}
                        strokeDashoffset={-2 * Math.PI * 34 * 0.76}
                        transform="rotate(-90 60 60)"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="34"
                        fill="none"
                        stroke="#f43f5e"
                        strokeWidth="12"
                        strokeDasharray={`${2 * Math.PI * 34 * 0.03} ${2 * Math.PI * 34}`}
                        strokeDashoffset={-2 * Math.PI * 34 * 0.84}
                        transform="rotate(-90 60 60)"
                      />
                      <text
                        x="60"
                        y="58"
                        textAnchor="middle"
                        fill="#0b1f33"
                        fontSize="16"
                        fontWeight="800"
                        fontFamily="var(--font-display), system-ui, sans-serif"
                      >
                        76%
                      </text>
                      <text
                        x="60"
                        y="72"
                        textAnchor="middle"
                        fill="#94a3b8"
                        fontSize="8"
                        fontWeight="600"
                      >
                        Đang dùng
                      </text>
                    </svg>
                    <ul className="min-w-0 space-y-1.5">
                      {[
                        { label: "Đang dùng", color: "bg-accent" },
                        { label: "Sắp hết hạn", color: "bg-amber-500" },
                        { label: "Hết hạn", color: "bg-rose-500" },
                        { label: "Chưa gán", color: "bg-slate-300" },
                      ].map((l) => (
                        <li key={l.label} className="flex items-center gap-1.5">
                          <span className={`h-2 w-2 shrink-0 rounded-full ${l.color}`} />
                          <span className="truncate text-[10px] font-medium text-slate-600">
                            {l.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200/80 bg-white p-2.5 sm:p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className={`${BADGE_CLASS} font-semibold text-slate-500`}>Cảnh báo</p>
                    <span className="rounded-full bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold text-amber-700">
                      3 mới
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {alerts.map((a) => (
                      <li
                        key={a.name}
                        className="flex items-start gap-2 rounded-lg bg-slate-50 px-2 py-1.5"
                      >
                        <span
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${
                            a.tone === "danger"
                              ? "bg-rose-100 text-rose-600"
                              : "bg-amber-100 text-amber-700"
                          }`}
                          aria-hidden
                        >
                          <AlertTriangle size={11} strokeWidth={2.2} />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-[11px] font-bold text-navy">
                            {a.name}
                          </span>
                          <span className="block text-[9px] text-slate-500">{a.meta}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating cards — same 3D space, translateZ ahead of panel */}
        <div
          className={`hero-dashboard-float absolute -left-3 top-[40%] z-20 hidden items-center gap-2 rounded-xl border border-border bg-white px-2.5 py-2 sm:flex md:-left-5`}
        >
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700"
            aria-hidden
          >
            <Bell size={15} strokeWidth={1.9} />
          </span>
          <div className="min-w-0">
            <p className={`${BADGE_CLASS} font-semibold text-navy`}>27 sắp hết hạn</p>
            <p className="text-[10px] text-muted">Nhắc trước 30 ngày</p>
          </div>
        </div>

        <div
          className={`hero-dashboard-float absolute -bottom-3 -right-2 z-20 flex max-w-[210px] items-start gap-2.5 rounded-2xl border border-border bg-white p-3 sm:-bottom-4 sm:-right-3 sm:max-w-[230px]`}
        >
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent"
            aria-hidden
          >
            <Lock size={16} strokeWidth={1.9} />
          </span>
          <div className="min-w-0">
            <p className={`${BADGE_CLASS} font-semibold text-navy`}>An toàn & bảo mật</p>
            <p className="mt-0.5 text-[11px] leading-snug text-muted">
              Dữ liệu license được mã hoá và bảo vệ tuyệt đối.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CtaShieldArt() {
  return (
    <div className="relative mx-auto aspect-square w-full">
      <span
        className="pointer-events-none absolute inset-[18%] rounded-full bg-white/20 blur-xl"
        aria-hidden
      />
      <svg viewBox="0 0 120 120" className="relative h-full w-full drop-shadow-[0_12px_28px_rgba(11,31,51,0.25)]" aria-hidden>
        <defs>
          <linearGradient id="lmShield" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#ccfbf1" stopOpacity="0.85" />
          </linearGradient>
        </defs>
        <path
          d="M60 10 22 28v30c0 28 18 52 38 60 20-8 38-32 38-60V28L60 10Z"
          fill="url(#lmShield)"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="2"
        />
        <circle cx="60" cy="58" r="18" fill="#0b1f33" />
        <path
          d="M52 58.5 57.2 63.5 69 50.5"
          fill="none"
          stroke="#5eead4"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="94" cy="28" r="3" fill="#ffffff" opacity="0.85" />
        <circle cx="28" cy="36" r="2" fill="#ffffff" opacity="0.55" />
      </svg>
    </div>
  );
}

function BrandMark({ brand, size = 40 }: { brand: BrandId; size?: number }) {
  if (brand === "windows") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <path
          fill="#0078D4"
          d="M3 5.5 11 4.3v7.2H3V5.5Zm9-.9 9-1.3v9.4h-9V4.6ZM3 13.5h8V21l-8-1.2v-6.3Zm9 0h9v8.7l-9-1.3v-7.4Z"
        />
      </svg>
    );
  }
  if (brand === "m365") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <path fill="#D83B01" d="M3 4.5 14 2v20L3 19.5V4.5Z" />
        <path fill="#A4262C" d="M14 2h7v20h-7V2Z" opacity="0.85" />
        <path fill="#fff" d="M6.2 8.2h5.2v1.4H8.1v1.6h3v1.3H8.1v1.8h3.4v1.4H6.2V8.2Z" />
      </svg>
    );
  }
  if (brand === "adobe") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <rect width="24" height="24" rx="5" fill="#EB1000" />
        <path
          fill="#fff"
          d="M8.2 17.5 12 6.5l3.8 11H14l-.7-2.1H10.7l-.7 2.1H8.2Zm3-7.8-.95 2.9h1.9L11.2 9.7Z"
        />
      </svg>
    );
  }
  if (brand === "acronis") {
    return (
      <span
        className="inline-flex items-center justify-center rounded-lg bg-[#1A73E8] font-display text-xs font-bold text-white"
        style={{ width: size, height: size }}
        aria-hidden
      >
        AC
      </span>
    );
  }
  if (brand === "autodesk") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <rect width="24" height="24" rx="5" fill="#0696D7" />
        <path
          fill="#fff"
          d="M5 17.5 10.2 6.5h3.2L18.6 17.5h-3.1l-.9-2.2H9l-.9 2.2H5Zm4.8-4.4h3.8l-1.9-4.6-1.9 4.6Z"
        />
      </svg>
    );
  }
  return null;
}
