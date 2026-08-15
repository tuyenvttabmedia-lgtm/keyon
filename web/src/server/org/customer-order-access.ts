import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export type CustomerActor = { id: string; email: string };

export type OrgPeerAccounts = {
  userIds: string[];
  emails: string[];
};

/** ACTIVE co-members across orgs the actor belongs to. Empty extra peers if none. */
export async function loadOrgPeerAccounts(
  userId: string,
): Promise<OrgPeerAccounts> {
  const mine = await prisma.organizationMembership.findMany({
    where: { userId, status: "ACTIVE" },
    select: { organizationId: true },
  });
  if (mine.length === 0) {
    return { userIds: [userId], emails: [] };
  }
  const peers = await prisma.organizationMembership.findMany({
    where: {
      organizationId: { in: mine.map((m) => m.organizationId) },
      status: "ACTIVE",
    },
    select: {
      userId: true,
      user: { select: { email: true } },
    },
  });
  return {
    userIds: [...new Set(peers.map((p) => p.userId))],
    emails: [...new Set(peers.map((p) => normalizeEmail(p.user.email)))],
  };
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function customerOrderWhere(
  actor: CustomerActor,
): Promise<Prisma.OrderWhereInput> {
  const peers = await loadOrgPeerAccounts(actor.id);
  return orderWhereForActor(actor, peers);
}

export function orderWhereForActor(
  actor: CustomerActor,
  peers: OrgPeerAccounts,
): Prisma.OrderWhereInput {
  const selfEmail = normalizeEmail(actor.email);
  const or: Prisma.OrderWhereInput[] = [
    { userId: actor.id },
    { email: { equals: actor.email, mode: "insensitive" } },
  ];
  const extraIds = peers.userIds.filter((id) => id !== actor.id);
  const extraEmails = peers.emails.filter((e) => e !== selfEmail);
  if (extraIds.length) or.push({ userId: { in: extraIds } });
  for (const email of extraEmails) {
    or.push({ email: { equals: email, mode: "insensitive" } });
  }
  return { OR: or };
}

export async function customerCanAccessOrder(
  actor: CustomerActor,
  order: { userId: string | null; email: string },
): Promise<boolean> {
  if (order.userId === actor.id) return true;
  if (normalizeEmail(order.email) === normalizeEmail(actor.email)) return true;
  const peers = await loadOrgPeerAccounts(actor.id);
  if (order.userId && peers.userIds.includes(order.userId)) return true;
  return peers.emails.includes(normalizeEmail(order.email));
}

export function isSharedOrgOrder(
  actor: CustomerActor,
  order: { userId: string | null; email: string },
): boolean {
  const ownUser = order.userId === actor.id;
  const ownEmail = normalizeEmail(order.email) === normalizeEmail(actor.email);
  return !ownUser && !ownEmail;
}
