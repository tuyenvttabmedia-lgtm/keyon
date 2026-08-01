import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { audit } from "@/lib/audit";
import { toErrorResponse, AppError } from "@/lib/errors";
import { hashPassword } from "@/lib/password";
import { isStaffRole, staffPatchSchema } from "@/lib/admin-users";
import { revokeAllAuthSessions } from "@/server/auth/sessions";

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const session = await readSession();
    if (!session || session.role !== "ADMIN") {
      throw new AppError("Chỉ Quản trị được sửa tài khoản staff", 403);
    }

    const { id } = await ctx.params;
    const body = staffPatchSchema.parse(await req.json());

    const target = await prisma.user.findUnique({ where: { id } });
    if (!target || !isStaffRole(target.role)) {
      throw new AppError("Không tìm thấy tài khoản staff", 404);
    }

    if (body.role && body.role !== target.role) {
      if (target.role === "ADMIN" && body.role !== "ADMIN") {
        const adminCount = await prisma.user.count({
          where: { role: "ADMIN" },
        });
        if (adminCount <= 1) {
          throw new AppError(
            "Không thể hạ quyền Quản trị cuối cùng",
            400,
          );
        }
      }
    }

    const data: {
      name?: string | null;
      role?: typeof body.role;
      passwordHash?: string;
      passwordChangedAt?: Date;
    } = {};

    if (body.name !== undefined) {
      data.name = body.name?.trim() || null;
    }
    if (body.role !== undefined) {
      data.role = body.role;
    }
    if (body.password) {
      data.passwordHash = await hashPassword(body.password);
      data.passwordChangedAt = new Date();
    }

    const updated = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, email: true, role: true, name: true },
    });

    if (body.password) {
      await revokeAllAuthSessions(id);
    }

    await audit("staff.update", "User", id, session.id, {
      email: updated.email,
      role: updated.role,
      passwordReset: Boolean(body.password),
      roleChanged: body.role !== undefined && body.role !== target.role,
    });

    return NextResponse.json({ id: updated.id });
  } catch (e) {
    return toErrorResponse(e);
  }
}
