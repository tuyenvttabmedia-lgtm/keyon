# KEYON — RUNBOOK (Xử lý sự cố)

**Audience:** Người trực vận hành / on-call  
**Khác OPERATIONS:** `OPERATIONS.md` = **cách làm đúng thường ngày**. File này = **khi hệ thống hỏng / khách kêu — làm gì theo thứ tự**.  
**Cập nhật:** 2026-07-21 (Sprint 1.5) · License Pool v1.0

> Mỗi lần xử lý xong 1 sự cố mới hoặc đổi quy trình — **thêm/sửa mục tương ứng trong file này**.

---

## Quy tắc cứng — License

1. **Không bao giờ `DELETE` license key** khỏi DB.  
2. Key lỗi / thu hồi: `AVAILABLE` (hoặc sau release) → **`DISABLED`** + audit/event.  
3. **Không** `CONSUMED → release` / bán lại.  
4. Đúng **4** status (không EXPIRED durable): [`LICENSE-POOL-v1.md`](./LICENSE-POOL-v1.md).

---

## Cách dùng

1. Xác định triệu chứng (bảng mục lục).  
2. Làm **đúng thứ tự** checklist — đừng nhảy bước.  
3. Ghi audit / ticket: thời gian, order code, hành động, kết quả.  
4. Không bao giờ: bấm fulfill / consume tay **hai lần** khi chưa rõ đã Consume chưa.  
7. **Không** gọi `Pool.consume` từ webhook — chỉ Payment → Fulfillment (`PAYMENT-ARCHITECTURE-v1.md`).

### Mục lục sự cố

| # | Sự cố |
|---|--------|
| R1 | Webhook SePay không chạy / không PAID |
| R2 | Worker chết / không xử lý queue |
| R3 | Redis đầy RAM / queue chậm |
| R4 | License Pool bị lock (RESERVED treo) |
| R5 | Khách báo đã CK nhưng chưa nhận key |
| R6 | Hết hàng / low stock đột ngột |
| R7 | Email không tới |
| R8 | Health / DB down |
| R9 | Nghi ngờ giao trùng / trừ kho sai |
| R10 | VPS chậm / CPU cao / nghi malware |
| R10 | Key lỗi cần loại khỏi bán |
| R11 | Backup / restore drill thất bại |

---

## R1 — Webhook SePay không chạy

**Triệu chứng:** Đơn mãi `PENDING_PAYMENT` / payment `AWAITING` dù khách đã CK; log không có hit `/api/webhooks/sepay`.

**Checklist**

1. Xác nhận trên SePay Dashboard: webhook URL = `{APP_URL}/api/webhooks/sepay`, trạng thái active, event “money in”.  
2. `curl -sS {APP_URL}/api/health` — app sống.  
3. So ENV: `PAYMENT_PROVIDER=sepay`, `SEPAY_WEBHOOK_SECRET` / `SEPAY_API_KEY` khớp dashboard.  
4. Xem log app (request 401 = sai chữ ký; 500 = bug).  
5. SePay “Test send” → phải `{ "success": true }`.  
6. Nếu tiền đã vào bank nhưng webhook không tới: **Reconcile** (Admin/CLI Sprint 1.5) — mark succeed **một lần** theo `payment_reference`.  
7. **Không** tạo delivery tay trước khi payment = SUCCEEDED và (Instant) unit = CONSUMED đúng 1 dòng.

**Xong khi:** Payment SUCCEEDED · Order PAID/FULFILLING/COMPLETED · audit có `payment.succeeded`.

---

## R2 — Worker chết

**Triệu chứng:** Đơn PAID nhưng không fulfill; email không gửi; queue depth tăng; heartbeat worker stale.

**Checklist**

1. Health / monitoring: Worker Status.  
2. Restart worker — xem `OPERATIONS.md` §8 (`pm2` / `systemctl` / `npm run worker`).  
3. Kiểm Redis sống (`redis-cli ping` hoặc health).  
4. Xem failed jobs BullMQ — retry **một** job mẫu, không flood.  
5. Nếu restart liên tục crash: xem log worker + error tracker (Sentry) — escalate Tech.  
6. Dev fallback: một số path có inline fulfill — **prod phải dựa worker**; đừng coi fallback là bình thường.

**Xong khi:** Heartbeat tươi · queue giảm · 1 đơn test đi hết.

---

## R3 — Redis đầy RAM / queue chậm

**Triệu chứng:** Latency cao; worker chậm; OOM Redis; jobs delay lâu.

**Checklist**

1. `INFO memory` (hoặc monitoring) — dùng bao nhiêu / maxmemory.  
2. Kiểm số job completed/failed giữ lại (BullMQ retention) — nhờ Tech trim nếu policy cho phép.  
3. **Cấm** `FLUSHALL` trên production có đơn đang chạy trừ khi Founder/Tech approve và đã backup ý thức mất queue.  
4. Restart Redis chỉ khi cần (`OPERATIONS.md` §9) → **bắt buộc** start lại worker.  
5. Tạm giảm load: pause nhận đơn mới nếu hết tài nguyên (quyết định Founder).

**Xong khi:** Memory ổn · queue xử lý lại · không mất payment SUCCEEDED đã ghi DB (DB là nguồn sự thật tiền).

---

## R4 — License Pool bị lock (RESERVED treo)

**Triệu chứng:** Key “biến mất” khỏi AVAILABLE nhưng đơn chưa Paid / đã Cancel; Inventory thấp bất thường; TTL job không chạy.

**Checklist**

1. Inventory / DB: đếm `RESERVED` theo SKU; xem `reserved_order_id`, `reserved_at`, `expires_at`.  
2. Nếu đơn Cancel / hết hạn thanh toán / `expires_at` quá hạn: gọi **`release`** (reason `order_cancelled` hoặc `ttl_expired`) → AVAILABLE + `LicenseReleased` — **không** status EXPIRED · **không DELETE**.  
3. Nếu TTL job chết: restart worker/cron; release thủ công **từng unit** qua API/Admin có audit.  
4. Nếu đơn đã Paid nhưng vẫn RESERVED (chưa Consume): **không** Release — đi R5 (`consume` + `reservation_token`).  
5. Concurrent / token: xem `LICENSE-POOL-v1.md` (E1, E7).

**Xong khi:** Mọi row ∈ 4 status · AVAILABLE+RESERVED+CONSUMED+DISABLED khớp tổng · audit/event đủ.

---

## R5 — Khách đã chuyển khoản nhưng chưa giao key

**Triệu chứng:** CS/khách gửi bill; đơn chưa COMPLETED hoặc chưa có Delivery.

**Checklist (theo thứ tự — rất quan trọng)**

1. Lấy **mã đơn** + `payment_reference` / nội dung CK.  
2. Payment status?
   - Chưa SUCCEEDED → R1 (webhook/reconcile). **Dừng** — chưa consume.  
   - Đã SUCCEEDED → bước 3.  
3. Order status? FulfillmentJob status?  
4. Instant:
   - Đã có Delivery? → **Ignore fulfill lại** (idempotent) · Resend nếu cần.  
   - Có unit RESERVED đúng order + còn `reservation_token`? → `consume({ reservationToken })` atomic.  
   - Token mismatch → **không** consume nhầm (R9 / Tech) — có thể đơn cũ đã TTL release.  
   - Đã CONSUMED + Delivery → hướng dẫn xem đơn.  
5. Manual: job trong Inbox chưa? Giao tay + complete.  
6. Hết kho / WAITING_STOCK: thông báo SLA · nhập kho · không auto-refund.  
7. Email fail ≠ chưa giao: kiểm Delivery trước; rồi R7.  
8. Mọi can thiệp tay: **audit** (ai, lúc nào, order id).

**Xong khi:** Khách có deliverable đúng 1 bản hợp lệ · hoặc ticket rõ lý do chờ (Manual/stock) có SLA.

---

## R6 — Hết hàng / low stock

**Triệu chứng:** 🔴 / 🟡 trên Inventory; Instant → WAITING_STOCK; notification Low Stock.

**Checklist**

1. Xác nhận metrics Pool theo SKU (`available` / `reserved` / …).  
2. Nhập thêm key (Admin Stock) **hoặc** chuyển bán Manual tạm.  
3. Đơn đang WAITING_STOCK: sau nhập kho — retry fulfill (không tạo payment mới).  
4. Policy: có thể vẫn nhận đơn → queue admin — **không** im lặng fail · **không** xóa key cũ.

---

## R7 — Email không tới

**Checklist**

1. Worker chạy? (R2)  
2. SMTP ENV / Mailpit (dev :8025).  
3. Job email failed trong queue — retry.  
4. Delivery vẫn có trên web → khách xem `/account/orders`; email là kênh phụ.  
5. Prod: spam folder · SPF/DKIM với nhà SMTP.

---

## R8 — Health / Database down

**Checklist**

1. `GET /api/health` — component nào fail.  
2. Postgres: container/service · disk đầy?  
3. Không migrate/reset bừa. Restore chỉ theo `OPERATIONS.md` §3 khi Tech confirm.  
4. Báo Founder nếu downtime kéo dài — tạm ngưng quảng cáo thanh toán.

---

## R9 — Nghi giao trùng / trừ kho sai

**Checklist**

1. **Dừng** mọi fulfill/replace/disable tay.  
2. Theo `payment_reference` + `order_id`: đếm Payment SUCCEEDED, Delivery, license CONSUMED.  
3. Kỳ vọng: 1 payment success · consume đúng `quantity` · Delivery tồn tại → webhook lại phải **no-op**.  
4. Nếu trùng thật: **giữ mọi row** — không DELETE; đánh dấu + escalate Tech; liên hệ khách theo policy.  
5. Bổ sung test case — cập nhật Internal Test + RUNBOOK nếu thiếu bước.

---

## R10 — Key lỗi / cần loại khỏi bán

**Checklist**

1. Xác định license id / hint (không lộ full key trên ticket công khai).  
2. Nếu đang RESERVED: xử lý order liên quan trước (release nếu đơn hủy, hoặc đợi consume nếu đã paid — escalate).  
3. Gọi **`disable(reason)`** → status `DISABLED` + event `LicenseDisabled`.  
4. **Cấm** `DELETE FROM …`.  
5. Nhập key thay thế vào pool (AVAILABLE mới).

**Xong khi:** Key lỗi = DISABLED · metrics `disabled` tăng · audit đủ.

---

## R11 — Backup / restore drill thất bại

**Triệu chứng:** `npm run backup:create` lỗi · restore vào `keyon_restore_test` fail · counts/checksum lệch · nghi ngờ backup chứa secret.

**Checklist**

1. Xác nhận Postgres container sống: `docker ps` → `keyon-dev-postgres` (hoặc `KEYON_PG_CONTAINER`).  
2. Tạo lại bundle: `cd web && npm run backup:create` — phải có `database.dump` + `config/env.production.example` + `storage/wasabi-verify.json`.  
3. **Không** restore đè DB production. Chỉ Empty Database: `keyon_restore_test`.  
4. `npm run backup:restore-verify -- --dir ../backups/keyon-<stamp>`.  
5. So counts: User · Product · Variant · License · Order · Payment + **checksum** `checksums.sha256`.  
6. Nếu B4 fail (secret trong backup): hủy bundle, kiểm tra không copy `.env`; chỉ giữ template.  
7. Exit đầy đủ: `npm run test:backup` → **B1–B5** PASS trước khi coi drill xong.

**Xong khi:** Restore DB mới OK · counts + checksum khớp · không có `.env`/secret trong bundle · OPERATIONS/BACKUP.md khớp script.

Chi tiết strategy: [`BACKUP.md`](./BACKUP.md).

---

## Escalation

| Mức | Khi nào | Ai |
|-----|---------|-----|
| L1 Ops | R1–R7, R10 theo checklist xong trong 15–30p | Fulfillment / CS |
| L2 Tech | Data inconsistent · Redis FLUSH · restore · bug Pool | Tech Lead |
| L3 Founder | Mất tiền / lộ key / downtime dài | Founder |

---

## R10 — VPS chậm / CPU cao / nghi malware

**Triệu chứng:** Trang chậm dù health 200 · load cao · PM2 restart nhiều · process lạ (`syslog-ng-<hex>`, path ẩn `/usr/share/man/.../.syslog*`).

1. Admin → **Monitoring** → Máy chủ / Bảo mật lite / Sự cố.  
2. SSH: `uptime` · `ps aux --sort=-%cpu | head` · `tail -50 /var/log/keyon-watchdog.log`.  
3. Chạy tay: `/opt/keyon/ops/host-watchdog.sh --security-full`.  
4. Nếu process/path malware: `pkill -9 -f …` · `rm -rf` thư mục ẩn · đổi mật khẩu / rotate secrets.  
5. Xác nhận: local `curl` health TTFB ổn · Monitoring status OK · Telegram không còn spam cùng code (cooldown).

---

## Liên kết

| Doc | |
|-----|--|
| License Pool v1.0 | `docs/LICENSE-POOL-v1.md` |
| Backup Strategy | `docs/BACKUP.md` |
| Hướng dẫn thường ngày | `docs/OPERATIONS.md` |
| Host watchdog | `ops/README.md` · `docs/MONITORING.md` |
| Sprint 1.5 | `docs/SPRINT-1.5-production-readiness.md` |
| Policy SLA / hoàn tiền | `/policy` + Admin Policy |
