import { NextResponse } from "next/server";
import { isStaff, readSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { audit } from "@/lib/audit";
import { toErrorResponse, AppError } from "@/lib/errors";
import { assertStaffCapability } from "@/lib/staff-access";
import { brandPatchSchema, pickBrandContent } from "@/lib/brand-admin";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await readSession();
    if (!session || !isStaff(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    assertStaffCapability(
      session.role,
      "brands_mutate",
      "Không có quyền sửa brand",
    );

    const { id } = await params;
    const body = brandPatchSchema.parse(await req.json());
    const current = await prisma.brand.findUnique({ where: { id } });
    if (!current) throw new AppError("Brand not found", 404);

    if (body.supplierId) {
      const s = await prisma.supplier.findUnique({ where: { id: body.supplierId } });
      if (!s) throw new AppError("Supplier not found", 404);
    }

    const nextName = body.name?.trim() ?? current.name;
    const nextSlug =
      body.slug !== undefined ? body.slug.trim().slice(0, 80) : current.slug;
    if (!nextSlug) throw new AppError("Slug không hợp lệ", 400);

    if (body.name !== undefined || body.slug !== undefined) {
      const clash = await prisma.brand.findFirst({
        where: {
          id: { not: id },
          OR: [{ name: nextName }, { slug: nextSlug }],
        },
      });
      if (clash) {
        throw new AppError("Tên hoặc slug brand đã tồn tại", 409);
      }
    }

    const brand = await prisma.brand.update({
      where: { id },
      data: {
        ...(body.name !== undefined ? { name: nextName } : {}),
        ...(body.slug !== undefined ? { slug: nextSlug } : {}),
        ...pickBrandContent(body),
      },
    });

    await audit(
      "brand.update",
      "Brand",
      brand.id,
      session.id,
      {
        name: brand.name,
        slug: brand.slug,
        active: brand.active,
        featured: brand.featured,
      },
    );

    return NextResponse.json({
      id: brand.id,
      slug: brand.slug,
      active: brand.active,
    });
  } catch (e) {
    return toErrorResponse(e);
  }
}
