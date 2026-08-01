import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export async function nextOrderCode(): Promise<string> {
  const n = await prisma.order.count();
  const seq = String(n + 1).padStart(6, "0");
  return `KO${seq}`;
}

export async function audit(
  action: string,
  entityType: string,
  entityId?: string,
  actorId?: string | null,
  meta?: Prisma.InputJsonValue,
) {
  await prisma.auditLog.create({
    data: {
      action,
      entityType,
      entityId,
      actorId: actorId ?? undefined,
      meta,
    },
  });
}
