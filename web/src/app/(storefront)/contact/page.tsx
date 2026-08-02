import type { Metadata } from "next";
import { defaultCmsContact, readJsonFile } from "@/server/cms/store";
import { ContactView } from "@/storefront/components/contact/ContactView";
import { buildMainPageMetadata } from "@/server/seo/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildMainPageMetadata("/contact");
}

export default async function ContactPage() {
  const cmsRaw = await readJsonFile("contact-page.json", defaultCmsContact);
  const cms = { ...defaultCmsContact, ...cmsRaw };
  return <ContactView cms={cms} />;
}
