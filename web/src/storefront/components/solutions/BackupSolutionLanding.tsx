"use client";

import { useMemo, useState } from "react";
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

export type BackupBrand = "acronis" | "aomei" | "veeam" | "microsoft" | "generic";

export type BackupFeaturedProduct = {
  id: string;
  title: string;
  href: string;
  brandLabel: string;
  meta: string;
  priceLabel: string;
  priceHint?: string;
  features: string[];
  brand: BackupBrand;
  /** Which selector tabs this SKU belongs to */
  tabs: BackupTabId[];
};

type BackupTabId = "endpoint" | "server" | "cloud" | "saas" | "dr";

type Props = {
  featured: BackupFeaturedProduct[];
  usingFallback?: boolean;
};

const ICON_SM = { size: 18, strokeWidth: 1.85, "aria-hidden": true as const };

const HERO_POINTS: { title: string; Icon: LucideIcon }[] = [
  { title: "Sao lưu tự động", Icon: CloudUpload },
  { title: "An toàn & Mã hóa", Icon: Lock },
  { title: "Khôi phục nhanh chóng", Icon: RefreshCw },
];

const DATA_PILLARS: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Thiết bị",
    body: "PC, laptop và máy trạm — sao lưu file hoặc image hệ thống.",
    Icon: Laptop,
  },
  {
    title: "Hệ thống",
    body: "OS, ứng dụng và cấu hình — sẵn sàng khôi phục khi sự cố.",
    Icon: Server,
  },
  {
    title: "Dữ liệu quan trọng",
    body: "Tài liệu, ảnh, database và file nghiệp vụ cần bảo vệ.",
    Icon: FolderOpen,
  },
  {
    title: "Ứng dụng & SaaS",
    body: "Microsoft 365, Google Workspace và dịch vụ cloud phổ biến.",
    Icon: AppWindow,
  },
  {
    title: "Dữ liệu đám mây",
    body: "Sao lưu dữ liệu trên cloud — giảm rủi ro mất mát từ nhà cung cấp.",
    Icon: Cloud,
  },
];

const TABS: { id: BackupTabId; label: string }[] = [
  { id: "endpoint", label: "Endpoint Backup" },
  { id: "server", label: "Server Backup" },
  { id: "cloud", label: "Cloud Backup" },
  { id: "saas", label: "SaaS Backup" },
  { id: "dr", label: "Disaster Recovery" },
];

const TRUST_STRIP: { title: string; Icon: LucideIcon }[] = [
  { title: "Kích hoạt nhanh", Icon: Zap },
  { title: "Thanh toán an toàn", Icon: Lock },
  { title: "Hỗ trợ 24/7", Icon: Headphones },
  { title: "Bảo hành & cập nhật", Icon: ShieldCheck },
];

const FLOW: { title: string; body: string; Icon: LucideIcon; highlight?: boolean }[] = [
  {
    title: "Sự cố xảy ra",
    body: "Mất dữ liệu, xóa nhầm hoặc thiết bị hỏng.",
    Icon: AlertTriangle,
  },
  {
    title: "Dữ liệu đã được sao lưu",
    body: "Bản sao lưu an toàn sẵn sàng trên KEYON.",
    Icon: CloudUpload,
  },
  {
    title: "Khôi phục nhanh chóng",
    body: "Chọn điểm khôi phục và phục hồi chỉ trong vài phút.",
    Icon: History,
    highlight: true,
  },
  {
    title: "Dữ liệu trở lại bình thường",
    body: "File và hệ thống sẵn sàng sử dụng lại.",
    Icon: Check,
  },
  {
    title: "An tâm tiếp tục",
    body: "Dữ liệu luôn được bảo vệ liên tục.",
    Icon: ShieldCheck,
  },
];

export const BACKUP_FALLBACK_FEATURED: BackupFeaturedProduct[] = [
  {
    id: "fb-acronis",
    title: "Acronis Cyber Protect Home",
    href: "/products?q=acronis",
    brandLabel: "Acronis",
    meta: "1 Device · 1 Year",
    priceLabel: "1.290.000 đ / năm",
    priceHint: "Giá tham khảo",
    features: ["Backup + antivirus", "Khôi phục image", "Chống ransomware"],
    brand: "acronis",
    tabs: ["endpoint", "dr"],
  },
  {
    id: "fb-aomei",
    title: "AOMEI Backupper Professional",
    href: "/products?q=aomei",
    brandLabel: "AOMEI",
    meta: "1 Device · Perpetual",
    priceLabel: "990.000 đ",
    priceHint: "Giá tham khảo",
    features: ["Backup hệ thống", "Lịch tự động", "Khôi phục linh hoạt"],
    brand: "aomei",
    tabs: ["endpoint", "server"],
  },
  {
    id: "fb-veeam",
    title: "Veeam Backup & Replication",
    href: "/products?q=veeam",
    brandLabel: "Veeam",
    meta: "Subscription · theo gói",
    priceLabel: "Liên hệ",
    features: ["Backup server / VM", "Replication", "Khôi phục nhanh"],
    brand: "veeam",
    tabs: ["server", "cloud", "dr"],
  },
  {
    id: "fb-m365-backup",
    title: "Microsoft 365 Backup",
    href: "/products?q=microsoft+365+backup",
    brandLabel: "Microsoft",
    meta: "SaaS · theo người dùng",
    priceLabel: "Liên hệ",
    features: ["Exchange / OneDrive", "SharePoint / Teams", "Khôi phục theo điểm"],
    brand: "microsoft",
    tabs: ["saas", "cloud"],
  },
];

export function BackupSolutionLanding({ featured, usingFallback }: Props) {
  const [tab, setTab] = useState<BackupTabId>("endpoint");

  const products = useMemo(() => {
    const filtered = featured.filter((p) => p.tabs.includes(tab));
    const list = filtered.length > 0 ? filtered : featured;
    return list.slice(0, 4);
  }, [featured, tab]);

  return (
    <div className="bg-white">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_88%_18%,rgba(14,165,164,0.1),transparent_42%),radial-gradient(ellipse_at_10%_90%,rgba(14,165,233,0.06),transparent_48%)]"
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
            <span className={BREADCRUMB_CURRENT_CLASS}>Backup & Khôi phục</span>
          </nav>

          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-8 xl:gap-10">
            <div className="min-w-0">
              <h1 className={`max-w-[18ch] ${HERO_TITLE_CLASS}`}>
                Dữ liệu của bạn. Luôn có đường quay trở lại.
              </h1>
              <p className={`mt-4 max-w-xl ${PAGE_LEAD_CLASS}`}>
                Giải pháp sao lưu tự động, an toàn — giúp cá nhân và doanh nghiệp
                khôi phục nhanh khi sự cố, ransomware hoặc mất thiết bị.
              </p>

              <ul className="mt-6 grid gap-3 sm:grid-cols-3 sm:gap-3">
                {HERO_POINTS.map((p) => (
                  <li key={p.title} className="flex items-center gap-2.5">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent"
                      aria-hidden
                    >
                      <p.Icon {...ICON_SM} />
                    </span>
                    <span className={CARD_TITLE_CLASS}>{p.title}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/products?q=backup"
                  className={`inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white shadow-sm ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
                >
                  Khám phá giải pháp →
                </Link>
                <Link
                  href="/contact/sales"
                  className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-white px-6 ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
                >
                  <Headphones {...ICON_SM} />
                  Tư vấn miễn phí
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[480px] lg:max-w-none">
              <BackupHeroArt />
            </div>
          </div>
        </div>
      </section>

      {/* ── Data pillars ─────────────────────────────────────── */}
      <section className="py-9 md:py-11">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Mọi dữ liệu đều đáng được bảo vệ</h2>
            <div className="mx-auto mt-2.5 h-1 w-14 rounded-full bg-accent" aria-hidden />
          </header>
          <ul className="mt-7 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3.5">
            {DATA_PILLARS.map((p) => (
              <li key={p.title}>
                <article
                  className={`flex h-full flex-col rounded-2xl border border-border bg-white p-4 sm:p-5 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER}`}
                >
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent"
                    aria-hidden
                  >
                    <p.Icon size={22} strokeWidth={1.7} />
                  </span>
                  <h3 className={`mt-3.5 ${CARD_TITLE_CLASS}`}>{p.title}</h3>
                  <p className={`mt-1.5 ${BODY_MUTED_CLASS}`}>{p.body}</p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Solution selector ────────────────────────────────── */}
      <section className="pb-9 md:pb-11">
        <div className="home-container">
          <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className={SECTION_TITLE_CLASS}>Giải pháp Backup phù hợp với bạn</h2>
              {usingFallback ? (
                <p className={`mt-1 ${SECTION_LEAD_CLASS}`}>
                  Giá tham khảo — xác nhận khi xem chi tiết hoặc tư vấn.
                </p>
              ) : null}
            </div>
            <Link href="/products?q=backup" className={LINK_ACCENT_CLASS}>
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
                      className={`inline-flex w-full shrink-0 items-center rounded-xl px-3.5 py-3 text-left ${CTA_COMPACT_CLASS} ${TRANSITION_UI} ${
                        selected
                          ? "bg-white text-navy shadow-sm"
                          : "bg-transparent text-white/85 hover:bg-white/10"
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>

              <div role="tabpanel" className="p-4 sm:p-5 lg:p-6">
                <ul className="grid auto-rows-fr grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 xl:gap-3.5">
                  {products.map((p) => (
                    <li key={p.id} className="flex min-h-0 min-w-0">
                      <article
                        className={`flex h-full w-full flex-col rounded-2xl bg-white p-4 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER}`}
                      >
                        <div className="flex min-h-[52px] items-start gap-2.5">
                          <span className="mt-0.5 shrink-0" aria-hidden>
                            <BackupBrandMark brand={p.brand} size={36} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className={`${BADGE_CLASS} font-semibold text-muted`}>
                              {p.brandLabel}
                            </p>
                            <h3 className={`${CARD_TITLE_CLASS} mt-0.5 line-clamp-2 min-h-[2.5rem]`}>
                              {p.title}
                            </h3>
                          </div>
                        </div>
                        <p className={`mt-2 ${CARD_META_CLASS} line-clamp-1`}>{p.meta}</p>
                        <p className={`mt-2 ${CARD_PRICE_CLASS} min-h-[1.5rem] text-navy`}>
                          {p.priceLabel}
                        </p>
                        {p.priceHint ? (
                          <p className={`mt-0.5 ${CARD_META_CLASS}`}>{p.priceHint}</p>
                        ) : (
                          <p className="mt-0.5 h-4" aria-hidden />
                        )}
                        <ul className="mt-3 flex min-h-[4.5rem] flex-col gap-1.5">
                          {p.features.slice(0, 3).map((f) => (
                            <li key={f} className="flex gap-2">
                              <span
                                className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent text-white"
                                aria-hidden
                              >
                                <Check size={10} strokeWidth={3} />
                              </span>
                              <span className="line-clamp-2 text-xs leading-snug text-muted">
                                {f}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <Link
                          href={p.href}
                          className={`mt-auto inline-flex h-9 w-full items-center justify-center rounded-xl bg-accent px-3 ${CTA_COMPACT_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover`}
                        >
                          Mua ngay →
                        </Link>
                      </article>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <ul className="grid gap-3 border-t border-white/10 bg-accent px-4 py-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4 lg:px-6">
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

      {/* ── Recovery flow ────────────────────────────────────── */}
      <section className="relative overflow-hidden pb-9 md:pb-11">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.06)_1px,transparent_0)] bg-[length:18px_18px]"
          aria-hidden
        />
        <div className="home-container relative">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>
              Khi sự cố xảy ra, bạn chỉ cần khôi phục
            </h2>
            <div className="mx-auto mt-2.5 h-1 w-14 rounded-full bg-accent" aria-hidden />
          </header>

          <ol className="relative mt-10 grid items-start gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3 lg:pt-2">
            <span
              className="pointer-events-none absolute left-[8%] right-[8%] top-[2.75rem] hidden border-t border-dashed border-slate-300 lg:block"
              aria-hidden
            />
            {FLOW.map((s) => (
              <li
                key={s.title}
                className={`relative z-[1] flex flex-col items-center text-center ${
                  s.highlight ? "lg:-mt-2" : ""
                }`}
              >
                <span
                  className={`flex items-center justify-center rounded-full border-2 ${
                    s.highlight
                      ? `h-[4.5rem] w-[4.5rem] border-accent bg-accent text-white shadow-[0_0_0_8px_rgba(14,165,164,0.12)] ${ELEVATION_FLOAT}`
                      : "h-14 w-14 border-accent/40 bg-white text-accent"
                  }`}
                  aria-hidden
                >
                  <s.Icon size={s.highlight ? 28 : 20} strokeWidth={1.8} />
                </span>
                <p
                  className={`mt-3 max-w-[16ch] ${CARD_TITLE_CLASS} ${
                    s.highlight ? "text-[15px]" : ""
                  }`}
                >
                  {s.title}
                </p>
                <p className={`mt-1.5 max-w-[18ch] ${BODY_MUTED_CLASS}`}>{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="pb-9 md:pb-11">
        <div className="home-container">
          <div className="relative overflow-hidden rounded-2xl bg-navy px-5 py-8 sm:px-8 sm:py-9 lg:px-10">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_30%,rgba(14,165,164,0.2),transparent_45%)]"
              aria-hidden
            />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
              <div className="max-w-xl">
                <h2 className={`${SECTION_TITLE_CLASS} text-white`}>
                  Đừng để mất dữ liệu mới bắt đầu sao lưu.
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-300 md:text-[15px]">
                  Chọn gói backup phù hợp hôm nay — kích hoạt nhanh, khôi phục khi cần.
                </p>
              </div>
              <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row">
                <Link
                  href="/products?q=backup"
                  className={`inline-flex h-12 items-center justify-center rounded-xl bg-white px-6 ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} hover:bg-white/95`}
                >
                  Khám phá giải pháp →
                </Link>
                <Link
                  href="/contact/sales"
                  className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/35 bg-transparent px-6 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:border-accent hover:text-accent`}
                >
                  <Headphones {...ICON_SM} />
                  Liên hệ tư vấn
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function BackupHeroArt() {
  const circumference = 2 * Math.PI * 54;
  const progress = 0.92;
  const dash = circumference * progress;

  return (
    <div
      className={`relative overflow-hidden rounded-[1.75rem] border border-border/80 bg-gradient-to-br from-[#0b1f33] via-[#0f2a3f] to-[#0c4a4a] p-4 sm:p-5 ${ELEVATION_FLOAT}`}
      role="img"
      aria-label="Minh họa sao lưu KEYON: đồng bộ 92%, dữ liệu đã bảo vệ, sẵn sàng khôi phục"
    >
      {/* Atmosphere */}
      <div
        className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-accent/35 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-10 h-52 w-52 rounded-full bg-sky-500/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] bg-[length:18px_18px] opacity-50"
        aria-hidden
      />

      <div className="relative aspect-[5/4.35] w-full">
        {/* Live badge */}
        <div
          className={`absolute left-0 top-0 z-30 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur-md ${ELEVATION_HAIRLINE}`}
        >
          <span className="relative flex h-2 w-2" aria-hidden>
            <span className="absolute inline-flex h-full w-full motion-safe:animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className={`${BADGE_CLASS} font-semibold text-white`}>Đang bảo vệ</span>
        </div>

        {/* Top-right status chip */}
        <div
          className={`absolute right-0 top-0 z-30 flex max-w-[11.5rem] items-center gap-2.5 rounded-2xl border border-white/15 bg-white/95 px-3 py-2.5 backdrop-blur-sm ${ELEVATION_FLOAT} motion-safe:home-hero-spark`}
        >
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white"
            aria-hidden
          >
            <Check size={18} strokeWidth={2.6} />
          </span>
          <div className="min-w-0">
            <p className={`${BADGE_CLASS} font-semibold text-navy`}>Backup Complete</p>
            <p className="text-[11px] text-muted">Hôm nay · 14:20</p>
          </div>
        </div>

        {/* Center progress orb */}
        <div className="absolute inset-[14%_18%_28%_18%] z-10 flex flex-col items-center justify-center">
          <div className="relative flex h-full w-full max-h-[220px] max-w-[220px] items-center justify-center">
            <span
              className="pointer-events-none absolute inset-[8%] rounded-full bg-accent/40 blur-2xl motion-safe:animate-pulse"
              aria-hidden
            />
            <svg viewBox="0 0 140 140" className="relative z-[1] h-full w-full" aria-hidden>
              <defs>
                <linearGradient id="bkRing" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#5eead4" />
                  <stop offset="100%" stopColor="#0ea5a4" />
                </linearGradient>
                <filter id="bkGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#2dd4bf" floodOpacity="0.55" />
                </filter>
              </defs>
              <circle cx="70" cy="70" r="54" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="8" />
              <circle
                cx="70"
                cy="70"
                r="54"
                fill="none"
                stroke="url(#bkRing)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circumference}`}
                transform="rotate(-90 70 70)"
                filter="url(#bkGlow)"
              />
              <circle cx="70" cy="70" r="42" fill="#06121f" stroke="rgba(94,234,212,0.25)" strokeWidth="1.5" />
              <text
                x="70"
                y="66"
                textAnchor="middle"
                fontFamily="var(--font-display), system-ui, sans-serif"
                fontSize="28"
                fontWeight="800"
                fill="#5eead4"
              >
                K
              </text>
              <text
                x="70"
                y="86"
                textAnchor="middle"
                fontFamily="var(--font-body), system-ui, sans-serif"
                fontSize="11"
                fontWeight="600"
                fill="#94a3b8"
              >
                92% synced
              </text>
            </svg>
          </div>
        </div>

        {/* Platform rings under orb */}
        <div
          className="pointer-events-none absolute bottom-[22%] left-1/2 z-[5] h-8 w-[58%] -translate-x-1/2"
          aria-hidden
        >
          <span className="absolute inset-x-0 top-0 h-3 rounded-[100%] border border-accent/30 bg-accent/15 blur-[0.5px]" />
          <span className="absolute inset-x-[12%] top-2 h-2.5 rounded-[100%] border border-accent/45 bg-accent/25" />
          <span className="absolute inset-x-[28%] top-3.5 h-2 rounded-[100%] bg-accent/55 blur-[1px]" />
        </div>

        {/* Bottom-left protected folders */}
        <div
          className={`absolute bottom-0 left-0 z-30 w-[48%] max-w-[200px] rounded-2xl border border-white/20 bg-white/95 p-3 backdrop-blur-md ${ELEVATION_FLOAT}`}
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className={`${BADGE_CLASS} font-semibold text-muted`}>Đã bảo vệ</p>
            <CloudUpload size={14} className="text-accent" strokeWidth={2} aria-hidden />
          </div>
          <ul className="space-y-1.5">
            {[
              { name: "Documents", tone: "bg-sky-100 text-sky-700" },
              { name: "Images", tone: "bg-violet-100 text-violet-700" },
              { name: "Projects", tone: "bg-amber-100 text-amber-800" },
            ].map((f) => (
              <li key={f.name} className="flex items-center gap-2">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-lg ${f.tone}`}
                  aria-hidden
                >
                  <FolderOpen size={12} strokeWidth={2} />
                </span>
                <span className="truncate text-[11px] font-semibold text-navy">{f.name}</span>
                <Check size={12} className="ml-auto shrink-0 text-accent" strokeWidth={2.6} />
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom-right restore + encryption */}
        <div className="absolute bottom-0 right-0 z-30 flex w-[46%] max-w-[200px] flex-col gap-2.5">
          <div
            className={`flex items-center gap-2.5 rounded-2xl border border-white/20 bg-white/95 px-3 py-2.5 backdrop-blur-md ${ELEVATION_FLOAT}`}
          >
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent"
              aria-hidden
            >
              <History size={17} strokeWidth={1.9} />
            </span>
            <div className="min-w-0">
              <p className={`${BADGE_CLASS} font-semibold text-navy`}>Restore Point</p>
              <p className="text-[11px] text-muted">10:30 · Hôm nay</p>
            </div>
          </div>
          <div
            className={`flex items-center gap-2.5 rounded-2xl border border-accent/40 bg-accent px-3 py-2.5 text-white ${ELEVATION_FLOAT}`}
          >
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15"
              aria-hidden
            >
              <Lock size={15} strokeWidth={2} />
            </span>
            <div className="min-w-0">
              <p className={`${BADGE_CLASS} font-semibold text-white`}>AES-256</p>
              <p className="text-[11px] text-white/80">Mã hóa end-to-end</p>
            </div>
          </div>
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
