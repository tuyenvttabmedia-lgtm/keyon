import { absoluteAssetUrl } from "@/storefront/lib/asset-url";
import { getSiteOrigin } from "@/server/seo/site-url";

type JsonLdOfferInput = {
  name: string;
  description?: string;
  brandName: string;
  sku: string;
  priceVnd: number;
  currency?: string;
  url: string;
  imageUrl?: string | null;
  availability: "InStock" | "OutOfStock" | "PreOrder";
};

/** Product + Offer JSON-LD — no fake AggregateRating. */
export function buildProductJsonLd(input: JsonLdOfferInput): Record<string, unknown> {
  const origin = getSiteOrigin();
  const image = absoluteAssetUrl(input.imageUrl ?? null, origin) || undefined;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    ...(input.description ? { description: input.description } : {}),
    brand: {
      "@type": "Brand",
      name: input.brandName,
    },
    sku: input.sku,
    ...(image ? { image: [image] } : {}),
    offers: {
      "@type": "Offer",
      url: input.url.startsWith("http") ? input.url : `${origin}${input.url}`,
      priceCurrency: input.currency ?? "VND",
      price: String(input.priceVnd),
      availability: `https://schema.org/${input.availability}`,
      itemCondition: "https://schema.org/NewCondition",
    },
  };
}
