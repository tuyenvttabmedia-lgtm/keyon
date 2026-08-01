# Sprint 1.5 — Production Readiness

**Status:** Planned · thứ tự chốt lại 2026-07-21  
**Trước đó:** Sprint 1 Phase A Ops  
**Không làm trong sprint này:** Pax8 API · Phase B đầy đủ · Partner · Managed Subscription  

## Vì sao có sprint này

Phase A đã mua–giao được trên localhost. **Chưa đủ** để mở khách thật.  
**Không** nhảy Pax8. **Không** gắn SePay thật trước khi kho key an toàn.

```
Phase A MVP ✅
    → Sprint 1.5 (thứ tự bên dưới)
    → Internal Test (25–30 case) ← gate cuối sprint
    → Pilot (khách thật)
    → Pax8 1 SKU (Sprint 2)
    → Phase B
```

---

## Goal

Phase A đủ ổn định để **pilot**: kho không bán trùng · tiền vào đúng · ops thấy sức khỏe hệ thống · backup/restore đã verify · runbook sự cố dùng được.

---

## Thứ tự thực hiện (bắt buộc)

```
1. License Pool          ← trái tim KEYON
2. Inventory Read Model
3. SePay thật
4. Monitoring (+ error tracking)
5. Ops Dashboard (+ notifications)
6. Backup / Restore / Verify
7. Internal Test (25–30 case) → Pilot gate
```

**Lý do Pool trước SePay:** khi webhook báo Paid, hệ thống phải đã biết `Reserve → Consume → Delivery → Audit`. Nếu Pool chưa vững, SePay thật dễ trừ kho sai / giao trùng / khóa key treo.

Security hardening (CSP, headers, rate limit, secret rotation doc) làm **song song / cuối** từng bước liên quan — không đổi thứ tự 1→7.

---

## Checklist theo bước

| # | Hạng mục | Done khi |
|---|----------|----------|
| **1** | **License Pool** | ✅ E1–E9 PASS (`npm run test:license-pool`) |
| **2** | **Inventory Read Model** | ✅ I1–I6 PASS (`npm run test:inventory`) — chỉ đọc Pool |
| **3** | **SePay Production** | ✅ P1–P10 PASS (`npm run test:sepay`) |
| **4** | **Monitoring** | Health: DB · Redis · Queue · Disk · Worker · Webhook errors · (+ Sentry/BetterStack) |
| **5** | **Dashboard** | Orders Today · Revenue · Pending · Manual/Instant Queue · License Remaining · Worker Status · Webhook Errors · Payment Success Rate · Notification Center |
| **6** | **Backup** | Dump → Restore → Verify (script + chạy thử ≥1 lần) |
| **7** | **Internal Test** | ~25–30 case xanh (bảng dưới) → mới Pilot |

Song song tài liệu: `OPERATIONS.md` (hướng dẫn) · `RUNBOOK.md` (xử lý sự cố).

---

## 1. License Pool (trái tim)

**Đặc tả chốt:** [`LICENSE-POOL-v1.md`](./LICENSE-POOL-v1.md) — đọc trước khi code.

Tóm tắt (**4** status — **không** EXPIRED durable):

```
AVAILABLE → RESERVED → CONSUMED
                 ├─ TTL/cancel → AVAILABLE + LicenseReleased(reason) + ttl_release_count++
AVAILABLE → DISABLED
```

- Owner + **`reservation_token`** + **`version`** (optimistic lock)  
- TTL: `LICENSE_RESERVE_TTL` · consume atomic + khớp token  
- API: `reserve(qty)` · `consume` · `release` · `disable` — không biết Payment  
- Events: Reserved / Consumed / Released / Disabled (**không** LicenseExpired)  
- Exit Pool: E1–E9 trong spec  

---

## 2. Inventory Read Model

**Đặc tả:** [`INVENTORY-READ-MODEL-v1.md`](./INVENTORY-READ-MODEL-v1.md)

```
Pool.metrics() → Inventory Read Model → Dashboard
```

- Không bảng stock / không `stock_quantity`  
- Low stock per `Variant.lowStockThreshold`  
- Exit I1–I6  

---

## 3. SePay Production

**Freeze trước code:** [`PAYMENT-ARCHITECTURE-v1.md`](./PAYMENT-ARCHITECTURE-v1.md) · ADR: [`adr/ADR-004-payment-domain.md`](./adr/ADR-004-payment-domain.md)  
**Checklist:** [`SEPAY-PRODUCTION.md`](./SEPAY-PRODUCTION.md)

```
Webhook → Payment Domain → Fulfillment → Pool.consume
```

- State: PENDING_PAYMENT → PROCESSING → PAID | FAILED | EXPIRED | CANCELLED  
- Idempotency 3 lớp: `provider_event_id` · `payment_reference` · delivery exists  
- Exit **P1–P10** bắt buộc  

---

## 4. Monitoring (+ error tracking)

Theo dõi sau khi có payment thật: Webhook · Worker · Redis · DB · Queue depth · Disk · Worker heartbeat.  
Error tracking: Sentry **hoặc** BetterStack (`SENTRY_DSN` / tương đương — tắt khi trống).

---

## 5. Dashboard (đúng nghĩa ops)

Không chỉ doanh thu — tối thiểu:

- Orders Today · Revenue · Pending  
- Manual Queue · Instant Queue  
- License Remaining (aggregate)  
- Worker Status · Webhook Errors · Payment Success Rate  
- Notification Center: Low Stock · Fulfill Failed · Webhook Failed · Payment Retry · Worker Down  

---

## 6. Backup

```
Backup → Restore → Verify
```

Scripts `scripts/backup-postgres.*` · `restore-postgres.*` · `test-restore.*` · output `backups/` (gitignore).  
Làm **trước Pilot** — không chờ Production.

---

## 7. Internal Test (~25–30 case) — Pilot gate

### Payment
- [ ] QR đúng  
- [ ] QR hết hạn  
- [ ] Webhook trùng  
- [ ] Webhook chậm  
- [ ] Webhook sai chữ ký  

### Fulfillment
- [ ] Instant happy path  
- [ ] Manual happy path  
- [ ] Hết key  
- [ ] Resend  
- [ ] Replace  
- [ ] Cancel (PENDING_PAYMENT + Release reserve)  

### License Pool
- [ ] Reserve / Release / Consume  
- [ ] Concurrent reserve (1 key → 1 thắng) — E1  
- [ ] TTL → AVAILABLE + reason ttl_expired — E2  
- [ ] Duplicate payment/webhook — E3  
- [ ] Cancel → release — E4  
- [ ] Chặn release CONSUMED / consume không RESERVED / reserve DISABLED — E5–E8  
- [ ] Token mismatch reject — E7  
- [ ] Không mất tích (4 status) — E9  

### Worker
- [ ] Restart worker  
- [ ] Retry job  
- [ ] Queue delay  
- [ ] Email fail (không làm hỏng money/fulfill path)  

*(Bổ sung case khi implement — mục tiêu 25–30.)*

**Vượt toàn bộ mới Pilot.**

---

## Out of scope

- Pax8 / Semi-Automated live  
- Managed Subscription · Partner · CMS sâu · multi-gateway  

---

## Exit criteria

- [ ] Pool: reserve/consume/release + concurrent + duplicate webhook  
- [ ] Inventory usable (🟢🟡🔴)  
- [ ] SePay E2E + reconcile + audit  
- [ ] Monitoring + error tracker nhận lỗi giả  
- [ ] Dashboard + notifications ops dùng được  
- [ ] Backup → Restore → Verify ≥1 lần  
- [ ] Internal test suite xanh  
- [ ] `OPERATIONS.md` + `RUNBOOK.md` đủ cho người trực  

---

## Tài liệu liên quan

| File | Vai trò |
|------|---------|
| `docs/LICENSE-POOL-v1.md` | Đặc tả Pool chốt |
| `docs/OPERATIONS.md` | Hướng dẫn vận hành thường ngày |
| `docs/RUNBOOK.md` | Xử lý sự cố (on-call) |
| `docs/KEYON - Ke hoach trien khai.md` | Roadmap |
| `docs/SPRINT-1-phase-a-ops.md` | Sprint trước |
