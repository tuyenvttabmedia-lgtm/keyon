# KEYON — Internal Test (Pilot Ready Gate)

**Status:** ✅ APPROVED · ALL IT1–IT8 PASS · **Pilot Ready** · Evidence: `npm run test:internal`  
**Next:** [`PILOT.md`](./PILOT.md)  
**Audience:** Founder / Tech Lead  
**Related:** [`OPS-SPRINTS.md`](./OPS-SPRINTS.md) · [`ARCHITECTURE-FREEZE.md`](./ARCHITECTURE-FREEZE.md)

> Quality Gate cuối trước Pilot. **Không viết suite mới thay thế domain tests** — gom pipeline đã có + một E2E đồng bộ.

---

## 1. Mục tiêu

Nếu **IT1–IT8 PASS** → KEYON đạt **Pilot Ready**.

Pilot sau đó **không** kiểm tra code lại — kiểm tra vận hành, user thật, SLA, support, reconciliation.

---

## 2. Pipeline (gom, không redesign)

```
Foundation ✅
License Pool ✅
Inventory ✅
Monitoring ✅
Dashboard ✅
Backup ✅
Payment ✅
        ↓
Internal Test Pipeline (IT1–IT8)
        ↓
Pilot Ready
```

| Stage | Command (đã có) |
|-------|-----------------|
| License Pool | `npm run test:license-pool` |
| Inventory | `npm run test:inventory` |
| Payment | `npm run test:sepay` |
| Monitoring | `npm run test:monitoring` |
| Dashboard | `npm run test:dashboard` |
| Backup | `npm run test:backup` |
| E2E flow | trong `npm run test:internal` (IT7) |

Canonical:

```bash
cd web && npm run test:internal
```

---

## 3. Exit Criteria IT1–IT8

| ID | Điều kiện |
|----|-----------|
| **IT1** | License Pool E1–E9 PASS |
| **IT2** | Inventory I1–I6 PASS |
| **IT3** | Payment P1–P10 PASS |
| **IT4** | Monitoring M1–M7 PASS |
| **IT5** | Dashboard D1–D6 PASS |
| **IT6** | Backup B1–B5 PASS |
| **IT7** | End-to-end order flow PASS: Order → Payment → Fulfillment → Delivery → Resend/Replace |
| **IT8** | Toàn bộ pipeline PASS — **không** có test FAIL |

Chỉ 8 điều này. Không mở rộng KPI / analytics / test framework mới.

---

## 4. IT7 — E2E flow (bắt buộc)

```
Order (checkout + Instant reserve)
  ↓
Payment succeeded
  ↓
Fulfillment
  ↓
Delivery tồn tại
  ↓
Resend (resendCount++)
  ↓
Replace (delivery mới, bản cũ giữ)
  ↓
PASS
```

Không đổi Core Stable. Chỉ chứng minh các domain **đồng bộ** trên một đơn.

---

## 5. Sau Internal Test

```
Internal Test → Pilot → Pax8 (1 Supplier → 1 Product → 1 SKU → Provision → Complete)
```

Không Amendment ADR vì Internal Test. Không đổi Core nếu không có bằng chứng từ Pilot.
