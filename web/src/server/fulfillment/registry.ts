import { FulfillmentStrategy } from "@prisma/client";
import type { FulfillmentStrategyHandler } from "./types";
import { instantStrategy } from "./strategies/instant";
import { manualStrategy } from "./strategies/manual";
import { semiAutomatedStrategy } from "./strategies/semi-automated";
import { managedSubscriptionStrategy } from "./strategies/managed-subscription";
import { AppError } from "@/lib/errors";

const registry: Record<FulfillmentStrategy, FulfillmentStrategyHandler> = {
  INSTANT: instantStrategy,
  MANUAL: manualStrategy,
  SEMI_AUTOMATED: semiAutomatedStrategy,
  MANAGED_SUBSCRIPTION: managedSubscriptionStrategy,
};

export function getFulfillmentStrategy(
  strategy: FulfillmentStrategy,
): FulfillmentStrategyHandler {
  const handler = registry[strategy];
  if (!handler) {
    throw new AppError(`Unknown fulfillment strategy: ${strategy}`, 500, "FULFILL_STRATEGY");
  }
  return handler;
}
