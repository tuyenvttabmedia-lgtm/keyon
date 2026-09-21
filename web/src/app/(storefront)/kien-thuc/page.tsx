import type { Metadata } from "next";
import {
  defaultBlog,
  defaultCmsBlogTaxonomy,
  readJsonFile,
  type BlogPost,
  type CmsBlogTaxonomy,
} from "@/server/cms/store";
import { isBlogPostLive } from "@/server/cms/blog-utils";
import { KnowledgeHubView } from "@/storefront/components/blog/KnowledgeHubView";
import { mergeBlogTaxonomy } from "@/storefront/lib/blog-taxonomy";
import { postDateIso } from "@/storefront/lib/blog";
import { KNOWLEDGE_HUB_PATH } from "@/storefront/lib/resources";
import { buildMainPageMetadata } from "@/server/seo/metadata";
import type { MainSeoPageKey } from "@/lib/seo-main-pages";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildMainPageMetadata(KNOWLEDGE_HUB_PATH as MainSeoPageKey);
}

export default async function KnowledgeHubPage() {
  const [taxRaw, postsRaw] = await Promise.all([
    readJsonFile<CmsBlogTaxonomy>(
      "blog-taxonomy.json",
      defaultCmsBlogTaxonomy,
    ),
    readJsonFile<BlogPost[]>("blog.json", defaultBlog),
  ]);

  const taxonomy = mergeBlogTaxonomy(taxRaw);
  const posts = (Array.isArray(postsRaw) ? postsRaw : defaultBlog)
    .filter((p) => isBlogPostLive(p))
    .sort(
      (a, b) =>
        new Date(postDateIso(b)).getTime() - new Date(postDateIso(a)).getTime(),
    );

  return <KnowledgeHubView taxonomy={taxonomy} posts={posts} />;
}
