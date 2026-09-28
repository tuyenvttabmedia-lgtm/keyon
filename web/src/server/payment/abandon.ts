import { prisma } from "@/lib/db";
import { childLogger } from "@/lib/logger";
import { PAYMENT_ABANDON_MS_DEFAULT } from "@/lib/payment-window";
import { markPaymentExpired } from "./money";

const log = childLogger("payment.abandon");

export function paymentAbandonMs(): number {
  const n = Number(process.env.PAYMENT_ABANDON_MS ?? PAYMENT_ABANDON_MS_DEFAULT);
  if (!Number.isFinite(n) || n < 60_000) return PAYMENT_ABANDON_MS_DEFAULT;
  return n;
}

/** Pending orders with no money after the abandon window → payment EXPIRED + order CANCELLED. */
export async function abandonUnpaidPayments(now = new Date()): Promise<number> {
  const cutoff = new Date(now.getTime() - paymentAbandonMs());
  const due = await prisma.payment.findMany({
    where: {
      status: { in: ["CREATED", "AWAITING"] },
      createdAt: { lt: cutoff },
      order: { status: "PENDING_PAYMENT" },
      OR: [{ expiresAt: null }, { expiresAt: { lt: now } }],
    },
    select: { paymentReference: true },
    orderBy: { createdAt: "asc" },
    take: 50,
  });

  let closed = 0;
  for (const row of due) {
    try {
      const payment = await markPaymentExpired(row.paymentReference);
      if (payment.status === "EXPIRED") closed++;
    } catch (err) {
      log.warn({ err, ref: row.paymentReference }, "abandon skip");
    }
  }
  return closed;
}

const SWEEP_MS = Number(process.env.PAYMENT_ABANDON_SWEEP_MS ?? 60_000);

export function startPaymentAbandonSweeper() {
  const tick = async () => {
    try {
      const n = await abandonUnpaidPayments();
      if (n > 0) log.info({ closed: n }, "unpaid orders abandoned");
    } catch (err) {
      log.error({ err }, "payment abandon sweep failed");
    }
  };
  void tick();
  const timer = setInterval(tick, SWEEP_MS);
  timer.unref?.();
  log.info({ SWEEP_MS, abandonMs: paymentAbandonMs() }, "payment abandon sweeper started");
  return () => clearInterval(timer);
}
