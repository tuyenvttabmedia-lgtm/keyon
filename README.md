# KEYON

Digital License Platform — **MVP theo [`docs/KEYON-MVP-SPEC.md`](docs/KEYON-MVP-SPEC.md)** (KISS · Core Stable giữ nguyên).

## Docs

- [`docs/KEYON - Ke hoach trien khai.md`](docs/KEYON%20-%20Ke%20hoach%20trien%20khai.md) — roadmap v1.2
- [`docs/DASHBOARD.md`](docs/DASHBOARD.md) — Dashboard D1–D6 PASS
- [`docs/MONITORING.md`](docs/MONITORING.md) — Monitoring M1–M7 PASS
- [`docs/OPS-SPRINTS.md`](docs/OPS-SPRINTS.md) — Monitoring→…→Pilot
- [`docs/ARCHITECTURE-FREEZE.md`](docs/ARCHITECTURE-FREEZE.md) — Freeze CLOSED
- [`docs/SEPAY-PRODUCTION.md`](docs/SEPAY-PRODUCTION.md) — SePay P1–P10 PASS
- [`docs/adr/README.md`](docs/adr/README.md) — ADR + Amendment Rule
- [`docs/SPRINT-1.5-LP-phases.md`](docs/SPRINT-1.5-LP-phases.md) — LP-1…LP-7
- [`docs/OPERATIONS.md`](docs/OPERATIONS.md) — sổ tay vận hành (thường ngày)
- [`docs/RUNBOOK.md`](docs/RUNBOOK.md) — xử lý sự cố (on-call)
- [`docs/SPRINT-1.5-production-readiness.md`](docs/SPRINT-1.5-production-readiness.md) — **sprint tiếp theo** (Pool → … → Test)
- [`docs/ADR-001-stack.md`](docs/ADR-001-stack.md)
- [`docs/SPRINT-0.5-architecture-hardening.md`](docs/SPRINT-0.5-architecture-hardening.md)
- [`docs/SPRINT-1-phase-a-ops.md`](docs/SPRINT-1-phase-a-ops.md)

## Localhost

```bash
docker compose -f compose.dev.yaml up -d
cd web
cp .env.example .env.local   # nếu chưa có
npm install
npx prisma migrate deploy
npm run db:seed
npm run dev      # :3000
npm run worker   # BullMQ + Mailpit SMTP
```

| Service | URL |
|---------|-----|
| App | http://localhost:3000 |
| Mailpit | http://localhost:8025 |
| Health | http://localhost:3000/api/health |
| Policy | http://localhost:3000/policy |
| Admin | http://localhost:3000/admin |

### Accounts

`admin@keyon.local` / `fulfill@keyon.local` / `customer@keyon.local` — `Admin@123`

### Flow

1. Mua Instant → stub pay → key + email Mailpit  
2. Mua Manual → stub pay → `/admin/inbox` → giao  
3. Resend / Replace (staff) → audit + email  
4. Cancel đơn `PENDING_PAYMENT` từ Admin → Orders  

SePay: `PAYMENT_PROVIDER=sepay` + `SEPAY_*` · webhook `/api/webhooks/sepay`

## Production (sau)

```bash
docker compose -f compose.prod.yaml --env-file .env.production up -d
# + deploy web/worker container hoặc systemd
```

Đổi secrets, `PAYMENT_PROVIDER`, SMTP/Wasabi thật. Không expose Postgres/Redis ra internet.
