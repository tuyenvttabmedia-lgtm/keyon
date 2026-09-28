/**
 * QR expiry vs unpaid abandon window.
 * npm run test:payment-window
 */
import {
  PAYMENT_ABANDON_MS_DEFAULT,
  canManualCancelOrder,
  isQrExpired,
  shouldAbandonUnpaid,
} from "../src/lib/payment-window";

const HOUR = 60 * 60 * 1000;
const createdAt = new Date("2026-09-28T00:00:00.000Z");
const qrExpires = new Date(createdAt.getTime() + 15 * 60 * 1000);
const abandonMs = PAYMENT_ABANDON_MS_DEFAULT;

type R = { id: string; ok: boolean; detail: string };
const results: R[] = [];

function pass(id: string, detail: string) {
  results.push({ id, ok: true, detail });
  console.log(`${id} PASS  ${detail}`);
}
function fail(id: string, detail: string) {
  results.push({ id, ok: false, detail });
  console.log(`${id} FAIL  ${detail}`);
}

function check(id: string, ok: boolean, detail: string) {
  if (ok) pass(id, detail);
  else fail(id, detail);
}

const openAt = createdAt.getTime() + 5 * 60 * 1000;
check(
  "W1",
  !isQrExpired(qrExpires, openAt) &&
    canManualCancelOrder({
      orderStatus: "PENDING_PAYMENT",
      paymentStatus: "AWAITING",
      expiresAt: qrExpires,
      now: openAt,
    }) &&
    !shouldAbandonUnpaid({ createdAt, expiresAt: qrExpires, now: openAt, abandonMs }),
  "QR còn hạn: hiện Hủy, chưa đóng đơn",
);

const lateAt = createdAt.getTime() + 2 * HOUR;
check(
  "W2",
  isQrExpired(qrExpires, lateAt) &&
    !canManualCancelOrder({
      orderStatus: "PENDING_PAYMENT",
      paymentStatus: "AWAITING",
      expiresAt: qrExpires,
      now: lateAt,
    }) &&
    !shouldAbandonUnpaid({ createdAt, expiresAt: qrExpires, now: lateAt, abandonMs }),
  "QR hết hạn trước 24 giờ: ẩn Hủy, đơn vẫn mở để nhận tiền",
);

const dueAt = createdAt.getTime() + abandonMs + 1000;
check(
  "W3",
  shouldAbandonUnpaid({ createdAt, expiresAt: qrExpires, now: dueAt, abandonMs }) &&
    !canManualCancelOrder({
      orderStatus: "PENDING_PAYMENT",
      paymentStatus: "AWAITING",
      expiresAt: qrExpires,
      now: dueAt,
    }),
  "Đủ 24 giờ không có tiền và QR đã hết hạn: được tự đóng",
);

check(
  "W4",
  !shouldAbandonUnpaid({
    createdAt,
    expiresAt: new Date(dueAt + HOUR),
    now: dueAt,
    abandonMs,
  }),
  "QR còn trên màn hình thì không tự đóng dù đã quá 24 giờ",
);

check(
  "W5",
  !canManualCancelOrder({
    orderStatus: "PAID",
    paymentStatus: "SUCCEEDED",
    expiresAt: qrExpires,
    now: openAt,
  }),
  "Đơn đã thanh toán không còn nút Hủy",
);

const failed = results.filter((r) => !r.ok);
if (failed.length > 0) {
  console.error(`payment-window ${failed.length} FAIL`);
  process.exit(1);
}
console.log(`payment-window ${results.length} PASS`);
