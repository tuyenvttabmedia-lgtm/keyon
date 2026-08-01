# KEYON Blueprint — Đề xuất chỉnh sửa & hoàn thiện

**Mục đích:** Biến `KEYON Enterprise Architecture - Development.docx` từ Capability Concept Document thành bộ tài liệu có thể thi công (vẫn không viết code).  
**Nguồn đánh giá:** Technical Architecture Review (Google/Microsoft lens).  
**Nguyên tắc biên tập:** Bớt handbook chung chung → thêm quyết định, hợp đồng, trạng thái, failure modes.

---

## Phần A. Cấu trúc lại toàn bộ Blueprint

### A.1. Vấn đề cấu trúc hiện tại

| Vấn đề | Hệ quả |
|--------|--------|
| 18 chương + 12 phụ lục cùng “độ cao” | Mọi thứ nhìn quan trọng như nhau; team không biết đọc gì trước |
| Mỗi chương cùng khuôn: Mục đích → Nguyên tắc → Mở rộng → Kết luận | Nhiều trang nhưng ít quyết định |
| “API Contract / Canonical Data Model” không có contract & schema | Không estimate / không baseline engineering |
| Phase 1 nhét CMS+SEO+Commerce+Fulfillment | Overbuild; money path chậm |
| Trùng lặp mạnh giữa Ch10–12 vs App B–C, Ch15 vs App D | Bảo trì tài liệu tốn kém, mâu thuẫn dễ xảy ra |

### A.2. Mô hình 3 lớp (khuyến nghị)

Tách 1 file khổng lồ thành **3 tài liệu sống**, có owner riêng:

```
┌─────────────────────────────────────────────────────────┐
│  LỚP 1 — PRODUCT & CAPABILITY VISION                    │
│  Audience: Founder, PO, Sales, Marketing                 │
│  Cadence: ít đổi (review quý)                            │
│  Độ dài mục tiêu: 25–40 trang                            │
└─────────────────────────────────────────────────────────┘
                          │ ràng buộc business
                          ▼
┌─────────────────────────────────────────────────────────┐
│  LỚP 2 — SOLUTION ARCHITECTURE (SA)                      │
│  Audience: Architect, Tech Lead, BA senior               │
│  Cadence: đổi theo ADR (mỗi quyết định lớn 1 ADR)        │
│  Độ dài mục tiêu: 40–60 trang + sơ đồ                    │
└─────────────────────────────────────────────────────────┘
                          │ ràng buộc kỹ thuật
                          ▼
┌─────────────────────────────────────────────────────────┐
│  LỚP 3 — ENGINEERING SPECS                               │
│  Audience: BE/FE/DevOps/QA                               │
│  Cadence: đổi theo sprint (versioned)                    │
│  Artifacts: OpenAPI, ERD, state machines, runbooks       │
└─────────────────────────────────────────────────────────┘
```

Handbook (security standards, glossary, DR…) chỉ giữ nếu có **owner + checklist + chu kỳ review**. Không thì gộp thành phụ lục ngắn hoặc bỏ.

### A.3. Mục lục đề xuất — Lớp 1: Product & Capability Vision

Giữ / rút gọn từ Ch1–7 + một phần Ch2–4. Xóa lặp “kết luận chương” dài.

1. Project Overview (Vision, Mission, Positioning, Non-goals)  
2. Business Scope & Revenue Model  
3. Customer Segments (Individual → Partner) — **giữ bảng so sánh**  
4. Business Capability Map (1 trang sơ đồ + 1 trang RACI-lite)  
5. Product Catalog Principles (Brand → Series → Product → Variant + Fulfillment Types)  
6. Information Architecture (portal map mức cao: Store / Portal / Admin / Partner)  
7. Out of Scope & Future Options (marketplace, AI, global — **chỉ liệt kê, không thiết kế**)

**Quy tắc biên tập Lớp 1:** Không API payload, không DB table, không “microservices trong tương lai” trừ khi là constraint kinh doanh.

### A.4. Mục lục đề xuất — Lớp 2: Solution Architecture (trọng tâm sửa)

Đây là lớp **thiếu nhất** hôm nay. Đề xuất mục lục mới:

1. Architecture Overview (context diagram: Customer, Admin, Payment GW, Supplier, Queue, DB)  
2. Architecture Style Decision — ADR-001 (xem Phần C)  
3. Bounded Contexts / Modules & Dependency Rules  
4. Critical Path: Order → Payment → Fulfillment → License/Subscription  
5. State Machines (Order, Payment, Fulfillment Task, License, Subscription)  
6. Idempotency, Webhooks & Money Safety  
7. Integration Architecture (Payment Adapter, Supplier Adapter)  
8. Inventory & License Reservation  
9. Finance & Ledger (HOLD model nếu có agent/partner credit)  
10. AuthN/Z Model (RBAC + ownership + API key lifecycle)  
11. Event Catalog (domain events tối thiểu cho Phase 1–3)  
12. Data Architecture Logical (ERD logic commerce/fulfillment/finance — không physical DDL)  
13. API Surface Map (resource groups; chưa cần mọi field)  
14. Reliability, Observability & SLOs (số liệu draft)  
15. Security Threat Model (TOP 10 abuse cases của KEYON)  
16. Phased Delivery Map (map capability → phase; trỏ sang roadmap)  
17. ADR Log (index)

**Từ tài liệu cũ map sang đây:**

| Cũ | Xử lý |
|----|--------|
| Ch8 Workflow | Giữ narrative ngắn → **thay bằng state machines** (mục 5) |
| Ch9 Frontend | Giảm còn 2–3 trang nguyên tắc; chi tiết → Engineering Spec sau |
| Ch10 Backend | Giữ layered/modular; thêm dependency rules + sync/async boundary rõ |
| Ch11 API | Giữ classification; bổ sung resource map; chi tiết contract → Lớp 3 |
| Ch12 DB | Domain list OK; bổ sung logical ERD + uniqueness rules |
| Ch13–14 CMS/SEO | Đẩy phần lớn sang Phase 2+; Lớp 2 chỉ ghi boundary |
| Ch15 Security | Rút nguyên tắc + **threat model KEYON-specific** |
| Ch16–17 Infra/Ops | Giữ nguyên tắc + SLO draft; tool cụ thể → ADR / Eng Spec |
| Ch18 Roadmap | Tách thành tài liệu Roadmap (xem Phần C) hoặc phụ lục SA |
| App B | Entity catalog giữ; bổ sung quan hệ + ownership + uniqueness |
| App C | Đổi tên thành “Integration Standards”; contract thật → Lớp 3 |
| App D–L | Merge / cắt còn checklist; không nhân đôi Ch15–17 |

### A.5. Mục lục đề xuất — Lớp 3: Engineering Specs (giai đoạn sau, vẫn không code vội)

Chỉ mở khi Lớp 2 đã có P0 artifacts:

- `spec/openapi/` — Public/Customer/Admin/Partner (versioned)  
- `spec/state-machines/` — bảng transition máy đọc được  
- `spec/data/logical-erd.md` (+ sau đó physical migration plan)  
- `spec/adapters/payment.md`, `supplier.md`  
- `spec/runbooks/` — payment webhook fail, supplier timeout, license leak response  
- `adr/` — ADR-001…  

### A.6. Checklist biên tập cho mọi chương còn giữ

Mỗi mục chỉ được tồn tại nếu trả lời được ≥ 1 câu:

1. **Quyết định gì?** (ADR hoặc rule rõ)  
2. **Ai sở hữu?** (domain/module owner)  
3. **Fail thì sao?** (error / retry / compensate / escalate)  
4. **Đo thế nào?** (metric hoặc acceptance)  
5. **Thuộc phase nào?** (1 / 2 / 3 / later)

Nếu chỉ còn “có khả năng mở rộng”, “dễ bảo trì”, “theo best practice” → **xóa hoặc gộp vào glossary**.

### A.7. Thứ tự viết lại (khuyến nghị 4 tuần tài liệu)

| Tuần | Việc | Output |
|------|------|--------|
| 1 | Tách Lớp 1; freeze Non-goals; Capability map 1 trang | Vision v1.1 |
| 2 | Viết SA mục 4–8 (critical path + P0) | SA draft money path |
| 3 | Logical ERD + AuthZ + Event catalog + Threat model | SA draft completeness |
| 4 | Roadmap Phase 1–3 + ADR-001 + index ADR | Go/No-go cut code lõi |

**Gate:** Không mở rộng CMS/SEO/Partner ecosystem trong tài liệu cho đến khi tuần 2 đạt review pass.

---

## Phần B. Outline chi tiết 8 artifact P0

Mỗi artifact dưới đây là **template điền**, không phải code. Điền xong = “đủ để estimate & implement”.

---

### P0-1. Order / Payment / Fulfillment State Machine

**Mục tiêu:** Không còn trạng thái mơ hồ kiểu “đang xử lý”.

#### Thực thể & trạng thái đề xuất (điền bảng transition)

**A. Order**

| State | Ý nghĩa | Ai được đưa vào |
|-------|---------|-----------------|
| `DRAFT` | Giỏ / báo giá chưa chốt | Customer / Admin |
| `PENDING_PAYMENT` | Đã chốt, chờ thanh toán | System |
| `PAID` | Tiền OK (payment success) | Payment webhook/reconcile |
| `FULFILLING` | Đang cấp hàng | Fulfillment |
| `COMPLETED` | Đã giao xong theo policy | Fulfillment |
| `CANCELLED` | Hủy trước/đúng policy | Customer/Admin + rules |
| `PAYMENT_FAILED` | Hết hạn / thất bại thanh toán | System |

**B. Payment** (tách khỏi Order)

| State | Ý nghĩa |
|-------|---------|
| `CREATED` | Đã tạo phiên thanh toán |
| `AWAITING` | Chờ cổng / khách |
| `SUCCEEDED` | Xác nhận thành công (idempotent) |
| `FAILED` | Thất bại terminal |
| `EXPIRED` | Timeout phiên |
| `REFUNDED` / `PARTIAL_REFUNDED` | Sau chính sách hoàn |

**C. Fulfillment Task** (1 Order có thể nhiều task theo item)

| State | Ý nghĩa |
|-------|---------|
| `QUEUED` | Chờ worker / nhân viên |
| `RESERVED` | Đã giữ license/inventory |
| `PROCESSING` | Đang gọi supplier / manual |
| `SUCCEEDED` | Đã giao |
| `FAILED` | Fail terminal theo policy |
| `WAITING_ADMIN` | Cần can thiệp (vd. supplier hết hàng) |
| `RELEASED` | Nhả reserve vì hủy/timeout |

**D. License**

| State | Ý nghĩa |
|-------|---------|
| `AVAILABLE` | Trong kho |
| `RESERVED` | Giữ cho order |
| `DELIVERED` | Đã giao khách |
| `REVOKED` / `EXPIRED` | Theo policy |

#### Bảng bắt buộc phải có (điền trong doc)

Với mỗi thực thể: `From → To | Trigger | Guard | Side effects | Compensating action`

#### Quy tắc cứng (nhúng vào SA)

1. **Payment success ≠ Delivery success.** Không gộp 1 status.  
2. Thanh toán OK + fulfillment fail → **không auto-refund**; chuyển `WAITING_ADMIN` / ticket + policy hoàn tay.  
3. Mỗi lần gọi supplier = **1 attempt record** mới; timeout không “buy lại” mù, mà `checkTransaction`.  
4. Mọi transition quan trọng ghi Audit (who/when/why/correlation_id).

#### Acceptance của artifact

- [ ] Có diagram + bảng transition đủ 4 thực thể trên  
- [ ] Có ≥ 5 scenarios: happy path Instant; Manual; payment fail; pay OK fulfill fail; webhook trùng  
- [ ] BA + Tech Lead ký review

---

### P0-2. Idempotency & Webhook (Money Safety)

**Mục tiêu:** Không double-charge, không double-fulfill, webhook retry an toàn.

#### Phạm vi API bắt buộc có Idempotency-Key (hoặc tương đương)

| Operation | Key scope đề xuất | Response khi trùng key |
|-----------|-------------------|------------------------|
| Create order | `(customer_id, key)` hoặc `(agent_id, agent_request_id)` | HTTP 200 + kết quả gốc |
| Create payment session | `(order_id, key)` | Cùng payment session |
| Apply refund | `(payment_id, key)` | Cùng refund result |
| Partner place order | `(partner_id, partner_request_id)` **UNIQUE** | 200 + original |
| Supplier attempt request_id | Unique per provider attempt | Không tạo attempt mới |

#### Webhook inbound (Payment GW)

| Mục | Quyết định cần ghi |
|-----|-------------------|
| Verify signature | Thuật toán / header / secret storage |
| Dedup key | `payment_reference` UNIQUE toàn cục |
| Persist-before-side-effect | Lưu event → enqueue → ACK |
| Processing | Worker mới được gọi fulfill / cập nhật ledger |
| Retry from GW | An toàn vì idempotent |
| Late / out-of-order | Rule theo timestamp + terminal state |

#### Webhook outbound (Partner)

| Mục | Quyết định cần ghi |
|-----|-------------------|
| Sign payload | HMAC scheme |
| Retry policy | backoff, max attempts, DLQ |
| Delivery log | request/response stored |

#### Acceptance

- [ ] Bảng key scope + uniqueness  
- [ ] Sequence: webhook → DB → queue → worker  
- [ ] Test matrix: duplicate webhook ×3; client retry create order ×3  

---

### P0-3. Supplier Adapter Contract

**Mục tiêu:** Thêm/supplier đổi không phá Order/Fulfillment.

#### Interface tối thiểu (mô tả trong SA — chưa code)

| Method | Input chính | Output chính | Ghi chú |
|--------|-------------|--------------|---------|
| `buyCard` / `provision` | sku mapping, qty, client_request_id | provider_tx_id, status, licenses? | Chỉ gọi khi chưa có attempt success |
| `topup` (nếu có) | … | … | Tách khỏi buy nếu khác nghiệp vụ |
| `checkTransaction` | provider_tx_id / request_id | status chuẩn hóa | **Bắt buộc khi timeout** |
| `getBalance` | — | balance | Monitoring / gate soft |
| `syncProduct` | — | catalog mapping | Admin/job |

#### Chuẩn hóa status về KEYON

`PENDING | SUCCESS | FAILED | UNKNOWN` (+ map bảng từng supplier).

#### Timeout policy

```
Call supplier
  ├─ SUCCESS → fulfill success path
  ├─ FAILED (explicit) → fail attempt; theo policy retry/new attempt hoặc WAITING_ADMIN
  └─ TIMEOUT / UNKNOWN → checkTransaction (không buy lại)
        ├─ SUCCESS → recover
        ├─ PENDING → requeue check
        └─ FAILED / still unknown after N → WAITING_ADMIN + alert
```

#### Dữ liệu bắt buộc lưu mỗi attempt

`provider, request_id, provider_tx_id, request_payload_encrypted?, response, status, started_at, finished_at, order_item_id`

#### Acceptance

- [ ] Contract trên cho ≥ Instant + Manual (+ Subscription stub)  
- [ ] Mapping status 1 bảng  
- [ ] Timeout flow ký review  

---

### P0-4. License Inventory & Reservation

**Mục tiêu:** Instant fulfillment không race; Manual không “quên giữ chỗ”.

#### Object model logic

- `LicensePool` / stock theo Variant (+ Region/Duration nếu cần)  
- `LicenseUnit` (từng key/seat token — encrypted at rest)  
- `Reservation` (order_item_id, ttl, status)

#### Luồng Instant

1. Payment success → create Fulfillment Task  
2. `RESERVE` N units (atomic)  
3. Nếu thiếu stock → `WAITING_ADMIN` (vẫn **không** disable bán theo policy platform: ghi chú trong doc)  
4. Deliver → mark `DELIVERED` + notify  
5. Cancel/expire reservation → `RELEASE`

#### Quy tắc

| Rule | Mô tả |
|------|------|
| TTL reservation | vd. 15–60 phút hoặc đến khi order terminal |
| Concurrency | DB constraint / row lock strategy (mô tả logic, chưa SQL) |
| Encryption | PIN/key không plain; ai decrypt được (role) |
| Audit | mọi allocate/release |

#### Acceptance

- [ ] Sequence Instant + hết hàng  
- [ ] Quy tắc TTL/RELEASE  
- [ ] Threat: nhân viên export kho — control  

---

### P0-5. Logical ERD (Commerce + Fulfillment + Finance)

**Mục tiêu:** Single source of truth đủ quan hệ, chưa cần DDL.

#### Domain tối thiểu Phase 1

`User/Customer`, `Brand/Product/Variant`, `Cart?/Order/OrderItem`, `Payment/PaymentAttempt`, `FulfillmentTask`, `ProviderTransaction`, `LicenseUnit/Reservation`, `Invoice?` (có thể Phase 2), `AuditLog`, `ApiKey` (nếu Partner chưa làm thì ghi “Phase 3”)

#### Với mỗi entity bắt buộc ghi

- Primary identifier  
- Unique business keys  
- Soft delete?  
- Ownership domain  
- Quan hệ 1–N quan trọng  
- Field nhạy cảm (encrypt/hash)

#### Uniqueness cứng gợi ý

| Key | Scope |
|-----|------|
| `payments.payment_reference` | GLOBAL unique |
| `(agent_id, agent_request_id)` | per agent (khi có) |
| `provider_transactions.request_id` | per provider attempt |
| `license_unit` code hash | unique in pool |

#### Acceptance

- [ ] ERD diagram đọc được (Lucid/Miro/draw.io đính kèm)  
- [ ] Bảng uniqueness  
- [ ] Không còn “entity list không quan hệ” như App B hiện tại  

---

### P0-6. Partner / Agent Money Model (nếu Phase có B2B sớm — nếu không: ghi “Phase 3” rõ)

**Mục tiêu:** Không âm số dư ảo; không nhầm reference.

#### HOLD model

```
Create billable transaction
  → Ledger HOLD (reference_type + reference_id = transaction_id)
  → Create order / provider processing
       ├─ Provider SUCCESS → HOLD → DEBIT
       └─ Provider FAIL    → HOLD → RELEASE
```

#### Quy tắc

- Reference **transaction_id**, không dùng order_code làm ledger key duy nhất  
- Không auto-refund khi provider fail  
- Settlement/commission tách khỏi customer retail payment nếu khác kênh  

Nếu KEYON Phase 1 **không** làm Partner credit: ghi rõ trong SA “Out of scope Phase 1” để tránh nửa model.

#### Acceptance

- [ ] Decision: có/không Phase 1  
- [ ] Nếu có: sơ đồ HOLD + bảng entry types  

---

### P0-7. NFR & SLO Draft

**Mục tiêu:** Có số để dual review (product vs eng). Có thể chỉnh sau, nhưng không để trống.

| Metric | Draft gợi ý (điền số thật) | Phục vụ |
|--------|----------------------------|---------|
| API p95 (catalog read) | ___ ms | FE UX |
| Checkout create order p95 | ___ ms | Conversion |
| Payment webhook → Order PAID | ___ s | Money lag |
| Instant fulfill p95 sau PAID | ___ s / ___ min | Customer promise |
| Manual fulfill SLA | ___ business hours | Ops |
| Queue lag alert | ___ | On-call |
| RPO / RTO (DB) | ___ / ___ | DR |
| Availability monthly | ___ % | SLA commercial |

Thêm error budget & alerting ownership (ai nhận Pager).

#### Acceptance

- [ ] Bảng có số (dù “giả định v0”) + ngày revisit  

---

### P0-8. ADR Stack Decision

**Mục tiêu:** Chấm dứt “cloud-agnostic tuyệt đối = không chọn gì”.

#### ADR-001 — Application shape (bắt buộc trước code)

**Options:** Modular Monolith (khuyến nghị Phase 1–3) vs Microservices sớm  

**Khuyến nghị TA:** Modular Monolith + module boundaries cứng + async queue; tách service khi có pain thật (scale độc lập / team topology).

Ghi: Context, Decision, Consequences, Revisit triggers.

#### ADR-002 — Data store

Primary OLTP (vd. PostgreSQL), cache?, object storage cho media, search?  

#### ADR-003 — Async backbone

Queue (vd. Redis + BullMQ / SQS / …) — chọn 1 cho Phase 1  

#### ADR-004 — Secrets & encryption

Secret manager; AES for secrets at rest; bcrypt/argon2 for API key hash; never encrypt-for-compare API keys  

#### ADR-005 — Deployment baseline

Environments Dev/Staging/Prod; IaC tool; backup  

#### Acceptance

- [ ] ADR-001…003 approved trước khi scaffold repo lớn  

---

## Phần C. Roadmap Phase 1–3 realist hơn

### C.1. Nguyên tắc xếp phase

1. **Money path trước content path** (Order/Pay/Fulfill trước CMS sâu).  
2. Mỗi phase phải có **exit criteria đo được**.  
3. “Có thể mở rộng sau” ≠ “làm skeleton mọi thứ ngay”.  
4. Semi-automated: Manual fulfillment là **first-class**, không phải tạm bợ xấu hổ.  
5. Partner/AI/Global không vào Phase 1 dù Vision có nhắc.

### C.2. So sánh nhanh với Blueprint cũ

| Cũ (rủi ro) | Đề xuất |
|-------------|---------|
| Phase 1: Auth+Catalog+Pricing+Order+Pay+Fulfill+CMS+SEO+Admin | Phase 1: Money + Manual/Instant lõi + Admin tối thiểu |
| Phase 2: Commerce expansion (gift, loyalty…) | Phase 2: Catalog/CMS/SEO + refund/invoice cứng |
| Phase 3: Subscription platform | Phase 3: Subscription + renewal (+ Partner chỉ khi sẵn sàng) |
| Phase 4–7 sớm Partner/AI/Global | Để “Later backlog”, không đánh số cứng |

---

### C.3. Phase 1 — Foundation (Money Path)

**Mục tiêu sản phẩm:** Khách mua Variant → thanh toán → nhận license (instant hoặc manual) → xem lịch sử.

#### In scope

| Workstream | Chi tiết tối thiểu |
|------------|-------------------|
| Identity | Register/login, basic RBAC Admin/Staff/Customer |
| Catalog | Brand, Product, Variant, price, fulfillment_type |
| Checkout | Order + OrderItem |
| Payment | 1 cổng chính; webhook idempotent |
| Fulfillment | Instant (kho) + Manual queue + Admin hoàn tất |
| Customer Portal | Đơn hàng, xem license đã giao |
| Admin | Catalog CRUD nhẹ, orders, fulfillment queue, basic audit |
| Observability | Structured logs + payment/fulfillment metrics cơ bản |

#### Explicit out of scope Phase 1

CMS builder, blog sâu, SEO tooling đầy đủ, coupon/gift/loyalty, Partner API, subscription auto-renew, multi-currency, AI, white-label.

#### Exit criteria (Go sống)

- [ ] 1 happy Instant + 1 happy Manual trên staging với cổng thanh toán thật/sandbox  
- [ ] Webhook duplicate không double-fulfill  
- [ ] Timeout supplier (nếu đã gắn API) đi đúng check path  
- [ ] Audit đủ cho hoàn tiền tay  
- [ ] P0-1…P0-5 + ADR-001…003 đã approved  

**Definition of Done tài liệu Phase 1:** SA critical path đóng; Eng Spec OpenAPI cho Order/Payment/Fulfill v0.

---

### C.4. Phase 2 — Commerce & Content Hardening

**Mục tiêu:** Tăng chuyển đổi + vận hành nội dung + chặt tài chính bán lẻ.

#### In scope

- Cart nâng cao, promotion/coupon (nếu ROI rõ)  
- Refund workflow có policy + audit  
- Invoice cơ bản  
- CMS pages/blog + SEO metadata/sitemap/canonical (đủ bán organic)  
- Admin báo cáo đơn giản (GMV, fulfill SLA)  
- Reconciliation job cổng thanh toán (daily)  

#### Out of scope

Partner ecosystem, AI, multi-region.

#### Exit criteria

- [ ] Refund không phá ledger/order state  
- [ ] Daily reconcile báo lệch được  
- [ ] Công bố ≥ N landing/SEO pages theo IA Lớp 1  

---

### C.5. Phase 3 — Subscription Platform (+ Partner optional gate)

**Mục tiêu:** Từ bán key → quản lý chu kỳ.

#### In scope (Subscription)

- Subscription entity, seats (nếu cần), renewal manual trước  
- Reminders, expiry states  
- Provisioning task riêng (不等同 Instant license)  
- Auto-renew **chỉ khi** payment mandate ổn  

#### Partner — chỉ mở nếu gated

Gate: Phase 1–2 money path ổn ≥ X tuần; có nhu cầu ĐL thật; ADR partner money (P0-6) xong.

Partner tối thiểu: API key, place order idempotent, webhook outbound, price list — **chưa** white-label.

#### Exit criteria

- [ ] Renewal không tạo order/payment mơ hồ  
- [ ] Subscription fail path → WAITING_ADMIN rõ  
- [ ] Nếu có Partner: load test + abuse cases (key leak, replay)  

---

### C.6. Later backlog (không đánh Phase cứng)

Giữ Vision nhưng **không schedule**: Gift card, Loyalty, Marketplace, AI support, Multi-region, CSP enterprise deal desk, Public developer platform…

Mỗi item cần: hypothesis kinh doanh + dependency architecture + phase đề xuất khi quay lại.

---

### C.7. Dependency map (để đặt vào Roadmap page)

```
P0 Artifacts & ADR ──► Phase 1 Money Path ──► Phase 2 Content+Finance harden
                                              │
                                              └──► Phase 3 Subscription
                                                       │
                                                       └──► Partner (gated)
```

Không có mũi tên nào từ “CMS Phase 1” vào money path — CMS không block Phase 1.

---

## Phần D. Cách áp vào file Word hiện tại (thao tác biên tập)

1. **Duplicate** file gốc → `KEYON EA — Vision v1.1` / `KEYON SA v0.1` / `KEYON Roadmap v0.1`.  
2. Vision: cắt dán Ch1–7; xóa Ch9–18 khỏi file này.  
3. SA: tạo file mới theo mục lục A.4; **copy có chọn lọc** đoạn đúng từ Ch8/10/11/12/15; không copy nguyên chương.  
4. Với mỗi mục “Ví dụ:” trống / sơ đồ thiếu semantics → thay bằng bảng transition hoặc ghi `TODO(owner, date)`.  
5. App B/C: App B → phụ lục SA “Entity Catalog”; App C → “Integration Standards” + trỏ sang Eng Spec chưa viết.  
6. App D–L: một người review trong ½ ngày — giữ ≤ 20 trang checklist hoặc archive.  
7. Trang bìa mỗi file ghi: **Status (Draft/Review/Approved), Owner, Last reviewed, Depends on**.

---

## Phần E. Definition of Done — “Blueprint đã hoàn thiện đủ để code”

Có thể bắt đầu scaffold / Phase 1 code khi:

| # | Điều kiện |
|---|-----------|
| 1 | Vision v1.1 approved (Non-goals rõ) |
| 2 | SA có đủ P0-1 → P0-5 (P0-6 quyết định in/out) |
| 3 | ADR-001 → ADR-003 approved |
| 4 | Roadmap Phase 1–3 + exit criteria published |
| 5 | Threat model TOP 10 KEYON có control map tối thiểu |
| 6 | Tech Lead + PO ký “money path review” |

Chưa đủ nếu chỉ có: 18 chương nguyên tắc + phụ lục handbook dày.

---

*Tài liệu đề xuất chỉnh sửa — không phải implementation. Có thể dùng song song với `KEYON EA Architecture Review.md`.*
