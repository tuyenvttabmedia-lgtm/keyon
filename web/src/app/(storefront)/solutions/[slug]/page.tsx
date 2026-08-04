import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IaLandingPage } from "@/storefront/components/marketing/IaLanding";
import { SOLUTION_PAGES } from "@/storefront/nav/ia-pages";
import { buildMainPageMetadata } from "@/server/seo/metadata";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return Object.keys(SOLUTION_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = SOLUTION_PAGES[slug];
  if (!page) return buildMainPageMetadata("/solutions");
  return {
    ...(await buildMainPageMetadata(`/solutions/${slug}`)),
    title: `${page.title} | KEYON`,
    description: page.subtitle,
  };
}

export default async function SolutionPage({ params }: Props) {
  const { slug } = await params;
  const page = SOLUTION_PAGES[slug];
  if (!page) notFound();
  return <IaLandingPage page={page} hubLabel="Giải pháp" hubHref="/solutions" />;
}
