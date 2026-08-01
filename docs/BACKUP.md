# KEYON — Backup Strategy (Frozen)

**Status:** ✅ ALL B1–B5 PASS · Evidence: `npm run test:backup`  
**Audience:** Founder / Ops / DevOps  
**Related:** [`OPERATIONS.md`](./OPERATIONS.md) · [`RUNBOOK.md`](./RUNBOOK.md) · [`OPS-SPRINTS.md`](./OPS-SPRINTS.md)

> Spec đóng băng trước khi code. Không mở rộng Exit Criteria. Không backup secrets.

---

## 1. Backup gồm 3 thành phần riêng biệt

```
PostgreSQL
      ↓
database dump

Storage
      ↓
Wasabi
      ↓
không backup lại object
chỉ verify bucket / config

Configuration
      ↓
ENV template
      ↓
không backup secret thật
```

| Part | Artifact | Không làm |
|------|----------|-----------|
| **Database** | `pg_dump -Fc` → `database.dump` | Không dump Redis / không dump object storage |
| **Storage** | `storage/wasabi-verify.json` | Không copy object Wasabi |
| **Config** | `config/env.production.example` + `backup-manifest.json` | Không copy `.env` / secret thật |

---

## 2. Không được backup

| Forbidden | Lý do |
|-----------|--------|
| `.env` / `.env.local` / `.env.production` | Secrets |
| API Secret / SePay Secret / SMTP Password / Wasabi Secret | Secrets |
| Session / encryption keys thật | Secrets |

**Chỉ backup template:**

- `web/.env.production.example` (hoặc root `.env.production.example`)
- Manifest metadata (timestamp, app version, DB name, **không** connection string có password)

---

## 3. Restore Rule

**Restore luôn chạy trên Empty Database.**  
**Không restore đè production.**

```
Backup
  ↓
New Database
  ↓
Restore
  ↓
Migration Check
  ↓
Checksum
  ↓
PASS
```

Quy trình chuẩn (dev / drill):

1. Tạo DB trống `keyon_restore_test` (hoặc tên drill).  
2. `pg_restore` vào DB đó.  
3. Kiểm tra Prisma migrations đã apply (schema khớp).  
4. So checksum dump + **record counts**.  
5. Drop DB restore test sau khi PASS (tuỳ chọn).

---

## 4. Verify (bắt buộc)

Ngoài checksum file dump, phải so khớp **source vs restored**:

| Count |
|-------|
| User |
| Product |
| Variant |
| License (`LicenseItem`) |
| Order |
| Payment |

Không đủ chỉ báo “Restore OK”.

---

## 5. Scripts (canonical)

Chạy từ `web/`:

| Script | Việc |
|--------|------|
| `npm run backup:create` | Tạo bundle 3 phần vào `../backups/keyon-<stamp>/` |
| `npm run backup:restore-verify` | Restore DB mới + counts + checksum |
| `npm run test:backup` | Exit **B1–B5** |

Yêu cầu: Docker Postgres `keyon-dev-postgres` (hoặc override `KEYON_PG_CONTAINER`).

---

## 6. Exit Criteria B1–B5

| ID | Điều kiện |
|----|-----------|
| **B1** | Backup tạo thành công (3 phần + dump tồn tại) |
| **B2** | Restore sang DB mới thành công |
| **B3** | Verify record counts + checksum PASS |
| **B4** | Secrets không nằm trong backup (không có `.env` thật; không chứa secret values đã biết) |
| **B5** | `RUNBOOK.md` & `OPERATIONS.md` khớp thực tế (trỏ đúng scripts) |

Chỉ 5 điều này. Không mở rộng.

---

## 7. Sau Backup

```
Backup → Internal Test → Pilot → Pax8 (1 SKU)
```

Không đổi roadmap. Không sửa Core Stable vì Backup.
