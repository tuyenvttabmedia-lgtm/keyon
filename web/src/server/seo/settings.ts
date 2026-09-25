import "server-only";

import {
  defaultSettings,
  readJsonFile,
  type PageSeoOverride,
  type SiteSettings,
} from "@/server/cms/store";
import { isMainSeoPath, MAIN_SEO_PATHS } from "@/lib/seo-main-pages";

function cleanOverride(raw: PageSeoOverride | undefined): PageSeoOverride | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const title = raw.title?.trim() || undefined;
  const description = raw.description?.trim() || undefined;
  const ogImageUrl = raw.ogImageUrl?.trim() || undefined;
  if (!title && !description && !ogImageUrl) return undefined;
  return { title, description, ogImageUrl };
}

/** Merge file data with defaults; keep only known main-page paths. */
export function normalizeSiteSettings(raw: Partial<SiteSettings> | null | undefined): SiteSettings {
  const base = { ...defaultSettings, ...(raw ?? {}) };
  const mergedPageSeo: Record<string, PageSeoOverride> = {
    ...(defaultSettings.pageSeo ?? {}),
  };
  const incoming = raw?.pageSeo ?? {};
  for (const path of MAIN_SEO_PATHS) {
    const cleaned = cleanOverride(incoming[path] ?? mergedPageSeo[path]);
    if (cleaned) mergedPageSeo[path] = cleaned;
    else delete mergedPageSeo[path];
  }
  for (const key of Object.keys(mergedPageSeo)) {
    if (!isMainSeoPath(key)) delete mergedPageSeo[key];
  }

  const googleSiteVerification =
    (raw?.googleSiteVerification ?? base.googleSiteVerification)?.trim() ||
    undefined;
  const ga4MeasurementId =
    (raw?.ga4MeasurementId ?? base.ga4MeasurementId)?.trim().toUpperCase() ||
    undefined;
  const gtmContainerId =
    (raw?.gtmContainerId ?? base.gtmContainerId)?.trim().toUpperCase() ||
    undefined;

  return {
    siteName: (base.siteName || defaultSettings.siteName).trim() || "KEYON",
    supportEmail:
      (base.supportEmail || defaultSettings.supportEmail).trim() ||
      defaultSettings.supportEmail,
    quotePublicTrackingEnabled: Boolean(base.quotePublicTrackingEnabled),
    seoTitle: (base.seoTitle || defaultSettings.seoTitle).trim(),
    seoDescription: (base.seoDescription || defaultSettings.seoDescription).trim(),
    ogImageUrl: base.ogImageUrl?.trim() || undefined,
    faviconUrl: base.faviconUrl?.trim() || undefined,
    appleTouchIconUrl: base.appleTouchIconUrl?.trim() || undefined,
    googleSiteVerification,
    ga4MeasurementId:
      ga4MeasurementId && /^G-[A-Z0-9]+$/.test(ga4MeasurementId)
        ? ga4MeasurementId
        : undefined,
    gtmContainerId:
      gtmContainerId && /^GTM-[A-Z0-9]+$/.test(gtmContainerId)
        ? gtmContainerId
        : undefined,
    pageSeo: mergedPageSeo,
  };
}

export async function loadSiteSettings(): Promise<SiteSettings> {
  const raw = await readJsonFile("settings.json", defaultSettings);
  return normalizeSiteSettings(raw);
}

export function pageSeoOf(
  settings: SiteSettings,
  path: string,
): PageSeoOverride | undefined {
  return settings.pageSeo?.[path];
}
