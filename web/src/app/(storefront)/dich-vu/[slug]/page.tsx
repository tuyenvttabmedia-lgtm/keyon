import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceTopicLanding } from "@/storefront/components/services/ServiceTopicLanding";
import { SERVICE_TOPICS, serviceTopicBySlug } from "@/storefront/nav/ia";
import { buildMainPageMetadata } from "@/server/seo/metadata";
import { absoluteTitle } from "@/server/seo/title";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SERVICE_TOPICS.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const topic = serviceTopicBySlug(slug);
  if (!topic) return buildMainPageMetadata("/dich-vu");
  return {
    ...(await buildMainPageMetadata(`/dich-vu/${slug}`)),
    title: absoluteTitle(`${topic.label} | KEYON`),
    description: topic.description,
  };
}

export default async function ServiceTopicPage({ params }: Props) {
  const { slug } = await params;
  const topic = serviceTopicBySlug(slug);
  if (!topic) notFound();
  return <ServiceTopicLanding topic={topic} />;
}
