# ADR-001 — Application shape & stack

**Status:** Accepted  
**Date:** 2026-07-21  
**Supersedes stub:** `docs/ADR-001-stack.md` → file này

## Context

KEYON Phase A cần ship nhanh trên localhost rồi VPS: cửa hàng license + phòng máy xử lý đơn (Manual + Instant), chưa phải microservices. Team nhỏ, ưu tiên một repo dễ deploy và bảo trì.

## Decision

| Layer | Choice |
|-------|--------|
| App | **Next.js** App Router — UI + API trong một codebase |
| DB | **PostgreSQL** + **Prisma** |
| Queue | **Redis** + **BullMQ** worker (persist-then-queue trên money/fulfill path) |
| Auth | Session cookie · roles CUSTOMER / ADMIN / FULFILLMENT / CS |
| Payment | Interface `PaymentProvider` — stub trước, SePay khi Pool + Inventory ổn |
| Deploy | Docker Compose trên VPS sau khi localhost ổn |

Modular monolith: Controller/API → Service → Repository/Prisma. Không tách Nest/service riêng ở Phase A.

## Consequences

**Được:** Một deploy · onboarding nhanh · đổi cổng thanh toán qua interface · queue sẵn cho webhook.

**Mất:** Giới hạn scale theo process; tách service sau tốn công nếu cần. Turbopack/Next 15 ràng buộc version.

## Alternatives

| Phương án | Lý do không chọn (Phase A) |
|-----------|----------------------------|
| NestJS API + SPA riêng | Thêm repo/deploy; overkill cho MVP |
| Serverless-only (không worker) | Khó TTL Pool / queue retry ổn định |
| Mongo / no-ORM | Money + stock cần transaction SQL mạnh |
| Gắn SePay ngay ngày 1 | Pool chưa vững → trừ kho/giao trùng |
