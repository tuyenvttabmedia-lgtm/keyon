import { z } from "zod";
import type { CommercialAgreementStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { audit } from "@/lib/audit";
import { AppError } from "@/lib/errors";

const STATUSES = ["DRAFT", "ACTIVE", "CLOSED"] as const;

export const agreementCreateSchema = z.object({
  title: z.string().trim().min(2).max(200),
  reference: z.string().trim().max(80).optional().nullable(),
  organizationId: z.string().trim().min(1).optional().nullable(),
  status: z.enum(STATUSES).optional(),
  startsAt: z.string().trim().optional().nullable(),
  endsAt: z.string().trim().optional().nullable(),
  note: z.string().trim().max(2000).optional().nullable(),
});

export const agreementUpdateSchema = agreementCreateSchema.partial();

export const agreementLinkOrderSchema = z.object({
  orderCode: z.string().trim().min(1).max(40),
});

function emptyToNull(s: string | null | undefined) {
  const t = s?.trim() ?? "";
  return t.length ? t : null;
}

function parseDay(raw: string | null | undefined): Date | null {
  const s = emptyToNull(raw);
  if (!s) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    throw new AppError("Ngày phải dạng YYYY-MM-DD", 400);
  }
  return new Date(`${s}T12:00:00.000Z`);
}

async function assertOrg(organizationId: string | null) {
  if (!organizationId) return null;
  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { id: true },
  });
  if (!org) throw new AppError("Không tìm thấy tổ chức", 404);
  return org.id;
}

export async function createAgreement(
  input: z.infer<typeof agreementCreateSchema>,
  actorId: string,
) {
  const organizationId = await assertOrg(emptyToNull(input.organizationId));
  const row = await prisma.commercialAgreement.create({
    data: {
      title: input.title.trim(),
      reference: emptyToNull(input.reference),
      organizationId,
      status: (input.status ?? "DRAFT") as CommercialAgreementStatus,
      startsAt: parseDay(input.startsAt),
      endsAt: parseDay(input.endsAt),
      note: emptyToNull(input.note),
    },
  });
  await audit("agreement.create", "CommercialAgreement", row.id, actorId, {
    title: row.title,
  });
  return row;
}

export async function updateAgreement(
  id: string,
  input: z.infer<typeof agreementUpdateSchema>,
  actorId: string,
) {
  const existing = await prisma.commercialAgreement.findUnique({ where: { id } });
  if (!existing) throw new AppError("Không tìm thấy khung HĐ", 404);
  const organizationId =
    input.organizationId !== undefined
      ? await assertOrg(emptyToNull(input.organizationId))
      : undefined;
  const row = await prisma.commercialAgreement.update({
    where: { id },
    data: {
      ...(input.title != null ? { title: input.title.trim() } : {}),
      ...(input.reference !== undefined
        ? { reference: emptyToNull(input.reference) }
        : {}),
      ...(organizationId !== undefined ? { organizationId } : {}),
      ...(input.status != null
        ? { status: input.status as CommercialAgreementStatus }
        : {}),
      ...(input.startsAt !== undefined ? { startsAt: parseDay(input.startsAt) } : {}),
      ...(input.endsAt !== undefined ? { endsAt: parseDay(input.endsAt) } : {}),
      ...(input.note !== undefined ? { note: emptyToNull(input.note) } : {}),
    },
  });
  await audit("agreement.update", "CommercialAgreement", row.id, actorId, {
    status: row.status,
  });
  return row;
}

export async function deleteAgreement(id: string, actorId: string) {
  const existing = await prisma.commercialAgreement.findUnique({
    where: { id },
    select: { id: true, title: true },
  });
  if (!existing) throw new AppError("Không tìm thấy khung HĐ", 404);
  await prisma.commercialAgreement.delete({ where: { id } });
  await audit("agreement.delete", "CommercialAgreement", id, actorId, {
    title: existing.title,
  });
}

export async function linkOrderByCode(
  agreementId: string,
  orderCode: string,
  actorId: string,
) {
  const agreement = await prisma.commercialAgreement.findUnique({
    where: { id: agreementId },
    select: { id: true, status: true },
  });
  if (!agreement) throw new AppError("Không tìm thấy khung HĐ", 404);
  if (agreement.status === "CLOSED") {
    throw new AppError("Khung HĐ đã đóng — không gắn thêm đơn", 400);
  }
  const code = orderCode.trim();
  const order = await prisma.order.findFirst({
    where: { code: { equals: code, mode: "insensitive" } },
    select: { id: true, code: true, status: true },
  });
  if (!order) throw new AppError("Không tìm thấy đơn", 404);

  try {
    const link = await prisma.commercialAgreementOrder.create({
      data: { agreementId, orderId: order.id },
    });
    await audit("agreement.link_order", "CommercialAgreement", agreementId, actorId, {
      orderId: order.id,
      orderCode: order.code,
      linkId: link.id,
    });
    return { linkId: link.id, orderId: order.id, orderCode: order.code };
  } catch {
    throw new AppError("Đơn đã gắn khung HĐ này", 409);
  }
}

export async function unlinkOrder(
  agreementId: string,
  orderId: string,
  actorId: string,
) {
  const link = await prisma.commercialAgreementOrder.findUnique({
    where: { agreementId_orderId: { agreementId, orderId } },
  });
  if (!link) throw new AppError("Đơn chưa gắn khung HĐ này", 404);
  await prisma.commercialAgreementOrder.delete({ where: { id: link.id } });
  await audit("agreement.unlink_order", "CommercialAgreement", agreementId, actorId, {
    orderId,
  });
}
