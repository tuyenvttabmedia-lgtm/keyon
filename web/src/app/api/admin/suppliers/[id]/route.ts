import { requireStaffSession } from "@/server/auth/require-staff";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { audit } from "@/lib/audit";
import { toErrorResponse, AppError } from "@/lib/errors";
import { supplierWriteSchema } from "@/lib/admin-suppliers";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireStaffSession({ capability: "suppliers_mutate" });

    const { id } = await params;
    const body = supplierWriteSchema.parse(await req.json());
    const name = body.name.trim();

    const current = await prisma.supplier.findUnique({ where: { id } });
    if (!current) throw new AppError("Supplier not found", 404);

    const clash = await prisma.supplier.findFirst({
      where: { name, NOT: { id } },
    });
    if (clash) throw new AppError("Tên nhà cung cấp đã tồn tại", 409);

    const supplier = await prisma.supplier.update({
      where: { id },
      data: {
        name,
        supplierType: body.supplierType,
        integrationMode: body.integrationMode,
        active: body.active ?? true,
        contactName: body.contactName,
        contactEmail: body.contactEmail,
        website: body.website,
        notes: body.notes?.trim() || null,
      },
    });

    await audit("supplier.update", "Supplier", supplier.id, session.id, {
      name: supplier.name,
      supplierType: supplier.supplierType,
      integrationMode: supplier.integrationMode,
      active: supplier.active,
    });

    return NextResponse.json({ id: supplier.id });
  } catch (e) {
    return toErrorResponse(e);
  }
}
