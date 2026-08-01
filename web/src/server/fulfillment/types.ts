import type {
  DeliverableType,
  FulfillmentStrategy as StrategyEnum,
  ProductVariant,
} from "@prisma/client";

export type FulfillmentContext = {
  jobId: string;
  orderItemId: string;
  variant: ProductVariant;
};

export type FulfillmentStrategyHandler = {
  readonly strategy: StrategyEnum;
  execute(ctx: FulfillmentContext): Promise<void>;
};

export function hintFor(type: DeliverableType, plain: string): string {
  if (type === "KEY") {
    if (plain.length <= 4) return "****";
    return `${plain.slice(0, 4)}${"*".repeat(Math.min(8, plain.length - 4))}`;
  }
  if (type === "ACCOUNT") {
    try {
      const obj = JSON.parse(plain) as { username?: string };
      return obj.username ? `acc:${obj.username}` : "account";
    } catch {
      return "account";
    }
  }
  return type.toLowerCase();
}
