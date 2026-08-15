import type { FulfillmentStrategy, SalesMotion } from "@prisma/client";

/**
 * Who may create a checkout Order.
 * B5: QUOTE_REQUIRED + MANUAL is a priced service SKU (pay then inbox).
 * QUOTE_REQUIRED + Instant/Semi stays lead-only (e.g. Pax8).
 */
export function variantAllowsCheckout(input: {
  salesMotion: SalesMotion | string;
  fulfillmentStrategy: FulfillmentStrategy | string;
}): boolean {
  const motion = input.salesMotion;
  const strategy = input.fulfillmentStrategy;
  if (strategy === "MANAGED_SUBSCRIPTION") return false;
  if (motion === "SELF_SERVE") {
    return (
      strategy === "INSTANT" ||
      strategy === "MANUAL" ||
      strategy === "SEMI_AUTOMATED"
    );
  }
  if (motion === "QUOTE_REQUIRED") {
    return strategy === "MANUAL";
  }
  return false;
}

export function variantShowsQuoteCta(input: {
  salesMotion: SalesMotion | string;
}): boolean {
  return input.salesMotion === "QUOTE_REQUIRED";
}
