# License Pool v1.0 — Đặc tả chốt

**Status:** Chốt thiết kế 2026-07-21 · **Implement LP-1…LP-7 ✅ · E1–E9 ALL PASS** (2026-07-21)  
**Phạm vi:** Instant stock (key/account encrypted). Manual không đi Pool trừ khi sau này nhập kho.

---

## 1. Nguyên tắc kiến trúc

| # | Nguyên tắc |
|---|------------|
| 1 | Pool **không biết Payment** (không SePay / PayOS / Pax8) |
| 2 | Chỉ API: `reserve` · `consume` · `release` · `disable` (+ `metrics`) |
| 3 | Orchestration (Checkout / Fulfillment) gọi Pool |
| 4 | **Không bao giờ DELETE** license item — chỉ `AVAILABLE → DISABLED` |
| 5 | Consume **atomic** (một DB transaction) |
| 6 | Idempotency: order đã có delivery / đã consume → ignore |
| 7 | `reserve(quantity)` từ đầu (batch-ready) |
| 8 | Domain event — subscriber sau, không sửa Pool |
| 9 | **Không** có status `EXPIRED` durable — TTL chỉ là **event/reason** |
| 10 | Consume phải khớp **`reservation_token`** |
| 11 | **Optimistic lock** (`version`) chống race reserve/consume |

```
Payment → Fulfillment (orchestration) → License Pool
```

---

## 2. State machine (đúng 4 trạng thái)

```
AVAILABLE
     │
     ▼
RESERVED
  ├──────────────▶ CONSUMED
  │
  ├── TTL ───────▶ AVAILABLE
  │                + LicenseReleased(reason=ttl_expired)
  │                + metric.ttl_release_count++  (alias: expired_count)
  │
  └── Cancel ────▶ AVAILABLE
                   + LicenseReleased(reason=order_cancelled)

AVAILABLE ───────▶ DISABLED
```

| Status | Ý nghĩa | Bán lại? |
|--------|---------|----------|
| **AVAILABLE** | Sẵn sàng bán | Có |
| **RESERVED** | Giữ cho đúng 1 order (+ token) | Không |
| **CONSUMED** | Đã giao khách | **Không bao giờ** |
| **DISABLED** | Lỗi / thu hồi | Không |

### Vì sao không có status EXPIRED

Nếu `RESERVED → EXPIRED → AVAILABLE` sẽ phát sinh: job chuyển trạng thái, dashboard/query tồn kho phải loại EXPIRED, metrics tính hai lần, nguy cơ key **kẹt** EXPIRED khi worker lỗi.

**TTL là sự kiện, không phải trạng thái nghiệp vụ lâu dài.**  
Lưu dấu vết bằng event/audit:

```
10:05  LicenseReserved
10:20  LicenseReleased  reason=ttl_expired
```

**Cấm:** `CONSUMED → release` · `DELETE` · `CONSUMED → AVAILABLE` · status `EXPIRED`.

Map schema cũ Phase A: `DELIVERED` → `CONSUMED` · `REVOKED` → `DISABLED`.

---

## 3. License Item — fields

### 3.1 Khi RESERVED (owner bắt buộc)

| Field | Ý nghĩa |
|-------|---------|
| `status` | `RESERVED` |
| `reserved_order_id` | Order đang giữ |
| `reserved_order_item_id` | Dòng hàng |
| `reserved_at` | Thời điểm reserve |
| `expires_at` | `reserved_at + LICENSE_RESERVE_TTL` |
| **`reservation_token`** | Token một lần cho lần giữ này (cuid/uuid) |
| `version` | Optimistic lock (increment mỗi update thành công) |

### 3.2 Khác

| Field | Khi |
|-------|-----|
| `consumed_at` | CONSUMED |
| `disabled_at` / `disabled_reason` | DISABLED |
| `payloadEnc` | Luôn có — không xóa |

Ví dụ:

```
License ABCD-XXXX
  status = RESERVED
  reserved_order_id = …
  reservation_token = tok_…
  expires_at = …
  version = 6
```

### 3.3 `reservation_token`

Sinh mới mỗi lần `reserve` thành công. Clear khi `release` / `consume`.

```
Webhook trễ / retry:
  consume({ orderItemId, reservation_token })
    → token mismatch (key đã release rồi reserve cho đơn khác)
    → Reject
```

Orchestration **phải** lưu token lúc reserve (trên OrderItem / FulfillmentJob / bảng reservation) và truyền lại lúc consume.

### 3.4 Optimistic lock (`version`)

```sql
UPDATE "StockUnit"
SET status = 'RESERVED', version = version + 1, …
WHERE id = $id AND status = 'AVAILABLE' AND version = $expected
```

0 row updated → thua race (worker khác đã lấy). Chỉ một giao dịch thắng khi 2 khách tranh 1 key.

Prisma: field `version Int @default(0)` + kiểm tra `count` sau update; hoặc `$executeRaw` có điều kiện.

---

## 4. TTL

```env
LICENSE_RESERVE_TTL=15m
```

Parse ENV — **không hard-code**.  
Job: `status=RESERVED AND expires_at < now()` → `release(..., reason=ttl_expired)`.

---

## 5. API bề mặt

```ts
reserve({ variantId, orderId, orderItemId, quantity }): {
  licenses: { id, reservationToken }[]
}

consume({
  orderId,
  orderItemId,
  reservationToken,   // bắt buộc (hoặc mảng token nếu qty>1)
}): ConsumedLicense[]   // idempotent nếu đã CONSUMED đúng order

release({
  orderId,
  orderItemId?,
  reason: "ttl_expired" | "order_cancelled" | "payment_failed" | string
}): void                // chỉ RESERVED của order đó

disable({ licenseId, reason, actorId }): void

metrics({ variantId? }): PoolMetrics
```

### 5.1 `reserve(quantity)`

- Chọn AVAILABLE với lock (`FOR UPDATE SKIP LOCKED` **và/hoặc** version check).  
- All-or-nothing nếu không đủ `quantity`.  
- Gán owner + `reservation_token` mới + `expires_at` + `version++`.  
- Idempotent theo `orderItemId`: đã RESERVED/CONSUMED cho item → trả existing, **không** giữ thêm.  
- Emit `LicenseReserved`.

### 5.2 `consume` — atomic + token

```
BEGIN
  -- units must be RESERVED for this orderItem
  -- AND reservation_token matches (per unit)
  UPDATE … → CONSUMED, clear token, version++
  CREATE Delivery …
  WRITE Audit …
COMMIT
→ emit LicenseConsumed
```

Fail → **ROLLBACK**.  
Token mismatch / không RESERVED → reject (không silent succeed trừ khi đã CONSUMED đúng order = idempotent hit).

### 5.3 `release`

- Chỉ `RESERVED` + đúng order (và optional item).  
- `CONSUMED` → **reject**.  
- → AVAILABLE, clear owner + token, `version++`.  
- Emit `LicenseReleased` với `reason`.

### 5.4 `disable`

- Từ AVAILABLE (hoặc RESERVED: release logic đơn trước / reject nếu còn order active — v1.0: chỉ disable AVAILABLE, hoặc RESERVED sau khi ops release).  
- **Không DELETE.** Emit `LicenseDisabled`.

---

## 6. Domain events (đúng 4 — không có LicenseExpired)

| Event | Khi |
|-------|-----|
| `LicenseReserved` | reserve OK |
| `LicenseConsumed` | consume commit OK |
| `LicenseReleased` | release / TTL / cancel — **`reason` phân biệt** |
| `LicenseDisabled` | disable |

`reason` cho `LicenseReleased` (tối thiểu):

- `ttl_expired`
- `order_cancelled`
- `payment_failed`

TTL **không** emit event riêng.

---

## 7. Metrics

```ts
{
  available: number      // count status
  reserved: number
  consumed: number
  disabled: number
  ttl_release_count: number   // lifetime / period — từ event hoặc counter table
  // alias dashboard: expired_count ≡ ttl_release_count
}
```

Dashboard: “Hôm nay · TTL Release · 15” = filter event `LicenseReleased` + `reason=ttl_expired` theo ngày (hoặc counter daily).

Invariant: với mỗi variant (và global),

```
available + reserved + consumed + disabled = total rows (không DELETE)
```

Không có row “mất tích” ngoài 4 status.

---

## 8. Luồng orchestration (ngoài Pool)

```
Checkout Instant
  → tokens = Pool.reserve(qty)
  → persist tokens trên order item
  → Payment AWAITING
Payment SUCCEEDED
  → Pool.consume({ reservationToken })
Cancel / pay fail / TTL job
  → Pool.release({ reason })
Key lỗi
  → Pool.disable
```

---

## 9. Exit criteria — Pool “xong” khi chứng minh được

Trước khi sang Inventory / SePay, **bắt buộc** pass:

| # | Kịch bản | Kỳ vọng |
|---|----------|---------|
| E1 | Hai khách cùng mua SKU còn **1** key | Chỉ **một** reserve thành công |
| E2 | TTL hết hạn | Key → AVAILABLE · `LicenseReleased(ttl_expired)` · `ttl_release_count++` |
| E3 | Webhook thanh toán lặp | Không consume lần hai (idempotent) |
| E4 | Hủy đơn khi RESERVED | `release` OK · reason `order_cancelled` |
| E5 | Release key đã CONSUMED | **Reject** |
| E6 | Consume khi không RESERVED (AVAILABLE/DISABLED) | **Reject** |
| E7 | Consume token sai / token cũ sau khi đã release+reserve đơn khác | **Reject** |
| E8 | Reserve key DISABLED | **Reject** / không chọn được |
| E9 | Không key “mất tích” | Mọi row ∈ {AVAILABLE, RESERVED, CONSUMED, DISABLED} · tổng count khớp |

---

## 10. Acceptance implement

- [x] 4 status + migration từ DELIVERED/REVOKED  
- [x] Owner fields + `reservation_token` + `version` + `LICENSE_RESERVE_TTL`  
- [x] API reserve/consume/release/disable + metrics  
- [x] 4 events (Released có reason)  
- [x] Exit criteria E1–E9 — `npm run test:license-pool` **ALL PASS** (2026-07-21)  

**Bước tiếp:** Inventory Dashboard — chỉ đọc `LicensePoolService.metrics()` / count theo status (không bảng stock thứ hai).

---

## 11. Tài liệu liên quan

- Sprint: `SPRINT-1.5-production-readiness.md`  
- Sự cố: `RUNBOOK.md` (cấm DELETE · R4/R9/R10)  

---

*License Pool v1.0 — 4 status · token · version · TTL = event reason.*
