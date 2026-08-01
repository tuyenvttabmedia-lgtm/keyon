# KEYON — Kế hoạch triển khai (bản chính)

**Status:** Draft **v1.3** — **Architecture Freeze CLOSED** · Engineering: SePay Production · 2026-07-21  
**Audience:** Founder / PO / Ops / Tech Lead / Reviewer  
**Nguyên tắc:** Spec→Freeze→Implement→Exit→PASS→Core Stable→Pilot · không refactor vì cảm hứng  
**ADR:** [`docs/adr/`](adr/README.md) · Freeze: [`ARCHITECTURE-FREEZE.md`](ARCHITECTURE-FREEZE.md)  
**Ops:** `OPERATIONS.md` · `RUNBOOK.md` · Sprint 1.5 / SePay: `SEPAY-PRODUCTION.md`

**Gộp từ:** Fulfillment Strategy + Pax8 · SoftVN/PaciSoft · tối giản vận hành · bổ sung Capability / Supplier / Deliverable / Post Delivery  

**Stub file nguồn** trỏ về đây — mọi cập nhật chỉ sửa **file chính**.

---

## Lộ trình chốt (v1.2)

```
Foundation ✅ → Phase A ✅ → Pool ✅ → Inventory ✅ → SePay ✅
    → Architecture Freeze CLOSED
    → Monitoring   ← ĐANG (M1–M7)
    → Dashboard → Backup → Internal Test → Pilot → Pax8 1 SKU
```

**Vai trò:** Technical Reviewer — ADR / Exit / Core Stable / evidence.

### Core Stable & Pilot (chốt 2026-07-21)

Sau **SePay P1–P10 PASS**, khóa Core: Order · Payment · Fulfillment · License Pool · Inventory.  
Sprint tiếp: Monitoring · Dashboard · Backup · Internal Test · **Pilot** — không đổi nghiệp vụ cốt lõi vì “ý tưởng hay hơn”.  
Chỉ mở lại Core khi Pilot chứng minh lỗi nghiệp vụ / bottleneck / UX-ops hỏng. Chi tiết: `docs/adr/README.md`.

### Phase B thu nhỏ (sau Pilot)

Không tích hợp “toàn bộ Pax8”. Chỉ:

```
1 Supplier (Pax8)
  → 1 Product (vd. Microsoft 365 Business Basic)
    → 1 SKU
      → Provision
        → Complete
```

Khi 1 SKU ổn mới nhân rộng thêm SKU / quote / VAT.

---

## Capability Matrix (nhìn 30 giây)

| Capability | Phase | Ghi chú |
|------------|-------|---------|
| **Manual** fulfillment | **A** ✅ | Inbox người — mặc định khỏe |
| **Instant** fulfillment | **A** ✅ | Kho nội bộ + giao sau pay |
| **Production readiness** | **1.5** | Pool → Inventory → SePay → Monitor → Dashboard → Backup → Test |
| Dual funnel (mua / báo giá) | A (mua) · **B** (quote đầy đủ) | SoftVN-style |
| **Semi-Automated** + Pax8 | **B** | **Bắt đầu đúng 1 SKU** sau Pilot |
| VAT / HĐ B2B · reconcile sâu | **B** (sau 1 SKU) | |
| **Managed Subscription** | **C** | Vòng đời seat / renew |
| Post Delivery: Resend / Replace / Warranty | **A** ✅ mỏng · cứng **B** | |
| Post Delivery: Upgrade / Renew / Ticket sâu | **B–C** | Renew mạnh ở C |
| Partner / Đại lý · Marketplace (AWS…) | Later | |

Enum / cấu hình Variant **ghi đủ từ đầu trên giấy**; chỉ **bật vận hành** theo Phase.

---

## 0. Kết luận đã chốt

KEYON giai đoạn đầu = **cửa hàng license + phòng máy xử lý đơn**, không phải enterprise platform đầy đủ.

| Quyết định | Nội dung |
|------------|----------|
| Fulfillment strategy | `manual` · `instant` · `semi_automated` · `managed_subscription` (matrix trên) |
| Deliverable type | `key` · `account` · `subscription` · `digital_file` · `external_portal` — **tách khỏi** strategy |
| Supplier | Entity **Supplier** + **supplier_type** (không nhét “pax8” vào một field phẳng) |
| Pax8 | Distributor API — **sau** Sprint 1.5 + Pilot; lần đầu **đúng 1 SKU** rồi mới nhân rộng |
| Thứ tự sau Phase A | **Sprint 1.5 Production Readiness** → Pilot → Pax8 1 SKU → Phase B |
| Post Delivery | Tầng sau COMPLETED: Resend → Replace → Warranty → Upgrade → Renew → Support |
| Thị trường VN | SoftVN dual funnel/SLA/license model; PaciSoft VAT/content — không copy phần cứng / chỉ báo giá |
| Phức tạp được phép | (1) PAID ≠ đã giao (2) fail giao → người, không auto-refund (3) idempotency + mã hóa deliverable nhạy cảm + audit |
| Ops | `OPERATIONS.md` (thường ngày) · `RUNBOOK.md` (sự cố on-call) |

---

## 1. Mô hình sản phẩm trên Variant

```
Variant
  ├─ license_model           # perpetual | subscription | maintenance
  ├─ fulfillment_strategy    # manual | instant | semi_automated | managed_subscription
  ├─ deliverable_type        # key | account | subscription | digital_file | external_portal
  ├─ sales_motion            # self_serve | quote_required
  ├─ sla_promise             # text / phút-or-giờ trên PDP
  ├─ supplier_id             # FK → Supplier (nullable nếu thuần kho nội bộ qua Internal)
  ├─ upstream_product_ref    # id bên NCC (vd. Pax8 productId) — nullable
  └─ requires_provisioning_fields[]
```

### 1.1. Các trục độc lập (đừng gộp)

| Trục | Ví dụ | Dùng để |
|------|-------|---------|
| **license_model** | perpetual / subscription / maintenance | Giải thích, giá, gia hạn (SoftVN) |
| **fulfillment_strategy** | manual / instant / SA / MS | Inbox, engine, Phase |
| **deliverable_type** | key / account / subscription / … | UI “tài sản của tôi”, form giao hàng, bảo mật |
| **sales_motion** | self_serve / quote_required | CTA mua vs báo giá |
| **Supplier** | KEYON Stock / Pax8 / PACISOFT | Ai cung ứng — type quyết định tích hợp |

Ví dụ:

| SP | license_model | strategy | deliverable | supplier |
|----|---------------|----------|-------------|----------|
| Windows retail | perpetual | instant | key | KEYON Stock (Internal) |
| Antivirus dán tay | perpetual | manual | key | NCC tay (External hoặc Distributor) |
| M365 qua Pax8 | subscription | semi_automated → MS | subscription / external_portal | Pax8 (Distributor) |
| File cài + serial | perpetual | manual/instant | digital_file (+ key) | Internal / External |

---

### 1.2. Fulfillment Strategy

| Strategy | Phase | Pax8? | Vận hành |
|----------|-------|-------|----------|
| **Manual** | A | Không | Staff nhập deliverable theo `deliverable_type` |
| **Instant** | A | Không | Trừ kho Internal → giao |
| **Semi-Automated** | B | Thường có | API + human-in-the-loop |
| **Managed Subscription** | C | Có | Vòng đời sau NetNew |

> Semi-Automated ≠ nửa Instant/Manual. = automation + **van người** khi thiếu data / fail / timeout.

---

### 1.3. Deliverable Type (bắt buộc — Pax8 ít khi có key)

| Type | Ý nghĩa | Phase UI tối thiểu |
|------|---------|-------------------|
| **key** | Key/serial/PIN | A — hiện + copy + mã hóa |
| **account** | User/pass hoặc invite | A — form giao + cảnh báo bảo mật |
| **subscription** | Gói theo chu kỳ (seat, kỳ hạn) | B draft · **C** đủ |
| **digital_file** | Link/file tải (installer, PDF) | A nếu có SP |
| **external_portal** | “Vào portal hãng / admin M365…” | B với SA |

Một Variant **một deliverable_type chính**. Nếu cần kèm file hướng dẫn: metadata phụ, không nhân type.

Fulfillment Job **hoàn tất** = đã ghi nhận Delivery record đúng type (không giả định luôn là key).

---

### 1.4. Supplier (bỏ `supplier_channel` phẳng)

```
Supplier
  ├─ name                 # KEYON Stock | Pax8 | PACISOFT | …
  ├─ supplier_type        # internal | external | distributor | marketplace
  ├─ integration_mode     # none | manual_ops | api   ← Phase A hầu hết none/manual_ops
  └─ config / credentials # chỉ khi api (Pax8 Phase B)
```

| supplier_type | Ví dụ | Ghi chú |
|---------------|-------|---------|
| **internal** | KEYON Stock | Kho Instant |
| **external** | NCC lấy key lẻ / Zalo | Manual; không API |
| **distributor** | Pax8, PACISOFT | Cùng type — khác `integration_mode` (api vs manual_ops) |
| **marketplace** | AWS Marketplace (sau) | Thêm supplier mới — **không đổi schema type** |

Variant trỏ `supplier_id` (+ `upstream_product_ref` khi distributor/marketplace có SKU map).

→ Thêm AWS Marketplace sau = **thêm dòng Supplier**, không sửa enum chiến lược.

---

### 1.5. Dual funnel & SLA (SoftVN)

| Funnel | Khi | Phase |
|--------|-----|-------|
| Mua ngay (`self_serve`) | Giá niêm yết, SP chuẩn | A |
| Nhận báo giá (`quote_required`) | DN, SL lớn, phức tạp, VAT | B đầy đủ |

| Strategy | SLA UX |
|----------|--------|
| Instant | ≤ 15–30 phút |
| Manual | 2–8 giờ làm việc |
| Semi-Automated | “Đang kích hoạt NCC” + tiến độ |
| Managed Subscription | “Thiết lập gói” → trang subscription |

Báo giá = sales motion. Distributor API (Pax8) = upstream fulfill.

---

## 2. Luồng: Order → Payment → Fulfillment → **Post Delivery**

```
Order → Payment → Fulfillment → COMPLETED
                                    ↓
                              Post Delivery
                         (Resend / Replace / Warranty /
                          Upgrade / Renew / Support)
```

### 2.1. Trạng thái khách (gọn)

| Hiển thị | Ý nghĩa |
|----------|---------|
| Chờ thanh toán | |
| Đã thanh toán — đang xử lý | PAID + fulfill |
| Hoàn tất | Đã có Delivery |
| Thất bại / hủy | |
| Đang chờ xử lý thêm | Thiếu info / hết kho / chờ NCC |

### 2.2. Rules cứng

1. Payment success ≠ Delivery success  
2. Pay OK + fulfill fail → WAITING_HUMAN, không auto-refund  
3. Timeout upstream → check/reconcile, không create/giao trùng  
4. Deliverable nhạy cảm (key/account) mã hóa; audit giao / resend / replace / hoàn / đổi giá  

### 2.3. Fulfillment Inbox

Một hộp thư · lọc strategy · tuổi job · SLA · **deliverable_type** · supplier.

| Strategy | Thao tác |
|----------|----------|
| Manual | Nhập đúng type → giao → email |
| Instant | Tự trừ kho Internal / chờ stock |
| Semi-Automated | Bổ sung field / Retry / Chờ NCC · Pax8 id |
| Managed Subscription | Subscription record · (C) gia hạn |

### 2.4. Luồng fulfill (tóm tắt)

**Manual:** `PAID → QUEUED → staff tạo Delivery(type) → COMPLETED + email`  
**Instant:** `PAID → reserve Internal → Delivery(key) → COMPLETED` · hết kho → WAITING_STOCK  
**Semi-Automated:** validate → Create upstream order (idempotent) → PENDING → SUCCESS Delivery(subscription/portal/…) / FAIL|TIMEOUT → human  
**Managed Subscription:** NetNew như SA + lifecycle Phase C  

### 2.5. Post Delivery (giữ chân — đừng bỏ quên)

Sau `COMPLETED`, khách/CS thao tác trên **Delivery / Subscription** đã gắn Order:

| Hành động | Ý nghĩa | Phase |
|-----------|---------|-------|
| **Resend** | Gửi lại thông tin đã giao (email/portal) | **A** (giới hạn số lần + audit) |
| **Replace** | Thu hồi bản cũ (nếu policy) + giao bản mới | **A** policy · ops **B** vững |
| **Warranty** | Khiếu nại trong hạn BH | **A** policy 1-pager · quy trình **B** |
| **Upgrade** | Đổi gói / nâng tier (order mới hoặc change) | **B–C** |
| **Renew** | Gia hạn chu kỳ | **C** (thuê bao); manual nhắc **B** OK |
| **Support Ticket** | Ticket gắn Order + Delivery | **A** mỏng (Zalo/email+ghi chú) · **B** form trong portal |

**Quy tắc:** Post Delivery **không** tạo Payment mới trừ Upgrade/Renew có thu tiền (order/payment riêng). Resend/Replace trong BH ≠ refund tự động.

Portal khách Phase A tối thiểu: xem Delivery + nút Resend (nếu còn lượt) + liên hệ hỗ trợ kèm mã đơn.

### 2.6. Vai trò mỏng

Chủ · Fulfillment/Kho · CS · (Kế toán xem).

---

## 3. SoftVN / PaciSoft — giữ / bỏ

| Giữ | Bỏ / hoãn |
|-----|-----------|
| Dual CTA, SLA điện tử, license education | Chỉ chat mới mua |
| M365 → Distributor Pax8 | Phần cứng |
| VAT / MST / content so sánh gói | Catalog vạn SKU · Đại lý sớm |

---

## 4. Phạm vi Phase (chi tiết)

| Phase | Fulfill | Deliverable trọng tâm | Supplier | Post Delivery |
|-------|---------|----------------------|----------|---------------|
| **A** ✅ | Manual + Instant | key, account, digital_file | Internal + External (+ Distributor **manual_ops**) | Resend · Warranty policy · Support mỏng |
| **1.5** | Pool → Inventory → SePay → Monitor → Dashboard → Backup → Internal Test | — | — | + notifications · security · OPERATIONS + RUNBOOK |
| **B** (thu nhỏ→mở) | + Semi-Automated **1 SKU trước** | + subscription / external_portal | + Distributor **api** (Pax8) | Replace vững · Ticket · Quote/VAT (sau 1 SKU) |
| **C** | + Managed Subscription | subscription đầy đủ | Pax8 lifecycle | Renew · Upgrade có kiểm soát |
| **Later** | — | — | Marketplace (AWS…) · Partner | |

---

## 5. Kế hoạch bước triển khai (chưa dev)

### Bước 0 — Freeze (0,5–1 ngày)

- [ ] Approve file chính **v1.2** (Sprint 1.5 trước Pax8 · Phase B 1 SKU)  
- [ ] Non-goals: không Pax8 trước Pilot; không phần cứng; không Partner sớm; không Instant qua Pax8; không auto-refund mù; không giả định mọi SP là key  
- [ ] Owner: PO + Founder  

### Bước 1 — Catalog giấy + Supplier sheet (1–2 ngày)

Variant fields bắt buộc:

| Field | |
|-------|--|
| SKU / tên | ✓ |
| license_model | ✓ |
| fulfillment_strategy | ✓ |
| **deliverable_type** | ✓ |
| sales_motion | ✓ |
| sla_promise | ✓ |
| **supplier** (tên + type) | ✓ |
| giá bán / giá vốn | ✓ |
| upstream_product_ref | Phase B nếu api |
| provisioning fields | Phase B |

Sheet riêng `Suppliers v0`:

| name | supplier_type | integration_mode | ghi chú |
|------|---------------|------------------|---------|
| KEYON Stock | internal | none | Instant |
| … | external | manual_ops | |
| Pax8 | distributor | api (B) | |
| PACISOFT | distributor | manual_ops | báo giá / lấy tay |

- [ ] ≥ 5 Instant + ≥ 5 Manual; ≥ 2 dòng “tương lai SA/M365” (deliverable ≠ key)  
- [ ] Owner: PO + Ops  

**Output:** `KEYON Catalog v0` + `Suppliers v0`.

### Bước 2 — Policy 1-pager (1 ngày)

- [ ] SLA Instant/Manual  
- [ ] Hoàn tiền  
- [ ] **Resend / Replace / Warranty** (điều kiện, số lần, ai duyệt)  
- [ ] Giờ Inbox  
- [ ] Owner: Ops + Founder  

### Bước 3 — State + Inbox + Post Delivery giấy (1 ngày)

- [ ] Order / Payment / FulfillmentJob / **Delivery** (có deliverable_type)  
- [ ] Inbox: cột strategy + deliverable_type + supplier  
- [ ] Luồng Post Delivery: Resend / Replace / Warranty (happy + abuse)  
- [ ] Kịch bản: Instant key · Manual account · hết kho · pay OK fail giao · webhook trùng · **resend lần 2**  
- [ ] Owner: PO + Tech Lead  

### Bước 4 — Payment (0,5–1 ngày)

- [ ] 1 cổng · payment_reference unique · webhook persist-then-queue  

### Bước 5 — Pax8 prep (**sau** Sprint 1.5 + Pilot — không chặn A / 1.5)

- [ ] Partner model · sandbox · map **đúng 1 SKU** (vd. M365 Business Basic)  
- [ ] Xác nhận deliverable_type (thường subscription / external_portal)  
- [ ] Provision → Complete E2E trước khi thêm SKU thứ 2  

### Bước 6 — UX giấy (1–2 ngày)

- [ ] PDP: CTA theo sales_motion · SLA · **không hứa “nhận key” nếu type khác**  
- [ ] “Tài sản của tôi”: renderer theo deliverable_type  
- [ ] Resend + liên hệ hỗ trợ  
- [ ] Trang license_model (SoftVN-style)  

### Bước 7 — Admin (1 ngày)

- [ ] Catalog · Suppliers · Đơn · Inbox · Kho Internal · Lead báo giá · Delivery/Resend log · Audit  

### Bước 8 — Bảo mật checklist (0,5 ngày)

- [ ] Mã hóa key/account · audit Resend/Replace · secrets Pax8 ngoài repo · rate limit login  

### Bước 9 — Gate mở Phase A build

- [ ] Bước 0–4, 6–8  
- [ ] Catalog + Suppliers giấy  
- [ ] Policy gồm Post Delivery tối thiểu  
- [ ] State/Inbox/Delivery giấy  
- [ ] 1 cổng pay  

**Chưa cần:** Pax8 live · Managed Subscription chi tiết · Marketplace · Partner.

### Bước 10 — Lịch (cập nhật v1.2)

| Khối | Việc | Status |
|------|------|--------|
| Phase A + Sprint 0.5–1 | Manual+Instant · Admin · Resend/Replace · stub pay | ✅ |
| **Sprint 1.5** | **1.Pool → 2.Inventory → 3.SePay → 4.Monitor → 5.Dashboard → 6.Backup → 7.Internal Test** | **Next** |
| Internal Testing → Pilot | Khách thật trên Instant/Manual | Sau 1.5 |
| **Sprint 2** | Pax8 **1 Supplier · 1 Product · 1 SKU** · Provision → Complete | Sau Pilot |
| Phase B mở rộng | Thêm SKU · Quote/VAT · Replace/Ticket vững | Sau 1 SKU ổn |
| Phase C | Managed Subscription · Renew | Later |

---

## 6. Việc cần tránh

| Tránh | Lý do |
|-------|------|
| **Pax8 ngay sau MVP** | Tiền + kho + ops chưa sẵn → nợ kỹ thuật & rủi ro khách thật |
| Tích hợp “toàn bộ catalog” Pax8 lần 1 | Chỉ 1 SKU đến khi ổn |
| Mọi SP coi như **key** | Sai Pax8 / account / portal |
| `supplier_channel = pax8` phẳng | Khó thêm Marketplace / PACISOFT cùng kiểu Distributor |
| Instant → Pax8 | |
| Managed Subscription / Renew sâu ngày 1 | |
| Post Delivery = refund tự động | |
| Create Order trùng khi timeout | |
| Excel + KEYON + Pax8 không đối soát | |
| Production không có backup/restore đã test | |

---

## 7. Definition of Done Phase

**A:** Ops không Excel cho đơn Manual/Instant mới; Delivery đúng type; Resend có audit; pay webhook không giao trùng. ✅ (localhost)

**1.5 (Pilot gate):** License Pool vững; Inventory 🟢🟡🔴; SePay E2E + idempotent; monitoring; dashboard ops; backup verify; ~25–30 internal tests xanh; `OPERATIONS.md` + `RUNBOOK.md` dùng được.

**B (thu nhỏ rồi mở):** SA **1 SKU** Distributor API ổn → mới thêm SKU / Quote+VAT / Ticket vững.

**C:** Subscription portal + Renew theo policy.

---

## 8. Tài liệu liên quan (trong `docs/`)

| File | Vai trò |
|------|---------|
| **File này (v1.2)** | Nguồn sự thật kế hoạch triển khai |
| `adr/README.md` | Index ADR + quy trình Spec/Freeze/Exit + Core Stable |
| `adr/ADR-001` … `005` | Stack · Pool · Inventory RM · Payment · Fulfillment |
| `PAYMENT-ARCHITECTURE-v1.md` | **FROZEN** — chi tiết Payment (bổ sung ADR-004) |
| `SEPAY-PRODUCTION.md` | Sprint SePay checklist |
| `OPERATIONS.md` | Sổ tay vận hành thường ngày (deploy/backup/secret/SMTP/SePay/worker) |
| `RUNBOOK.md` | Xử lý sự cố on-call (webhook/worker/pool/khách CK…) |
| `LICENSE-POOL-v1.md` | Đặc tả License Pool chốt (Sprint 1.5 bước 1) |
| `SPRINT-1.5-production-readiness.md` | Checklist Production Readiness (thứ tự 1→7) |
| `SPRINT-1-phase-a-ops.md` | Sprint 1 (done) |
| `SPRINT-0.5-architecture-hardening.md` | Hardening (done) |
| `adr/README.md` + ADR-001…005 | Quyết định kiến trúc ngắn (Context/Decision/…) |
| `ADR-001-stack.md` (root) | Stub → `adr/ADR-001-stack.md` |
| `KEYON - Fulfillment Strategy va Pax8.md` | Stub → file này |
| `KEYON - SoftVN Pacisoft ap dung.md` | Stub → file này |
| `KEYON - Ra soat van hanh & toi gian.md` | Bối cảnh tối giản (lịch sử) |
| `KEYON Blueprint - De xuat chinh sua & hoan thien.md` | Đề xuất chỉnh EA (lịch sử) |
| `KEYON EA Architecture Review.md` | Review blueprint Word gốc |

---

*Draft v1.2 — Sprint 1.5 trước Pax8 · Phase B 1 SKU · OPERATIONS + RUNBOOK · thứ tự 1.5: Pool→Inventory→SePay→…→Test.*
