import { EventEmitter } from "events";
import { childLogger } from "@/lib/logger";

const log = childLogger("payment.events");
const bus = new EventEmitter();
bus.setMaxListeners(50);

export type PaymentEventName =
  | "PaymentCreated"
  | "PaymentSucceeded"
  | "PaymentFailed"
  | "PaymentExpired"
  | "PaymentCancelled";

export type PaymentDomainEventPayload = {
  name: PaymentEventName;
  paymentId: string;
  paymentReference: string;
  orderId: string;
  reason?: string | null;
  at: Date;
};

export function onPaymentEvent(
  name: PaymentEventName,
  handler: (e: PaymentDomainEventPayload) => void | Promise<void>,
) {
  bus.on(name, handler);
  return () => bus.off(name, handler);
}

export function emitPaymentEvent(event: PaymentDomainEventPayload) {
  log.info(
    { name: event.name, paymentId: event.paymentId, ref: event.paymentReference },
    "payment domain event",
  );
  bus.emit(event.name, event);
}
