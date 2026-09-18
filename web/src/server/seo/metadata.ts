import "server-only";

import type { Metadata } from "next";
import { absoluteAssetUrl } from "@/storefront/lib/asset-url";
import type { SiteSettings } from "@/server/cms/store";
import { loadSiteSettings, pageSeoOf } from "@/server/seo/settings";
import {
  absoluteUrl,
  allowSearchIndexing,
  getSiteOrigin,
} from "@/server/seo/site-url";

export type ResolvedSeo = {
  title: string;
  description: string;
  ogImageUrl?: string;
  canonical: string;
  siteName: string;
};

/** Entity fields first; missing pieces fall back to global SEO. */
export function resolveWithGlobalFallback(
  settings: SiteSettings,
  partial: {
    title?: string | null;
    description?: string | null;
    ogImageUrl?: string | null;
    path: string;
  },
): ResolvedSeo {
  const page = pageSeoOf(settings, partial.path);
  const title =
    partial.title?.trim() ||
    page?.title?.trim() ||
    settings.seoTitle.trim() ||
    settings.siteName;
  const description =
    partial.description?.trim() ||
    page?.description?.trim() ||
    settings.seoDescription.trim();
  const ogImageUrl =
    absoluteAssetUrl(
      partial.ogImageUrl?.trim() ||
        page?.ogImageUrl?.trim() ||
        settings.ogImageUrl ||
        null,
      getSiteOrigin(),
    ) || undefined;
  const path = partial.path.startsWith("/") ? partial.path : `/${partial.path}`;
  return {
    title,
    description,
    ogImageUrl,
    canonical: absoluteUrl(path === "/" ? "/" : path),
    siteName: settings.siteName,
  };
}

export function toNextMetadata(seo: ResolvedSeo, opts?: {
  robotsIndex?: boolean;
  robotsFollow?: boolean;
  type?: "website" | "article";
  faviconUrl?: string | null;
  appleTouchIconUrl?: string | null;
}): Metadata {
  const index =
    opts?.robotsIndex !== undefined
      ? opts.robotsIndex && allowSearchIndexing()
      : allowSearchIndexing();
  const follow = opts?.robotsFollow !== false;
  const images = seo.ogImageUrl ? [{ url: seo.ogImageUrl }] : undefined;
  const favicon =
    absoluteAssetUrl(opts?.faviconUrl?.trim() || null, getSiteOrigin()) ||
    absoluteAssetUrl("/brand/keyon-k.png", getSiteOrigin());
  const apple =
    absoluteAssetUrl(opts?.appleTouchIconUrl?.trim() || null, getSiteOrigin()) ||
    favicon;

  return {
    metadataBase: new URL(getSiteOrigin()),
    title: seo.title,
    description: seo.description,
    alternates: { canonical: seo.canonical },
    robots: { index, follow },
    icons: {
      icon: [{ url: favicon }],
      shortcut: [{ url: favicon }],
      apple: [{ url: apple }],
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: seo.canonical,
      siteName: seo.siteName,
      type: opts?.type ?? "website",
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      ...(seo.ogImageUrl ? { images: [seo.ogImageUrl] } : {}),
    },
  };
}

export async function buildRootMetadata(): Promise<Metadata> {
  const settings = await loadSiteSettings();
  const seo = resolveWithGlobalFallback(settings, { path: "/" });
  return toNextMetadata(seo, {
    faviconUrl: settings.faviconUrl,
    appleTouchIconUrl: settings.appleTouchIconUrl,
  });
}

export async function buildMainPageMetadata(path: string): Promise<Metadata> {
  const settings = await loadSiteSettings();
  const page = pageSeoOf(settings, path);
  const seo = resolveWithGlobalFallback(settings, {
    path,
    title: page?.title,
    description: page?.description,
    ogImageUrl: page?.ogImageUrl,
  });
  return toNextMetadata(seo, {
    faviconUrl: settings.faviconUrl,
    appleTouchIconUrl: settings.appleTouchIconUrl,
  });
}

export async function loadGlobalSeoFallback(): Promise<SiteSettings> {
  return loadSiteSettings();
}
