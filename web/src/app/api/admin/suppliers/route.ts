import { NextResponse } from "next/server";
import { isStaff, readSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { audit } from "@/lib/audit";
import { toErrorResponse, AppError } from "@/lib/errors";
import { supplierWriteSchema } from "@/lib/admin-suppliers";

export async function POST(req: Request) {
  try {
    const session = await readSession();
    if (!session || !isStaff(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.role === "CS") {
      throw new AppError("CS không được tạo nhà cung cấp", 403);
    }

    const body = supplierWriteSchema.parse(await req.json());
    const name = body.name.trim();
    const existing = await prisma.supplier.findUnique({ where: { name } });
    if (existing) {
      throw new AppError("Tên nhà cung cấp đã tồn tại", 409);
    }

    const supplier = await prisma.supplier.create({
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

    await audit("supplier.create", "Supplier", supplier.id, session.id, {
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
