import { randomBytes } from "crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { audit } from "@/lib/audit";
import { emitLicenseEvent } from "./events";
import { reserveExpiresAt } from "./ttl";
import type {
  ConsumeInput,
  ConsumedLicense,
  DisableInput,
  LicenseReservation,
  PoolMetrics,
  ReleaseInput,
  ReserveInput,
} from "./types";

function createId() {
  return randomBytes(12).toString("base64url");
}
type LockedRow = { id: string; version: number; variantId: string };

/**
 * LicensePoolService — không biết Payment/SePay.
 * Chỉ: reserve · consume · release · disable (+ metrics helper).
 */
export const LicensePoolService = {
  async reserve(input: ReserveInput): Promise<LicenseReservation[]> {
    const qty = input.quantity;
    if (!Number.isInteger(qty) || qty < 1) {
      throw new AppError("quantity must be >= 1", 400, "POOL_INVALID_QTY");
    }

    // Idempotent: đã RESERVED/CONSUMED cho orderItem này → trả về (không giữ thêm)
    const existing = await prisma.licenseItem.findMany({
      where: {
        reservedOrderItemId: input.orderItemId,
        status: { in: ["RESERVED", "CONSUMED"] },
      },
      orderBy: { createdAt: "asc" },
    });
    if (existing.length > 0) {
      if (existing.length !== qty && existing.some((e) => e.status === "RESERVED")) {
        // đã reserve một phần / khác qty — trả đúng bản đang giữ
      }
      const reserved = existing.filter((e) => e.status === "RESERVED");
      if (reserved.length >= qty) {
        return reserved.slice(0, qty).map((e) => toReservation(e, input));
      }
      if (existing.every((e) => e.status === "CONSUMED") && existing.length >= qty) {
        throw new AppError(
          "Order item already consumed — cannot reserve again",
          409,
          "POOL_ALREADY_CONSUMED",
        );
      }
    }

    const expiresAt = reserveExpiresAt();
    const token = `rt_${createId()}`;

    const reservations = await prisma.$transaction(
      async (tx) => {
        const rows = await tx.$queryRaw<LockedRow[]>`
          SELECT id, version, "variantId"
          FROM "LicenseItem"
          WHERE "variantId" = ${input.variantId}
            AND status = 'AVAILABLE'
          ORDER BY id
          FOR UPDATE SKIP LOCKED
          LIMIT ${qty}
        `;

        if (rows.length < qty) {
          throw new AppError("Insufficient license stock", 409, "POOL_INSUFFICIENT");
        }

        const out: LicenseReservation[] = [];
        for (const row of rows) {
          const updated = await tx.licenseItem.updateMany({
            where: {
              id: row.id,
              status: "AVAILABLE",
              version: row.version,
            },
            data: {
              status: "RESERVED",
              version: { increment: 1 },
              reservedOrderId: input.orderId,
              reservedOrderItemId: input.orderItemId,
              reservationToken: qty === 1 ? token : `rt_${createId()}`,
              reservedAt: new Date(),
              expiresAt,
              orderItemId: null,
              consumedAt: null,
            },
          });
          if (updated.count !== 1) {
            throw new AppError("Optimistic lock conflict on reserve", 409, "POOL_VERSION_CONFLICT");
          }
          const item = await tx.licenseItem.findUniqueOrThrow({ where: { id: row.id } });
          await tx.licenseEvent.create({
            data: {
              id: createId(),
              type: "RESERVED",
              licenseItemId: item.id,
              variantId: item.variantId,
              orderId: input.orderId,
              orderItemId: input.orderItemId,
              reservationToken: item.reservationToken,
            },
          });
          out.push(toReservation(item, input));
        }

        if (qty === 1 && out[0]) {
          await tx.orderItem.update({
            where: { id: input.orderItemId },
            data: { reservationToken: out[0].reservationToken },
          });
        }

        return out;
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted },
    );

    for (const r of reservations) {
      emitLicenseEvent({
        name: "LicenseReserved",
        licenseId: r.licenseId,
        variantId: r.variantId,
        orderId: r.orderId,
        orderItemId: r.orderItemId,
        reservationToken: r.reservationToken,
        at: new Date(),
      });
      await audit("license.reserved", "LicenseItem", r.licenseId, null, {
        orderId: r.orderId,
        token: r.reservationToken,
      });
    }

    return reservations;
  },

  async consume(input: ConsumeInput): Promise<ConsumedLicense[]> {
    const token = input.reservationToken?.trim();
    if (!token) throw new AppError("reservationToken required", 400, "POOL_TOKEN_REQUIRED");

    // Idempotent: event CONSUMED với token này đã có
    const prior = await prisma.licenseEvent.findFirst({
      where: { type: "CONSUMED", reservationToken: token },
      orderBy: { createdAt: "desc" },
    });
    if (prior) {
      const item = await prisma.licenseItem.findUnique({ where: { id: prior.licenseItemId } });
      if (item && item.status === "CONSUMED") {
        return [
          {
            licenseId: item.id,
            variantId: item.variantId,
            orderId: prior.orderId!,
            orderItemId: prior.orderItemId!,
            payloadEnc: item.payloadEnc,
          },
        ];
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      const item = await tx.licenseItem.findFirst({
        where: { reservationToken: token },
      });
      if (!item) {
        throw new AppError("Invalid or expired reservation token", 409, "POOL_TOKEN_MISMATCH");
      }
      if (item.status !== "RESERVED") {
        throw new AppError(
          `Cannot consume license in status ${item.status}`,
          409,
          "POOL_NOT_RESERVED",
        );
      }
      if (!item.reservedOrderId || !item.reservedOrderItemId) {
        throw new AppError("Reserved license missing owner", 500, "POOL_OWNER_MISSING");
      }

      const updated = await tx.licenseItem.updateMany({
        where: {
          id: item.id,
          status: "RESERVED",
          reservationToken: token,
          version: item.version,
        },
        data: {
          status: "CONSUMED",
          version: { increment: 1 },
          orderItemId: item.reservedOrderItemId,
          consumedAt: new Date(),
          reservationToken: null,
          reservedOrderId: null,
          reservedOrderItemId: null,
          reservedAt: null,
          expiresAt: null,
        },
      });
      if (updated.count !== 1) {
        throw new AppError("Optimistic lock conflict on consume", 409, "POOL_VERSION_CONFLICT");
      }

      const consumed = await tx.licenseItem.findUniqueOrThrow({ where: { id: item.id } });
      await tx.licenseEvent.create({
        data: {
          id: createId(),
          type: "CONSUMED",
          licenseItemId: consumed.id,
          variantId: consumed.variantId,
          orderId: item.reservedOrderId,
          orderItemId: item.reservedOrderItemId,
          reservationToken: token,
        },
      });

      return {
        licenseId: consumed.id,
        variantId: consumed.variantId,
        orderId: item.reservedOrderId,
        orderItemId: item.reservedOrderItemId,
        payloadEnc: consumed.payloadEnc,
      } satisfies ConsumedLicense;
    });

    emitLicenseEvent({
      name: "LicenseConsumed",
      licenseId: result.licenseId,
      variantId: result.variantId,
      orderId: result.orderId,
      orderItemId: result.orderItemId,
      reservationToken: token,
      at: new Date(),
    });
    await audit("license.consumed", "LicenseItem", result.licenseId, null, {
      orderId: result.orderId,
    });

    return [result];
  },

  async release(input: ReleaseInput): Promise<void> {
    const token = input.reservationToken?.trim();
    if (!token) throw new AppError("reservationToken required", 400, "POOL_TOKEN_REQUIRED");

    const item = await prisma.licenseItem.findFirst({
      where: { reservationToken: token },
    });
    if (!item) {
      // Idempotent: đã release (token cleared) — OK nếu có event RELEASED
      const ev = await prisma.licenseEvent.findFirst({
        where: { type: "RELEASED", reservationToken: token },
      });
      if (ev) return;
      throw new AppError("Reservation token not found", 404, "POOL_TOKEN_NOT_FOUND");
    }
    if (item.status === "CONSUMED") {
      throw new AppError("Cannot release a CONSUMED license", 409, "POOL_RELEASE_CONSUMED");
    }
    if (item.status !== "RESERVED") {
      throw new AppError(
        `Cannot release license in status ${item.status}`,
        409,
        "POOL_NOT_RESERVED",
      );
    }

    await prisma.$transaction(async (tx) => {
      const updated = await tx.licenseItem.updateMany({
        where: {
          id: item.id,
          status: "RESERVED",
          reservationToken: token,
          version: item.version,
        },
        data: {
          status: "AVAILABLE",
          version: { increment: 1 },
          reservationToken: null,
          reservedOrderId: null,
          reservedOrderItemId: null,
          reservedAt: null,
          expiresAt: null,
          orderItemId: null,
        },
      });
      if (updated.count !== 1) {
        throw new AppError("Optimistic lock conflict on release", 409, "POOL_VERSION_CONFLICT");
      }
      await tx.licenseEvent.create({
        data: {
          id: createId(),
          type: "RELEASED",
          licenseItemId: item.id,
          variantId: item.variantId,
          orderId: item.reservedOrderId,
          orderItemId: item.reservedOrderItemId,
          reservationToken: token,
          reason: input.reason,
        },
      });
      if (item.reservedOrderItemId) {
        await tx.orderItem.updateMany({
          where: { id: item.reservedOrderItemId, reservationToken: token },
          data: { reservationToken: null },
        });
      }
    });

    emitLicenseEvent({
      name: "LicenseReleased",
      licenseId: item.id,
      variantId: item.variantId,
      orderId: item.reservedOrderId,
      orderItemId: item.reservedOrderItemId,
      reservationToken: token,
      reason: input.reason,
      at: new Date(),
    });
    await audit("license.released", "LicenseItem", item.id, null, { reason: input.reason });
  },

  async disable(input: DisableInput): Promise<void> {
    const item = await prisma.licenseItem.findUnique({ where: { id: input.licenseId } });
    if (!item) throw new AppError("License not found", 404, "POOL_NOT_FOUND");
    if (item.status === "CONSUMED") {
      throw new AppError("Cannot disable CONSUMED license", 409, "POOL_DISABLE_CONSUMED");
    }
    if (item.status === "DISABLED") return; // idempotent
    if (item.status === "RESERVED") {
      throw new AppError(
        "Release reservation before disable (or cancel order first)",
        409,
        "POOL_DISABLE_RESERVED",
      );
    }

    await prisma.$transaction(async (tx) => {
      const updated = await tx.licenseItem.updateMany({
        where: { id: item.id, status: "AVAILABLE", version: item.version },
        data: {
          status: "DISABLED",
          version: { increment: 1 },
          disabledAt: new Date(),
          disabledReason: input.reason,
        },
      });
      if (updated.count !== 1) {
        throw new AppError("Optimistic lock conflict on disable", 409, "POOL_VERSION_CONFLICT");
      }
      await tx.licenseEvent.create({
        data: {
          id: createId(),
          type: "DISABLED",
          licenseItemId: item.id,
          variantId: item.variantId,
          reason: input.reason,
          meta: input.actorId ? { actorId: input.actorId } : undefined,
        },
      });
    });

    emitLicenseEvent({
      name: "LicenseDisabled",
      licenseId: item.id,
      variantId: item.variantId,
      reason: input.reason,
      at: new Date(),
    });
    await audit("license.disabled", "LicenseItem", item.id, input.actorId ?? null, {
      reason: input.reason,
    });
  },

  /** TTL job — chỉ gọi release(), không UPDATE DB trực tiếp. */
  async releaseExpired(now = new Date()): Promise<number> {
    const expired = await prisma.licenseItem.findMany({
      where: {
        status: "RESERVED",
        expiresAt: { lt: now },
        reservationToken: { not: null },
      },
      select: { reservationToken: true },
      take: 100,
    });
    let n = 0;
    for (const row of expired) {
      if (!row.reservationToken) continue;
      try {
        await this.release({
          reservationToken: row.reservationToken,
          reason: "ttl_expired",
        });
        n++;
      } catch {
        // race với consume/release khác — bỏ qua
      }
    }
    return n;
  },

  async metrics(variantId?: string): Promise<PoolMetrics> {
    if (variantId) {
      const map = await this.metricsForVariants([variantId]);
      return (
        map.get(variantId) ?? {
          available_count: 0,
          reserved_count: 0,
          consumed_count: 0,
          disabled_count: 0,
          ttl_release_count: 0,
          ttl_release_today: 0,
        }
      );
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [available, reserved, consumed, disabled, ttlRelease, ttlReleaseToday] =
      await Promise.all([
        prisma.licenseItem.count({ where: { status: "AVAILABLE" } }),
        prisma.licenseItem.count({ where: { status: "RESERVED" } }),
        prisma.licenseItem.count({ where: { status: "CONSUMED" } }),
        prisma.licenseItem.count({ where: { status: "DISABLED" } }),
        prisma.licenseEvent.count({
          where: { type: "RELEASED", reason: "ttl_expired" },
        }),
        prisma.licenseEvent.count({
          where: {
            type: "RELEASED",
            reason: "ttl_expired",
            createdAt: { gte: startOfDay },
          },
        }),
      ]);
    return {
      available_count: available,
      reserved_count: reserved,
      consumed_count: consumed,
      disabled_count: disabled,
      ttl_release_count: ttlRelease,
      ttl_release_today: ttlReleaseToday,
    };
  },

  /**
   * Batch metrics for many variants — 3 queries thay vì 6×N.
   * Inventory Read Model listInstantSkus dùng path này.
   */
  async metricsForVariants(variantIds: string[]): Promise<Map<string, PoolMetrics>> {
    const map = new Map<string, PoolMetrics>();
    const empty = (): PoolMetrics => ({
      available_count: 0,
      reserved_count: 0,
      consumed_count: 0,
      disabled_count: 0,
      ttl_release_count: 0,
      ttl_release_today: 0,
    });
    for (const id of variantIds) map.set(id, empty());
    if (variantIds.length === 0) return map;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [statusRows, ttlAll, ttlToday] = await Promise.all([
      prisma.licenseItem.groupBy({
        by: ["variantId", "status"],
        where: { variantId: { in: variantIds } },
        _count: { _all: true },
      }),
      prisma.licenseEvent.groupBy({
        by: ["variantId"],
        where: {
          variantId: { in: variantIds },
          type: "RELEASED",
          reason: "ttl_expired",
        },
        _count: { _all: true },
      }),
      prisma.licenseEvent.groupBy({
        by: ["variantId"],
        where: {
          variantId: { in: variantIds },
          type: "RELEASED",
          reason: "ttl_expired",
          createdAt: { gte: startOfDay },
        },
        _count: { _all: true },
      }),
    ]);

    for (const row of statusRows) {
      const m = map.get(row.variantId) ?? empty();
      const n = row._count._all;
      if (row.status === "AVAILABLE") m.available_count = n;
      else if (row.status === "RESERVED") m.reserved_count = n;
      else if (row.status === "CONSUMED") m.consumed_count = n;
      else if (row.status === "DISABLED") m.disabled_count = n;
      map.set(row.variantId, m);
    }
    for (const row of ttlAll) {
      const m = map.get(row.variantId) ?? empty();
      m.ttl_release_count = row._count._all;
      map.set(row.variantId, m);
    }
    for (const row of ttlToday) {
      const m = map.get(row.variantId) ?? empty();
      m.ttl_release_today = row._count._all;
      map.set(row.variantId, m);
    }
    return map;
  },

  /** Recent pool events — Inventory/Dashboard dùng thay vì query LicenseItem. */
  async recentEvents(input: {
    variantId: string;
    types?: Array<"RESERVED" | "CONSUMED" | "RELEASED" | "DISABLED">;
    take?: number;
  }) {
    return prisma.licenseEvent.findMany({
      where: {
        variantId: input.variantId,
        ...(input.types?.length ? { type: { in: input.types } } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: input.take ?? 20,
      select: {
        id: true,
        type: true,
        licenseItemId: true,
        orderId: true,
        orderItemId: true,
        reservationToken: true,
        reason: true,
        createdAt: true,
      },
    });
  },
};

function toReservation(
  item: {
    id: string;
    variantId: string;
    reservationToken: string | null;
    expiresAt: Date | null;
    version: number;
  },
  input: ReserveInput,
): LicenseReservation {
  if (!item.reservationToken || !item.expiresAt) {
    throw new AppError("Reservation incomplete", 500);
  }
  return {
    licenseId: item.id,
    reservationToken: item.reservationToken,
    variantId: item.variantId,
    orderId: input.orderId,
    orderItemId: input.orderItemId,
    expiresAt: item.expiresAt,
    version: item.version,
  };
}
