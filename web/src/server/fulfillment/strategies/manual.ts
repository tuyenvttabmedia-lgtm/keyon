import { FulfillmentStrategy } from "@prisma/client";
import type { FulfillmentStrategyHandler, FulfillmentContext } from "../types";
import { prisma } from "@/lib/db";

export const manualStrategy: FulfillmentStrategyHandler = {
  strategy: FulfillmentStrategy.MANUAL,
  async execute(ctx: FulfillmentContext) {
    await prisma.fulfillmentJob.update({
      where: { id: ctx.jobId },
      data: {
        status: "WAITING_HUMAN",
        notes: "Chờ nhân viên giao hàng (Manual)",
      },
    });
  },
};
