import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Microsoft365EmailLanding, M365_EMAIL_FAQ, M365_EMAIL_LABEL, M365_EMAIL_PATH, M365_EMAIL_SEO } from "@/storefront/components/services/Microsoft365EmailLanding";
import {
  EmailDataMigrationLanding,
  EMAIL_MIGRATION_FAQ,
  EMAIL_MIGRATION_LABEL,
  EMAIL_MIGRATION_PATH,
  EMAIL_MIGRATION_SEO,
} from "@/storefront/components/services/EmailDataMigrationLanding";
import {
  CloudServerLanding,
  CLOUD_SERVER_LABEL,
  CLOUD_SERVER_PATH,
  CLOUD_SERVER_SEO,
} from "@/storefront/components/services/CloudServerLanding";
import {
  BackupDisasterRecoveryLanding,
  BACKUP_DR_FAQ,
  BACKUP_DR_LABEL,
  BACKUP_DR_PATH,
  BACKUP_DR_SEO,
} from "@/storefront/components/services/BackupDisasterRecoveryLanding";
import { ServiceTopicLanding } from "@/storefront/components/services/ServiceTopicLanding";
import { BACKUP_DR_SERVICE_SLUG, CLOUD_SERVER_SERVICE_SLUG, EMAIL_MIGRATION_SERVICE_SLUG, M365_EMAIL_SERVICE_SLUG, SERVICE_TOPICS, serviceTopicBySlug } from "@/storefront/nav/ia";
import { buildMainPageMetadata } from "@/server/seo/metadata";
import {
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
  buildServiceJsonLd,
} from "@/server/seo/structured-data";
import { absoluteTitle } from "@/server/seo/title";
import { resolveMediaUrl } from "@/lib/media-url";
import { defaultCmsBackupDrService, readJsonFile } from "@/server/cms/store";
import { resolveStorage } from "@/server/storage/config";

export const revalidate = 60;

async function readBackupDrHero() {
  const [cmsRaw, storage] = await Promise.all([
    readJsonFile("backup-dr-service.json", defaultCmsBackupDrService),
    resolveStorage(),
  ]);
  const mediaBase =
    storage.driver === "wasabi"
      ? storage.wasabi.publicBaseUrl ||
        `${storage.wasabi.endpoint.replace(/\/$/, "")}/${storage.wasabi.bucket}`
      : "";
  const cms = { ...defaultCmsBackupDrService, ...cmsRaw };
  return resolveMediaUrl(cms.heroImageUrl, mediaBase) || cms.heroImageUrl || undefined;
}

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
  if (slug === EMAIL_MIGRATION_SERVICE_SLUG) {
    const base = await buildMainPageMetadata(EMAIL_MIGRATION_PATH);
    return {
      ...base,
      title: absoluteTitle(EMAIL_MIGRATION_SEO.title),
      description: EMAIL_MIGRATION_SEO.description,
      openGraph: {
        ...base.openGraph,
        title: EMAIL_MIGRATION_SEO.title,
        description: EMAIL_MIGRATION_SEO.description,
      },
      twitter: {
        ...base.twitter,
        title: EMAIL_MIGRATION_SEO.title,
        description: EMAIL_MIGRATION_SEO.description,
      },
    };
  }
  if (slug === CLOUD_SERVER_SERVICE_SLUG) {
    const base = await buildMainPageMetadata(CLOUD_SERVER_PATH);
    return {
      ...base,
      title: absoluteTitle(CLOUD_SERVER_SEO.title),
      description: CLOUD_SERVER_SEO.description,
      openGraph: {
        ...base.openGraph,
        title: CLOUD_SERVER_SEO.title,
        description: CLOUD_SERVER_SEO.description,
      },
      twitter: {
        ...base.twitter,
        title: CLOUD_SERVER_SEO.title,
        description: CLOUD_SERVER_SEO.description,
      },
    };
  }
  if (slug === BACKUP_DR_SERVICE_SLUG) {
    const base = await buildMainPageMetadata(BACKUP_DR_PATH);
    return {
      ...base,
      title: absoluteTitle(BACKUP_DR_SEO.title),
      description: BACKUP_DR_SEO.description,
      openGraph: {
        ...base.openGraph,
        title: BACKUP_DR_SEO.title,
        description: BACKUP_DR_SEO.description,
      },
      twitter: {
        ...base.twitter,
        title: BACKUP_DR_SEO.title,
        description: BACKUP_DR_SEO.description,
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
  if (slug === EMAIL_MIGRATION_SERVICE_SLUG) {
    const serviceLd = buildServiceJsonLd({
      name: EMAIL_MIGRATION_LABEL,
      description: EMAIL_MIGRATION_SEO.description,
      path: EMAIL_MIGRATION_PATH,
      serviceType: EMAIL_MIGRATION_LABEL,
    });
    const breadcrumbLd = buildBreadcrumbJsonLd([
      { name: "Trang chủ", path: "/" },
      { name: "Dịch vụ", path: "/services" },
      { name: "Di chuyển Email & Dữ liệu", path: EMAIL_MIGRATION_PATH },
    ]);
    const faqLd = buildFaqPageJsonLd([...EMAIL_MIGRATION_FAQ]);
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
        <EmailDataMigrationLanding />
      </>
    );
  }
  if (slug === CLOUD_SERVER_SERVICE_SLUG) {
    const serviceLd = buildServiceJsonLd({
      name: CLOUD_SERVER_LABEL,
      description: CLOUD_SERVER_SEO.description,
      path: CLOUD_SERVER_PATH,
      serviceType: CLOUD_SERVER_LABEL,
    });
    const breadcrumbLd = buildBreadcrumbJsonLd([
      { name: "Trang chủ", path: "/" },
      { name: "Dịch vụ", path: "/services" },
      { name: CLOUD_SERVER_LABEL, path: CLOUD_SERVER_PATH },
    ]);
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
        <CloudServerLanding />
      </>
    );
  }
  if (slug === BACKUP_DR_SERVICE_SLUG) {
    const serviceLd = buildServiceJsonLd({
      name: BACKUP_DR_LABEL,
      description: BACKUP_DR_SEO.description,
      path: BACKUP_DR_PATH,
      serviceType: BACKUP_DR_LABEL,
    });
    const breadcrumbLd = buildBreadcrumbJsonLd([
      { name: "Trang chủ", path: "/" },
      { name: "Dịch vụ", path: "/services" },
      { name: BACKUP_DR_LABEL, path: BACKUP_DR_PATH },
    ]);
    const faqLd = buildFaqPageJsonLd([...BACKUP_DR_FAQ]);
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
        <BackupDisasterRecoveryLanding heroImageUrl={await readBackupDrHero()} />
      </>
    );
  }
  return <ServiceTopicLanding topic={topic} />;
}
