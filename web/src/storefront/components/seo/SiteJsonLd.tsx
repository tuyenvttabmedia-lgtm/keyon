import "server-only";

import { loadSiteSettings } from "@/server/seo/settings";
import { buildOrganizationWebsiteJsonLd } from "@/server/seo/organization-json-ld";

/** Server-rendered Org + WebSite JSON-LD for the storefront shell. */
export async function SiteJsonLd() {
  const settings = await loadSiteSettings();
  const graphs = buildOrganizationWebsiteJsonLd(settings);
  return (
    <>
      {graphs.map((data, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </>
  );
}
