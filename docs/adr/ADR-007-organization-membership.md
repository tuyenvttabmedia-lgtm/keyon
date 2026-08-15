# ADR-007 — Organization + Membership (B3.1)

**Status:** Accepted (implement B3.1)  
**Date:** 2026-08-15  
**Does not amend:** ADR-002 License Pool · ADR-003 Inventory · ADR-004 Payment · ADR-005 Fulfillment · ADR-006 IA  
**Spec:** `docs/B2B-PHASE-B.md`

## Context

B2B cần nhiều người thuộc một doanh nghiệp. `QuoteRequest.companyName` và email domain chỉ là **lead / gợi ý tìm Admin** — không phải quan hệ pháp lý và **không** được dùng cho authorization.

Customer portal hiện chỉ đọc Order theo `userId` / email tài khoản (đúng). Mở “cùng công ty xem đơn” trước khi có Org sẽ lẫn identity với heuristic.

## Decision

### B3.1 (này)

1. Bảng mới `Organization` và `OrganizationMembership`. Không sửa Order, Payment, Fulfillment, Pool, Product, Variant.
2. Membership do **staff gán tay** (email đã có User CUSTOMER). Không auto-join từ domain. Không tạo User khi gán.
3. `QuoteRequest` **không** có `organizationId`.
4. Portal **không** đổi scope Order/license. Membership chưa cấp quyền xem chéo.
5. Role membership: `OWNER` | `MEMBER`. Status: `INVITED` | `ACTIVE` | `DISABLED`. B3.1 staff gán → `ACTIVE` (INVITED dành bước invite sau).

### B3.2 (cấm trong PR này)

`Order.organizationId`, đọc Order/license theo org → **dừng**, ADR riêng trước migrate.

## Schema (additive)

```
Organization(id, name, taxId?, note?, createdAt, updatedAt)
OrganizationMembership(id, organizationId, userId, role, status, createdAt, updatedAt)
  @@unique([organizationId, userId])
```

## Consequences

**Được:** Nền ủy quyền thật, tách khỏi heuristic B2.  
**Mất:** Ops phải tạo org/gán member thủ công. Chưa có shared cart/orders.

## Exit criteria (O1–O6)

| ID | Tiêu chí |
|----|----------|
| O1 | Schema có Organization + Membership; **Order không** `organizationId` |
| O2 | `/account/orders` where chỉ `userId` / `email` tài khoản |
| O3 | `company-order-filter` không dùng cho storefront auth |
| O4 | Admin tạo org (live DB) |
| O5 | Gán member không đụng hàng Order |
| O6 | QuoteRequest không có `organizationId` |

## Alternatives rejected

| Phương án | Lý do |
|-----------|--------|
| Suy org từ email domain | Lộ dữ liệu; Gmail; không phải DN đã xác minh |
| `organizationId` trên QuoteRequest | Lead ≠ Org |
| Gắn Order.organizationId trong B3.1 | Đụng Core Order + access trước khi membership ổn |
