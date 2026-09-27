/**
 * Shared landing-hero rhythm for Solutions / Business pages.
 * Keep padding tight so right-column art does not inflate the first viewport.
 */
/** Matches Home hero vertical padding. */
export const LANDING_HERO_PAD = "pb-5 pt-5 md:pb-4 md:pt-5 lg:pb-6 lg:pt-8" as const;

/** Default 2-column hero grid (copy | art). */
export const LANDING_HERO_GRID =
  "grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10 xl:gap-12" as const;
