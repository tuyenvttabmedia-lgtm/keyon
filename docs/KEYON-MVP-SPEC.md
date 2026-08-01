# KEYON — MVP SPEC

**Đây là tài liệu chính để phát triển phiên bản đầu tiên.**  
**Ngày:** 2026-07-21 · **Nguyên tắc:** KISS · Simple > Fancy · Stable > Complex  

| Quy mô thật | |
|-------------|--|
| Đội vận hành | **1–10 người** |
| Đơn / ngày | **vài chục → vài trăm** (không thiết kế cho 1000 nhân viên) |
| KEYON là | Digital License Platform — ổn định, đơn giản, dễ vận hành |
| KEYON không phải | Shopify · Microsoft · Atlassian · Enterprise CMS |

**Core Stable — KHÔNG ĐỔI:** Order · Payment · Fulfillment · License Pool · Inventory Read Model · Supplier · Product · Variant  

Mọi tài liệu UX/Blueprint cũ → **tham khảo only** (xem cuối file). Không mở rộng thêm spec Enterprise.

---

## A. Phân loại tài liệu đã viết

### KEEP (giữ — cần cho vận hành / kỹ thuật đã chốt)

| Tài liệu | Lý do |
|----------|--------|
| `ARCHITECTURE-FREEZE.md` + `docs/adr/*` | Kiến trúc đã đóng băng |
| `LICENSE-POOL-v1.md` · `INVENTORY-READ-MODEL-v1.md` · `PAYMENT-ARCHITECTURE-v1.md` | Core domain |
| `OPERATIONS.md` · `RUNBOOK.md` · `BACKUP.md` | Vận hành thật |
| `MONITORING.md` · `DASHBOARD.md` | Ops đã PASS |
| `INTERNAL-TEST.md` · `PILOT.md` · `PAX8-1SKU.md` · `OPS-SPRINTS.md` | Gate / roadmap kỹ thuật |
| `SEPAY-PRODUCTION.md` | Payment đã chốt |

### SIMPLIFY (rút gọn — ý hay nhưng quá nặng cho 1–10 người)

| Nguồn | Giữ ý | Bỏ / gọn trong MVP |
|-------|-------|---------------------|
| Product UX Blueprint | Storefront ≠ Admin · PAID ≠ giao · glossary khách · dual status | Persona dài, journey enterprise, phase UX-A/B/C, portal tách Support/Finance |
| Implementation UX Spec | Section Home tối thiểu · map CMS đơn giản · empty/loading/error cơ bản | API contract chi tiết, acceptance dài |
| Production UI Spec 01 | Container/spacing vừa đủ khi code Home · token màu/type cơ bản | Đo px từng section, motion/z-index dày, checklist quá dài |
| Admin UX Spec 01 | Một chỗ sửa Home · Draft/Publish · Media chọn ảnh | 12 module tách, Preview 3 device/module, Rollback/History/Bulk/Conflict/Audit phức tạp |

### REMOVE (không làm ở MVP — làm hệ thống phức tạp, ít giá trị lúc này)

- Version History / Rollback **từng** module CMS  
- Bulk Publish · Publish schedule · conflict resolution đa user  
- Preview Desktop/Tablet/Mobile **trong từng** admin module  
- Trust Badge Manager · Review Manager riêng · How-it-works Editor riêng · Homepage Builder kéo thả section phức tạp  
- SEO Manager đầy đủ như enterprise (MVP: vài field trong CMS Home)  
- Support Portal / Fulfillment Portal / Finance Portal tách app  
- Command palette, org B2B, Agent portal, Status page CMS, Popup/Landing builder  
- Custom CSS, raw HTML, workflow kiểu Shopify Plus  
- Thiết kế “1000 đơn/ngày / hàng nghìn nhân viên” như mục tiêu MVP  

---

## 1. Storefront (màn hình MVP)

| # | Màn | Route gợi ý | Việc khách làm |
|---|-----|-------------|----------------|
| 1 | Home | `/` | Hiểu KEYON + vào mua |
| 2 | Product Listing | `/products` | Duyệt / lọc đơn giản |
| 3 | Product Detail | `/products/{slug}` | Chọn gói + mua |
| 4 | Checkout / Payment | `/checkout/{orderId}` | Thanh toán (QR/hướng dẫn) |
| 5 | Payment Success | `/checkout/{orderId}/success` | Biết **đã trả tiền** (chưa hẳn đã giao) |
| 6 | Order Tracking | `/account/orders/{id}` | Xem tiền + giao tách trạng thái |
| 7 | Login | `/login` | Đăng nhập |
| 8 | Register | `/register` | Đăng ký (nếu bật) |
| 9 | Customer Portal | `/account` | Tổng quan · đơn · tài sản |
| 10 | FAQ | `/faq` | Tự giúp |
| 11 | Contact | `/contact` | Liên hệ hỗ trợ |

**Quy tắc UI ngắn**

- Không lộ enum: INSTANT/MANUAL → câu người dùng.  
- PAID ≠ Delivered trên mọi màn đơn.  
- Deliverable nằm trong **Tài sản**, không chỉ email.  

---

## 2. Admin (màn hình MVP)

Một Admin app, sidebar đơn. Role tối thiểu: **Admin** + **Fulfillment** (+ CS dùng chung Admin với quyền hẹp nếu cần).

| # | Màn | Việc ops làm |
|---|-----|----------------|
| 1 | Dashboard | Đơn hôm nay, chờ giao, cảnh báo kho, health nhẹ |
| 2 | Đơn hàng | List + chi tiết + timeline |
| 3 | Khách hàng | List + chi tiết |
| 4 | Sản phẩm | CRUD product |
| 5 | Danh mục / Variant | Gói, giá, strategy, SLA text, active |
| 6 | Thương hiệu | Tên, logo, slug |
| 7 | Kho License | Nhập / xem pool Instant (không xóa key) |
| 8 | Nhà cung cấp | List + cấu hình cơ bản |
| 9 | Thanh toán | Tra cứu payment / đối soát nhẹ |
| 10 | CMS | Xem §3 |
| 11 | Marketing | Banner (+ optional featured chọn sản phẩm) |
| 12 | SEO | Title/description trang chính (gộp CMS hoặc Settings) |
| 13 | Media | Upload/chọn ảnh |
| 14 | Người dùng | Staff + role đơn giản |
| 15 | Cài đặt | Site name, logo, mail from… |

**Inbox giao hàng:** nằm trong Đơn hàng hoặc một mục **Inbox** đơn giản (Manual complete / Replace) — không portal riêng.

---

## 3. CMS (gộp — không tách 12 module)

```
CMS
├── Home
├── Banner
├── FAQ
├── Footer
└── Navigation
```

Media = mục Admin riêng (dùng chung khi chọn ảnh).

### Home — chỉ các block sau

| Block | Nội dung chỉnh sửa | Ẩn/Hiện |
|-------|--------------------|---------|
| Hero | Title, subtitle, CTA, ảnh nền | Có |
| Featured Products | Chọn tối đa ~8 sp/gói + thứ tự | Có |
| Categories | Vài shortcut (label + link) | Có |
| How It Works | 3–4 bước (title + mô tả) | Có |
| Why KEYON | 3–4 ý (title + mô tả) | Có |
| FAQ | Chọn FAQ `hiện trên Home` | Có |
| Bottom CTA | Heading + nút | Có |

**Không có ở MVP Home:** Reviews · Trust badge manager · Floating cards · kéo thả section phức tạp · Preview 3 device trong CMS.

---

## 4. Workflow CMS (tối thiểu)

| Hành động | Có ở MVP? |
|-----------|-----------|
| Lưu | ✅ |
| Ẩn / Hiện block hoặc bài FAQ | ✅ |
| Draft → Publish (1 nút Publish lên live) | ✅ |
| Xem site (mở `/` tab mới) | ✅ |
| Version History / Rollback từng module | ❌ |
| Schedule / Bulk publish / Conflict UI | ❌ |
| Preview Desktop/Tablet/Mobile trong Admin | ❌ (dùng browser thật) |

Một người sửa → Publish. Đủ cho 1–10 người.

---

## 5. Core Stable

Không thay đổi schema/hành vi domain:

Order · Payment · Fulfillment · License Pool · Inventory · Supplier · Product · Variant  

UI/CMS chỉ **đọc / trình bày / cấu hình nội dung**. Không nhét business logic thanh toán vào CMS.

---

## 6. ROADMAP MVP (UI)

```
Phase 1 — Storefront tối thiểu
  Home
    ↓
  Product Listing
    ↓
  Product Detail
    ↓
  Checkout + Payment Success
    ↓
  Portal (Orders + Assets) + Login/Register
    ↓
  FAQ + Contact

Phase 2 — Admin vận hành
  Dashboard + Đơn hàng + Inbox giao
    ↓
  Sản phẩm / Variant / Brand / Kho License
    ↓
  CMS (Home, Banner, FAQ, Footer, Nav) + Media
    ↓
  Thanh toán tra cứu + Người dùng + Cài đặt

Phase 3 — Chỉ khi Phase 1–2 ổn
  SEO gọn · Marketing banner nâng nhẹ · (sau) Pax8 HTTP nếu cần
```

**Không** song song thiết kế Enterprise. Xong Phase 1 mới mở rộng UI.

---

## 7. Definition of Done — MVP UI

- [ ] Khách mua Instant/Manual trên UI mới (hoặc cải tiến) không cần hiểu thuật ngữ nội bộ  
- [ ] Ops 1–10 người sửa Hero/FAQ/Banner/Footer không đụng code  
- [ ] Draft/Publish đủ dùng — không rollback CMS  
- [ ] Core Stable không bị sửa vì UI  
- [ ] Có thể chạy Pilot / kinh doanh thật trên UI này  

---

## 8. Tài liệu cũ — chỉ tham khảo

| File | Vai trò từ nay |
|------|----------------|
| `PRODUCT-UX-BLUEPRINT.md` | Tham khảo ý tưởng |
| `IMPLEMENTATION-UX-SPEC.md` | Tham khảo |
| `PRODUCTION-UI-SPEC-01-HOME.md` | Tham khảo đo lường nếu cần khi code Home |
| `ADMIN-UX-SPEC-01-HOME.md` | Tham khảo — **không** implement nguyên 12 module |

**Tài liệu chính UI/CMS từ nay:** **file này — `KEYON MVP SPEC`.**  
Không viết thêm spec Enterprise. Ưu tiên: nhanh · đơn giản · ổn định · vận hành được ngay.
