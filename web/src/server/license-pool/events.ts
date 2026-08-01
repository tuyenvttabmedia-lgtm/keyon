import { EventEmitter } from "events";
import type { LicenseDomainEvent, LicenseDomainEventName } from "./types";
import { childLogger } from "@/lib/logger";

const log = childLogger("license-pool.events");

type Handler = (event: LicenseDomainEvent) => void | Promise<void>;

const bus = new EventEmitter();
bus.setMaxListeners(50);

/** In-process bus — subscribers (notify/email/analytics) đăng ký sau, không sửa Pool. */
export function onLicenseEvent(name: LicenseDomainEventName, handler: Handler) {
  bus.on(name, handler);
  return () => bus.off(name, handler);
}

export function emitLicenseEvent(event: LicenseDomainEvent) {
  log.info(
    {
      name: event.name,
      licenseId: event.licenseId,
      reason: event.reason,
      orderId: event.orderId,
    },
    "license domain event",
  );
  bus.emit(event.name, event);
}
