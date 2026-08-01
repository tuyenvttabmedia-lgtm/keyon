import { FulfillmentStrategy } from "@prisma/client";
import type { FulfillmentStrategyHandler, FulfillmentContext } from "../types";
import { prisma } from "@/lib/db";

/** Phase C — subscription lifecycle */
export const managedSubscriptionStrategy: FulfillmentStrategyHandler = {
  strategy: FulfillmentStrategy.MANAGED_SUBSCRIPTION,
  async execute(ctx: FulfillmentContext) {
    await prisma.fulfillmentJob.update({
      where: { id: ctx.jobId },
      data: {
        status: "WAITING_HUMAN",
        notes: "Managed Subscription — Phase C; chờ triển khai lifecycle",
      },
    });
  },
};
