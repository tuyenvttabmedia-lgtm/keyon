import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IaLandingPage } from "@/storefront/components/marketing/IaLanding";
import { VolumeLicensingLanding } from "@/storefront/components/business/VolumeLicensingLanding";
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
  if (slug === "volume-licensing") {
    return {
      ...(await buildMainPageMetadata(`/business/${slug}`)),
      title: "Mua bản quyền số lượng lớn | KEYON",
      description:
        "Volume licensing KEYON: chọn quy mô 5 / 10 / 50 / 100+ người dùng và nhận tư vấn báo giá theo nhu cầu.",
    };
  }
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
  if (slug === "volume-licensing") {
    return <VolumeLicensingLanding />;
  }
  return <IaLandingPage page={page} hubLabel="Doanh nghiệp" hubHref="/business" />;
}
