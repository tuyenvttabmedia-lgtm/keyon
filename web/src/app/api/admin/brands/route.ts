import { NextResponse } from "next/server";
import { isStaff, readSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { audit } from "@/lib/audit";
import { toErrorResponse, AppError } from "@/lib/errors";
import { assertStaffCapability } from "@/lib/staff-access";
import {
  brandCreateSchema,
  pickBrandContent,
  slugifyBrand,
} from "@/lib/brand-admin";

export async function POST(req: Request) {
  try {
    const session = await readSession();
    if (!session || !isStaff(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    assertStaffCapability(
      session.role,
      "brands_mutate",
      "Không có quyền tạo brand",
    );

    const body = brandCreateSchema.parse(await req.json());
    const slug = (body.slug?.trim() || slugifyBrand(body.name)).slice(0, 80);
    if (!slug) throw new AppError("Slug không hợp lệ", 400);

    if (body.supplierId) {
      const s = await prisma.supplier.findUnique({ where: { id: body.supplierId } });
      if (!s) throw new AppError("Supplier not found", 404);
    }

    const existing = await prisma.brand.findFirst({
      where: { OR: [{ name: body.name.trim() }, { slug }] },
    });
    if (existing) {
      throw new AppError("Tên hoặc slug brand đã tồn tại", 409);
    }

    const content = pickBrandContent(body);
    const brand = await prisma.brand.create({
      data: {
        name: body.name.trim(),
        slug,
        ...content,
        featured: (content.featured as boolean | undefined) ?? false,
        sortOrder: (content.sortOrder as number | undefined) ?? 0,
        active: (content.active as boolean | undefined) ?? true,
      },
    });

    await audit(
      "brand.create",
      "Brand",
      brand.id,
      session.id,
      { name: brand.name, slug: brand.slug },
    );

    return NextResponse.json({ id: brand.id, slug: brand.slug });
  } catch (e) {
    return toErrorResponse(e);
  }
}
