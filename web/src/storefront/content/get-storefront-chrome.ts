/**
 * Lightweight storefront chrome (header brand + footer) — no catalog/Prisma.
 * Keeps marketing layouts cacheable without pulling full HomeContent.
 */
import { cache } from "react";
import { unstable_cache } from "next/cache";
import {
  defaultCmsFooter,
  defaultCmsNav,
  readJsonFile,
  type CmsFooter,
  type CmsNav,
} from "@/server/cms/store";
import { resolveMediaUrl } from "@/lib/media-url";
import { resolveStorage } from "@/server/storage/config";
import { homeFixture } from "./home.fixture";
import type { HomeContent } from "./types";

export type StorefrontChrome = {
  brand: HomeContent["brand"];
  footer: HomeContent["footer"];
};

function cmsTextOrFallback(value: string | undefined, fallback: string): string {
  const v = value?.trim() ?? "";
  return v || fallback;
}

async function loadStorefrontChrome(): Promise<StorefrontChrome> {
  const [footer, nav] = await Promise.all([
    readJsonFile<CmsFooter>("footer.json", defaultCmsFooter),
    readJsonFile<CmsNav>("nav.json", defaultCmsNav),
  ]);

  const storage = await resolveStorage();
  const mediaBase =
    storage.driver === "wasabi"
      ? storage.wasabi.publicBaseUrl ||
        `${storage.wasabi.endpoint.replace(/\/$/, "")}/${storage.wasabi.bucket}`
      : "";

  const footerLogo = resolveMediaUrl(footer.logoUrl, mediaBase) || undefined;
  const navLogo = resolveMediaUrl(nav.logoUrl, mediaBase) || undefined;
  let logoUrl = footerLogo || navLogo;
  if (
    logoUrl &&
    /\/brand\/keyon-logo\.png(?:\?|$)/i.test(logoUrl) &&
    !/keyon-logo-light/i.test(logoUrl)
  ) {
    logoUrl = "/brand/keyon-logo-light.png";
  }

  const columns = (footer.columns.length ? footer.columns : homeFixture.footer.columns).map(
    (col) => ({
      ...col,
      links: (col.links ?? []).filter((l) => (l.href || "").trim()),
    }),
  );

  return {
    brand: {
      logoUrl: resolveMediaUrl(nav.logoUrl, mediaBase) || undefined,
      brandName: nav.brandName?.trim() || defaultCmsNav.brandName,
      tagline:
        typeof nav.tagline === "string" ? nav.tagline.trim() : defaultCmsNav.tagline,
    },
    footer: {
      logoUrl,
      brandName:
        footer.brandName?.trim() ||
        nav.brandName?.trim() ||
        defaultCmsFooter.brandName,
      blurb: cmsTextOrFallback(footer.blurb, homeFixture.footer.blurb),
      companyInfo: {
        companyName:
          footer.companyInfo?.companyName?.trim() ||
          defaultCmsFooter.companyInfo?.companyName ||
          "",
        address:
          footer.companyInfo?.address?.trim() ||
          defaultCmsFooter.companyInfo?.address ||
          "",
        taxCode:
          footer.companyInfo?.taxCode?.trim() ||
          defaultCmsFooter.companyInfo?.taxCode ||
          "",
        phone:
          footer.companyInfo?.phone?.trim() ||
          defaultCmsFooter.companyInfo?.phone ||
          "",
        email:
          footer.companyInfo?.email?.trim() ||
          defaultCmsFooter.companyInfo?.email ||
          homeFixture.footer.supportEmail ||
          "support@keyon.vn",
      },
      columns,
      copyright: footer.copyright || homeFixture.footer.copyright,
      socialLinks: (() => {
        const allowed = new Set([
          "facebook",
          "youtube",
          "linkedin",
          "zalo",
          "tiktok",
          "instagram",
          "x",
        ]);
        const out: HomeContent["footer"]["socialLinks"] = [];
        const rawList = footer.socialLinks?.length
          ? footer.socialLinks
          : defaultCmsFooter.socialLinks || [];
        for (const raw of rawList) {
          const network = (raw.network || "").trim().toLowerCase();
          const href = (raw.href || "").trim();
          if (!allowed.has(network) || !href) continue;
          out.push({
            network: network as NonNullable<HomeContent["footer"]["socialLinks"]>[number]["network"],
            href,
            label: raw.label?.trim() || undefined,
          });
        }
        return out;
      })(),
      legalLinks: [],
      supportEmail:
        footer.companyInfo?.email?.trim() ||
        homeFixture.footer.supportEmail ||
        "support@keyon.vn",
      bctVisible: Boolean(footer.bctVisible),
      bctHref: footer.bctHref?.trim() || defaultCmsFooter.bctHref,
      bctImageUrl:
        resolveMediaUrl(footer.bctImageUrl, mediaBase) ||
        footer.bctImageUrl?.trim() ||
        "/brand/bct-thong-bao.svg",
      bctAlt: footer.bctAlt?.trim() || defaultCmsFooter.bctAlt,
      dmcaVisible: Boolean(footer.dmcaVisible),
      dmcaHref: footer.dmcaHref?.trim() || defaultCmsFooter.dmcaHref || "",
      dmcaImageUrl:
        resolveMediaUrl(footer.dmcaImageUrl, mediaBase) ||
        footer.dmcaImageUrl?.trim() ||
        "/brand/dmca-protected.svg",
      dmcaAlt: footer.dmcaAlt?.trim() || defaultCmsFooter.dmcaAlt,
    },
  };
}

const getStorefrontChromeCached = unstable_cache(
  loadStorefrontChrome,
  ["storefront-chrome-v1"],
  { revalidate: 60 },
);

export const getStorefrontChrome = cache(() => getStorefrontChromeCached());
