# KEYON — Pilot Evidence (PL1–PL5)

**Mục tiêu:** Ghi nhận bằng chứng vận hành để Pilot Review PASS (10/10 ops).  
**Không** yêu cầu tool BI mới — spreadsheet / screenshot / ticket / CSV là đủ.

Điền ngày / link bằng chứng vào cột **Evidence**.

| ID | Điều kiện | Cách ghi nhận | Evidence | Owner | Done |
|----|-----------|---------------|----------|-------|------|
| **PL1** | SLA Instant / Manual + uptime | Screenshot Admin Monitoring + 5–10 đơn ghi phút xử lý (paid→delivered). Health `healthy` trong kỳ. | | | ☐ |
| **PL2** | Tỷ lệ Payment→Delivery | Từ Admin Payments CSV: `SUCCEEDED` có `deliveryCount≥1` / tổng paid pilot. Ghi %. | | | ☐ |
| **PL3** | Backup/restore drill | Theo [`BACKUP.md`](./BACKUP.md): `pg_dump` → restore DB trống → checksum/count. Gắn log + ngày. | | | ☐ |
| **PL4** | Resend + Replace | 1 đơn thật (hoặc staging-pilot): Resend delivery + Replace key; có audit log. | | | ☐ |
| **PL5** | Đối soát SePay | Admin Payments → Export CSV: `reference` ↔ SePay ↔ `order` ↔ `deliveryCount`. File CSV + ghi chú lệch. | | | ☐ |

## Trước khi mở khách thật (gate)

- [ ] `/api/health` → `paymentProvider: sepay`, không warn stub
- [ ] Admin staff: email thật + 2FA + **đã đổi mật khẩu** (không còn `Admin@123`)
- [ ] Instant pool ≥ buffer pilot (khuyến nghị ≥20 AVAILABLE / SKU bán)
- [ ] 1 đơn E2E SePay sandbox/prod → PAID → Instant/Manual OK
- [ ] Catalog: SKU không bán / Pax8 chưa live đã inactive
- [ ] Inbox Manual: ops biết Complete + Retry Instant

## Liên kết nhanh

- Health: https://keyon.vn/api/health  
- Payments: `/admin/payments` (Export CSV)  
- Stock: `/admin/stock`  
- Monitoring: `/admin/monitoring`  
- Backup: [`BACKUP.md`](./BACKUP.md) · Runbook: [`RUNBOOK.md`](./RUNBOOK.md)

**Pilot Review PASS** khi PL1–PL5 có Evidence ≠ trống.
