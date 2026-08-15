# ADR-008 — Org-scoped Order & license read (B3.2)

**Status:** Accepted (implement B3.2)  
**Date:** 2026-08-15  
**Depends on:** [ADR-007](./ADR-007-organization-membership.md)  
**Does not amend:** ADR-002 Pool · ADR-003 Inventory · ADR-004 Payment · ADR-005 Fulfillment (state machines)  
**Spec:** `docs/B2B-PHASE-B.md`

## Context

B3.1 có Organization + Membership nhưng portal vẫn chỉ đọc Order/license của chính account. Cần nhiều user cùng DN xem đơn và license **sau khi staff gán membership**.

Gắn `Order.organizationId` sẽ đụng schema Core Order. Heuristic email domain đã bị cấm cho authorization (ADR-007 / Phase B).

## Decision

1. **Không** thêm `organizationId` trên Order / QuoteRequest / Delivery. Không đổi `OrderStatus` / Payment / Pool.
2. **Read authorization** (portal + customer APIs):
   - Luôn: `order.userId = session.id` OR `order.email` khớp session (không phân biệt hoa thường).
   - Thêm: Order thuộc **userId hoặc email** của mọi membership **ACTIVE** cùng org với session (cũng ACTIVE).
3. **Cấm:** email domain, `QuoteRequest.companyName`, membership INVITED/DISABLED.
4. Phạm vi: `/account`, `/account/orders`, chi tiết đơn, `/account/assets`, chi tiết license, `POST /api/deliveries/resend`. Tickets / notifications / profile PII **không** share.
5. Staff Admin không đổi (vẫn full). Role OWNER vs MEMBER: **cùng quyền đọc** ở B3.2.
6. Pin đơn độc lập người mua = **B3.3** qua join `OrganizationOrder` ([ADR-011](./ADR-011-org-order-pin.md)) — **không** cột `Order.organizationId`.

## Schema / migration

Không. Chỉ query Membership + User.

## State

Không. Không thêm Order state.

## API

Customer list/detail/resend dùng `customerOrderWhere` / `customerCanAccessOrder`. Không API khách tạo org.

## Exit criteria (A1–A7)

| ID | Tiêu chí |
|----|----------|
| A1 | Order schema vẫn không `organizationId` |
| A2 | Helper đọc Membership `ACTIVE` — không `company-order-filter` |
| A3 | `/account/orders` dùng helper |
| A4 | Chi tiết đơn dùng helper |
| A5 | Assets + chi tiết license dùng helper |
| A6 | Resend API dùng helper |
| A7 | Tickets không dùng org peer where |

## Alternatives rejected

| Phương án | Lý do |
|-----------|--------|
| `Order.organizationId` ngay | Đụng Core Order trước khi chứng minh cần pin đơn |
| Share theo email domain | ADR-007 / principle 2 |
| Share tickets/notifications | Ngoài phạm vi đơn/license |
