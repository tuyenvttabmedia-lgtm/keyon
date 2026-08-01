# KEYON — OPERATIONS (Sổ tay vận hành)

**Audience:** Founder / Ops / DevOps — **không cần đọc mã nguồn**  
**Stack:** Next.js (`web/`) · Postgres · Redis/BullMQ · SePay · SMTP · Wasabi (optional)  
**Cập nhật:** 2026-07-21 (Backup B1–B5)

> **Sự cố / on-call** → xem [`RUNBOOK.md`](./RUNBOOK.md) (không trùng nội dung ở đây).  
> Khi thay đổi ENV / script / cổng thanh toán — **sửa file này cùng PR**.

---

## 1. Tổng quan môi trường

| Môi trường | Compose | App | Ghi chú |
|------------|---------|-----|---------|
| Dev | `compose.dev.yaml` | `cd web && npm run dev` | Mailpit :8025 |
| Prod | `compose.prod.yaml` | process manager / container | Secrets thật, không expose DB/Redis |

| URL / cổng (dev) | |
|----------------|--|
| App | http://localhost:3000 |
| Health | http://localhost:3000/api/health |
| Mailpit | http://localhost:8025 |
| Postgres | localhost:5432 |
| Redis | localhost:6379 |
| Worker | `cd web && npm run worker` |

Tài khoản seed (chỉ localhost): `admin@keyon.local` / `Admin@123`

---

## 2. Deploy (localhost → VPS)

### 2.1 Lần đầu trên VPS

1. Clone repo, copy `web/.env.example` → `.env.production` (hoặc `.env.local` trên server).  
2. Điền secrets: `DATABASE_URL`, `REDIS_URL`, `SESSION_SECRET`, `DELIVERY_ENCRYPTION_KEY`, SePay, SMTP.  
3. `docker compose -f compose.prod.yaml --env-file .env.production up -d`  
4. Trong `web/`: `npm ci` → `npx prisma migrate deploy` → (tuỳ) `npm run db:seed` **chỉ** môi trường trống / staging.  
5. Build & chạy app: `npm run build` → `npm start` (port 3000).  
6. Chạy worker riêng: `npm run worker` (systemd / pm2 / container thứ 2).  
7. Kiểm tra `GET /api/health` = healthy.

### 2.2 Deploy bản mới (update)

1. `git pull`  
2. Backup DB (mục 3) **trước** migrate.  
3. `npm ci` · `npx prisma migrate deploy` · `npm run build`  
4. Restart app + worker (mục 8–9).  
5. Smoke: health · login admin · 1 đơn stub/SePay test.

**Không** chạy `db:seed` trên production có dữ liệu thật.

---

## 3. Backup (3 phần — xem [`BACKUP.md`](./BACKUP.md))

Strategy đã đóng băng. Bundle luôn gồm:

| Part | Nội dung |
|------|----------|
| PostgreSQL | `database.dump` (`pg_dump -Fc`) |
| Storage | `storage/wasabi-verify.json` — **chỉ** verify bucket/config, **không** copy object |
| Config | `config/env.production.example` + `backup-manifest.json` — **không** secret thật |

**Không backup:** `.env` · API/SePay/SMTP/Wasabi secrets.

### 3.1 Tạo backup (canonical)

```bash
cd web
npm run backup:create
# → ../backups/keyon-<stamp>/
```

Giữ tối thiểu: **hàng ngày** + trước mọi migrate / đổi secret lớn. Thư mục `backups/` không commit git.

### 3.2 Restore Rule

**Restore luôn vào Empty Database** (`keyon_restore_test`).  
**Không** restore đè production.

```
Backup → New Database → Restore → Migration Check → Checksum → Counts → PASS
```

```bash
cd web
npm run backup:restore-verify -- --dir ../backups/keyon-<stamp>
```

Verify counts bắt buộc: User · Product · Variant · License · Order · Payment (+ checksum dump).

### 3.3 Exit test

```bash
cd web && npm run test:backup   # B1–B5
```

Chi tiết sự cố restore → [`RUNBOOK.md`](./RUNBOOK.md) mục R11.

---

## 4. Rotate secret

| Secret | ENV | Khi rotate |
|--------|-----|------------|
| Session JWT/cookie | `SESSION_SECRET` | User bị logout toàn bộ — thông báo trước |
| Mã hóa deliverable | `DELIVERY_ENCRYPTION_KEY` | **Nguy hiểm:** key cũ không giải mã được bản ghi cũ trừ khi dual-key — chỉ rotate khi có migration re-encrypt |
| SePay | `SEPAY_*` / Admin | Đổi dashboard + Admin/ENV; test webhook |
| SMTP | `SMTP_USER` / `SMTP_PASS` | Test gửi 1 mail |
| Wasabi | `WASABI_*` / Admin | Test upload/download 1 file |
| Pax8 | `PAX8_*` / Admin | Test cấu hình Admin; stub nếu chưa live |
| DB / Redis | URL + password | Update compose + app ENV · restart |

Quy trình chung:

1. Backup DB.  
2. Sinh secret mới (đủ dài, random).  
3. Cập nhật ENV trên server.  
4. Restart app + worker.  
5. Smoke test liên quan.  
6. Thu hồi secret cũ trên nhà cung cấp (SePay / SMTP / Wasabi).

---

## 5. Đổi SMTP

1. Sửa `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`.  
2. Restart **worker** (worker gửi mail qua queue).  
3. Dev: Mailpit `localhost:1025` / UI `:8025`.  
4. Prod: gửi thử Resend trên 1 đơn test · kiểm tra spam folder.

---

## 6. Đổi Wasabi (object storage)

**Khuyến nghị (Admin):** Cài đặt → **Storage / Wasabi** — endpoint, region, bucket, keys, public base URL. Secret mã hóa AES (`DELIVERY_ENCRYPTION_KEY`). Bấm **Test kết nối** rồi upload thử tại Media.

**ENV fallback** (ops / khi admin chưa cấu hình):

1. Điền `STORAGE_DRIVER=wasabi` + `WASABI_ENDPOINT` · `REGION` · `BUCKET` · keys · optional `WASABI_PUBLIC_BASE_URL`.  
2. Restart app (và worker nếu worker upload).  
3. Upload 1 file thử (Admin Media / Test kết nối).  
4. Rollback: Admin chọn driver `local`, hoặc `STORAGE_DRIVER=local` nếu lỗi.

**Ưu tiên resolve:** Admin `storage.json` (driver=wasabi + đủ credential) → ENV → local.

Bucket media nên cho phép public-read trên prefix (vd. `media/`) hoặc dùng CDN URL làm Public base URL.

---

## 7. Đổi / bật SePay

**Khuyến nghị (Admin):** Cài đặt → **SePay** — chọn provider `sepay`, điền STK + bank BIN, API key / HMAC secret (mã hóa AES). Dán webhook URL hiện trên form vào SePay dashboard. Bấm **Test cấu hình**.

**Giống CardOn:** từng field Admin (nếu có) ưu tiên hơn ENV; field trống lấy từ ENV.

**ENV fallback:**

```env
PAYMENT_PROVIDER=sepay
SEPAY_ACCOUNT_NUMBER=...
SEPAY_BANK_BIN=...
SEPAY_API_KEY=...          # nếu dùng API key
SEPAY_WEBHOOK_SECRET=...   # nếu dùng HMAC
NEXT_PUBLIC_APP_URL=https://your-domain
```

1. Dashboard SePay: webhook → `{APP_URL}/api/webhooks/sepay`.  
2. Auth: HMAC **hoặc** API Key.  
3. Đơn test: QR/CK → webhook → `PAID` → fulfillment.  
4. Webhook trùng: chỉ 1 lần succeed.  
5. Rollback: Admin chọn `stub`, hoặc `PAYMENT_PROVIDER=stub` (staging).

Reconcile (khi có job Sprint 1.5): chạy từ Admin hoặc CLI theo cửa sổ ngày.

---

## 7b. Đổi Pax8 / NCC API

**Khuyến nghị (Admin):** Cài đặt → **NCC / Pax8** — driver (`stub`/`sandbox`/`http`), base URL, client id/secret (AES), company id. PACISOFT: slot credential dự phòng.

**Resolve:** Admin driver `http|sandbox` ưu tiên; còn lại ENV `PAX8_DRIVER`. Từng field credential: Admin ?? ENV.

1. Lưu + **Test cấu hình**.  
2. Fulfillment SEMI_AUTOMATED dùng `getSupplierProvisioner()` (stub mặc định).  
3. `http` chỉ lưu credential — live adapter chưa bật (xem `PAX8-1SKU.md`).  
4. Rollback: driver `stub`.

---

## 8. Restart worker

Worker = process `npm run worker` (BullMQ: payment / fulfillment / email).

```bash
# pm2 ví dụ
pm2 restart keyon-worker

# systemd ví dụ
sudo systemctl restart keyon-worker
```

Dev: Ctrl+C rồi `npm run worker` lại.

Kiểm tra: health worker heartbeat (Sprint 1.5) · hoặc xử lý 1 job (resend email xuất hiện Mailpit/SMTP).

---

## 9. Restart queue / Redis

```bash
# Dev
docker restart keyon-dev-redis

# Nếu job stuck: kiểm tra Redis keys BullMQ; tránh FLUSHALL trên prod có job đang chạy
```

Sau restart Redis: **start lại worker**. Job failed có thể cần retry từ Admin (khi có UI) hoặc re-queue theo runbook Tech.

---

## 10. Migrate DB

```bash
cd web
# Backup trước (mục 3)
npx prisma migrate deploy
```

Lỗi migrate:

1. Không `migrate reset` trên production.  
2. Restore backup nếu migrate nửa chừng hỏng.  
3. Gọi Tech Lead — đối chiếu migration trong `web/prisma/migrations/`.

Dev reset **phá dữ liệu**:

```bash
npx prisma migrate reset   # chỉ localhost
npm run db:seed
```

---

## 11. Monitoring nhanh (checklist ca)

| Check | Cách |
|-------|------|
| App sống | `curl -s https://domain/api/health` |
| DB / Redis | health payload |
| Worker | heartbeat / queue depth (Sprint 1.5) |
| Mail | 1 resend test |
| SePay | đơn AWAITING lâu bất thường → reconcile |
| Disk | `df -h` trên VPS — chỗ chứa dump + uploads |
| Error tracker | Sentry/BetterStack — 0 spike lạ |

---

## 12. Sự cố

Chi tiết checklist on-call: **[`RUNBOOK.md`](./RUNBOOK.md)** (R1–R9).

Tóm tắt nhanh:

| Sự cố | Mục RUNBOOK |
|-------|-------------|
| Webhook / CK chưa PAID | R1, R5 |
| Worker down | R2 |
| Redis / queue | R3 |
| Key RESERVED treo | R4 |
| Hết kho | R6 |

---

## 13. Liên hệ / tài liệu

| Doc | |
|-----|--|
| Kế hoạch | `docs/KEYON - Ke hoach trien khai.md` |
| Sprint 1.5 | `docs/SPRINT-1.5-production-readiness.md` |
| Sự cố (on-call) | `docs/RUNBOOK.md` |
| Stack | `docs/ADR-001-stack.md` |
| ENV mẫu | `web/.env.example` |
