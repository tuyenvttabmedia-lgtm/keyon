# Sprint 1 — Phase A Ops Ready

**Status:** Done · 2026-07-21  
**Trước đó:** Sprint 0.5 Architecture Hardening  
**Không làm:** Pax8 API · Managed Subscription · Partner · CMS sâu  

## Goal

Nhân viên vận hành được trên localhost **không cần seed tay / SQL**: quản lý catalog nhẹ, nhập kho Instant, Inbox Manual, hủy đơn an toàn, Replace/Resend có audit, email vào Mailpit, SePay sẵn sàng gắn env.

## Checklist

| # | Item | Done |
|---|------|------|
| 1 | Admin shell + nav | ✅ |
| 2 | Catalog admin (list / giá / active) | ✅ |
| 3 | Stock Instant (xem / thêm key) | ✅ |
| 4 | Suppliers list | ✅ |
| 5 | Orders admin + Cancel (PENDING_PAYMENT) | ✅ |
| 6 | Replace delivery (staff) | ✅ |
| 7 | Email HTML templates (pay / deliver / resend / replace) | ✅ |
| 8 | SePay provider + webhook route (env-driven) | ✅ |
| 9 | Policy page (SLA / resend / warranty) | ✅ |
| 10 | Seed ≥5 Instant + ≥5 Manual | ✅ |

## Exit

- [x] Mua Instant + Manual end-to-end với email trong Mailpit  
- [x] Staff thêm stock + giao Manual từ Admin  
- [x] Cancel đơn chờ thanh toán có audit  
- [x] `/api/health` vẫn healthy · worker chạy  

## Notes

- Default payment vẫn **stub**; set `PAYMENT_PROVIDER=sepay` + `SEPAY_*` khi gắn cổng thật.
- Webhook: `POST /api/webhooks/sepay` → verify → `markPaymentSucceeded` (idempotent).
- Replace giữ delivery cũ; email template riêng.
