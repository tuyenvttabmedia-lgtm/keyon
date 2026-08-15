# ADR-011 — Pin Order to Organization (B3.3)

**Status:** Accepted (implement B3.3 via join)  
**Date:** 2026-08-16  
**Depends on:** [ADR-007](./ADR-007-organization-membership.md) · [ADR-008](./ADR-008-org-order-access.md)  
**Does not amend:** ADR-002…005 (state machines)

## Context

B3.2 chia sẻ đơn theo **người mua** (userId/email của membership ACTIVE). Cần gắn đơn vào org **độc lập người mua** (guest checkout, nhân viên cũ, đơn kế toán chỉ định).

`Order.organizationId` đụng Core Order (ADR-007/008 đã cấm).

## Decision

1. **Không** cột `organizationId` trên Order / QuoteRequest.
2. Join `OrganizationOrder` (`organizationId`, `orderId`). Unique cặp. Cascade khi xóa org hoặc Order — không xóa bên kia ngoài join.
3. Staff Admin gắn/gỡ theo mã đơn. Không auto-pin từ email domain / quote companyName.
4. Portal đọc (cùng phạm vi ADR-008): thêm Order có join tới org mà session là membership **ACTIVE**. INVITED/DISABLED không.
5. OWNER và MEMBER cùng quyền đọc pinned. Tickets / notifications / profile không đổi.
6. Không đổi `OrderStatus`. Checkout không tự pin.

## Schema / migration

Additive. Không ALTER cột `Order`.

## Exit criteria (P1–P6)

| ID | Tiêu chí |
|----|----------|
| P1 | Order schema không `organizationId` |
| P2 | Có `OrganizationOrder` |
| P3 | Helper where gồm `organizationLinks` khi actor ACTIVE |
| P4 | API pin dùng join, không `order.update` |
| P5 | Storefront tickets không pin |
| P6 | Live pin + unpin không đổi `Order.status` |

## Alternatives rejected

| Phương án | Lý do |
|-----------|--------|
| `Order.organizationId` | Đụng Core |
| Auto-pin theo domain | ADR-007 |
| Pin = thay membership | Hai trục khác nhau |
