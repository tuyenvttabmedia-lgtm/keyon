import { redirect } from "next/navigation";
import { readSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { defaultCmsAccount, readJsonFile } from "@/server/cms/store";
import { TicketsView } from "@/storefront/components/account/TicketsView";
import { resolveAccountCopy } from "@/storefront/lib/account-cms";

export const dynamic = "force-dynamic";

export default async function TicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const session = await readSession();
  if (!session) redirect("/login");
  const { orderId } = await searchParams;
  let defaultSubjectOrder: string | undefined = orderId;
  if (orderId) {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        OR: [{ userId: session.id }, { email: session.email }],
      },
      select: { code: true },
    });
    if (order) defaultSubjectOrder = order.code;
  }
  const [cmsRaw, rows] = await Promise.all([
    readJsonFile("account.json", defaultCmsAccount),
    prisma.supportTicket.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);
  const cms = resolveAccountCopy(cmsRaw);
  return (
    <TicketsView
      cms={cms}
      defaultOrderId={orderId}
      defaultOrderCode={defaultSubjectOrder}
      initial={rows.map((t) => ({
        id: t.id,
        subject: t.subject,
        body: t.body,
        status: t.status,
        adminNote: t.adminNote,
        orderId: t.orderId,
        createdAt: t.createdAt.toISOString(),
      }))}
    />
  );
}
