# KEYON — Product UX Blueprint

> **TRẠNG THÁI:** THAM KHẢO ONLY · **Tài liệu chính:** [`KEYON-MVP-SPEC.md`](./KEYON-MVP-SPEC.md)  
> Không dùng Blueprint này để mở rộng Enterprise. Phát triển MVP theo KISS trong MVP Spec.

**Document type:** Product / UX Architecture (không phải kỹ thuật implement)  
**Role of author:** Product Owner · UX Architect · SaaS Product Designer · Website Operator  
**Status:** Draft v1.0 — thiết kế trải nghiệm toàn nền tảng  
**Date:** 2026-07-21  

> **Phạm vi tài liệu:** Information Architecture, Navigation, Sitemap, Flows, Journeys, Permissions, Screen Inventory, Customer↔Admin config mapping.  
> **Ngoài phạm vi:** code, React, Tailwind, HTML, API schema, ADR kỹ thuật.

---

## 0. Định vị sản phẩm

### KEYON là gì

KEYON **không** phải shop bán key.  
KEYON là **Digital License Platform** — nền tảng mua, giao, sở hữu, hỗ trợ và đối soát giấy phép số.

Tư duy tham chiếu: **Microsoft 365 Commerce · Stripe · Paddle · Lemon Squeezy**  
Không tham chiếu: Shopee / marketplace “giảm giá flash”.

### Đối tượng vận hành

| Persona | Mục tiêu chính trên nền tảng |
|---------|------------------------------|
| Khách cá nhân | Mua nhanh, nhận deliverable đúng loại, tự phục vụ (resend) |
| Doanh nghiệp | Mua rõ ràng, hóa đơn/VAT (giai đoạn sau), quản lý tài sản license |
| Đại lý (sau) | Giá/API/số dư — portal riêng |
| Nhà cung cấp | Cung ứng / provision (Pax8…) — không lộ ra storefront |
| Admin | Cấu hình 100% những gì khách thấy + vận hành hệ thống |
| Support / CS | Tra cứu đơn, resend, escalate, không phá money path |
| Fulfillment | Inbox đúng strategy, complete Manual, không đoán mò |
| Kế toán | Đối soát payment ↔ order ↔ delivery |

### Nguyên tắc UX cứng

1. **PAID ≠ đã giao** — UI luôn tách “đã thanh toán” / “đã nhận deliverable”.  
2. **Không hứa “nhận key”** nếu deliverable khác key.  
3. **Enum kỹ thuật không lộ** trên storefront (INSTANT/MANUAL → ngôn ngữ người dùng).  
4. **Mọi thứ khách thấy → có nơi cấu hình trong Admin** (CMS / Marketing / SEO / Policy…).  
5. **Ít thao tác · ít sai · mở rộng theo volume** (xem §0.1).  
6. **Admin ≠ Storefront skin** — Admin là cockpit; Storefront là thương hiệu.

### 0.1 Vận hành theo volume đơn/ngày

| Volume | Storefront cần | Ops cockpit cần | Rủi ro nếu giữ UI “internal tool” |
|--------|----------------|-----------------|-----------------------------------|
| **~100 đơn/ngày** | Catalog rõ, checkout 3 bước, portal “Tài sản của tôi”, FAQ/Policy | Inbox theo cột strategy, Dashboard KPI cơ bản, Resend/Replace 1 click | Khách không tin; Support trả lời lặp |
| **~500 đơn/ngày** | Tìm kiếm/lọc brand, trạng thái đơn rõ, email transactional chuẩn, giảm ticket bằng self-serve | Queue depth + SLA timer trên Inbox, bulk actions có kiểm soát, alert low-stock | Fulfillment nghẽn; sai Manual/Instant |
| **~1000 đơn/ngày** | Account org (B2B light), tìm đơn mạnh, status page khi sự cố | Workload assignment, reconciliation workspace, audit hành động sensitive, role tách cứng | Sai sót tiền/giao hàng; không scale người |

**Thiết kế cho 1000, ship UX theo lớp 100 → 500 → 1000** — không thiết kế Shopee flash sale.

---

## 1. Information Architecture (Menu website)

### 1.1 Public Storefront

| Nhóm IA | Mục đích | Ghi chú ngôn ngữ |
|---------|----------|------------------|
| **Khám phá** | Hiểu KEYON bán gì | “Sản phẩm”, “Thương hiệu”, không “SKU/Variant” |
| **Mua** | Chuyển đổi | Checkout gắn đơn + thanh toán |
| **Sở hữu** | Sau mua | “Tài sản của tôi” / “License của tôi” |
| **Tin cậy** | Giảm ma sát | Policy, SLA, Bảo hành, FAQ, Liên hệ |
| **Công ty** | Thương hiệu | Về KEYON, Bảo mật, Điều khoản |

**Primary nav (đề xuất):**

```
Sản phẩm | Thương hiệu | Cách giao hàng | Chính sách | Hỗ trợ | [Đăng nhập] [Tài khoản]
```

**Không đưa lên primary nav khách:** Admin, Inventory, Provider, Pool, Monitoring, Pax8.

### 1.2 Customer Account (sau đăng nhập)

```
Tổng quan | Đơn hàng | Tài sản (Deliverables) | Hồ sơ | Bảo mật
```

### 1.3 Admin Console (staff)

```
Home (Ops) | Đơn hàng | Inbox giao hàng | Kho & Inventory | Catalog | Nội dung (CMS)
Người dùng & RBAC | Thanh toán & Đối soát | Nhà cung cấp | Báo cáo | Cài đặt hệ thống
```

### 1.4 Support Portal (CS) — subset Admin

```
Tra cứu | Đơn của khách | Hành động cho phép | Kiến thức (FAQ nội bộ) | Escalate
```

### 1.5 Fulfillment Workspace

```
Inbox của tôi | Chờ NCC | Hết kho | Hoàn tất Manual | Lịch sử
```

### 1.6 Finance / Kế toán

```
Thanh toán | Đối soát | Biến động ngày | Xuất báo cáo
```

---

## 2. Navigation

### 2.1 Mô hình điều hướng

| Surface | Pattern | Lý do |
|---------|---------|--------|
| Storefront | Top nav + footer sâu | Giống Stripe/Lemon — ít distraction |
| PDP / Checkout | Focus mode | Giảm bỏ cuộc giữa chừng |
| Customer Portal | Left nav (desktop) + bottom tabs (mobile) | “Tài sản” luôn 1 tap |
| Admin | Left sidebar + command search (⌘K) | Scale 500–1000 đơn |
| Support | Search-first | Vào bằng mã đơn / email / payment ref |
| Fulfillment | Kanban / queue columns | Theo strategy + SLA |

### 2.2 Customer glossary (bắt buộc)

| Không dùng (nội bộ) | Dùng trên UI khách |
|---------------------|--------------------|
| INSTANT | Giao ngay sau thanh toán |
| MANUAL | Xử lý bởi KEYON (trong SLA) |
| SEMI_AUTOMATED | Kích hoạt qua nhà cung cấp |
| License Pool | (ẩn) |
| Variant / SKU | Gói / Phiên bản |
| Fulfillment job | Trạng thái giao hàng |
| provider_event_id | (ẩn; chỉ Finance/Admin) |

### 2.3 Deep links bắt buộc

- Mã đơn công khai cho khách + support  
- Checkout resume theo phiên đơn  
- Admin/Support mở đơn từ payment reference  
- Asset link ổn định trong email  

---

## 3. Sitemap

### 3.1 Public

```
/                         Home
/products                 Catalog
/products/{slug}          PDP
/brands
/brands/{slug}
/how-it-works
/policy
/policy/{slug}
/faq
/faq/{slug}
/security
/about
/contact
/status
/legal/terms
/legal/privacy
/blog                     (CMS)
/blog/{slug}
/login
/register
```

### 3.2 Checkout & payment

```
/checkout/{orderId}
/checkout/{orderId}/expired
/checkout/{orderId}/success          # money OK — chưa hẳn delivered
```

### 3.3 Customer Portal

```
/account
/account/orders
/account/orders/{id}
/account/assets
/account/assets/{id}
/account/profile
/account/security
/account/tickets
/account/org                         # B2B later
```

### 3.4 Admin Console

```
/admin
/admin/orders[/id]
/admin/inbox[/jobId]
/admin/inventory[/sku]
/admin/stock
/admin/catalog/...
/admin/suppliers[/id]
/admin/payments[/id]
/admin/reconciliation
/admin/customers[/id]
/admin/staff
/admin/roles
/admin/cms/...
/admin/marketing/...
/admin/seo/...
/admin/faq/...
/admin/reviews/...
/admin/policy/...
/admin/notifications/...
/admin/monitoring
/admin/settings
/admin/audit
/admin/reports
```

### 3.5 Support · Fulfillment · Finance

```
/support/...
/fulfillment/...
/finance/...
```

---

## 4. User Flows (cốt lõi)

### 4.1 Instant self-serve

```
Browse → PDP → Checkout → QR/AWAITING
  → PAID → Giao ngay → Tài sản + Email
  → Resend (self-serve, có hạn mức)
```

### 4.2 Manual

```
PDP (SLA rõ) → Checkout → PAID → Inbox staff → Complete → Tài sản
```

### 4.3 Semi-Automated (Pax8 / 1 SKU)

```
PDP (“Kích hoạt qua đối tác”) → PAID → Provision → Portal/Subscription delivery
  → PENDING: khách thấy “Đang kích hoạt” + ETA
```

### 4.4 Expire / fail payment

```
Hết hạn → Giải phóng giữ chỗ (Instant) → “Tạo lại đơn” rõ ràng
```

### 4.5 Replace (staff)

```
Mở đơn → Replace → Giữ bản cũ → Bản mới active → Email + Audit
```

### 4.6 Quote (giữ chỗ IA — sau)

```
PDP quote → Form lead → Admin báo giá → Link thanh toán
```

**Moment UX bắt buộc:** màn “Đã thanh toán” ≠ màn “Đã nhận deliverable”.

---

## 5. Screen Map (theo hành trình)

### Acquisition → Purchase

| ID | Screen | Mục đích |
|----|--------|----------|
| F-01 | Home | Tin cậy + vào catalog |
| F-02 | Catalog | Duyệt / lọc |
| F-03 | Brand | Uy tín |
| F-04 | PDP | Quyết định mua đúng loại giao |
| F-05 | How it works | Giáo dục SLA |
| F-06–10 | Checkout → Waiting → Money OK → Delivering → Delivered | Tách tiền / giao |

### Own → Self-serve support

| ID | Screen |
|----|--------|
| C-01 | Account home |
| C-02–03 | Orders |
| C-04–05 | Assets + Resend |
| C-06–07 | FAQ / Contact |

### Ops day

Admin Ops Home · Inbox · Order god-view · Payments · CMS publish · Reconciliation.

---

## 6. Customer Journey

```
Awareness → Consideration → Purchase → Delivery → Ownership → Support → Repeat
```

| Stage | Cảm xúc cần đạt | Touchpoint |
|-------|-----------------|------------|
| Awareness | Nền tảng license uy tín | Home, Brand, Security |
| Consideration | Biết nhận gì & khi nào | PDP, How it works, Policy |
| Purchase | Thanh toán rõ, không sợ mất tiền | Checkout, QR, trạng thái tiền |
| Delivery | Biết đang chờ hay đã có | Delivering / Delivered / Email |
| Ownership | Quản lý được tài sản | Assets |
| Support | Tự xử trước khi hỏi người | Resend, FAQ, Contact |
| Repeat | Mua lại nhanh | Account + catalog |

**Moments of truth:** PDP đúng loại giao · Sau CK không im lặng · Deliverable trong Assets · Resend có hạn · Sự cố có Status/Banner.

---

## 7. Admin Journey (Website Operator)

### Một ngày

```
Sáng: Ops Home (health, queue, low stock, đơn lệch)
  → CMS/Campaign nếu cần
  → Finance anomalies
  → Audit nếu sự cố
Cuối ngày: snapshot + đối soát nhanh
```

### Bốn cockpit

1. **Commerce** — Catalog, giá, sales motion  
2. **Fulfillment** — Inbox, kho, NCC  
3. **Money** — Payments, reconciliation  
4. **Experience** — CMS, SEO, FAQ, Policy, Reviews, Notifications  

**JTBD:** đổi Hero/FAQ/SLA copy / tắt bán gói — **không** cần deploy code.

---

## 8. Support Journey

```
Tiếp nhận (mã đơn / email)
  → Xác thực
  → Timeline: Payment | Fulfillment | Delivery | Resend/Replace
  → Hành động trong quyền
  → Ghi chú + đóng
  → Cấm: auto-refund mù, consume lại, xóa key
```

Màn then chốt: **Order Timeline** một nguồn sự thật.  
Macro trả lời lấy từ FAQ Manager (không lệch policy).

---

## 9. Fulfillment Journey

```
Inbox (strategy + SLA sắp quá hạn)
  → Manual: nhập deliverable → Complete
  → Instant lỗi/hết kho: lý do hệ thống → restock/escalate
  → Semi: theo dõi provision (không spam NCC)
  → Không đụng payment status
```

**Kanban:** `Mới TT | Đang xử lý | Chờ NCC | Chờ kho | Cần review | Xong hôm nay`

---

## 10. Permission (RBAC UX)

| Role | Storefront | Portal khách | Support | Fulfillment | Finance | CMS | System |
|------|------------|--------------|---------|-------------|---------|-----|--------|
| Guest | ✓ | — | — | — | — | — | — |
| Customer | ✓ | own | ticket | — | — | — | — |
| CS | — | via tools | ✓ | Resend* | read | FAQ read | — |
| Fulfillment | — | — | limited | Complete/Replace* | — | — | — |
| Finance | — | — | — | — | ✓ | — | — |
| Marketing | — | — | — | — | — | ✓ | — |
| Admin / Owner | theo policy | * | ✓ | ✓ | ✓ | ✓ | ✓ |

\*Replace / Impersonate: bắt buộc lý do + audit.

**Capabilities ví dụ:** `order.read`, `delivery.resend`, `delivery.replace`, `payment.reconcile`, `cms.publish`, `catalog.publish`, `staff.manage`.

---

## 11. Screen Inventory đầy đủ

### 11.1 Frontend public

FE-01 Home · FE-02 Catalog · FE-03–04 Brands · FE-05 PDP · FE-06 How it works · FE-07–08 Policy · FE-09–10 FAQ · FE-11 Security · FE-12 About · FE-13 Contact · FE-14 Status · FE-15–16 Legal · FE-17–18 Blog · FE-19–21 Auth · FE-22 Error branded · FE-23 Maintenance/Banner global

### 11.2 Checkout

CK-01 Create · CK-02 QR/Waiting · CK-03 Expired · CK-04 Money OK · CK-05 Delivering · CK-06 Delivered

### 11.3 Customer Portal

CP-01 Overview · CP-02–03 Orders · CP-04–05 Assets · CP-06 Profile · CP-07 Security · CP-08 Notif prefs · CP-09–10 Tickets · CP-11 Org (later)

### 11.4 Support Portal

SP-01 Search · SP-02 Customer 360 · SP-03 Order workspace · SP-04 Resend confirm · SP-05 Escalate · SP-06 Shift log · SP-07 Internal KB

### 11.5 Fulfillment

FF-01 Inbox board · FF-02 Job Manual · FF-03 Waiting supplier · FF-04 Out of stock · FF-05 Completed today

### 11.6 Finance

FN-01 Home · FN-02–03 Payments · FN-04 Reconciliation · FN-05 Exports

### 11.7 Admin Ops & Commerce

AD-01 Ops Home · AD-02–03 Orders · AD-04–05 Customers · AD-06–09 Catalog/Brands · AD-10–11 Suppliers · AD-12–14 Inventory/Stock · AD-15 Payments · AD-16 Monitoring · AD-17–18 Staff/Roles · AD-19 Audit · AD-20 Reports · AD-21 Settings · AD-22 Notification templates · AD-23 Feature/sales toggles

### 11.8 Admin Experience CMS (bắt buộc)

| ID | Admin | Khách thấy |
|----|-------|------------|
| CMS-01 | Homepage builder | Home |
| CMS-02 | Hero manager | Hero |
| CMS-03 | Section blocks | Home sections |
| CMS-04 | Banner manager | Global banner |
| CMS-05 | Navigation manager | Header |
| CMS-06 | Footer builder | Footer |
| CMS-07 | Trust badges | Trust UI |
| CMS-08 | FAQ Manager | FAQ |
| CMS-09 | Policy Manager | Policy |
| CMS-10 | SEO Manager | Meta/OG |
| CMS-11 | Redirect manager | Redirects |
| CMS-12 | Blog/Content | Blog |
| CMS-13 | Media library | Media |
| CMS-14 | Review Manager | Reviews |
| CMS-15 | Testimonial manager | Quotes |
| CMS-16 | Landing builder | Campaign LP |
| CMS-17 | Popup manager | Promo (dùng tiết chế) |
| CMS-18 | Email snippets | Transactional copy |
| CMS-19 | Status editor | /status |
| CMS-20 | Localization (sau) | i18n |
| CMS-21 | Legal versioning | Terms/Privacy |
| CMS-22 | Brand story pages | About/Security |
| CMS-23 | How-it-works editor | Giáo dục giao |
| CMS-24 | Merchandising | Catalog featured/sort |
| CMS-25 | 404/Maintenance content | Error pages |

---

## 12. Customer-visible → Admin config (100%)

| Khách nhìn thấy | Cấu hình Admin | Owner |
|-----------------|----------------|-------|
| Logo / brand name | Brand & System | Admin |
| Hero | Hero Manager | Marketing |
| Banner | Banner Manager | Marketing/Ops |
| Header menu | Navigation Manager | Marketing |
| Footer | Footer Builder | Marketing |
| Featured products | Merchandising | Marketing + Catalog |
| PDP copy/gallery | Product editor | Catalog |
| Nhãn giao + SLA text | Variant + Policy snippets | Catalog + Ops |
| Trust badges | Trust manager | Marketing |
| Reviews | Review Manager | Marketing/CS |
| FAQ | FAQ Manager | CS + Marketing |
| Policy / warranty / resend copy | Policy Manager | Ops + Legal |
| SEO | SEO Manager | Marketing |
| Blog | Content | Marketing |
| Contact form | Contact settings | CS |
| Status incidents | Status editor | Ops |
| Email đơn/giao/resend | Notification templates | Ops |
| Legal | Legal versioning | Admin/Legal |
| 404 / empty states | CMS error pages | Marketing |
| Maintenance message | Maintenance + Banner | Ops |
| How it works | How-it-works editor | Product/Marketing |
| Checkout help text | Checkout copy CMS | Ops |
| Payment waiting copy | Payment copy / provider | Ops/Finance |
| “Đang xử lý giao” copy | Fulfillment status map | Ops |
| Resend label + hạn mức giải thích | Policy + UI strings | Ops |
| Support macros | KB + FAQ sync | CS |

**Publish:** Draft → Review → Live + audit mọi lần publish.

---

## 13. Anti-patterns (cấm)

1. Lộ enum kỹ thuật trên storefront.  
2. Một status gộp tiền + giao.  
3. Chỉ gửi deliverable qua email — không có Assets.  
4. Đổi Hero/FAQ phải sửa code.  
5. CS hoàn tiền một chạm không policy.  
6. UX flash-sale marketplace.  
7. Catalog = dump SKU kỹ thuật.  
8. Finance/Fulfillment/CS dùng chung màn không tách quyền.

---

## 14. Phased UX delivery (khớp roadmap KEYON)

| Phase UX | Nội dung | Khi nào |
|----------|----------|---------|
| **UX-A (Pilot)** | Storefront tin cậy tối thiểu · Portal Assets · Dual status · FAQ/Policy CMS tối thiểu · Admin cockpit giữ | Song song / sau Pilot ops |
| **UX-B** | CMS đủ map §12 · Support portal · Inbox SLA · Merchandising | Sau Pilot ổn |
| **UX-C** | Finance workspace · Status page · B2B org · Agent portal | Scale |

UX-A **không** đụng Core Stable — chỉ Experience Outer Layer.

---

## 15. Definition of Done (Product)

- [ ] IA + Sitemap được Founder/PO approve  
- [ ] Customer glossary chốt  
- [ ] Dual status money/delivery chốt trên mọi màn đơn  
- [ ] Bảng §12 không còn lỗ hổng biết trước  
- [ ] RBAC capability được Ops approve  
- [ ] Screen inventory đủ để mở backlog wireframe UX-A  

---

## 16. Next steps (vẫn không code)

1. Workshop 90’ PO/Founder: glossary + dual status.  
2. Wireframe lo-fi UX-A: Home, PDP, Checkout, Order, Assets, Ops Home, Inbox.  
3. Content model CMS (fields) — product spec.  
4. Chỉ sau approve wireframe mới mở Sprint UI implement.

---

**Document owner:** Product  
**Consumers:** Founder · Design · Ops · Engineering (đọc để hiểu phạm vi)  
**Không thay thế:** ADR / Core Stable / Pilot PL1–PL5 — tài liệu này là lớp trải nghiệm.
