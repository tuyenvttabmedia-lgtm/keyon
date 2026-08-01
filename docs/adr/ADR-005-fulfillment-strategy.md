# ADR-005 — Fulfillment Strategy

**Status:** Accepted  
**Date:** 2026-07-21  
**Chi tiết:** `docs/KEYON - Ke hoach trien khai.md` § Fulfillment Strategy

## Context

KEYON bán nhiều loại deliverable (key, account, portal…) và nhiều cách giao (kho nội bộ, inbox người, API distributor). Gộp hết thành “một nút mua → nhận key” sẽ sai với Pax8/subscription và phá UX/SLA.

## Decision

Tách trục trên **Variant**:

| Trục | Ví dụ |
|------|--------|
| `fulfillment_strategy` | `manual` · `instant` · `semi_automated` · `managed_subscription` |
| `deliverable_type` | `key` · `account` · `subscription` · `digital_file` · `external_portal` |
| `license_model` / `sales_motion` | perpetual… / self_serve · quote_required |

Phase A vận hành: **Manual** + **Instant** (Instant qua License Pool).  
Semi-Automated (Pax8) chỉ sau Pilot, **1 SKU**.  
Fulfillment orchestration gọi Pool — không phải Payment.

Strategy pattern trong code: registry Instant / Manual / Semi / Managed.

## Consequences

**Được:** Inbox đúng cột · PDP không hứa “nhận key” sai type · Phase B gắn Distributor không đập Phase A · PAID ≠ COMPLETED rõ ràng.

**Mất:** Nhiều enum/field lúc catalog; staff phải hiểu strategy; Semi/MS chưa ship sớm.

## Alternatives

| Phương án | Lý do không chọn |
|-----------|------------------|
| Mọi SP = Instant key | Sai account/portal/Pax8 |
| Instant gọi thẳng Pax8 | Phụ thuộc NCC ngày 1; timeout/retry phức tạp |
| Fulfill trong Payment webhook | Trộn money + delivery (xem ADR-004) |
| Một “status đơn” gộp tiền + giao | Không audit được pay OK / giao fail |
