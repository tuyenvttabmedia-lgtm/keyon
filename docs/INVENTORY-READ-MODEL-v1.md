# Inventory Read Model v1.0

**Status:** Implementing · **I1–I6 ALL PASS** (2026-07-21)  
**Không phải** nguồn sự thật tồn kho — **chỉ đọc** từ License Pool.

```
License Pool (source of truth)
        │
        ▼
Inventory Read Model   ← không update / reserve / consume / không bảng stock
        │
        ▼
Dashboard / Admin UI
```

## Cấm tuyệt đối

| ❌ Không có | Lý do |
|-------------|--------|
| `stock_quantity` / `remaining_quantity` / `sold_quantity` | Second source of truth |
| UPDATE/INSERT license từ Inventory | Chỉ Pool |
| Forecast / reorder AI | Phase B/C |
| Dashboard `prisma.licenseItem` trực tiếp | Phải qua Read Model |

## API

### `GET /api/inventory` (staff)

```json
{
  "sku": "WIN11-PRO-RET",
  "available": 97,
  "reserved": 2,
  "consumed": 201,
  "disabled": 1,
  "ttl_release_today": 3,
  "stock_status": "OK" | "LOW_STOCK" | "OUT_OF_STOCK",
  "low_stock_threshold": 10
}
```

Toàn bộ count từ `LicensePoolService.metrics(variantId)` (+ TTL hôm nay từ `LicenseEvent`).

### `GET /api/admin/inventory/:sku`

Available / Reserved / Consumed / Disabled + recent Reserved / Released / Consumed events (qua Pool).

### Health (trong inventory + `/api/health`)

- `inventory_healthy`
- `last_refresh`
- `metrics_version`
- `pool_version`

## Low Stock (per Variant)

Field: `ProductVariant.lowStockThreshold` (không hard-code).

```
available == 0     → OUT_OF_STOCK
available < thr    → LOW_STOCK
else               → OK
```

## Exit I1–I6

| ID | Điều kiện |
|----|-----------|
| I1 | Metrics khớp Pool (count status) |
| I2 | Không bảng stock riêng (schema check) |
| I3 | Low Stock / OUT_OF_STOCK đúng threshold |
| I4 | Dashboard số liệu từ Inventory Read Model |
| I5 | Dashboard không `licenseItem` trực tiếp |
| I6 | `GET /api/inventory` < 200ms với seed |

```bash
cd web && npm run test:inventory
```

**Sau ALL PASS → SePay thật.**
