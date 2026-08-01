import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { audit } from "@/lib/audit";
import { toErrorResponse, AppError } from "@/lib/errors";
import { hashPassword } from "@/lib/password";
import { staffCreateSchema } from "@/lib/admin-users";

export async function POST(req: Request) {
  try {
    const session = await readSession();
    if (!session || session.role !== "ADMIN") {
      throw new AppError("Chỉ Quản trị được tạo tài khoản staff", 403);
    }

    const body = staffCreateSchema.parse(await req.json());
    const existing = await prisma.user.findUnique({
      where: { email: body.email },
    });
    if (existing) {
      throw new AppError("Email đã tồn tại", 409);
    }

    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name?.trim() || null,
        role: body.role,
        passwordHash: await hashPassword(body.password),
        passwordChangedAt: new Date(),
      },
      select: { id: true, email: true, role: true },
    });

    await audit("staff.create", "User", user.id, session.id, {
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({ id: user.id });
  } catch (e) {
    return toErrorResponse(e);
  }
}
