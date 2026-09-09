import { isStaff, readSession, type SessionUser } from "@/lib/auth";
import { AppError } from "@/lib/errors";
import { prisma } from "@/lib/db";
import {
  assertAdminRole,
  assertStaffCapability,
  type StaffCapability,
} from "@/lib/staff-access";
import { assertSameOriginMutation } from "@/server/auth/csrf";
import { roleRequiresTotp } from "@/server/auth/sessions";

/**
 * Shared staff API gate: CSRF (mutations) + session + staff + optional capability + TOTP.
 */
export async function requireStaffSession(opts?: {
  capability?: StaffCapability;
  /** HTTP method — defaults to POST (mutation). Pass "GET" to skip CSRF. */
  method?: string;
}): Promise<SessionUser> {
  await assertSameOriginMutation({ method: opts?.method ?? "POST" });

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

/** ADMIN-only gate (still requires TOTP via requireStaffSession). */
export async function requireAdminSession(opts?: {
  capability?: StaffCapability;
  method?: string;
}): Promise<SessionUser> {
  const session = await requireStaffSession(opts);
  assertAdminRole(session.role);
  return session;
}
