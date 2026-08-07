import type { Metadata } from "next";
import {
  defaultBlog,
  defaultCmsContact,
  readJsonFile,
  type BlogPost,
} from "@/server/cms/store";
import { getFaqForPage } from "@/storefront/content/get-home-content";
import { filterPostsBySection, resourcePostHref } from "@/storefront/lib/resources";
import { SupportCenterLanding } from "@/storefront/components/support/SupportCenterLanding";
import {
  buildSuggestedSearches,
  resolveSupportChannels,
  type SupportSearchDoc,
} from "@/storefront/components/support/shared";
import { buildMainPageMetadata } from "@/server/seo/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    ...(await buildMainPageMetadata("/support")),
    title: "Trung tâm hỗ trợ | KEYON",
    description:
      "Tìm hướng dẫn, câu hỏi thường gặp và gửi yêu cầu hỗ trợ về sản phẩm, đơn hàng, bản quyền và tài khoản KEYON.",
  };
}

export default async function SupportHubPage() {
  const [faq, postsRaw, cmsRaw] = await Promise.all([
    getFaqForPage(),
    readJsonFile<BlogPost[]>("blog.json", defaultBlog),
    readJsonFile("contact-page.json", defaultCmsContact),
  ]);
  const cms = { ...defaultCmsContact, ...cmsRaw };

  const published = (Array.isArray(postsRaw) ? postsRaw : defaultBlog).filter(
    (p) => p.status === "published",
  );
  const guides = filterPostsBySection(published, "guides");

  const docs: SupportSearchDoc[] = [
    ...faq.map((f) => ({
      id: `faq-${f.id}`,
      kind: "faq" as const,
      title: f.question,
      excerpt: f.answer.slice(0, 160),
      href: `/faq`,
    })),
    ...guides.map((g) => ({
      id: `guide-${g.id}`,
      kind: "guide" as const,
      title: g.title,
      excerpt: g.excerpt,
      href: resourcePostHref(g),
    })),
  ];

  const suggestions = buildSuggestedSearches(docs);
  const channels = resolveSupportChannels(cms);
  const faqItems = faq.map((f) => ({
    id: f.id,
    question: f.question,
    answer: f.answer,
  }));

  return (
    <SupportCenterLanding
      docs={docs}
      suggestions={suggestions}
      faqItems={faqItems}
      channels={channels}
    />
  );
}
