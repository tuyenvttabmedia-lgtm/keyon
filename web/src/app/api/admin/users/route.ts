import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { audit } from "@/lib/audit";
import { toErrorResponse, AppError } from "@/lib/errors";
import { hashPassword } from "@/lib/password";
import { staffCreateSchema } from "@/lib/admin-users";
import { issuePasswordReset } from "@/server/auth/password-reset";

export async function POST(req: Request) {
  try {
    const session = await readSession();
    if (!session || session.role !== "ADMIN") {
      throw new AppError("Chỉ Quản trị viên được tạo tài khoản nhân viên", 403);
    }

    const body = staffCreateSchema.parse(await req.json());
    const existing = await prisma.user.findUnique({
      where: { email: body.email },
    });
    if (existing) {
      throw new AppError("Email đã tồn tại", 409);
    }

    // Unusable random password — staff sets their own via reset link
    const bootstrap = randomBytes(32).toString("base64url");
    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name.trim(),
        role: body.role,
        passwordHash: await hashPassword(bootstrap),
      },
      select: { id: true, email: true, role: true },
    });

    const issued = await issuePasswordReset({
      userId: user.id,
      email: user.email,
    });

    await audit("staff.create", "User", user.id, session.id, {
      email: user.email,
      role: user.role,
      emailSent: issued.emailSent,
    });

    return NextResponse.json({
      id: user.id,
      emailSent: issued.emailSent,
      resetUrl: issued.resetUrl,
      message: issued.emailSent
        ? "Đã tạo nhân viên và gửi email đặt mật khẩu."
        : issued.resetUrl
          ? (issued.error ??
            "Đã tạo nhân viên. Dùng link đặt mật khẩu (môi trường dev).")
          : (issued.error ??
            "Đã tạo nhân viên nhưng chưa gửi được email đặt mật khẩu. Dùng «Đặt lại mật khẩu» sau khi cấu hình Mail."),
    });
  } catch (e) {
    return toErrorResponse(e);
  }
}
