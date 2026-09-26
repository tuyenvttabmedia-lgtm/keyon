import type { Metadata } from "next";
import { BusinessHubLanding } from "@/storefront/components/business/BusinessHubLanding";
import { buildMainPageMetadata } from "@/server/seo/metadata";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildMainPageMetadata("/business");
}

export default function BusinessHubPage() {
  return <BusinessHubLanding />;
}
