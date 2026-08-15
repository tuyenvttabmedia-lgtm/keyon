# ADR-010 — CommercialAgreement linking many Orders (B4.2)

**Status:** Accepted (implement B4.2)  
**Date:** 2026-08-15  
**Depends on:** [ADR-009](./ADR-009-order-commercial-ref.md) · [Phase B](../B2B-PHASE-B.md)  
**Does not amend:** ADR-002 Pool · ADR-003 Inventory · ADR-004 Payment · ADR-005 Fulfillment (state machines)

## Context

Một khung thương mại (HĐ khung / PO khung) cần **nhiều Order**. Gắn `agreementId` lên bảng Order đụng Core Stable (cùng lý do ADR-009 cấm `poNumber`). Payment đi thẳng agreement sẽ bỏ Order — cấm Phase B principle 5–6.

Số HĐ trên **một** đơn vẫn là OrderNote (B4.1).

## Decision

1. Bảng mới `CommercialAgreement` (title, reference, optional `organizationId`, `startsAt`/`endsAt`, `note`).
2. Status **của agreement**: `DRAFT` | `ACTIVE` | `CLOSED` — **không** phải `OrderStatus` / `PaymentStatus`.
3. Liên kết nhiều Order qua `CommercialAgreementOrder` (join). **Không** cột `Order.agreementId`.
4. API chỉ Admin. Không API khách ký HĐ. Không `Payment` trên agreement. Checkout/webhook không đọc agreement.
5. Portal khách không list/ghi agreement. B3.2 membership không suy từ HĐ.
6. Xóa agreement cascade join rows, không xóa Order. Xóa Order cascade join rows, không xóa agreement.

## Schema / migration

Additive. Không ALTER cột bảng `Order`.

## State

Chỉ lifecycle agreement. PAID/COMPLETED giữ ADR-004/005.

## Exit criteria (C1–C7)

| ID | Tiêu chí |
|----|----------|
| C1 | Model `Order` không `agreementId` / `poNumber` / `contractRef` |
| C2 | Có `CommercialAgreement` + `CommercialAgreementOrder` |
| C3 | `Payment` không `agreementId` |
| C4 | Storefront account không import agreements |
| C5 | `OrderStatus` không thêm state HĐ |
| C6 | API gắn đơn dùng join, không `order.update` |
| C7 | Live: tạo HĐ + gắn Order, `Order.status` không đổi |

## Alternatives rejected

| Phương án | Lý do |
|-----------|--------|
| `Order.agreementId` | Đụng Core Order |
| HĐ thay Order / Payment theo HĐ | Principle 5–6 |
| Share portal theo HĐ | Access chỉ membership ACTIVE (ADR-008) |
