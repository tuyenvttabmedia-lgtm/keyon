import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IaLandingPage } from "@/storefront/components/marketing/IaLanding";
import { VolumeLicensingLanding } from "@/storefront/components/business/VolumeLicensingLanding";
import { SubscriptionsLanding } from "@/storefront/components/business/subscriptions/SubscriptionsLanding";
import { LicensingConsultingLanding } from "@/storefront/components/business/consulting/LicensingConsultingLanding";
import { ImplementationLanding } from "@/storefront/components/business/ImplementationLanding";
import { ContractsLanding } from "@/storefront/components/business/ContractsLanding";
import { BUSINESS_PAGES } from "@/storefront/nav/ia-pages";
import { buildMainPageMetadata } from "@/server/seo/metadata";
import { absoluteTitle } from "@/server/seo/title";

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
      title: absoluteTitle("Mua bản quyền phần mềm số lượng lớn | KEYON"),
      description:
        "Mua bản quyền phần mềm số lượng lớn cho doanh nghiệp. KEYON tư vấn license, báo giá theo quy mô, bàn giao và hỗ trợ kích hoạt.",
    };
  }
  if (slug === "subscriptions") {
    return {
      ...(await buildMainPageMetadata(`/business/${slug}`)),
      title: absoluteTitle("Subscription & Gia hạn bản quyền phần mềm | KEYON"),
      description:
        "Mua subscription phần mềm, theo dõi thời hạn và gia hạn bản quyền tại KEYON. Tư vấn sản phẩm, số lượng và thời hạn theo nhu cầu.",
    };
  }
  if (slug === "licensing-consulting") {
    return {
      ...(await buildMainPageMetadata(`/business/${slug}`)),
      title: absoluteTitle("Tư vấn bản quyền phần mềm cho doanh nghiệp | KEYON"),
      description:
        "KEYON tư vấn lựa chọn bản quyền phần mềm, Microsoft 365, Office, Windows và giải pháp bảo mật phù hợp với nhu cầu sử dụng.",
    };
  }
  if (slug === "implementation") {
    return {
      ...(await buildMainPageMetadata(`/business/${slug}`)),
      title: absoluteTitle("Dịch vụ triển khai | KEYON"),
      description:
        "Bàn giao và kích hoạt bản quyền theo quy mô tổ chức — onboarding IT, không phải catalog MSP cloud.",
    };
  }
  if (slug === "contracts") {
    return {
      ...(await buildMainPageMetadata(`/business/${slug}`)),
      title: absoluteTitle("Hợp đồng & Đơn hàng doanh nghiệp | KEYON"),
      description:
        "Theo dõi đơn hàng, license và yêu cầu báo giá doanh nghiệp trên KEYON. Hỗ trợ volume licensing, subscription, PO và gia hạn.",
    };
  }
  return {
    ...(await buildMainPageMetadata(`/business/${slug}`)),
    title: absoluteTitle(`${page.title} | KEYON`),
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
  if (slug === "subscriptions") {
    return <SubscriptionsLanding />;
  }
  if (slug === "licensing-consulting") {
    return <LicensingConsultingLanding />;
  }
  if (slug === "implementation") {
    return <ImplementationLanding />;
  }
  if (slug === "contracts") {
    return <ContractsLanding />;
  }
  return <IaLandingPage page={page} hubLabel="Doanh nghiệp" hubHref="/business" />;
}
