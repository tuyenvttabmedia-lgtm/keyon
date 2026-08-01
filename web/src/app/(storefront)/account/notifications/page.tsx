import { redirect } from "next/navigation";
import { readSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { defaultCmsAccount, readJsonFile } from "@/server/cms/store";
import { NotificationsView } from "@/storefront/components/account/NotificationsView";
import { resolveAccountCopy } from "@/storefront/lib/account-cms";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const session = await readSession();
  if (!session) redirect("/login");
  const [cmsRaw, rows] = await Promise.all([
    readJsonFile("account.json", defaultCmsAccount),
    prisma.userNotification.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);
  const cms = resolveAccountCopy(cmsRaw);
  return (
    <NotificationsView
      cms={cms}
      initial={rows.map((n) => ({
        id: n.id,
        title: n.title,
        body: n.body,
        href: n.href,
        readAt: n.readAt?.toISOString() ?? null,
        createdAt: n.createdAt.toISOString(),
      }))}
    />
  );
}
