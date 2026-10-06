"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  AppWindow,
  Check,
  Cloud,
  CloudUpload,
  FolderOpen,
  Headphones,
  History,
  Laptop,
  Lock,
  RefreshCw,
  Server,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { SolutionHeroPhoto } from "@/storefront/components/solutions/SolutionHeroPhoto";
import {
  BADGE_CLASS,
  BODY_MUTED_CLASS,
  BREADCRUMB_CLASS,
  BREADCRUMB_CURRENT_CLASS,
  CARD_META_CLASS,
  CARD_PRICE_CLASS,
  CARD_TITLE_CLASS,
  CTA_COMPACT_CLASS,
  CTA_LABEL_CLASS,
  HERO_TITLE_CLASS,
  LINK_ACCENT_CLASS,
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
import {
  LANDING_CRUMB_GAP,
  LANDING_HERO_GRID,
  LANDING_HERO_PAD,
} from "@/storefront/components/marketing/hero-shell";
import { SolutionFinalCta } from "./SolutionFinalCta";

export type BackupBrand = "acronis" | "aomei" | "veeam" | "microsoft" | "generic";

export type BackupFeaturedProduct = {
  id: string;
  title: string;
  href: string;
  brandLabel: string;
  meta: string;
  priceLabel: string;
  priceHint?: string;
  imageUrl?: string;
  features: string[];
  brand: BackupBrand;
  /** Which selector tabs this SKU belongs to */
  tabs: BackupTabId[];
};

type BackupTabId = "endpoint" | "server" | "cloud" | "saas" | "dr";

type Props = {
  featured: BackupFeaturedProduct[];
  heroImageUrl?: string;
};

const ICON_SM = { size: 18, strokeWidth: 1.85, "aria-hidden": true as const };

const HERO_POINTS: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "License phần mềm backup",
    body: "Chọn sản phẩm và license backup phù hợp với thiết bị hoặc hạ tầng.",
    Icon: CloudUpload,
  },
  {
    title: "Tính năng theo vendor",
    body: "Lịch sao lưu, lưu trữ, mã hóa và khôi phục tùy theo sản phẩm và gói license.",
    Icon: Lock,
  },
  {
    title: "Hỗ trợ chọn gói",
    body: "Tư vấn tiếng Việt khi cần lựa chọn backup cho PC, server, Microsoft 365 hoặc Cloud.",
    Icon: RefreshCw,
  },
];

const DATA_PILLARS: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Thiết bị",
    body: "Gói endpoint cho PC / laptop — sao lưu file hoặc image theo phần mềm vendor.",
    Icon: Laptop,
  },
  {
    title: "Hệ thống",
    body: "Gói server / máy trạm — khôi phục theo khả năng của sản phẩm đã mua.",
    Icon: Server,
  },
  {
    title: "Dữ liệu quan trọng",
    body: "Bảo vệ tài liệu, ảnh, database trên hạ tầng do bạn hoặc IT quản lý.",
    Icon: FolderOpen,
  },
  {
    title: "Ứng dụng & SaaS",
    body: "Backup dữ liệu Microsoft 365 và các nền tảng SaaS theo phạm vi hỗ trợ của từng sản phẩm.",
    Icon: AppWindow,
  },
  {
    title: "Dữ liệu đám mây",
    body: "Backup dữ liệu trên các nền tảng Cloud theo phạm vi hỗ trợ của từng sản phẩm.",
    Icon: Cloud,
  },
];

const TABS: { id: BackupTabId; label: string }[] = [
  { id: "endpoint", label: "Endpoint Backup" },
  { id: "server", label: "Server Backup" },
  { id: "cloud", label: "Cloud Backup" },
  { id: "saas", label: "SaaS Backup" },
  { id: "dr", label: "Gói liên quan DR" },
];

const TRUST_STRIP: { title: string; Icon: LucideIcon }[] = [
  { title: "Kích hoạt theo gói", Icon: Zap },
  { title: "Thanh toán an toàn", Icon: Lock },
  { title: "Hỗ trợ tiếng Việt", Icon: Headphones },
  { title: "Điều khoản theo vendor", Icon: ShieldCheck },
];

const FLOW: { title: string; body: string; Icon: LucideIcon; highlight?: boolean }[] = [
  {
    title: "Sự cố xảy ra",
    body: "Mất dữ liệu, xóa nhầm hoặc thiết bị hỏng.",
    Icon: AlertTriangle,
  },
  {
    title: "Bạn đã có bản sao",
    body: "Bản sao nằm trên hạ tầng / cloud do phần mềm vendor quản lý — không trên KEYON.",
    Icon: CloudUpload,
  },
  {
    title: "Khôi phục trong phần mềm",
    body: "Chọn điểm khôi phục trong sản phẩm đã kích hoạt — thời gian phụ thuộc dung lượng và hạ tầng.",
    Icon: History,
    highlight: true,
  },
  {
    title: "Dữ liệu trở lại bình thường",
    body: "File và hệ thống sẵn sàng sử dụng lại sau khi restore xong.",
    Icon: Check,
  },
  {
    title: "Tiếp tục bảo vệ dữ liệu",
    body: "Duy trì lịch sao lưu và chính sách bảo vệ theo cấu hình của sản phẩm.",
    Icon: ShieldCheck,
  },
];

export function BackupSolutionLanding({ featured, heroImageUrl }: Props) {
  const [tab, setTab] = useState<BackupTabId>("endpoint");
  const showFeatured = featured.length > 0;
  const heroSrc = heroImageUrl?.trim() || "";

  const products = useMemo(() => {
    const filtered = featured.filter((p) => p.tabs.includes(tab));
    const list = filtered.length > 0 ? filtered : featured;
    return list.slice(0, 4);
  }, [featured, tab]);

  return (
    <div className="bg-white">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-x-clip border-b border-border bg-white">
        {heroSrc ? null : (
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_88%_18%,rgba(14,165,164,0.12),transparent_42%),radial-gradient(ellipse_at_10%_90%,rgba(14,165,233,0.05),transparent_48%)]"
            aria-hidden
          />
        )}
        <div className={`home-container relative ${LANDING_HERO_PAD}`}>
          <SolutionHeroPhoto src={heroSrc} />
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
            <span className={BREADCRUMB_CURRENT_CLASS}>Sao lưu và khôi phục</span>
          </nav>

          <div className={LANDING_HERO_GRID}>
            <div className="min-w-0 max-w-[520px]">
              <h1 className={`max-w-xl ${HERO_TITLE_CLASS}`}>
                Giải pháp sao lưu và khôi phục dữ liệu
              </h1>
              <p className="mt-3 max-w-xl font-display text-lg font-semibold tracking-tight text-navy sm:text-xl">
                Dữ liệu của bạn.{" "}
                <span className="text-accent">Luôn có đường quay trở lại.</span>
              </p>
              <p className={`mt-3 max-w-xl ${PAGE_LEAD_CLASS}`}>
                Khám phá phần mềm và license backup cho PC, máy chủ, Microsoft 365 và dữ liệu
                Cloud trên KEYON, với thông tin rõ ràng và hỗ trợ kích hoạt tiếng Việt.
              </p>

              <ul className="mt-5 grid gap-3 sm:grid-cols-3 sm:gap-2.5">
                {HERO_POINTS.map((p) => (
                  <li key={p.title} className="flex gap-2.5 sm:flex-col sm:items-start sm:gap-1.5">
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent"
                      aria-hidden
                    >
                      <p.Icon {...ICON_SM} />
                    </span>
                    <div className="min-w-0">
                      <p className={CARD_TITLE_CLASS}>{p.title}</p>
                      <p className={`mt-0.5 ${CARD_META_CLASS}`}>{p.body}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                <Link
                  href="/categories/backup"
                  className={`inline-flex h-11 items-center justify-center rounded-xl bg-accent px-5 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
                >
                  Xem sản phẩm Backup →
                </Link>
                <Link
                  href="/contact/quote"
                  className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-white px-5 ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
                >
                  <Headphones {...ICON_SM} />
                  Gửi yêu cầu tư vấn
                </Link>
              </div>
            </div>

            <div className="relative z-10 w-full min-w-0 lg:justify-self-end">
              {heroSrc ? (
                <div className="hidden lg:block lg:min-h-[380px]" aria-hidden />
              ) : (
                <div className="hidden lg:block">
                  <BackupHeroArt />
                </div>
              )}
              <div className={`rounded-2xl border border-border bg-white px-4 py-3 lg:mt-3 ${ELEVATION_HAIRLINE}`}>
                <p className={CARD_TITLE_CLASS}>License trên KEYON, dữ liệu trên hệ thống của bạn</p>
                <p className={`mt-1 ${CARD_META_CLASS}`}>
                  KEYON bàn giao license phần mềm backup. Bản sao lưu nằm trên hạ tầng của bạn hoặc nhà
                  cung cấp — không lưu trên KEYON.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Data pillars ─────────────────────────────────────── */}
      <section className="home-section">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Mọi dữ liệu đều đáng được bảo vệ</h2>
            <div className="mx-auto mt-2.5 h-1 w-14 rounded-full bg-accent" aria-hidden />
          </header>
          <ul className="mt-7 grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3.5 lg:grid-cols-5 lg:gap-3.5">
            {DATA_PILLARS.map((p, i) => (
              <li
                key={p.title}
                className={i === DATA_PILLARS.length - 1 ? "sm:col-span-2 lg:col-span-1" : undefined}
              >
                <article
                  className={`flex h-full items-start gap-3 rounded-2xl border border-border bg-white p-3.5 lg:flex-col lg:p-4 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER}`}
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent"
                    aria-hidden
                  >
                    <p.Icon size={18} strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0">
                    <h3 className={CARD_TITLE_CLASS}>{p.title}</h3>
                    <p className={`mt-1 ${BODY_MUTED_CLASS}`}>{p.body}</p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
          <p className={`mx-auto mt-5 max-w-2xl text-center ${BODY_MUTED_CLASS}`}>
            KEYON cung cấp license; dữ liệu được lưu trữ theo hệ thống và cấu hình của khách
            hàng hoặc nhà cung cấp.
          </p>
        </div>
      </section>

      {/* ── Solution selector ────────────────────────────────── */}
      {showFeatured ? (
      <section className="home-section">
        <div className="home-container">
          <header className="mb-5 flex flex-col gap-2.5 sm:flex-row sm:items-end sm:justify-between">
            <h2 className={SECTION_TITLE_CLASS}>Giải pháp Backup phù hợp với bạn</h2>
            <Link href="/categories/backup" className={`hidden shrink-0 lg:inline ${LINK_ACCENT_CLASS}`}>
              Xem tất cả sản phẩm →
            </Link>
          </header>

          <div className="overflow-hidden rounded-2xl bg-navy">
            <div className="grid lg:grid-cols-[220px_minmax(0,1fr)]">
              <div
                role="tablist"
                aria-label="Loại backup"
                className="flex gap-1.5 overflow-x-auto border-b border-white/10 p-3 lg:flex-col lg:gap-1 lg:overflow-visible lg:border-b-0 lg:border-r lg:border-white/10 lg:p-4"
              >
                {TABS.map((t) => {
                  const selected = t.id === tab;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setTab(t.id)}
                      className={`inline-flex w-auto shrink-0 items-center whitespace-nowrap rounded-xl px-3.5 py-2.5 text-left lg:w-full lg:py-3 ${CTA_COMPACT_CLASS} ${TRANSITION_UI} ${
                        selected
                          ? "bg-white text-navy"
                          : "bg-transparent text-white/85 hover:bg-white/10"
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>

              <div role="tabpanel" className="p-4 sm:p-5 lg:p-6">
                <ul className="grid grid-cols-2 gap-2.5 sm:gap-3.5 lg:grid-cols-4 lg:gap-3.5">
                  {products.map((p) => (
                    <li key={p.id} className="flex min-h-0 min-w-0">
                      <article
                        className={`flex h-full w-full flex-col overflow-hidden rounded-xl bg-white sm:rounded-2xl ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER}`}
                      >
                        <Link href={p.href} className="relative block aspect-[5/4] bg-white">
                          {p.imageUrl ? (
                            <Image
                              src={p.imageUrl}
                              alt={p.title}
                              fill
                              className="object-contain p-1.5"
                              sizes="(max-width: 1280px) 45vw, 200px"
                            />
                          ) : (
                            <span className="flex h-full items-center justify-center" aria-hidden>
                              <BackupBrandMark brand={p.brand} size={40} />
                            </span>
                          )}
                        </Link>
                        <div className="flex flex-1 flex-col px-2.5 pb-2.5 pt-2 sm:px-3.5 sm:pb-3.5 sm:pt-2.5">
                          <p className={`${BADGE_CLASS} font-semibold text-muted`}>{p.brandLabel}</p>
                          <h3 className={`mt-0.5 line-clamp-2 ${CARD_TITLE_CLASS}`}>{p.title}</h3>
                          <p className={`mt-1.5 ${CARD_PRICE_CLASS}`}>{p.priceLabel}</p>
                          {p.priceHint ? (
                            <p className={`mt-1 ${CARD_META_CLASS}`}>{p.priceHint}</p>
                          ) : null}
                          <Link
                            href={p.href}
                            className={`mt-auto inline-flex h-9 w-full items-center justify-center rounded-lg bg-accent px-2 ${CTA_COMPACT_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover`}
                          >
                            Mua ngay →
                          </Link>
                        </div>
                      </article>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/categories/backup"
                  className={`mt-4 inline-flex h-11 w-full items-center justify-center rounded-xl border border-white/30 px-4 lg:hidden ${CTA_COMPACT_CLASS} text-white ${TRANSITION_UI} hover:border-accent hover:text-accent`}
                >
                  Xem tất cả sản phẩm
                </Link>
              </div>
            </div>

            <ul className="grid grid-cols-2 gap-2.5 border-t border-white/10 bg-accent px-3.5 py-3.5 sm:gap-3 lg:grid-cols-4 lg:gap-4 lg:px-6">
              {TRUST_STRIP.map((t) => (
                <li key={t.title} className="flex items-center gap-2.5">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/50 text-white"
                    aria-hidden
                  >
                    <t.Icon size={16} strokeWidth={1.9} />
                  </span>
                  <span className={`${CARD_TITLE_CLASS} text-white`}>{t.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      ) : null}

      {/* ── Recovery flow ────────────────────────────────────── */}
      <section className="home-section">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>
              Khi sự cố xảy ra, bạn chỉ cần khôi phục
            </h2>
            <p className={`mt-2.5 ${BODY_MUTED_CLASS}`}>
              Năm bước trong phần mềm đã kích hoạt — KEYON không lưu bản sao của bạn.
            </p>
          </header>

          <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3">
            {FLOW.map((s, i) => (
              <li
                key={s.title}
                className={`flex items-start gap-3 rounded-2xl border bg-white p-3.5 sm:flex-col sm:p-4 ${
                  s.highlight ? "border-accent bg-accent-soft/40" : "border-border"
                } ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER} ${
                  i === FLOW.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-display text-base font-bold ${
                    s.highlight ? "bg-accent text-white" : "bg-navy text-white"
                  }`}
                  aria-hidden
                >
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <s.Icon size={16} strokeWidth={1.85} className="shrink-0 text-accent" aria-hidden />
                    <p className={CARD_TITLE_CLASS}>{s.title}</p>
                  </div>
                  <p className={`mt-1.5 ${BODY_MUTED_CLASS}`}>{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <SolutionFinalCta
        title="Đừng để mất dữ liệu mới bắt đầu sao lưu."
        subtitle="Chọn phần mềm backup phù hợp và bắt đầu bảo vệ dữ liệu trên hệ thống của bạn."
        primaryHref="/categories/backup"
        primaryLabel="Xem sản phẩm Backup →"
        secondaryHref="/contact/quote"
        secondaryLabel="Liên hệ tư vấn →"
      />
    </div>
  );
}

function BackupHeroArt() {
  return (
    <div
      className="backup-hero-visual hero-visual"
      role="img"
      aria-label="Backup KEYON: bảo vệ dữ liệu, hoàn tất sao lưu và điểm khôi phục"
    >
      <div className="backup-hero-glow" aria-hidden />
      <div className="backup-hero-dots" aria-hidden />

      <div className="backup-hero-platform" aria-hidden>
        <span className="backup-hero-platform-ring backup-hero-platform-ring--outer" />
        <span className="backup-hero-platform-ring backup-hero-platform-ring--inner" />
        <span className="backup-hero-platform-core" />
      </div>

      {/* Cloud — center axis above laptop */}
      <div className="backup-hero-cloud">
        <div className="relative aspect-[280/200] w-full">
          <span
            className="pointer-events-none absolute inset-[14%] rounded-full bg-accent/28 blur-2xl"
            aria-hidden
          />
          <svg
            viewBox="0 0 280 200"
            className="relative z-[1] h-full w-full drop-shadow-[0_12px_24px_rgba(14,165,164,0.3)]"
            aria-hidden
          >
            <defs>
              <linearGradient id="bkCloudFill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#99f6e4" />
                <stop offset="45%" stopColor="#2dd4bf" />
                <stop offset="100%" stopColor="#0d9488" />
              </linearGradient>
              <filter id="bkCloudSoft" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="7" stdDeviation="9" floodColor="#0ea5a4" floodOpacity="0.3" />
              </filter>
            </defs>
            <path
              d="M78 148c-28 0-52-22-52-48s24-48 52-48c8-26 32-44 60-44 34 0 62 26 64 60 24 2 42 22 42 44 0 26-22 48-48 48H78Z"
              fill="url(#bkCloudFill)"
              filter="url(#bkCloudSoft)"
              opacity="0.95"
            />
            <circle cx="140" cy="100" r="34" fill="#0b1f33" />
            <text
              x="140"
              y="112"
              textAnchor="middle"
              fontFamily="var(--font-display), system-ui, sans-serif"
              fontSize="34"
              fontWeight="800"
              fill="#5eead4"
            >
              K
            </text>
          </svg>
        </div>
      </div>

      {/* Laptop — shared vertical axis with cloud */}
      <div className={`backup-hero-laptop motion-safe:home-hero-spark ${ELEVATION_FLOAT}`}>
        <div className="overflow-hidden rounded-t-xl border border-slate-200/90 bg-[#0f172a]">
          <div className="flex items-center gap-1 border-b border-white/10 px-2.5 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400/80" />
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400/80" />
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
          </div>
          <div className="flex flex-col items-center px-3 py-3.5 sm:py-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_0_16px_rgba(16,185,129,0.4)] sm:h-10 sm:w-10">
              <Check size={18} strokeWidth={2.6} />
            </span>
            <p className={`mt-1.5 ${BADGE_CLASS} font-semibold text-white`}>Sao lưu hoàn tất</p>
            <p className="mt-0.5 text-[10px] text-slate-400">Hôm nay · 14:20</p>
          </div>
        </div>
        <div className="mx-auto h-2 w-[108%] rounded-b-md bg-gradient-to-b from-slate-500 to-slate-600" />
        <div className="mx-auto h-1.5 w-[70%] rounded-b-full bg-slate-400" />
      </div>

      {/* Protected — attached to cloud (overlap right) */}
      <div
        className={`backup-hero-protected rounded-2xl border border-border/80 bg-white/95 p-2.5 backdrop-blur-sm sm:p-3 ${ELEVATION_FLOAT}`}
      >
        <p className={`${BADGE_CLASS} mb-1.5 font-semibold text-muted`}>Đã bảo vệ</p>
        <ul className="space-y-1.5">
          {[
            { name: "Documents", tone: "bg-sky-100 text-sky-700" },
            { name: "Images", tone: "bg-violet-100 text-violet-700" },
            { name: "Projects", tone: "bg-amber-100 text-amber-800" },
          ].map((f) => (
            <li key={f.name} className="flex items-center gap-1.5">
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${f.tone}`}
                aria-hidden
              >
                <FolderOpen size={11} strokeWidth={2} />
              </span>
              <span className="truncate text-[10px] font-semibold text-navy">{f.name}</span>
              <Check size={11} className="ml-auto shrink-0 text-accent" strokeWidth={2.6} />
            </li>
          ))}
        </ul>
      </div>

      {/* Restore — tucked beside laptop */}
      <div
        className={`backup-hero-restore flex items-center gap-2 rounded-2xl border border-border/80 bg-white px-2.5 py-2 ${ELEVATION_FLOAT}`}
      >
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent sm:h-9 sm:w-9"
          aria-hidden
        >
          <History size={15} strokeWidth={1.9} />
        </span>
        <div className="min-w-0">
          <p className={`${BADGE_CLASS} font-semibold text-navy`}>Điểm khôi phục</p>
          <p className="text-[10px] text-muted">10:30 AM · Hôm nay</p>
        </div>
      </div>
    </div>
  );
}

function BackupBrandMark({ brand, size = 36 }: { brand: BackupBrand; size?: number }) {
  const label =
    brand === "acronis"
      ? "AC"
      : brand === "aomei"
        ? "AO"
        : brand === "veeam"
          ? "VE"
          : brand === "microsoft"
            ? "MS"
            : "BK";
  const tone =
    brand === "acronis"
      ? "bg-[#1A73E8] text-white"
      : brand === "aomei"
        ? "bg-[#E85D04] text-white"
        : brand === "veeam"
          ? "bg-[#00B336] text-white"
          : brand === "microsoft"
            ? "bg-[#0078D4] text-white"
            : "bg-accent-soft text-accent";

  return (
    <span
      className={`inline-flex items-center justify-center rounded-lg font-display text-xs font-bold ${tone}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {label}
    </span>
  );
}
