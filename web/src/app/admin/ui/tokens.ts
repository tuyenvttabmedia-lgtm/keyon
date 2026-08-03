/**
 * Admin UI tokens — panel density & chrome (not storefront marketing).
 */
export const ADMIN_PANEL =
  "admin-panel rounded-2xl border border-border bg-card" as const;

export const ADMIN_PANEL_PAD = `${ADMIN_PANEL} p-5` as const;

export const ADMIN_TOOLBAR =
  "rounded-xl border border-border bg-card px-3 py-2.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]" as const;

export const ADMIN_BTN_PRIMARY =
  "inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-accent px-3 text-sm font-semibold text-white transition hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40" as const;

export const ADMIN_BTN_GHOST =
  "inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-border bg-white px-3 text-sm font-medium text-navy transition hover:border-accent hover:bg-accent-soft hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30" as const;

export const ADMIN_INPUT =
  "h-9 w-full rounded-lg border border-border bg-white px-3 text-sm text-navy outline-none transition placeholder:text-muted-soft focus:border-accent focus:ring-2 focus:ring-accent/20" as const;
