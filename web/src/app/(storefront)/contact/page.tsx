import { defaultCmsContact, readJsonFile } from "@/server/cms/store";
import { ContactView } from "@/storefront/components/contact/ContactView";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const cmsRaw = await readJsonFile("contact-page.json", defaultCmsContact);
  const cms = { ...defaultCmsContact, ...cmsRaw };
  return <ContactView cms={cms} />;
}
