import { prisma } from "@/lib/db";
import { AdminTicketsClient } from "./tickets-client";

export const dynamic = "force-dynamic";

export default async function AdminTicketsPage() {
  const tickets = await prisma.supportTicket.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { user: { select: { email: true, name: true } } },
  });
  return (
    <AdminTicketsClient
      initial={tickets.map((t) => ({
        id: t.id,
        subject: t.subject,
        body: t.body,
        status: t.status,
        adminNote: t.adminNote,
        orderId: t.orderId,
        createdAt: t.createdAt.toISOString(),
        user: t.user,
      }))}
    />
  );
}
