# ADR-003 — Inventory Read Model

**Status:** Accepted · Exit **I1–I6 PASS**  
**Date:** 2026-07-21  
**Chi tiết:** `docs/INVENTORY-READ-MODEL-v1.md`

## Context

Ops cần nhìn available / reserved / low stock theo SKU. Nếu tạo bảng `stock_quantity` / `remaining` song song Pool sẽ có **hai nguồn sự thật** và lệch dữ liệu khi race/webhook.

## Decision

**Inventory Read Model** — chỉ đọc, không sở hữu tồn kho:

```
License Pool (source of truth)
        → Inventory Read Model
                → Dashboard / Admin UI
```

- Aggregates từ `LicensePoolService.metrics()` (+ recent events qua Pool API).
- **Cấm** cột `stock_quantity` / `remaining_quantity` / `sold_quantity`.
- Low stock: `Variant.lowStockThreshold` → `OK` | `LOW_STOCK` | `OUT_OF_STOCK`.
- Dashboard **không** `prisma.licenseItem` trực tiếp.

## Consequences

**Được:** Một truth · đổi backend metrics (Redis/MV) sau không buộc sửa Dashboard · hỗ trợ sự cố qua `/admin/inventory/:sku`.

**Mất:** Mỗi list SKU = N lần metrics (chấp nhận Phase A; tối ưu sau nếu Pilot chậm — I6 đã <200ms seed).

**Không làm Phase A:** AI forecast · reorder engine.

## Alternatives

| Phương án | Lý do không chọn |
|-----------|------------------|
| Bảng inventory ghi số lượng | Second source of truth |
| Dashboard query `LicenseItem` trực tiếp | Khó thay storage metrics; leak domain |
| Materialized view ngay ngày 1 | Premature; Read Model đủ Pilot |
| Hard-code threshold = 10 trong code | Không linh hoạt theo SKU |
