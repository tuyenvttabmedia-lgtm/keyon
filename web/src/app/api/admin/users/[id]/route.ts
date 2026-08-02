import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { audit } from "@/lib/audit";
import { toErrorResponse, AppError } from "@/lib/errors";
import { isStaffRole, staffPatchSchema, staffStatusSchema } from "@/lib/admin-users";
import { revokeAllAuthSessions } from "@/server/auth/sessions";
import { issuePasswordReset } from "@/server/auth/password-reset";

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const session = await readSession();
    if (!session || session.role !== "ADMIN") {
      throw new AppError("Chỉ Quản trị viên được sửa tài khoản nhân viên", 403);
    }

    const { id } = await ctx.params;
    const raw = await req.json();

    const target = await prisma.user.findUnique({ where: { id } });
    if (!target || !isStaffRole(target.role)) {
      throw new AppError("Không tìm thấy tài khoản nhân viên", 404);
    }

    // Lock / unlock
    if ("disabled" in raw && typeof raw.disabled === "boolean") {
      const { disabled } = staffStatusSchema.parse(raw);

      if (disabled) {
        if (id === session.id) {
          throw new AppError("Không thể khóa chính tài khoản đang đăng nhập", 400);
        }
        if (target.role === "ADMIN") {
          const activeAdmins = await prisma.user.count({
            where: {
              role: "ADMIN",
              disabledAt: null,
              id: { not: id },
            },
          });
          if (activeAdmins < 1) {
            throw new AppError(
              "Phải còn ít nhất một Quản trị viên đang hoạt động",
              400,
            );
          }
        }
        await prisma.user.update({
          where: { id },
          data: { disabledAt: new Date() },
        });
        await revokeAllAuthSessions(id);
        await audit("staff.disabled", "User", id, session.id, {
          email: target.email,
        });
        return NextResponse.json({ id, disabled: true });
      }

      await prisma.user.update({
        where: { id },
        data: { disabledAt: null },
      });
      await audit("staff.enabled", "User", id, session.id, {
        email: target.email,
      });
      return NextResponse.json({ id, disabled: false });
    }

    // Trigger password reset email (no plaintext password)
    if (raw.action === "password_reset") {
      if (target.disabledAt) {
        throw new AppError("Tài khoản đang khóa — mở khóa trước khi đặt lại mật khẩu", 400);
      }
      const issued = await issuePasswordReset({
        userId: target.id,
        email: target.email,
      });
      await audit("staff.password_reset_requested", "User", id, session.id, {
        email: target.email,
        emailSent: issued.emailSent,
      });
      if (!issued.emailSent && !issued.resetUrl) {
        throw new AppError(
          issued.error ?? "Không gửi được email đặt mật khẩu",
          503,
        );
      }
      return NextResponse.json({
        ok: true,
        emailSent: issued.emailSent,
        resetUrl: issued.resetUrl,
        message: issued.emailSent
          ? "Đã gửi email đặt lại mật khẩu."
          : issued.error ?? "Dùng link đặt mật khẩu (dev).",
      });
    }

    const body = staffPatchSchema.parse(raw);

    if (body.role && body.role !== target.role) {
      if (id === session.id && body.role !== "ADMIN") {
        throw new AppError(
          "Không thể tự hạ quyền Quản trị viên của chính mình",
          400,
        );
      }
      if (target.role === "ADMIN" && body.role !== "ADMIN") {
        const activeAdmins = await prisma.user.count({
          where: {
            role: "ADMIN",
            disabledAt: null,
            id: { not: id },
          },
        });
        if (activeAdmins < 1) {
          throw new AppError(
            "Không thể hạ quyền Quản trị viên hoạt động cuối cùng",
            400,
          );
        }
      }
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(body.name !== undefined
          ? { name: body.name?.trim() || null }
          : {}),
        ...(body.role !== undefined ? { role: body.role } : {}),
      },
      select: { id: true, email: true, role: true, name: true },
    });

    await audit("staff.update", "User", id, session.id, {
      email: updated.email,
      role: updated.role,
      roleChanged: body.role !== undefined && body.role !== target.role,
    });

    return NextResponse.json({ id: updated.id });
  } catch (e) {
    return toErrorResponse(e);
  }
}
