import "server-only";

import { absoluteAssetUrl } from "@/storefront/lib/asset-url";
import type { SiteSettings } from "@/server/cms/types";
import { getSiteOrigin } from "@/server/seo/site-url";

/** Organization + WebSite JSON-LD for storefront root. */
export function buildOrganizationWebsiteJsonLd(settings: SiteSettings): Record<
  string,
  unknown
>[] {
  const origin = getSiteOrigin();
  const logo =
    absoluteAssetUrl(settings.faviconUrl ?? null, origin) ||
    absoluteAssetUrl("/brand/keyon-k.png", origin) ||
    `${origin}/brand/keyon-k.png`;

  const organization: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.siteName || "KEYON",
    url: origin,
    logo,
    email: settings.supportEmail,
  };

  const website: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.siteName || "KEYON",
    url: origin,
    publisher: {
      "@type": "Organization",
      name: settings.siteName || "KEYON",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${origin}/products?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return [organization, website];
}
