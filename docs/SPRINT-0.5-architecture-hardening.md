# Sprint 0.5 — Architecture Hardening

**Status:** Done (localhost) · 2026-07-21  
**Mục tiêu:** Hardening trước khi mở rộng Phase A UI / SePay / Pax8.

## Checklist

| Item | Status | Ghi chú |
|------|--------|---------|
| Docker tách env | Done | `compose.dev.yaml` + `compose.prod.yaml` (+ include legacy) |
| ENV | Done | `.env.example` · `.env.local` · `.env.production.example` |
| Logging (Pino) | Done | `src/lib/logger.ts` |
| Audit Log | Done | payment / order / fulfill / resend (+ mở rộng dần) |
| Queue BullMQ | Done | payment · fulfillment · email + `npm run worker` |
| Mail (Mailpit) | Done | SMTP `:1025` · UI http://localhost:8025 |
| Storage abstraction | Done | Local driver · Wasabi skeleton |
| Payment interface | Done | Stub / SePay / PayOS / MegaPay · `PaymentService` |
| Fulfillment Strategy | Done | Instant / Manual / Semi / Managed registry |
| Error handler | Done | `AppError` + `toErrorResponse` |
| Rate limit | Done | checkout / confirm / resend / complete |
| Health check | Done | `GET /api/health` |
| UUID/CUID public IDs | Done | Prisma `@default(cuid())` — không dùng id số |

## Chạy

```bash
docker compose -f compose.dev.yaml up -d
cd web
npm run db:migrate   # nếu cần
npm run db:seed
npm run dev          # terminal 1
npm run worker       # terminal 2 — BullMQ + email qua Mailpit
```

- App: http://localhost:3000  
- Mailpit: http://localhost:8025  
- Health: http://localhost:3000/api/health  

## Nguyên tắc giữ

- Checkout → `PaymentService.createPayment()` — không gọi cổng trực tiếp  
- Fulfillment → `getFulfillmentStrategy(x).execute()` — không `if/else` strategy  
- Webhook/pay success → queue → worker (có fallback inline khi worker tắt)  
- Upload → `StorageService` — không ghi cứng `/public/uploads` trong nghiệp vụ  
