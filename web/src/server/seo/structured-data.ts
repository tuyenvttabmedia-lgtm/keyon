import { absoluteUrl, getSiteOrigin } from "@/server/seo/site-url";
import { absoluteAssetUrl } from "@/storefront/lib/asset-url";

export type BreadcrumbItem = { name: string; path: string };

export function buildBreadcrumbJsonLd(
  items: BreadcrumbItem[],
): Record<string, unknown> {
  const origin = getSiteOrigin();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.path.startsWith("http")
        ? item.path
        : `${origin}${item.path.startsWith("/") ? item.path : `/${item.path}`}`,
    })),
  };
}

export type FaqJsonLdItem = { question: string; answer: string };

export function buildFaqPageJsonLd(
  items: FaqJsonLdItem[],
): Record<string, unknown> | null {
  const cleaned = items
    .map((x) => ({
      question: x.question.trim(),
      answer: x.answer.trim(),
    }))
    .filter((x) => x.question && x.answer);
  if (!cleaned.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: cleaned.map((x) => ({
      "@type": "Question",
      name: x.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: x.answer,
      },
    })),
  };
}

export function buildItemListJsonLd(input: {
  name: string;
  path: string;
  items: { name: string; path: string }[];
}): Record<string, unknown> | null {
  if (!input.items.length) return null;
  const origin = getSiteOrigin();
  const pageUrl = input.path.startsWith("http")
    ? input.path
    : absoluteUrl(input.path);
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: input.name,
    url: pageUrl,
    numberOfItems: input.items.length,
    itemListElement: input.items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: item.path.startsWith("http")
        ? item.path
        : `${origin}${item.path.startsWith("/") ? item.path : `/${item.path}`}`,
    })),
  };
}

export function buildArticleJsonLd(input: {
  title: string;
  description?: string;
  path: string;
  imageUrl?: string | null;
  datePublished?: string | null;
  dateModified?: string | null;
  authorName?: string | null;
}): Record<string, unknown> {
  const origin = getSiteOrigin();
  const url = input.path.startsWith("http")
    ? input.path
    : absoluteUrl(input.path);
  const image =
    absoluteAssetUrl(input.imageUrl ?? null, origin) || undefined;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    ...(input.description ? { description: input.description } : {}),
    mainEntityOfPage: url,
    url,
    ...(image ? { image: [image] } : {}),
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    author: {
      "@type": "Person",
      name: input.authorName?.trim() || "KEYON",
    },
    publisher: {
      "@type": "Organization",
      name: "KEYON",
      url: origin,
    },
  };
}
