import { redirect } from "next/navigation";
import { readSession } from "@/lib/auth";
import { defaultCmsAccount, readJsonFile } from "@/server/cms/store";
import { SecurityForm } from "@/storefront/components/account/SecurityForm";
import { resolveAccountCopy } from "@/storefront/lib/account-cms";

export const dynamic = "force-dynamic";

export default async function SecurityPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const session = await readSession();
  if (!session) redirect("/login");
  const sp = await searchParams;
  const cms = resolveAccountCopy(
    await readJsonFile("account.json", defaultCmsAccount),
  );
  return (
    <SecurityForm
      cms={cms}
      requireAdmin2fa={sp.reason === "admin_2fa"}
    />
  );
}
