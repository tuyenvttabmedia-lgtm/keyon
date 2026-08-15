import { z } from "zod";
import type {
  OrganizationMembershipRole,
  OrganizationMembershipStatus,
} from "@prisma/client";
import { prisma } from "@/lib/db";
import { audit } from "@/lib/audit";
import { AppError } from "@/lib/errors";

export const orgCreateSchema = z.object({
  name: z.string().trim().min(2).max(200),
  taxId: z.string().trim().max(40).optional().nullable(),
  note: z.string().trim().max(2000).optional().nullable(),
});

export const orgUpdateSchema = orgCreateSchema.partial();

export const memberAddSchema = z.object({
  email: z.string().trim().email().max(200),
  role: z.enum(["OWNER", "MEMBER"]).default("MEMBER"),
});

export const memberPatchSchema = z.object({
  role: z.enum(["OWNER", "MEMBER"]).optional(),
  status: z.enum(["INVITED", "ACTIVE", "DISABLED"]).optional(),
});

function emptyToNull(s: string | null | undefined) {
  const t = s?.trim() ?? "";
  return t.length ? t : null;
}

export async function createOrganization(
  input: z.infer<typeof orgCreateSchema>,
  actorId: string,
) {
  const org = await prisma.organization.create({
    data: {
      name: input.name.trim(),
      taxId: emptyToNull(input.taxId),
      note: emptyToNull(input.note),
    },
  });
  await audit("organization.create", "Organization", org.id, actorId, {
    name: org.name,
  });
  return org;
}

export async function updateOrganization(
  id: string,
  input: z.infer<typeof orgUpdateSchema>,
  actorId: string,
) {
  const existing = await prisma.organization.findUnique({ where: { id } });
  if (!existing) throw new AppError("Không tìm thấy tổ chức", 404);
  const org = await prisma.organization.update({
    where: { id },
    data: {
      ...(input.name != null ? { name: input.name.trim() } : {}),
      ...(input.taxId !== undefined ? { taxId: emptyToNull(input.taxId) } : {}),
      ...(input.note !== undefined ? { note: emptyToNull(input.note) } : {}),
    },
  });
  await audit("organization.update", "Organization", org.id, actorId, {
    name: org.name,
  });
  return org;
}

/** Staff assigns an existing CUSTOMER. Never creates a user. Never infers from domain. */
export async function addMemberByEmail(
  organizationId: string,
  input: z.infer<typeof memberAddSchema>,
  actorId: string,
) {
  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { id: true },
  });
  if (!org) throw new AppError("Không tìm thấy tổ chức", 404);

  const email = input.email.trim().toLowerCase();
  const user = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    select: { id: true, email: true, role: true },
  });
  if (!user) {
    throw new AppError(
      "Chưa có tài khoản khách với email này. Không tạo user/org từ domain.",
      404,
    );
  }
  if (user.role !== "CUSTOMER") {
    throw new AppError("Chỉ gán tài khoản khách (CUSTOMER)", 400);
  }

  const existing = await prisma.organizationMembership.findUnique({
    where: {
      organizationId_userId: { organizationId, userId: user.id },
    },
  });
  if (existing) {
    if (existing.status === "DISABLED") {
      const row = await prisma.organizationMembership.update({
        where: { id: existing.id },
        data: {
          status: "ACTIVE",
          role: input.role as OrganizationMembershipRole,
        },
      });
      await audit("organization.member_reactivate", "Organization", organizationId, actorId, {
        userId: user.id,
        membershipId: row.id,
      });
      return row;
    }
    throw new AppError("Khách đã thuộc tổ chức này", 409);
  }

  const row = await prisma.organizationMembership.create({
    data: {
      organizationId,
      userId: user.id,
      role: input.role as OrganizationMembershipRole,
      status: "ACTIVE",
    },
  });
  await audit("organization.member_add", "Organization", organizationId, actorId, {
    userId: user.id,
    membershipId: row.id,
    role: row.role,
  });
  return row;
}

export async function patchMembership(
  organizationId: string,
  membershipId: string,
  input: z.infer<typeof memberPatchSchema>,
  actorId: string,
) {
  const row = await prisma.organizationMembership.findFirst({
    where: { id: membershipId, organizationId },
  });
  if (!row) throw new AppError("Không tìm thấy thành viên", 404);
  const next = await prisma.organizationMembership.update({
    where: { id: membershipId },
    data: {
      ...(input.role
        ? { role: input.role as OrganizationMembershipRole }
        : {}),
      ...(input.status
        ? { status: input.status as OrganizationMembershipStatus }
        : {}),
    },
  });
  await audit("organization.member_patch", "Organization", organizationId, actorId, {
    membershipId,
    role: next.role,
    status: next.status,
  });
  return next;
}
