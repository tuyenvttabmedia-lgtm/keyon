/**
 * KEYON storefront effects — single source of truth (motion, elevation, states).
 *
 * See docs/STOREFRONT-EFFECTS.md.
 * Pair with typography.ts for type; this file owns interaction / depth / motion.
 *
 * Rules:
 *   1. Prefer these tokens over ad-hoc shadow-[…], duration-*, hover:-translate-y-*.
 *   2. Account / Auth / Checkout panels → ELEVATION_NONE (flat + border).
 *   3. Marketing cards may use HAIRLINE + HOVER_LIFT_CARD (≤2px, motion-safe).
 *   4. CTA accent glow only via ELEVATION_CTA_HOVER on primary buttons.
 *   5. Respect prefers-reduced-motion (motion-safe: / motion-reduce:).
 */

/* ─── Motion duration (Tailwind class fragments) ─────────────────────────── */

/** ~120ms — link color, micro icon */
export const MOTION_FAST = "duration-150" as const;

/** 200ms — default controls, borders, tabs */
export const MOTION_NORMAL = "duration-200" as const;

/** ~320ms — large panels, accordion, sticky morph */
export const MOTION_SLOW = "duration-300" as const;

/** Standard KEYON easing */
export const EASE_STANDARD = "ease-[cubic-bezier(0.2,0,0,1)]" as const;

/* ─── Transition property sets ───────────────────────────────────────────── */

export const TRANSITION_COLORS = "transition-colors" as const;

/** Default interactive: colors + opacity + shadow + border */
export const TRANSITION_UI = `transition ${MOTION_NORMAL}` as const;

/** Marketing card: include transform */
export const TRANSITION_PANEL =
  `transition-[color,background-color,border-color,box-shadow,transform,opacity] ${MOTION_NORMAL} ${EASE_STANDARD}` as const;

/* ─── Elevation ──────────────────────────────────────────────────────────── */

/** Account / Auth / Checkout / Admin panels — flat */
export const ELEVATION_NONE = "shadow-none" as const;

/** Home / Shop card at rest */
export const ELEVATION_HAIRLINE =
  "shadow-[0_1px_2px_rgba(15,23,42,0.03)]" as const;

/** Marketing card hover */
export const ELEVATION_CARD_HOVER =
  "hover:shadow-[0_10px_28px_rgba(15,23,42,0.07)]" as const;

/** Hero float / prominent chip */
export const ELEVATION_FLOAT =
  "shadow-[0_12px_32px_rgba(15,23,42,0.12)]" as const;

/** Hero panel hover (marketing only) */
export const ELEVATION_HERO_HOVER =
  "hover:shadow-[0_28px_60px_rgba(15,23,42,0.12)]" as const;

/** Float chip stronger hover */
export const ELEVATION_FLOAT_HOVER =
  "hover:shadow-[0_18px_40px_rgba(15,23,42,0.16)]" as const;

/** Sticky bottom bar (checkout/PDP) */
export const ELEVATION_STICKY_UP =
  "shadow-[0_-8px_30px_rgba(15,23,42,0.08)]" as const;

/** Dropdown / popover menu */
export const ELEVATION_DROPDOWN = "shadow-md" as const;

/** Modal / dialog */
export const ELEVATION_MODAL =
  "shadow-[0_20px_50px_rgba(15,23,42,0.16)]" as const;

/** Primary CTA hover glow (accent) — primary buttons only */
export const ELEVATION_CTA_HOVER =
  "hover:shadow-[0_8px_20px_rgba(14,165,164,0.28)]" as const;

/* ─── Hover presets ──────────────────────────────────────────────────────── */

/**
 * Marketing product/news/category card lift (2px).
 * Always pair with motion-safe; never use on Account portal cards.
 */
export const HOVER_LIFT_CARD =
  "motion-safe:hover:-translate-y-0.5 motion-reduce:transform-none" as const;

/** List / table row — portal safe */
export const HOVER_ROW = "hover:bg-navy-soft/30" as const;

/** Soft row fade (overview order / activity links) */
export const HOVER_FADE = "hover:opacity-90" as const;

/** Soft accent fill (menu item, shortcut, icon chip) */
export const HOVER_SOFT = "hover:bg-accent-soft hover:text-accent" as const;

/** Text link accent */
export const HOVER_LINK_ACCENT =
  `transition-colors ${MOTION_FAST} hover:text-accent` as const;

/** Outline control → filled accent */
export const HOVER_OUTLINE_FILL =
  "hover:border-accent hover:bg-accent hover:text-white" as const;

/* ─── Opacity ────────────────────────────────────────────────────────────── */

export const OPACITY_DISABLED = "disabled:opacity-40" as const;

/** Busy / submitting primary actions */
export const OPACITY_DISABLED_BUSY = "disabled:opacity-50" as const;

/** Area fill under line charts */
export const OPACITY_CHART_FILL = "opacity-[0.1]" as const;

/* ─── Z-index ────────────────────────────────────────────────────────────── */

export const Z_STICKY = "z-20" as const;
export const Z_HEADER = "z-30" as const;
export const Z_BANNER = "z-40" as const;
export const Z_DROPDOWN = "z-50" as const;
export const Z_OVERLAY = "z-[60]" as const;
export const Z_MODAL = "z-[70]" as const;
export const Z_TOAST = "z-[80]" as const;
export const Z_TOOLTIP = "z-[90]" as const;

/* ─── Chart rendering hints (SVG attrs / class fragments) ────────────────── */

/** Stroke width for line charts (use with vector-effect non-scaling-stroke) */
export const CHART_STROKE_WIDTH = 1.5;

/** Default point radius */
export const CHART_POINT_R = 1.75;

/** Hover point radius */
export const CHART_POINT_R_HOVER = 3;

export const CHART_FILL_OPACITY = 0.1;

/* ─── Composed recipes (optional convenience) ────────────────────────────── */

/** Flat portal card shell */
export const CARD_PORTAL =
  `rounded-2xl border border-border bg-white p-5 sm:p-6 ${ELEVATION_NONE}` as const;

/** Marketing card shell + hover lift */
export const CARD_MARKETING =
  `overflow-hidden rounded-2xl border border-border/80 bg-white ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} hover:border-border ${ELEVATION_CARD_HOVER}` as const;

/** Primary navy → accent CTA */
export const CTA_PRIMARY_EFFECT =
  `${TRANSITION_UI} hover:bg-accent ${ELEVATION_CTA_HOVER}` as const;
