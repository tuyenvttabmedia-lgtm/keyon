# KEYON — Architecture Decision Records

**Mốc:** Architecture Freeze **cuối cùng** — 2026-07-21  
**Giai đoạn:** Software **Engineering** (Implement → Test → Measure → Pilot → Improve)  
**Không còn:** đề xuất kiến trúc lớn nếu Pilot / bảo mật / pháp lý / data corruption không đòi hỏi.

---

## Quy trình (hợp đồng thiết kế)

```
Spec → Freeze → Implement → Exit Criteria → PASS → Core Stable → Pilot
         ↑                                                      │
         └──────── chỉ amend khi Pilot / security / data / law ─┘
```

Tài liệu = hợp đồng. Code phải chứng minh hợp đồng (exit tests). Không code trước rồi viết doc sau.

---

## Index ADR

| ADR | Chủ đề | Status |
|-----|--------|--------|
| [ADR-001](./ADR-001-stack.md) | App shape & stack | **Frozen** |
| [ADR-002](./ADR-002-license-pool.md) | License Pool | **Frozen** (E1–E9 PASS) |
| [ADR-003](./ADR-003-inventory-read-model.md) | Inventory Read Model | **Frozen** (I1–I6 PASS) |
| [ADR-004](./ADR-004-payment-domain.md) | Payment Domain | **Frozen** (implement SePay theo ADR) |
| [ADR-005](./ADR-005-fulfillment-strategy.md) | Fulfillment Strategy | **Frozen** |
| [ADR-006](./ADR-006-storefront-ia.md) | Storefront IA / Navigation (NAV-01…05) | **Accepted** (Phase 1+2) |
| [ADR-007](./ADR-007-organization-membership.md) | Organization + Membership (B3.1) | **Accepted** — không đụng Order/Pool |
| [ADR-008](./ADR-008-org-order-access.md) | Org-scoped Order/license read (B3.2) | **Accepted** — không cột Order |

Chi tiết dài: `LICENSE-POOL-v1.md`, `INVENTORY-READ-MODEL-v1.md`, `PAYMENT-ARCHITECTURE-v1.md`.

Working (not Frozen): [Phase B B2B](../B2B-PHASE-B.md) — Org / HĐ / service SKU. Không amend ADR-001…006 cho đến khi đủ trigger + Amendment Rule.

---

## Core Stable

Các domain **không được thay đổi** nếu không có bằng chứng từ Pilot (hoặc security / data / pháp lý):

| Domain |
|--------|
| Order |
| Payment |
| Fulfillment |
| License Pool |
| Inventory Read Model |
| Supplier |
| Product |
| Variant |

Sau **SePay P1–P10 PASS**, Core coi như khóa vận hành. Sprint tiếp = Outer Layer + ops:

Monitoring → Dashboard → Backup → Internal Test → **Pilot** → Pax8 (1 SKU, Supplier Integration)

### Outer Layer (được thay adapter)

| Thay | Không đụng Core |
|------|-----------------|
| SePay → PayOS → MegaPay → Stripe | chỉ **Payment Provider** |
| Pax8 → PACISOFT → AWS Marketplace | chỉ **Supplier Integration** |
| SMTP → SES → Mailgun → Resend | chỉ **Mail Provider** |
| Wasabi → R2 → S3 | chỉ **Storage Driver** |

Đây là mục tiêu của toàn bộ Architecture Freeze.

---

## Architecture Amendment Rule

```
Một ADR đã Frozen
        │
        ▼
   KHÔNG được sửa nội dung quyết định
        │
        ├─ trừ khi Pilot chứng minh sai
        ├─ hoặc lỗi bảo mật
        ├─ hoặc lỗi / corruption dữ liệu
        └─ hoặc yêu cầu pháp lý mới
```

**Không chấp nhận** lý do:

- “Em nghĩ cách này đẹp hơn.”
- “Có framework mới.”
- “Refactor cho hiện đại.”

Amend ADR = PR riêng + ghi rõ điều kiện nào ở trên + cập nhật exit tests.

---

## Quy tắc Review (mọi PR từ Sprint SePay trở đi)

Mỗi PR phải trả lời:

| # | Câu hỏi | Nếu YES |
|---|---------|---------|
| 1 | Có làm thay đổi **Core Stable** (ngoài scope Outer Layer / bugfix có bằng chứng)? | **Reject** |
| 2 | Có sửa **ADR Frozen**? | Phải có lý do Amendment Rule |
| 3 | **Exit Criteria** của sprint/feature đã PASS? | Chưa PASS → **không merge** |

---

## Git (khuyến nghị)

```
main      ← Production Ready (không commit trực tiếp)
develop   ← Sprint hiện tại
feature/sepay | feature/dashboard | feature/monitoring | …
```

Không commit thẳng lên `main`.

---

## Anti AI-drift (agent / Cursor)

Khi Sprint đang làm X (vd. SePay):

- **Không** tự refactor Fulfillment / License Pool / Inventory / Order / Product domain “cho đẹp”.
- Chỉ đụng Core khi: **BUG** + **test fail** + **bằng chứng** (log / exit criteria).
- Spec + ADR là nguồn sự thật; code phải khớp, không viết lại kiến trúc.

---

## Pilot = thước đo duy nhất đổi kiến trúc

Chỉ mở lại Core khi Pilot (hoặc security/data/law) chứng minh cần. Không refactor vì cảm hứng.

---

## Format mỗi ADR

1. **Context** — Vấn đề là gì?  
2. **Decision** — Chúng ta chọn gì?  
3. **Consequences** — Được / mất gì?  
4. **Alternatives** — Đã cân nhắc phương án nào?
