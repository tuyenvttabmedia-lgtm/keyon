# Ops Sprints — Exit Criteria (post SePay)

**Roadmap (không đổi):**

```
Monitoring → Dashboard → Backup → Internal Test → Pilot → Pax8 (1 SKU)
```

**Review checklist mỗi Sprint:** ADR? Exit PASS? Core Stable? Domain change? Evidence?

---

## 1. Monitoring ✅

**ALL PASS** — `npm run test:monitoring` · chi tiết `docs/MONITORING.md`

---

## 2. Dashboard ✅

**ALL PASS** — `npm run test:dashboard` · `docs/DASHBOARD.md`

Consumer: Inventory Read Model + Monitoring (payment/queue/ops). Không Prisma Domain trên page.

---

## 3. Backup ✅

**ALL PASS** — `npm run test:backup` · [`BACKUP.md`](./BACKUP.md)

3 phần: Postgres dump · Wasabi config verify (không object) · ENV template. Restore vào Empty DB + counts + checksum.

---

## 4. Internal Test ✅

**ALL PASS — Pilot Ready** — `npm run test:internal` · [`INTERNAL-TEST.md`](./INTERNAL-TEST.md)

| ID | Suite |
|----|-------|
| IT1 | License Pool E1–E9 |
| IT2 | Inventory I1–I6 |
| IT3 | Payment P1–P10 |
| IT4 | Monitoring M1–M7 |
| IT5 | Dashboard D1–D6 |
| IT6 | Backup B1–B5 |
| IT7 | E2E Order→Payment→Fulfillment→Delivery→Resend/Replace |
| IT8 | Toàn bộ PASS |

---

## 5. Pilot ▶ IN PROGRESS (Operations)

Spec: [`PILOT.md`](./PILOT.md) · Evidence ops: `npm run pilot:snapshot`

PL1–PL5 ghi nhận trong kỳ Pilot (không exit suite code).  
Không Storefront redesign · không đổi Core Stable.

```
Pilot (đang chạy) → Pilot Review (PL1–PL5) → Pax8 HTTP live (nếu cần)
```

Pax8 **stub** (X1–X8) đã sẵn — Outer Layer; bật HTTP sau Pilot Review.

---

## 6. Pax8 (Sprint 2) ✅

**ALL PASS** — `npm run test:pax8` · [`PAX8-1SKU.md`](./PAX8-1SKU.md)

1 Supplier → 1 Product → 1 SKU → Provision (stub) → Delivery → Complete.  
`PAX8_DRIVER=stub` · HTTP live chưa bật.
