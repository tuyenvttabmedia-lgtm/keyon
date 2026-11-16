# KEYON — Ops FPT / TechData (PO + email)

**Audience:** Founder / Ops  
**Status:** Vận hành theo Architecture Freeze — **không** API NCC, **không** sửa Core  
**Liên quan:** ADR-005 Fulfillment · ADR-002 License Pool · ADR-009 HĐ/PO (OrderNote)

---

## Nguyên tắc

FPT và TechData = `Supplier` type **DISTRIBUTOR** + `integrationMode` **MANUAL_OPS**.

| Path | Khi nào | Variant | Luồng |
|------|---------|---------|--------|
| **A — Instant đệm kho** | Key/serial mua trước được | `INSTANT` + `supplierId` = FPT/TechData | PO/email đệm → Admin **Stock Import** → Pool → khách nhận Instant |
| **B — Manual theo đơn** | Account / portal / volume / không đệm | `MANUAL` + cùng supplier | PAID → Inbox `WAITING_HUMAN` → PO/email → Complete |

Pax8 / API distributor = Phase sau, 1 SKU — **không** áp cho FPT/TechData hiện tại.

---

## Setup một lần

1. Chạy (prod/staging, **không** `db:seed` wipe):

```bash
cd web && npm run catalog:ensure-distributors
```

Tạo/cập nhật Supplier **TechData** + **FPT**; chuyển SKU Manual cũ từ `NCC Manual Demo` → TechData.

2. Admin → **Nhà cung cấp** → mở FPT / TechData → điền **email liên hệ** (để Inbox soạn mailto).

3. Gắn từng SKU trên Admin → Sản phẩm:
   - Đệm được → `Giao ngay (INSTANT)` + NCC TechData/FPT + ngưỡng low-stock.
   - Theo đơn → `Thủ công (MANUAL)` + cùng NCC; SLA PDP = giờ làm việc.

---

## Path A — hàng ngày

1. **Tồn kho** lọc theo NCC → `LOW_STOCK` / `OUT_OF_STOCK`.
2. Gửi PO/email NCC (ngoài web hoặc Inbox nếu đơn Instant đang `WAITING_STOCK`).
3. Nhận key → **Admin → Kho key Instant (Stock)** → Import đúng SKU.
4. Đơn đang `WAITING_STOCK` → Inbox → **Retry Instant**.

Không gọi API. Không buyCard.

---

## Path B — theo đơn

1. Thanh toán OK → Inbox job `WAITING_HUMAN`.
2. Mở job → panel **PO / email** → **Soạn email PO** (mailto) → gửi NCC.
3. (Tuỳ chọn) **Ghi số PO / HĐ** trên panel (OrderNote `[KEYON-COMMERCIAL]` — ADR-009).
4. Nhận deliverable → dán KEY/ACCOUNT/… → **Complete**.

---

## Cấm

- Thêm cột PO trên Order  
- Webhook / Payment gọi thẳng Pool  
- Semi-Automated “giả” bằng gửi email trong Core  
- Hứa Instant trên PDP khi chưa có buffer

---

## Smoke

- Admin → Nhà cung cấp: thấy **TechData**, **FPT** (Phân phối · Xử lý thủ công)  
- Inbox KPI **FPT / TechData** lọc đúng job MANUAL_OPS distributor  
- `/api/health` healthy sau deploy
