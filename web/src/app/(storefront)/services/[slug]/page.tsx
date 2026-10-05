import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Microsoft365EmailLanding, M365_EMAIL_FAQ, M365_EMAIL_LABEL, M365_EMAIL_PATH, M365_EMAIL_SEO } from "@/storefront/components/services/Microsoft365EmailLanding";
import { ServiceTopicLanding } from "@/storefront/components/services/ServiceTopicLanding";
import { M365_EMAIL_SERVICE_SLUG, SERVICE_TOPICS, serviceTopicBySlug } from "@/storefront/nav/ia";
import { buildMainPageMetadata } from "@/server/seo/metadata";
import {
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
  buildServiceJsonLd,
} from "@/server/seo/structured-data";
import { absoluteTitle } from "@/server/seo/title";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SERVICE_TOPICS.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const topic = serviceTopicBySlug(slug);
  if (!topic) return buildMainPageMetadata("/services");
  if (slug === M365_EMAIL_SERVICE_SLUG) {
    const base = await buildMainPageMetadata(M365_EMAIL_PATH);
    return {
      ...base,
      title: absoluteTitle(M365_EMAIL_SEO.title),
      description: M365_EMAIL_SEO.description,
      openGraph: {
        ...base.openGraph,
        title: M365_EMAIL_SEO.title,
        description: M365_EMAIL_SEO.description,
      },
      twitter: {
        ...base.twitter,
        title: M365_EMAIL_SEO.title,
        description: M365_EMAIL_SEO.description,
      },
    };
  }
  return {
    ...(await buildMainPageMetadata(`/services/${slug}`)),
    title: absoluteTitle(`${topic.label} | KEYON`),
    description: topic.description,
  };
}

export default async function ServiceTopicPage({ params }: Props) {
  const { slug } = await params;
  const topic = serviceTopicBySlug(slug);
  if (!topic) notFound();
  if (slug === M365_EMAIL_SERVICE_SLUG) {
    const serviceLd = buildServiceJsonLd({
      name: M365_EMAIL_LABEL,
      description: M365_EMAIL_SEO.description,
      path: M365_EMAIL_PATH,
      serviceType: M365_EMAIL_LABEL,
    });
    const breadcrumbLd = buildBreadcrumbJsonLd([
      { name: "Trang chủ", path: "/" },
      { name: "Dịch vụ", path: "/services" },
      { name: M365_EMAIL_LABEL, path: M365_EMAIL_PATH },
    ]);
    const faqLd = buildFaqPageJsonLd([...M365_EMAIL_FAQ]);
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
        {faqLd ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
          />
        ) : null}
        <Microsoft365EmailLanding />
      </>
    );
  }
  return <ServiceTopicLanding topic={topic} />;
}
