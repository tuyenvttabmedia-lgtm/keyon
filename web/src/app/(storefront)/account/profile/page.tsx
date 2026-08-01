import { redirect } from "next/navigation";
import { readSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { defaultCmsAccount, readJsonFile } from "@/server/cms/store";
import { resolveAccountCopy } from "@/storefront/lib/account-cms";
import {
  ProfileView,
  type ProfileActivity,
  type ProfileNoti,
} from "@/storefront/components/account/ProfileView";

export const dynamic = "force-dynamic";

function formatVnd(n: number) {
  return `${n.toLocaleString("vi-VN")}đ`;
}

function initials(name: string | null, email: string) {
  const n = name?.trim();
  if (n) {
    const parts = n.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0]![0] ?? ""}${parts[parts.length - 1]![0] ?? ""}`.toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

function passwordUpdatedLabel(from: Date) {
  const months = Math.max(
    0,
    Math.floor((Date.now() - from.getTime()) / (30 * 24 * 60 * 60 * 1000)),
  );
  if (months <= 0) return "Đã cập nhật gần đây";
  if (months === 1) return "Đã cập nhật 1 tháng trước";
  if (months < 12) return `Đã cập nhật ${months} tháng trước`;
  const years = Math.floor(months / 12);
  return years === 1
    ? "Đã cập nhật 1 năm trước"
    : `Đã cập nhật ${years} năm trước`;
}

function atLabel(d: Date) {
  return d.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function ProfilePage() {
  const session = await readSession();
  if (!session) redirect("/login");

  const orderWhere = {
    OR: [{ userId: session.id }, { email: session.email }],
  };

  const [cmsRaw, user, completedOrders, spendAgg, recentOrders, audits, notis] =
    await Promise.all([
      readJsonFile("account.json", defaultCmsAccount),
      prisma.user.findUnique({
        where: { id: session.id },
        select: {
          name: true,
          email: true,
          phone: true,
          address: true,
          dateOfBirth: true,
          createdAt: true,
          passwordChangedAt: true,
          emailVerifiedAt: true,
          totpEnabledAt: true,
        },
      }),
      prisma.order.count({
        where: { ...orderWhere, status: "COMPLETED" },
      }),
      prisma.order.aggregate({
        where: {
          ...orderWhere,
          status: { in: ["PAID", "FULFILLING", "COMPLETED"] },
        },
        _sum: { totalVnd: true },
      }),
      prisma.order.findMany({
        where: orderWhere,
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { items: { take: 2, select: { title: true } } },
      }),
      prisma.auditLog.findMany({
        where: { actorId: session.id },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.userNotification.findMany({
        where: { userId: session.id },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
    ]);

  if (!user) redirect("/login");

  const cms = resolveAccountCopy(cmsRaw);

  const activityItems: ProfileActivity[] = [
    ...recentOrders.map((o) => ({
      at: o.createdAt,
      item: {
        id: `order-${o.id}`,
        atLabel: atLabel(o.createdAt),
        title:
          o.items.length > 0
            ? `Đặt hàng ${o.items.map((i) => i.title).join(", ")}`
            : `Đặt hàng #${o.code}`,
        meta: formatVnd(o.totalVnd),
        metaIsPrice: true as const,
      },
    })),
    ...audits.map((a) => ({
      at: a.createdAt,
      item: {
        id: `audit-${a.id}`,
        atLabel: atLabel(a.createdAt),
        title:
          a.action === "password.change"
            ? "Đổi mật khẩu"
            : a.action === "profile.update"
              ? "Cập nhật thông tin tài khoản"
              : a.action,
        meta: "KEYON",
      },
    })),
  ]
    .sort((x, y) => y.at.getTime() - x.at.getTime())
    .slice(0, 4)
    .map((m) => m.item);

  const notifications: ProfileNoti[] = notis.map((n) => ({
    id: n.id,
    title: n.title,
    dateLabel: n.createdAt.toLocaleDateString("vi-VN"),
    href: n.href,
    tone: /hoàn thành|thành công|welcome|chào/i.test(n.title)
      ? ("success" as const)
      : ("info" as const),
  }));

  const pwdFrom = user.passwordChangedAt ?? user.createdAt;

  return (
    <ProfileView
      cms={cms}
      user={{
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        dateOfBirth: user.dateOfBirth
          ? user.dateOfBirth.toISOString().slice(0, 10)
          : null,
        memberSinceLabel: user.createdAt.toLocaleDateString("vi-VN"),
        initials: initials(user.name, user.email),
      }}
      stats={{
        completedOrders,
        totalSpendVnd: spendAgg._sum.totalVnd ?? 0,
      }}
      security={{
        passwordUpdatedLabel: passwordUpdatedLabel(pwdFrom),
        twoFactorEnabled: Boolean(user.totpEnabledAt),
        emailVerified: Boolean(user.emailVerifiedAt),
      }}
      activities={activityItems}
      notifications={notifications}
    />
  );
}
