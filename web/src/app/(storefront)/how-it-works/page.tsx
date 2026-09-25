import type { Metadata } from "next";
import { HowItWorksLanding } from "@/storefront/components/support/HowItWorksLanding";
import { buildMainPageMetadata } from "@/server/seo/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildMainPageMetadata("/how-it-works");
}

export default function HowItWorksPage() {
  return <HowItWorksLanding />;
}
