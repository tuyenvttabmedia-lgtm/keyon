import type { Metadata } from "next";
import { PolicyView } from "@/storefront/components/policy/PolicyView";
import { loadPolicyCms } from "@/storefront/components/policy/load-policy-cms";
import { buildMainPageMetadata } from "@/server/seo/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildMainPageMetadata("/policy");
}

export default async function PolicyPage() {
  const cms = await loadPolicyCms();
  return <PolicyView cms={cms} />;
}
