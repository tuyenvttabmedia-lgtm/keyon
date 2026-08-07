import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { defaultCmsContact, readJsonFile } from "@/server/cms/store";
import { buildMainPageMetadata } from "@/server/seo/metadata";
import {
  QuoteRequestLanding,
  type QuoteContactInfo,
} from "@/storefront/components/quote/QuoteRequestLanding";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    ...(await buildMainPageMetadata("/contact/quote")),
    title: "Yêu cầu báo giá | KEYON",
    description:
      "Gửi yêu cầu tư vấn và báo giá bản quyền doanh nghiệp KEYON — không cần tài khoản, không dùng giỏ hàng.",
  };
}

type Props = {
  searchParams: Promise<{
    estimatedUsers?: string;
    product?: string;
    intent?: string;
    requestType?: string;
  }>;
};

function resolveRequestType(intent?: string, requestType?: string) {
  if (requestType?.trim()) return requestType.trim().toUpperCase();
  if (intent === "volume-quote") return "VOLUME_LICENSING";
  if (intent === "subscription-consult" || intent === "business") return "SUBSCRIPTION";
  if (intent === "licensing-consult") return "LICENSING_CONSULTING";
  return "GENERAL";
}

export default async function ContactQuotePage({ searchParams }: Props) {
  const sp = await searchParams;
  const [products, cmsRaw] = await Promise.all([
    prisma.product.findMany({
      where: { active: true },
      orderBy: [{ name: "asc" }],
      select: { slug: true, name: true },
      take: 200,
    }),
    readJsonFile("contact-page.json", defaultCmsContact),
  ]);
  const cms = { ...defaultCmsContact, ...cmsRaw };

  const contact: QuoteContactInfo = {
    hotlineValue: cms.hotlineValue?.trim() || undefined,
    hotlineHint: cms.hotlineHint?.trim() || undefined,
    emailValue: cms.emailValue?.trim() || undefined,
    hoursValue: cms.hoursValue?.trim() || undefined,
    mapAddress: cms.mapAddress?.trim() || undefined,
    privacyHref: cms.formPrivacyHref?.trim() || "/policy/privacy",
  };

  return (
    <QuoteRequestLanding
      products={products}
      contact={contact}
      initial={{
        estimatedUsers: sp.estimatedUsers,
        productSlug: sp.product,
        requestType: resolveRequestType(sp.intent, sp.requestType),
        sourcePath: "/contact/quote",
      }}
    />
  );
}
