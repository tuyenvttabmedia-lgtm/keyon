# ADR-002 — License Pool

**Status:** Accepted · Exit **E1–E9 PASS**  
**Date:** 2026-07-21  
**Chi tiết:** `docs/LICENSE-POOL-v1.md`

## Context

Bán key Instant thật đòi hỏi không double-sell, không mất key “treo”, và webhook/retry không giao trùng. Trừ kho ad-hoc trong Instant strategy (AVAILABLE → DELIVERED) không đủ khi có thanh toán thật và concurrent checkout.

## Decision

Domain **License Pool** độc lập với Payment:

- Đúng **4** status: `AVAILABLE` · `RESERVED` · `CONSUMED` · `DISABLED` (không EXPIRED durable).
- API: `reserve(qty)` · `consume(token)` · `release(token, reason)` · `disable` · `metrics`.
- Reserve có owner + `reservation_token` + `expires_at` + optimistic `version`.
- TTL/cancel → `AVAILABLE` + event `LicenseReleased(reason)` + metric `ttl_release_count`.
- **Không DELETE** key — chỉ `DISABLED`.
- Pool **không biết** SePay/PayOS/Pax8.

## Consequences

**Được:** Concurrent an toàn · idempotent consume · audit/event rõ · Inventory chỉ đọc metrics · sẵn batch `quantity`.

**Mất:** Checkout/fulfill phải wire reserve/consume đúng chỗ; thêm TTL worker; phức tạp hơn “trừ kho một dòng”.

## Alternatives

| Phương án | Lý do không chọn |
|-----------|------------------|
| Trừ kho lúc Instant fulfill không reserve | Race 2 khách 1 key; CK chậm giữ kho kém |
| Status `EXPIRED` durable | Job chuyển trạng thái · nguy cơ kẹt · query tồn kho phức tạp |
| Pool gọi từ webhook Payment | Phá tách domain; khó đổi cổng / retry |
| Xóa row khi key lỗi | Mất audit trail |
