# ADR-004 — Payment Domain

**Status:** Accepted / **FROZEN** trước implement SePay  
**Date:** 2026-07-21  
**Chi tiết:** `docs/PAYMENT-ARCHITECTURE-v1.md` · checklist `docs/SEPAY-PRODUCTION.md`

## Context

Cần nhận tiền thật (SePay) mà không phá kho key và không double-fulfill khi webhook retry. Nhiều hệ thống gọi luôn “trừ kho / giao hàng” trong webhook — khi đổi cổng hoặc retry sẽ rối và nguy hiểm.

## Decision

```
SePay Webhook
      → Payment Domain          (chỉ xác nhận tiền)
            → Fulfillment       (quyết định giao)
                  → LicensePool.consume()
```

- **Webhook không được gọi trực tiếp License Pool.**
- State machine gọn: `PENDING_PAYMENT` → `PAYMENT_PROCESSING` → `PAID` | `FAILED` | `EXPIRED` | `CANCELLED`.
- Idempotency 3 lớp: `provider_event_id` · `payment_reference` · delivery exists.
- Payment qua `PaymentProvider` interface — SePay / stub / PayOS / MegaPay thay được.
- Reconcile fields: provider refs + amount + `provider_paid_at`.
- Events: Created · Succeeded · Failed · Expired · Cancelled (đúng 5).
- Exit SePay: **P1–P10** bắt buộc PASS.

## Consequences

**Được:** Đổi cổng thanh toán không đụng Pool · webhook an toàn · tách trách nhiệm rõ · sẵn Core Stable sau P1–P10.

**Mất:** Thêm orchestration layer; PAID async cần queue + recovery (không auto-refund).

## Alternatives

| Phương án | Lý do không chọn |
|-----------|------------------|
| Webhook → `Pool.consume()` | Payment ≠ fulfillment; khó đổi SePay→PayOS; retry nguy hiểm |
| Chỉ dựa `payment_reference` (không event id) | Duplicate event cùng ref khó truy |
| Auto-refund khi fulfill fail | Vi phạm nguyên tắc KEYON: tiền OK ≠ giao OK → người xử lý |
| Thêm nhiều payment status “cho đủ” | Phức tạp không có nhu cầu nghiệp vụ |
