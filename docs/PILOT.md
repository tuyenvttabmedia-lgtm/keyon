# KEYON — Pilot (Operations Phase)

**Status:** ✅ Pilot Gate APPROVED · **Operations Phase APPROVED TO START**  
**Audience:** Founder / Ops / Tech Lead  
**Related:** [`INTERNAL-TEST.md`](./INTERNAL-TEST.md) · [`ARCHITECTURE-FREEZE.md`](./ARCHITECTURE-FREEZE.md) · [`adr/README.md`](./adr/README.md) · [`OPERATIONS.md`](./OPERATIONS.md) · [`RUNBOOK.md`](./RUNBOOK.md)

> Pilot **không** kiểm tra lại kiến trúc bằng unit/exit suite.  
> Pilot xác nhận **vận hành thực tế**: user, quy trình, SLA, support, reconciliation.

---

## 1. Trạng thái vào Pilot

| Hạng mục | Trạng thái |
|----------|-----------|
| Foundation | ✅ PASS |
| Order | ✅ Core Stable |
| Payment | ✅ Core Stable |
| Fulfillment | ✅ Core Stable |
| License Pool | ✅ Core Stable |
| Inventory Read Model | ✅ Core Stable |
| Monitoring | ✅ PASS |
| Dashboard | ✅ PASS |
| Backup & Restore | ✅ PASS |
| Internal Test (IT1–IT8) | ✅ PASS · **Pilot Ready** |
| Architecture Governance | ✅ PASS |

**Không còn blocker kỹ thuật trước Pilot.**

Ba giai đoạn dự án:

```
Architecture Phase ✅  →  Engineering Phase ✅  →  Operations Phase (Pilot) ▶
```

---

## 2. Mục tiêu Pilot

Không còn: “kiến trúc đúng chưa?”  
Mà là: “hệ thống chạy ổn với người và quy trình thật chưa?”

| Nhóm | Mục tiêu đánh giá |
|------|-------------------|
| **SLA** | Thời gian xử lý đơn · độ sẵn sàng hệ thống |
| **Reliability** | Tỷ lệ thành công thanh toán · giao hàng |
| **Operations** | Backup/restore · monitoring · xử lý sự cố (RUNBOOK) |
| **Support** | Resend · Replace · quy trình hỗ trợ khách |
| **Reconciliation** | Đối soát thanh toán ↔ đơn hàng |

---

## 3. Exit Criteria Pilot (PL1–PL5)

Ghi nhận trong **Pilot Review** (sau giai kỳ Pilot). Không mở rộng thành BI/analytics platform.

| ID | Điều kiện |
|----|-----------|
| **PL1** | SLA: ghi nhận thời gian xử lý Instant / Manual + uptime quan sát được (health/monitoring) |
| **PL2** | Reliability: tỷ lệ Payment → Delivery thành công trên đơn Pilot (ghi số liệu, không “cảm giác”) |
| **PL3** | Operations: ≥1 lần drill backup/restore theo `BACKUP.md` trong kỳ Pilot; ≥1 sự cố/drill theo RUNBOOK (hoặc dry-run có ghi nhận) |
| **PL4** | Support: Resend và Replace dùng được trên đơn thật / staging-Pilot; audit trail đủ |
| **PL5** | Reconciliation: đối soát được payment reference ↔ order ↔ delivery cho đơn Pilot |

**Pilot Review PASS** khi PL1–PL5 có bằng chứng ghi nhận (log / spreadsheet / ticket — không bắt buộc tool mới).

---

## 4. Điều không thay đổi trong Pilot

| Nguyên tắc | |
|------------|--|
| Không đổi **Core Stable** chỉ vì muốn tối ưu | |
| Không sửa **ADR** nếu không có bằng chứng | |
| Mọi đổi kiến trúc → **Architecture Amendment Rule** | Pilot proof · security · data corruption · legal |

Có vấn đề từ Pilot:

```
Bằng chứng vận hành
      ↓
ADR?  →  Amendment?  →  Core Stable?
      ↓
Nếu cả ba Không → chỉ Outer Layer (adapter)
```

---

## 5. Phạm vi Pilot (đóng băng)

**Trong scope**

- Instant + Manual đã có (Phase A)
- SePay (hoặc stub staging có kiểm soát) theo môi trường Pilot
- Ops: Dashboard · Monitoring · Backup · RUNBOOK
- Support: Resend / Replace

**Ngoài scope**

- Pax8 / Semi-Automated live
- Multi-SKU supplier rollout
- Incremental backup / PITR / cross-region
- BI / AI / analytics mới

---

## 6. Sau Pilot

```
Pilot
  ↓
Pilot Review (PL1–PL5)
  ↓
Pax8
  ↓
1 Supplier → 1 Product → 1 SKU → Provision → Complete
```

Pax8 = **Supplier Layer adapter** — không redesign Core đã chứng minh.

---

## 7. Checklist Pilot Review (điền khi kết thúc kỳ)

| ID | Bằng chứng (link / ngày / số liệu) | PASS? |
|----|-------------------------------------|-------|
| PL1 | | ☐ |
| PL2 | | ☐ |
| PL3 | | ☐ |
| PL4 | | ☐ |
| PL5 | | ☐ |

**Kết luận Pilot Review:** ☐ PASS · ☐ FAIL (ghi Amendment nếu cần)

---

## 9. Cách chạy Pilot (tuần 1 — ops, không redesign UI)

Roadmap gốc giữ nguyên: **Pilot → Pilot Review → Pax8 HTTP (nếu cần)**.  
Không làm Storefront redesign trong kỳ này. Admin/tool UI đủ dùng cho Founder/Ops.

### Hàng ngày

1. App + worker chạy (`npm run dev` · `npm run worker`).  
2. `GET /api/health` healthy · Admin Monitoring xem queue/heartbeat.  
3. Ghi đơn Pilot (Instant + Manual): mã đơn, giờ tạo → PAID → Delivery.  
4. Cuối ngày: `cd web && npm run pilot:snapshot` → file `backups/pilot/pilot-snapshot-*.json`.

### Trong kỳ (bắt buộc PL3–PL4)

| Việc | Lệnh / chỗ |
|------|------------|
| Backup drill | `npm run test:backup` |
| RUNBOOK dry-run | `docs/RUNBOOK.md` (vd. R2 / R8) — ghi ngày |
| Resend / Replace | 1 đơn thật hoặc staging — kiểm audit |

### Pilot Review

Điền bảng PL1–PL5 bằng snapshot JSON + ghi chú vận hành.  
PASS + không Amendment → nền tảng mở rộng Pax8 HTTP / SKU tiếp theo.

---

## 8. Quyết định cuối cùng (2026-07-21)

| Hạng mục | Trạng thái |
|----------|------------|
| Internal Test | ✅ APPROVED |
| Pilot Gate | ✅ APPROVED |
| Operations Phase | ✅ APPROVED TO START |
| Amendment ADR | Không |
| Request Changes | Không |
| Core Stable change | Không |

```
Architecture ✅ → Engineering ✅ → Operations (Pilot) ▶
```

Từ đây chất lượng KEYON đánh giá bằng **số liệu vận hành · SLA · độ tin cậy · phản hồi user** — không bằng bổ sung/đổi kiến trúc.  
PL1–PL5 PASS + không Amendment → Core Stable được xem là **xác thực trong thực tế** → nền tảng Pax8.
