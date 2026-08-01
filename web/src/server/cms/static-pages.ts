import "server-only";

import {
  defaultCmsPolicy,
  defaultStaticPages,
  readJsonFile,
  type CmsPolicy,
  type CmsPolicyItem,
  type CmsStaticPage,
} from "@/server/cms/store";

export async function loadStaticPages(): Promise<CmsStaticPage[]> {
  const pages = await readJsonFile("static-pages.json", defaultStaticPages);
  return Array.isArray(pages) && pages.length > 0 ? pages : defaultStaticPages;
}

export async function loadPublishedStaticPages(
  collection?: CmsStaticPage["collection"],
): Promise<CmsStaticPage[]> {
  const pages = await loadStaticPages();
  return pages
    .filter((p) => p.status === "published")
    .filter((p) => (collection ? p.collection === collection : true))
    .sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title, "vi"));
}

export async function loadStaticPageBySlug(
  slug: string,
  opts?: { publishedOnly?: boolean },
): Promise<CmsStaticPage | null> {
  const pages = await loadStaticPages();
  const page = pages.find((p) => p.slug === slug) ?? null;
  if (!page) return null;
  if (opts?.publishedOnly && page.status !== "published") return null;
  return page;
}

function pageToPolicyItem(page: CmsStaticPage): CmsPolicyItem {
  return {
    id: page.id,
    slug: page.slug,
    title: page.title,
    description: page.description,
    iconKey: page.iconKey ?? "terms",
    body: page.body,
    updatedAt: page.updatedAt.slice(0, 10),
    pdfUrl: page.pdfUrl,
  };
}

/** Hub chrome from policy-page.json + items from published static pages (policy). */
export async function loadPolicyCms(): Promise<CmsPolicy> {
  const raw = await readJsonFile("policy-page.json", defaultCmsPolicy);
  const chrome: CmsPolicy = {
    ...defaultCmsPolicy,
    ...raw,
    items: defaultCmsPolicy.items,
  };
  const policyPages = await loadPublishedStaticPages("policy");
  if (policyPages.length > 0) {
    chrome.items = policyPages.map(pageToPolicyItem);
  } else if (raw.items?.length) {
    chrome.items = raw.items;
  }
  return chrome;
}

export async function loadPolicyDetail(slug: string): Promise<{
  cms: CmsPolicy;
  item: CmsPolicyItem;
  page: CmsStaticPage;
} | null> {
  const cms = await loadPolicyCms();
  const page = await loadStaticPageBySlug(slug, { publishedOnly: true });
  if (page && page.collection === "policy") {
    return { cms, item: pageToPolicyItem(page), page };
  }
  const fallback = cms.items.find((i) => i.slug === slug);
  if (!fallback) return null;
  return {
    cms,
    item: fallback,
    page: {
      id: fallback.id,
      slug: fallback.slug,
      title: fallback.title,
      description: fallback.description,
      body: fallback.body,
      status: "published",
      collection: "policy",
      template: "policy",
      iconKey: fallback.iconKey,
      sortOrder: 0,
      pdfUrl: fallback.pdfUrl,
      createdAt: fallback.updatedAt ?? new Date().toISOString(),
      updatedAt: fallback.updatedAt
        ? `${fallback.updatedAt}T00:00:00.000Z`
        : new Date().toISOString(),
      publishedAt: new Date().toISOString(),
    },
  };
}
