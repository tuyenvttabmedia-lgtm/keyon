import { notFound } from "next/navigation";
import { PolicyDetailView } from "@/storefront/components/policy/PolicyDetailView";
import { loadPolicyDetail } from "@/storefront/components/policy/load-policy-cms";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const data = await loadPolicyDetail(slug);
  if (!data) return { title: "Chính sách — KEYON" };
  return {
    title: data.page.metaTitle || `${data.item.title} — KEYON`,
    description: data.page.metaDescription || data.item.description,
  };
}

export default async function PolicyDetailPage({ params }: Props) {
  const { slug } = await params;
  const data = await loadPolicyDetail(slug);
  if (!data) notFound();
  return <PolicyDetailView cms={data.cms} item={data.item} />;
}
