import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IaLandingPage } from "@/storefront/components/marketing/IaLanding";
import { BUSINESS_PAGES } from "@/storefront/nav/ia-pages";
import { buildMainPageMetadata } from "@/server/seo/metadata";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return Object.keys(BUSINESS_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = BUSINESS_PAGES[slug];
  if (!page) return buildMainPageMetadata("/business");
  return {
    ...(await buildMainPageMetadata(`/business/${slug}`)),
    title: `${page.title} | KEYON`,
    description: page.subtitle,
  };
}

export default async function BusinessPage({ params }: Props) {
  const { slug } = await params;
  const page = BUSINESS_PAGES[slug];
  if (!page) notFound();
  return <IaLandingPage page={page} hubLabel="Doanh nghiệp" hubHref="/business" />;
}
