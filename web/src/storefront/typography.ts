/**
 * KEYON typography — single source of truth (storefront + portal + auth + admin).
 *
 * Scale (≈px @ 16 root):
 *   11  badge / caption / overline / breadcrumb
 *   12  card meta / strike price
 *   13  compact CTA / tabs / filter / pagination
 *   14  body / card title / form / nav / table / inline price
 *   15  full CTA / catalog price / section lead (md+)
 *   16–18  summary total / large dashboard tile only
 *   20+  subsection → section → PDP → page → hero
 *
 * Rules (see docs/STOREFRONT-TYPOGRAPHY.md):
 *   1. Prefer tokens over ad-hoc text-[Npx].
 *   2. CTA_LABEL only on h-11/h-12 buttons — never inside dense cards.
 *   3. Catalog prices ≠ portal prices.
 *   4. Dense field rows: FORM_LABEL + FIELD_VALUE + LINK_FIELD (same ~14px band).
 *   5. Color/weight may be overridden; size should stay on-token.
 */

import { MOTION_NORMAL } from "@/storefront/effects";

/** Inter via --font-display (see layout.tsx + globals.css). */
export const FONT_DISPLAY = "font-display";

/* ─── Titles ────────────────────────────────────────────────────────────── */

/** Home hero H1 — marketing only; do not reuse on content pages. */
export const HERO_TITLE_CLASS =
  `${FONT_DISPLAY} text-[1.75rem] font-bold leading-[1.2] tracking-tight text-navy sm:text-4xl lg:text-[2.35rem] lg:leading-[1.18] xl:text-[2.5rem]` as const;

/** Content page H1 (Cửa hàng, About, Blog, Account, …). */
export const PAGE_TITLE_CLASS =
  `${FONT_DISPLAY} text-3xl font-bold tracking-tight text-navy md:text-4xl` as const;

/**
 * PDP product name — between section title and page title.
 * Avoid competing with shop listing H1 (PAGE_TITLE).
 */
export const PDP_TITLE_CLASS =
  `${FONT_DISPLAY} text-2xl font-bold tracking-tight text-navy sm:text-[1.75rem] md:text-[2rem] md:leading-tight` as const;

/**
 * Home / listing section H2 — Categories / Featured / Partners / …
 * Scale: 20 → 24 → 28px.
 */
export const SECTION_TITLE_CLASS =
  `${FONT_DISPLAY} text-xl font-bold tracking-tight text-navy sm:text-2xl md:text-[28px] md:leading-8` as const;

/** Nested block title (FAQ, checkout panel, account card heading). */
export const SUBSECTION_TITLE_CLASS =
  `${FONT_DISPLAY} text-xl font-bold tracking-tight text-navy` as const;

/** Admin list/detail page H1 — one step below storefront page title. */
export const ADMIN_PAGE_TITLE_CLASS =
  `${FONT_DISPLAY} text-2xl font-bold tracking-tight text-navy` as const;

/* ─── Body / lead ───────────────────────────────────────────────────────── */

/** Hero subtitle / long page intro. */
export const PAGE_LEAD_CLASS =
  "text-[15px] leading-relaxed text-muted sm:text-base md:text-lg" as const;

/** Lead under section / page title. */
export const SECTION_LEAD_CLASS =
  "text-sm leading-relaxed text-muted md:text-[15px]" as const;

/** Default body copy in cards / lists / forms (14px). */
export const BODY_CLASS = "text-sm leading-relaxed text-navy" as const;

/** Muted body / helper under fields. */
export const BODY_MUTED_CLASS = "text-sm leading-relaxed text-muted" as const;

/* ─── Card / list density ───────────────────────────────────────────────── */

/** Card / list item title (product, news, order code). */
export const CARD_TITLE_CLASS =
  "text-[14px] font-bold leading-snug text-navy" as const;

/** Card meta / package / muted secondary line. */
export const CARD_META_CLASS = "text-[12px] text-muted-soft" as const;

/**
 * Tiny caption above a value (e.g. “License Key” above the key).
 * Smaller than CARD_META; not for body copy.
 */
export const FIELD_CAPTION_CLASS =
  "text-[11px] font-medium text-muted" as const;

/**
 * Status / chip / pill label (color via consumer: emerald, amber, accent…).
 */
export const BADGE_CLASS = "text-[11px] font-bold" as const;

/** Eyebrow / overline (category chip on PDP, uppercase labels). */
export const OVERLINE_CLASS =
  "text-[11px] font-semibold uppercase tracking-wider" as const;

/* ─── Nav / chrome ──────────────────────────────────────────────────────── */

/** Header / account sidebar nav item (idle). */
export const NAV_ITEM_CLASS =
  `text-sm font-medium text-navy transition ${MOTION_NORMAL}` as const;

/** Active nav item — size same as NAV_ITEM; color/weight emphasize. */
export const NAV_ITEM_ACTIVE_CLASS =
  "text-sm font-semibold text-accent" as const;

/** Breadcrumb trail (links + separators). */
export const BREADCRUMB_CLASS = "text-[12px] text-muted-soft" as const;

/** Current breadcrumb crumb. */
export const BREADCRUMB_CURRENT_CLASS =
  "text-[12px] font-semibold text-navy" as const;

/** Sidebar / account section label (“TÀI KHOẢN”). */
export const SIDEBAR_SECTION_CLASS =
  "text-[11px] font-bold uppercase tracking-wider text-muted-soft" as const;

/* ─── Table / empty ─────────────────────────────────────────────────────── */

/** Table column header. */
export const TABLE_HEADER_CLASS =
  "text-[11px] font-semibold uppercase tracking-wide text-muted" as const;

/** Table / list cell body. */
export const TABLE_CELL_CLASS = "text-sm text-navy" as const;

/** Empty-state title. */
export const EMPTY_TITLE_CLASS = CARD_TITLE_CLASS;

/** Empty-state body. */
export const EMPTY_BODY_CLASS = SECTION_LEAD_CLASS;

/* ─── Tabs ──────────────────────────────────────────────────────────────── */

/** Tab / segment control (idle) — same size as CTA_COMPACT. */
export const TAB_CLASS =
  `text-[13px] font-semibold text-muted transition ${MOTION_NORMAL}` as const;

/** Active tab. */
export const TAB_ACTIVE_CLASS =
  "text-[13px] font-semibold text-navy" as const;

/* ─── Actions / links ───────────────────────────────────────────────────── */

/**
 * Full-size CTA label — primary/secondary buttons only (h-11 / h-12).
 * Do not use inside dense cards (looks larger than CARD_TITLE).
 */
export const CTA_LABEL_CLASS = "text-[15px] font-semibold" as const;

/**
 * Compact action — Hiện / Chép / filter / tabs / pagination / outline sm.
 * Height typically h-8 / h-9 / h-10.
 */
export const CTA_COMPACT_CLASS = "text-[13px] font-semibold" as const;

/**
 * Text link size (= body). Prefer LINK_ACCENT_CLASS for accent+hover baked in.
 */
export const LINK_CLASS = "text-sm font-semibold" as const;

/** Dense text link (notifications micro actions). */
export const LINK_COMPACT_CLASS = "text-xs font-semibold" as const;

/** Accent text link (“Xem tất cả →”, “Quản lý bảo mật →”). */
export const LINK_ACCENT_CLASS =
  `${LINK_CLASS} text-accent transition ${MOTION_NORMAL} hover:text-accent-hover hover:underline` as const;

/**
 * Field-row action (“Chỉnh sửa”) — must not outsize FIELD_VALUE.
 * Size = CTA_COMPACT + accent.
 */
export const LINK_FIELD_CLASS =
  `${CTA_COMPACT_CLASS} text-accent transition ${MOTION_NORMAL} hover:text-accent-hover hover:underline` as const;

/** Micro accent link (notifications mark-read, etc.). */
export const LINK_MICRO_CLASS =
  `${LINK_COMPACT_CLASS} text-accent transition ${MOTION_NORMAL} hover:text-accent-hover hover:underline` as const;

/* ─── Forms / feedback ──────────────────────────────────────────────────── */

/** Label above input / read-only field label. */
export const FORM_LABEL_CLASS = "text-sm font-medium text-muted" as const;

/**
 * Read-only value under a field label (profile / settings / dense stats).
 * Same size as FORM_LABEL — emphasis via weight only.
 */
export const FIELD_VALUE_CLASS = "text-sm font-medium text-navy" as const;

/** Numeric field value (order count on dense cards). */
export const FIELD_VALUE_NUM_CLASS =
  "text-sm font-bold tabular-nums text-navy" as const;

/** Text inside inputs / textareas / selects. */
export const INPUT_TEXT_CLASS = "text-sm text-navy" as const;

/** Validation / request error under a form. */
export const FORM_ERROR_CLASS = "text-sm text-danger" as const;

/** Success flash under a form. */
export const FORM_SUCCESS_CLASS = "text-sm font-medium text-accent" as const;

/** Monospace value (license key, payment ref) — not a title. */
export const MONO_VALUE_CLASS =
  "break-all font-mono text-sm font-semibold tracking-wide text-navy" as const;

/* ─── Prices ────────────────────────────────────────────────────────────── */

/**
 * Catalog card price (shop / home featured).
 * Slightly above CARD_TITLE — OK on selling surfaces only.
 */
export const CARD_PRICE_CLASS =
  "text-[15px] font-bold tabular-nums text-accent" as const;

/**
 * PDP buy-box hero price — product detail only.
 * Do not use on account / order summary.
 */
export const PDP_PRICE_CLASS =
  `${FONT_DISPLAY} text-[1.65rem] font-bold tabular-nums tracking-tight text-accent sm:text-[1.75rem]` as const;

/**
 * Portal / inline price — account, order lines, activity, checkout line rows.
 * Same size as CARD_TITLE; emphasis via weight + accent only.
 */
export const INLINE_PRICE_CLASS =
  "text-[14px] font-bold tabular-nums text-accent" as const;

/**
 * “Tổng thanh toán” (checkout summary / order detail).
 * One mild bump above body — not section-title scale.
 */
export const SUMMARY_TOTAL_CLASS =
  `${FONT_DISPLAY} text-base font-bold tabular-nums tracking-tight text-accent sm:text-lg` as const;

/**
 * Large dashboard tile only (admin KPIs, rare).
 * Dense account cards → FIELD_VALUE_NUM / INLINE_PRICE instead.
 */
export const STAT_VALUE_CLASS =
  `${FONT_DISPLAY} text-base font-bold tabular-nums tracking-tight text-navy sm:text-lg` as const;

/** Compare-at / list price (struck). */
export const COMPARE_PRICE_CLASS =
  "text-[12px] tabular-nums text-muted-soft line-through" as const;
