import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { audit } from "@/lib/audit";
import { toErrorResponse, AppError } from "@/lib/errors";
import { isStaffRole } from "@/lib/admin-users";
import {
  revokeAllAuthSessions,
  revokeAuthSessionById,
} from "@/server/auth/sessions";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const session = await readSession();
    if (!session || session.role !== "ADMIN") {
      throw new AppError("Chỉ Quản trị viên được xem phiên nhân viên", 403);
    }

    const { id } = await ctx.params;
    const target = await prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true },
    });
    if (!target || !isStaffRole(target.role)) {
      throw new AppError("Không tìm thấy tài khoản nhân viên", 404);
    }

    const sessions = await prisma.authSession.findMany({
      where: { userId: id, revokedAt: null },
      orderBy: { lastSeenAt: "desc" },
      select: {
        id: true,
        deviceLabel: true,
        ip: true,
        createdAt: true,
        lastSeenAt: true,
      },
    });

    return NextResponse.json({
      sessions: sessions.map((s) => ({
        id: s.id,
        deviceLabel: s.deviceLabel,
        ip: s.ip,
        createdAt: s.createdAt.toISOString(),
        lastSeenAt: s.lastSeenAt.toISOString(),
      })),
    });
  } catch (e) {
    return toErrorResponse(e);
  }
}

export async function DELETE(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const session = await readSession();
    if (!session || session.role !== "ADMIN") {
      throw new AppError("Chỉ Quản trị viên được thu hồi phiên", 403);
    }

    const { id } = await ctx.params;
    const target = await prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true, email: true },
    });
    if (!target || !isStaffRole(target.role)) {
      throw new AppError("Không tìm thấy tài khoản nhân viên", 404);
    }

    const url = new URL(req.url);
    const sessionId = url.searchParams.get("sessionId");
    const all = url.searchParams.get("all") === "1";

    if (all) {
      await revokeAllAuthSessions(id);
      await audit("staff.session_revoked", "User", id, session.id, {
        email: target.email,
        scope: "all",
      });
      return NextResponse.json({ ok: true, revoked: "all" });
    }

    if (!sessionId) {
      throw new AppError("Thiếu sessionId hoặc all=1", 400);
    }

    await revokeAuthSessionById(id, sessionId);
    await audit("staff.session_revoked", "User", id, session.id, {
      email: target.email,
      scope: "one",
      sessionId,
    });
    return NextResponse.json({ ok: true, revoked: sessionId });
  } catch (e) {
    return toErrorResponse(e);
  }
}
