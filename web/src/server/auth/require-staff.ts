import { isStaff, readSession, type SessionUser } from "@/lib/auth";
import { AppError } from "@/lib/errors";
import { prisma } from "@/lib/db";
import {
  assertStaffCapability,
  type StaffCapability,
} from "@/lib/staff-access";
import { roleRequiresTotp } from "@/server/auth/sessions";

/**
 * Shared staff API gate: session + staff role + optional capability + TOTP when required.
 */
export async function requireStaffSession(opts?: {
  capability?: StaffCapability;
}): Promise<SessionUser> {
  const session = await readSession();
  if (!session || !isStaff(session.role)) {
    throw new AppError("Unauthorized", 401);
  }
  if (!session.jti) {
    throw new AppError("Unauthorized", 401);
  }

  if (roleRequiresTotp(session.role)) {
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { totpEnabledAt: true },
    });
    if (!user?.totpEnabledAt) {
      throw new AppError("Yêu cầu bật 2FA trước khi dùng API quản trị", 403);
    }
  }

  if (opts?.capability) {
    assertStaffCapability(session.role, opts.capability);
  }

  return session;
}
