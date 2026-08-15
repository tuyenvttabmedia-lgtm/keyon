# ADR-009 — Commercial PO / HĐ reference on Order (B4.1)

**Status:** Accepted (implement B4.1 via OrderNote)  
**Date:** 2026-08-15  
**Depends on:** [Phase B](../B2B-PHASE-B.md)  
**Does not amend:** ADR-002 Pool · ADR-003 Inventory · ADR-004 Payment · ADR-005 Fulfillment (state machines) · ADR-007/008 Org

## Context

Ops cần số PO / HĐ trên **một** Order. Gắn `poNumber` / `contractRef` / `agreementId` lên bảng Order đụng Core Stable. `CommercialAgreement` chỉ khi một khung liên kết **nhiều** Order hoặc có lifecycle riêng (B4.2, Trigger B — chưa có).

Phase B cho phép tạm: staff `OrderNote` — Outer, không schema Order.

## Decision

1. **Không** thêm cột trên `Order` (`poNumber`, `contractRef`, `agreementId`). Không đổi `OrderStatus`.
2. **Không** bảng `CommercialAgreement` trong B4.1.
3. Staff ghi tham chiếu qua `OrderNote` với marker `[KEYON-COMMERCIAL]`. Note mới = giá trị hiện tại; lịch sử giữ nguyên (append-only).
4. API chỉ Admin (`POST /api/admin/orders/commercial-ref`). Không API khách, không “ký HĐ”, không Payment theo HĐ.
5. Portal khách **không** đọc/ghi commercial ref.
6. Cột trên Order = B4.1b, **sau ADR + migrate** nếu Pilot cần query/index cứng. B4.2 khi đủ Trigger B.

## Schema / migration

Không.

## State

Không. PAID / COMPLETED giữ ADR-004/005.

## Exit criteria (R1–R6)

| ID | Tiêu chí |
|----|----------|
| R1 | Order schema không `poNumber` / `contractRef` / `agreementId` |
| R2 | Helper format/parse roundtrip; marker cố định |
| R3 | API Admin tạo `OrderNote`, không `order.update` |
| R4 | Storefront account không import commercial-ref |
| R5 | `OrderStatus` enum không thêm state HĐ |
| R6 | Ghi/đọc ref trên OrderNote (live DB) không đổi `Order.status` |

## Alternatives rejected

| Phương án | Lý do |
|-----------|--------|
| Cột Order ngay | Đụng Core trước khi chứng minh cần index |
| CommercialAgreement ngay | Chưa Trigger B (nhiều Order / term riêng) |
| HĐ thay Order / Payment | Principle 5–6 Phase B |
