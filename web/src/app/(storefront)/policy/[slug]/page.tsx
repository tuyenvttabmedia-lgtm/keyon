import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PolicyDetailView } from "@/storefront/components/policy/PolicyDetailView";
import { loadPolicyDetail } from "@/storefront/components/policy/load-policy-cms";
import {
  resolveWithGlobalFallback,
  toNextMetadata,
} from "@/server/seo/metadata";
import { loadSiteSettings } from "@/server/seo/settings";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [data, settings] = await Promise.all([
    loadPolicyDetail(slug),
    loadSiteSettings(),
  ]);
  if (!data) {
    return toNextMetadata(
      resolveWithGlobalFallback(settings, {
        path: "/policy",
        title: "Chính sách — KEYON",
      }),
      {
        faviconUrl: settings.faviconUrl,
        appleTouchIconUrl: settings.appleTouchIconUrl,
        googleSiteVerification: settings.googleSiteVerification,
      },
    );
  }
  const path = `/policy/${slug}`;
  const seo = resolveWithGlobalFallback(settings, {
    path,
    title: data.page.metaTitle || `${data.item.title} — KEYON`,
    description: data.page.metaDescription || data.item.description,
  });
  return toNextMetadata(seo, {
    faviconUrl: settings.faviconUrl,
    appleTouchIconUrl: settings.appleTouchIconUrl,
    googleSiteVerification: settings.googleSiteVerification,
  });
}

export default async function PolicyDetailPage({ params }: Props) {
  const { slug } = await params;
  const data = await loadPolicyDetail(slug);
  if (!data) notFound();
  return <PolicyDetailView cms={data.cms} item={data.item} />;
}
