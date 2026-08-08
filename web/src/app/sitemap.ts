import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { defaultBlog, readJsonFile, type BlogPost } from "@/server/cms/store";
import { loadPublishedStaticPages } from "@/server/cms/static-pages";
import { MAIN_SEO_PATHS } from "@/lib/seo-main-pages";
import { ACTIVE_SOLUTION_SLUGS, BUSINESS_PAGES } from "@/storefront/nav/ia-pages";
import { resourcePostHref } from "@/storefront/lib/resources";
import { absoluteUrl } from "@/server/seo/site-url";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = MAIN_SEO_PATHS.map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));

  for (const slug of ACTIVE_SOLUTION_SLUGS) {
    entries.push({
      url: absoluteUrl(`/solutions/${slug}`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.65,
    });
  }
  for (const slug of Object.keys(BUSINESS_PAGES)) {
    entries.push({
      url: absoluteUrl(`/business/${slug}`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.65,
    });
  }

  const [products, brands, postsRaw, staticPages] = await Promise.all([
    prisma.product.findMany({
      where: { active: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 5000,
    }),
    prisma.brand.findMany({
      where: { active: true },
      select: { slug: true, updatedAt: true },
      take: 1000,
    }),
    readJsonFile<BlogPost[]>("blog.json", defaultBlog),
    loadPublishedStaticPages(),
  ]);

  for (const p of products) {
    entries.push({
      url: absoluteUrl(`/products/${p.slug}`),
      lastModified: p.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  for (const b of brands) {
    entries.push({
      url: absoluteUrl(`/brands/${b.slug}`),
      lastModified: b.updatedAt,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  const posts = (Array.isArray(postsRaw) ? postsRaw : defaultBlog).filter(
    (p) => p.status === "published" && p.robotsIndex !== false,
  );
  for (const post of posts) {
    entries.push({
      url: absoluteUrl(resourcePostHref(post)),
      lastModified: post.updatedAt ? new Date(post.updatedAt) : now,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  for (const page of staticPages) {
    if (page.collection === "policy") {
      entries.push({
        url: absoluteUrl(`/policy/${page.slug}`),
        lastModified: page.updatedAt ? new Date(page.updatedAt) : now,
        changeFrequency: "monthly",
        priority: 0.5,
      });
    } else {
      entries.push({
        url: absoluteUrl(`/pages/${page.slug}`),
        lastModified: page.updatedAt ? new Date(page.updatedAt) : now,
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
  }

  return entries;
}
