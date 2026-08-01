# Payment Architecture v1.0 — Đóng băng

**Status:** FROZEN 2026-07-21 — **đọc trước khi code SePay Production**  
**Scope Sprint:** SePay Production (sau Inventory Read Model ✅)  
**Không làm:** Pax8 · multi-gateway song song · refund sâu · auto-refund

---

## 1. State machine (Payment Domain)

Chỉ các trạng thái sau — **không thêm** nếu chưa có nhu cầu nghiệp vụ rõ:

```
PENDING_PAYMENT
        │
        ▼
PAYMENT_PROCESSING
        │
        ├──────────────► PAID
        │
        ├──────────────► PAYMENT_FAILED
        │
        ├──────────────► PAYMENT_EXPIRED
        │
        └──────────────► PAYMENT_CANCELLED
```

| Domain state | Ý nghĩa |
|--------------|---------|
| `PENDING_PAYMENT` | Đơn/phiên thanh toán đã tạo, chưa vào cổng |
| `PAYMENT_PROCESSING` | Đã tạo QR / chờ webhook / đang xử lý tiền |
| `PAID` | Tiền OK (idempotent) |
| `PAYMENT_FAILED` | Thanh toán thất bại |
| `PAYMENT_EXPIRED` | Hết hạn QR / TTL thanh toán |
| `PAYMENT_CANCELLED` | Hủy bởi user/staff trước khi PAID |

### Map triển khai (Order + Payment row)

Payment Domain là **khái niệm orchestration**; persistence tách:

| Domain | `Order.status` (gợi ý) | `Payment.status` (gợi ý) |
|--------|------------------------|---------------------------|
| PENDING_PAYMENT | `PENDING_PAYMENT` | `CREATED` |
| PAYMENT_PROCESSING | `PENDING_PAYMENT` | `AWAITING` |
| PAID | `PAID` → rồi `FULFILLING` / `COMPLETED` | `SUCCEEDED` |
| PAYMENT_FAILED | `PAYMENT_FAILED` | `FAILED` |
| PAYMENT_EXPIRED | `CANCELLED` hoặc giữ `PENDING_PAYMENT` + payment expired* | `EXPIRED` |
| PAYMENT_CANCELLED | `CANCELLED` | `EXPIRED` hoặc `CANCELLED`** |

\* Chốt khi implement: expired → release Pool reserve + payment `EXPIRED`.  
\*\* Nếu cần enum `CANCELLED` trên Payment — chỉ thêm khi map 1:1 với domain; **không** thêm `REFUNDED` trong Sprint SePay (để sau).

`Order` sau PAID vẫn có `FULFILLING` / `COMPLETED` — đó là **Fulfillment**, không phải Payment Domain.

---

## 2. Tách tuyệt đối khỏi License Pool

```
SePay Webhook
      │
      ▼
Payment Domain          ← chỉ xác nhận tiền
      │
      ▼
Fulfillment             ← quyết định giao hàng
      │
      ▼
LicensePool.consume()
```

| Được | Không được |
|------|------------|
| Webhook → verify → mark PAID (Payment) | Webhook → `Pool.consume()` trực tiếp |
| Fulfillment gọi `Pool.consume(token)` | Payment service import License Pool |
| Pool không biết SePay / PayOS | |

Nguyên tắc giữ **đến cuối dự án**.

---

## 3. Idempotency — 3 tầng

| Layer | Key | Rule |
|-------|-----|------|
| **1** | `provider_event_id` (Webhook ID) | **UNIQUE** — event đã xử lý → return success, no-op |
| **2** | `payment_reference` | **UNIQUE** globally — webhook/retry cùng ref → cùng Payment |
| **3** | Fulfillment | `Delivery` đã tồn tại cho order item? → **STOP** (không consume / không giao lại) |

Webhook gửi N lần → tối đa 1 lần PAID hiệu lực · tối đa 1 lần giao Instant đúng quantity.

---

## 4. Transaction & recovery

### Happy path (cùng DB transaction khi có thể)

```
BEGIN
  Payment → PAID (SUCCEEDED)
  Fulfillment start
  Pool.consume(reservation_token)
  Delivery create
  Audit
COMMIT
```

Fail giữa chừng → **ROLLBACK** (không để “PAID mồ côi” trong cùng TX).

### Nếu fulfill phải async (queue)

Cho phép tách **sau** khi Payment đã commit PAID **chỉ khi** có recovery:

1. Webhook: persist event (L1) + mark PAID (idempotent) + enqueue fulfillment — **nhanh**.  
2. Worker: fulfill + consume + delivery (idempotent L3).  
3. Job fail → retry · alert · **không** auto-refund · RUNBOOK reconcile.

Cấm: PAID mà không có job/queue follow-up và không có monitor.

Persist-then-queue vẫn đúng CardOn/KEYON: webhook không gọi Provider API dài; ở đây webhook không gọi Pool — gọi Payment rồi enqueue Fulfillment.

---

## 5. Reconciliation fields (bắt buộc trên Payment)

| Field | Vai trò |
|-------|---------|
| `payment_reference` | Mã nội dung CK / QR ref (UNIQUE) |
| `provider_reference` | Mã tham chiếu phía SePay (nếu có) |
| `provider_transaction_id` | ID giao dịch ngân hàng/SePay |
| `provider_event_id` | ID webhook event (UNIQUE, Layer 1) |
| `provider_paid_at` | Thời điểm provider báo paid |
| `amount` / `amountVnd` | Số tiền |
| `currency` | Mặc định `VND` |

Đối soát SePay = join các field này, không đoán từ log.

---

## 6. Payment Events (đúng 5)

| Event |
|-------|
| `PaymentCreated` |
| `PaymentSucceeded` |
| `PaymentFailed` |
| `PaymentExpired` |
| `PaymentCancelled` |

Không phát thêm event “noise”. Subscriber: audit mirror · notify · metrics.

---

## 7. Monitoring KPIs (Pilot)

Ngoài `/api/health`:

| KPI |
|-----|
| Payment Success Rate |
| Webhook Retry Count |
| Duplicate Webhook Count |
| Webhook Processing Time |
| Average Fulfillment Time |

Dashboard / Monitoring đọc aggregate — implement trong bước Monitoring hoặc kèm SePay tối thiểu.

---

## 8. Exit Criteria SePay — P1–P10

| ID | Điều kiện |
|----|-----------|
| **P1** | Tạo QR thành công |
| **P2** | Webhook xác thực hợp lệ (HMAC/API key) |
| **P3** | Duplicate webhook không giao trùng |
| **P4** | Payment → Fulfillment → `Pool.consume` đúng luồng (không bypass) |
| **P5** | Payment fail **không** consume key |
| **P6** | Payment expired → release reserve đúng |
| **P7** | Reconciliation khớp provider (fields §5) |
| **P8** | Audit đầy đủ |
| **P9** | Dashboard / Inventory cập nhật đúng sau PAID+fulfill |
| **P10** | End-to-end test PASS |

```bash
# (sẽ có) npm run test:sepay
```

**Chỉ khi P1–P10 ALL PASS mới coi SePay Production xong.**

---

## 9. Roadmap sau SePay (không đổi)

```
License Pool              ✅
Inventory Read Model      ✅
SePay Production          ← đang mở (sau khi freeze này)
Monitoring
Dashboard hoàn thiện
Backup
Internal Test
Pilot
Pax8 (1 SKU)
```

**Không** nhảy Pax8 sau SePay.

---

## 10. Tài liệu liên quan

| File | |
|------|--|
| `docs/SEPAY-PRODUCTION.md` | Sprint checklist + P1–P10 |
| `docs/LICENSE-POOL-v1.md` | Pool — consume chỉ từ Fulfillment |
| `docs/INVENTORY-READ-MODEL-v1.md` | Đọc metrics sau PAID |
| `docs/RUNBOOK.md` | R1 / R5 webhook & CK |
| `docs/OPERATIONS.md` | Đổi ENV SePay |

---

*Payment Architecture v1.0 FROZEN — mọi PR SePay phải tuân thủ file này.*
