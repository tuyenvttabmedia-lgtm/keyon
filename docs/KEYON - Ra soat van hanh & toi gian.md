# KEYON — Rà soát lại đề xuất (góc vận hành thực tế)

**Câu hỏi:** Trong bản đề xuất tối ưu trước, chỗ nào chưa khớp vận hành? Chỗ nào phức tạp thừa? Giữ gì để dễ vận hành, UX tốt, quản lý dễ, bảo mật đủ, vẫn linh hoạt?

**Nguyên tắc lần này:** Tối giản đến mức một team nhỏ vận hành được hàng ngày; chỉ giữ độ phức tạp ở chỗ **tiền và license** (chỗ sai là mất tiền / mất uy tín).

---

## 1. Kết luận nhanh

Đề xuất trước **đúng hướng kỹ thuật** nhưng còn hơi “architect-heavy” so với mô hình KEYON thật: bán license semi-automated, nhiều đơn Manual, team vận hành nhỏ, khách VN quen Zalo/email hơn portal phức tạp.

| Hướng | Điều chỉnh |
|-------|------------|
| Dễ vận hành | Đưa **Fulfillment Inbox + hỗ trợ sau bán** lên ưu tiên ngang money path |
| UX | Ít portal, trạng thái đơn giản với khách, giao key rõ ràng |
| Quản lý | Báo cáo mỏng, vai trò ít, không RBAC enterprise |
| Bảo mật | Bộ control thực dụng Phase 1 — không Zero Trust đầy đủ |
| Linh hoạt | Linh hoạt ở **Variant + Fulfillment Type + Supplier thủ công**; chưa cần “nền tảng hub” |

**Verdict:** Giữ tách Vision / SA mỏng; **cắt** sổ ADR sớm, event platform, Partner/HOLD sớm, SLO kiểu SRE; **thêm** luồng vận hành ngày (queue, resend, bảo hành/cấp lại, thông báo).

---

## 2. Phần đề xuất trước — còn chưa phù hợp vận hành

### 2.1. Ba lớp tài liệu đầy đủ — hơi nặng cho team nhỏ

| Trước | Thực tế | Đổi thành |
|-------|---------|-----------|
| Vision + SA + Engineering Specs tách cứng | Dễ thành 3 file “chết”, không ai cập nhật | **2 file sống:** (1) Vision+Roadmap ngắn (2) **Vận hành & Kiến trúc lõi** (SA thực dụng). Spec kỹ thuật chi tiết chỉ khi bắt đầu code từng module |

### 2.2. Tám artifact P0 — đúng nhưng xếp ưu tiên lệch vận hành

| Artifact | Đánh giá vận hành | Quyết định |
|----------|-------------------|------------|
| P0-1 State machine | Cần, nhưng đang **quá nhiều state** trên giấy | **Giữ & tối giản** (mục 4) |
| P0-2 Idempotency/webhook | Bắt buộc với tiền | **Giữ** (chỉ trên money path) |
| P0-3 Supplier adapter đủ buy/check/sync | Phức tạp nếu Phase 1 chủ yếu **Manual / lấy key tay** | **Thu nhỏ:** Manual-first; API adapter chỉ khi có supplier API thật |
| P0-4 Inventory reservation | Cần cho Instant; Manual không cần reserve phức tạp | **Giữ nhẹ** cho Instant thôi |
| P0-5 Logical ERD đầy commerce+finance | Dễ over-model Invoice/Ledger sớm | **ERD mỏng Phase 1** (mục 4) |
| P0-6 Partner HOLD | Không cần nếu chưa bán đại lý tín dụng | **Hoãn** — ghi Out of scope, đừng nửa model |
| P0-7 NFR/SLO bảng SRE | RPO/RTO/% availability sớm ít dùng cho ops ngày | **Thu còn 4 số:** thời gian giao Instant kỳ vọng, SLA Manual (giờ làm việc), backup hàng ngày, thời gian phản hồi ticket |
| P0-8 Nhiều ADR trước code | ADR-002…005 quá sớm | **1 ADR:** Modular monolith + 1 DB + 1 queue. Còn lại quyết khi chạm |

### 2.3. Thiếu thứ vận hành thật hay cần (đề xuất trước nhấn nhẹ)

Đây là lỗ hổng so với “dễ vận hành / UX / quản lý”:

1. **Hộp thư xử lý đơn (Fulfillment Inbox)** — danh sách “cần làm hôm nay”, lọc theo trạng thái, SLA màu.  
2. **Resend license / xem lại key đã giao** (khách + CS) — anti-abuse cơ bản.  
3. **Luồng cấp lại / đổi thông tin kích hoạt / bảo hành** (rất phổ biến bán license).  
4. **Gắn ticket hỗ trợ với Order + License** (không cần ITIL đầy đủ).  
5. **Thông báo thực dụng:** Email bắt buộc; Zalo/SMS là Phase sau — nhưng **template email giao hàng** là P0 vận hành.  
6. **Nhà cung cấp thủ công:** tên NCC, ghi chú “lấy ở đâu”, giá vốn — không bắt buộc API.  
7. **Cảnh báo sắp hết kho Instant** cho ops.  
8. **Vai trò mỏng:** Chủ / Kho-Fulfillment / CS / (Kế toán xem) — không permission matrix dài.  
9. **Giá vốn & biên lợi nhuận trên Admin** — quản lý cần, không cần Finance Domain nặng.

---

## 3. Phức tạp thừa — có thể cắt / hoãn

### 3.1. Cắt khỏi Phase 1–2 (hoặc khỏi cả blueprint gần)

| Hạng mục | Vì sao thừa lúc này |
|----------|---------------------|
| Partner Portal / Public Developer Platform / White-label | Chưa có hệ sinh thái ĐL chạy |
| Workflow Engine / Integration Hub / Platform Services | Giải pháp tìm bài toán |
| CMS Block Library + Landing Page Builder đầy đủ | Cần trang tĩnh/SEO trước; builder sau |
| SEO Domain kiến trúc “enterprise” tách biệt | Metadata + sitemap + URL sạch là đủ |
| Event-Driven toàn hệ thống sớm | Chỉ cần queue cho email + fulfill sau thanh toán |
| Microservices / multi-region / Hybrid Cloud | Không khớp quy mô |
| Gift card, Loyalty, Wishlist, Recommendation | Không giúp vận hành lõi |
| Auto-renew + Mandate thanh toán phức tạp | Phase Subscription sau; gia hạn tay trước |
| Blue/Green + Canary + immutable infra đầy đủ | Dev → Staging → Prod + backup là đủ ban đầu |
| Zero Trust / Risk-Based Access / SSO doanh nghiệp | Narrative nặng; control thực dụng nhẹ hơn |
| Ledger double-entry đầy đủ Phase 1 | Order + Payment + giá vốn + hoàn tay đủ quản lý sớm |
| OpenAPI đầy đủ mọi nhóm API trước code | Contract hóa khi implement; chuẩn đặt tên giữ ngắn |
| Capability Map 7 trụ + handbook App D–L dày | Onboarding vocabulary OK; không điều khiển vận hành ngày |

### 3.2. Đừng “linh hoạt giả”

Linh hoạt **không** = thiết kế sẵn mọi Product Type / Marketplace / AI.

Linh hoạt **có** với KEYON:

- Thêm Variant mới không sửa kiến trúc  
- Đổi Instant ↔ Manual trên Variant  
- Thêm supplier **thủ công** (tên + note + giá vốn)  
- Sau này mới cắm Payment GW thứ 2 / Supplier API thứ 2 qua adapter  

Đó là đủ “linh hoạt” cho 12–18 tháng đầu.

---

## 4. Bộ tối giản đề xuất lại (thay thế 8 P0 nặng)

Gọi là **“Bộ vận hành lõi”** — 6 mục, ưu tiên xếp lại.

### M1. Trạng thái đơn giản (khách dễ hiểu, kho dễ làm)

**Khách chỉ thấy gọn:**

| Hiển thị khách | Bên trong (ops/system) |
|----------------|------------------------|
| Chờ thanh toán | `PENDING_PAYMENT` |
| Đã thanh toán — đang xử lý | `PAID` + fulfill `QUEUED/PROCESSING` |
| Hoàn tất — đã nhận | `COMPLETED` |
| Thất bại / hủy | `FAILED` / `CANCELLED` |
| Đang chờ hàng (Manual) | `WAITING_STOCK` (ops) → khách: “Đang xử lý, dự kiến …” |

**Quy tắc cứng giữ nguyên (không đơn giản hóa sai):**

- Tách **đã thanh toán** vs **đã giao**  
- Thanh toán OK mà giao fail → **không tự hoàn tiền**; đưa vào **Cần xử lý** cho người  
- Webhook/trùng request không giao 2 lần  

→ So với đề xuất cũ: bỏ / gộp bớt state fine-grained trên giấy; UI ops có filter, không bắt khách học 12 status.

### M2. Money path an toàn (giữ, không phình)

Chỉ bắt buộc:

- 1 cổng thanh toán  
- `payment_reference` unique  
- Webhook: lưu → xếp hàng → xử lý  
- Idempotency cho tạo đơn / xác nhận thanh toán  

Không cần nền tảng webhook đa đối tác Phase 1.

### M3. Fulfillment vận hành-first (nâng ưu tiên)

| Loại | Cách làm tối giản |
|------|-------------------|
| **Manual (mặc định khỏe)** | Inbox → nhân viên nhập/dán key → giao → email | 
| **Instant** | Kho key đã mã hóa → trừ kho → giao tự động sau pay |
| **Subscription / dịch vụ** | Phase sau; Phase 1 có thể bán như Manual task (“cấp tenant”) nếu bắt buộc |

**Màn Admin tối thiểu:** Inbox, chi tiết đơn, nút Giao hàng, Resend email, Đánh dấu hết hàng / chờ NCC, ghi chú nội bộ.

Đây là “trải nghiệm quản lý” thật — quan trọng hơn sơ đồ Adapter đầy đủ.

### M4. Mô hình dữ liệu mỏng Phase 1

Giữ entity:

`Customer`, `Product`, `Variant`, `Order`, `OrderItem`, `Payment`, `FulfillmentJob`, `LicenseDelivery` (key đã giao / meta), `LicenseStock` (chỉ Instant), `Supplier` (thủ công), `StaffUser` + `Role`, `AuditLog`, `EmailOutbox`

Hoãn: Ledger, Settlement, Partner, Seat/Tenant, CMS Block, SEO entity tách nặng, Gift/Coupon (trừ khi bán thật sự cần 1 mã giảm đơn giản).

### M5. Bảo mật thực dụng (đủ tốt, không đao to)

| Có ngay | Hoãn |
|---------|------|
| HTTPS, hash mật khẩu, session hết hạn | SSO / OAuth doanh nghiệp |
| Mã hóa key/PIN at rest; AI/CS xem có audit | HSM / key hierarchy phức tạp |
| RBAC 3–4 role | Permission 200 dòng |
| Audit: login, giao key, hoàn tiền, đổi giá, export | Log一切 mọi click |
| Rate limit login + admin | WAF/Zero Trust full story |
| Không lộ key trên URL; resend có giới hạn | Threat model 40 trang |

“Bảo mật tốt” với KEYON = **key không plain, thao tác nhạy cảm có dấu vết, quyền ít và rõ** — không phải checklist ISO copy nguyên.

### M6. UX khách — tối giản có chủ đích

Một hành trình:

1. Tìm/sp Variant đúng (thương hiệu, thời hạn)  
2. Mua → thanh toán  
3. Trang kết quả: **Instant = hiện key + hướng dẫn**; **Manual = “đang xử lý, hạn XL”**  
4. “License của tôi” — xem lại / tải hướng dẫn  
5. Nút liên hệ hỗ trợ kèm mã đơn  

Không cần: 5 portal, wishlist, AI search, tài khoản tổ chức đầy đủ Phase 1.

---

## 5. Roadmap vận hành (thay Phase kiến trúc nặng)

### Phase A — Chạy được phòng máy (MVP vận hành)

- Catalog Variant + giá  
- Thanh toán 1 cổng  
- Manual Inbox + Instant kho đơn giản  
- Email giao hàng  
- Portal “đơn & license của tôi”  
- Admin: đơn, kho, giao, audit cơ bản  
- 3–4 role  

**Exit:** Mỗi ngày vận hành không cần Excel song song cho đơn mới.

### Phase B — Chắc tay & bán được sâu hơn

- Resend / cấp lại / bảo hành (policy ngắn)  
- Hoàn tiền tay có lý do + audit  
- Đối soát thanh toán đơn giản (file/ngày)  
- Trang nội dung + SEO cơ bản  
- Báo cáo: số đơn, doanh thu, đơn chậm SLA Manual, tồn kho Instant  
- Ticket gắn đơn (có thể rất mỏng)  

### Phase C — Mở rộng có kiểm soát

- Subscription / gia hạn (tay → tự động dần)  
- Supplier API (khi ROI rõ) + check-on-timeout  
- Cổng thanh toán 2 (adapter)  
- Partner **chỉ khi** có ĐL thật (idempotent order + công nợ tách riêng nếu cần)  

---

## 6. Bảng “Giữ / Cắt / Đổi” so với đề xuất kiến trúc trước

| Đề xuất trước | Giữ | Cắt/Hoãn | Đổi |
|---------------|-----|----------|-----|
| Tách Vision vs SA | Giữ | — | Gộp SA + vận hành thành 1 “Sổ lõi” |
| 8 P0 artifacts | Money + trạng thái + kho Instant | HOLD, ADR đầy, SLO SRE, adapter đầy sớm | Thành **6 mục M1–M6** |
| Modular monolith | Giữ mạnh | Microservices talk | — |
| API-First đầy portal | — | Partner/Admin API đầy sớm | Store + Customer + Admin UI; API nội bộ đủ dùng |
| Domain/Finance đầy | — | Ledger sớm | Giá vốn + biên lãi trên đơn |
| Security by Design | Giữ ý | Zero Trust đầy đủ | Control list M5 |
| Phase 1 money trước CMS | Giữ | — | **Thêm** Inbox/email là cùng tầng với money |
| Capability / handbook dày | 1 trang capability | App D–L dày | Archive |

---

## 7. Còn điểm nào “căng” — chấp nhận phức tạp?

Chỉ **3 chỗ** được phép phức tạp (đừng tối giản quá tay):

1. **Tách thanh toán ↔ giao hàng** + không auto-refund mù  
2. **Idempotency webhook / chống giao trùng**  
3. **Mã hóa & kiểm soát xem license**  

Mọi thứ khác: ưu tiên màn hình rõ, quy trình ngắn, ít khái niệm.

---

## 8. Checklist “đủ vận hành thật” (thay DoD kiến trúc dày)

Có thể bắt đầu làm product/ops khi:

- [ ] Khách hiểu được 4–5 trạng thái đơn  
- [ ] Nhân viên có Inbox xử lý xong đơn Manual trong một màn  
- [ ] Instant giao sau pay không đụng Excel  
- [ ] Email giao hàng ổn định; resend có kiểm soát  
- [ ] Thanh toán trùng webhook không giao 2 lần  
- [ ] Key mã hóa; role FS không cần quyền sửa giá  
- [ ] Chủ xem được doanh thu / đơn chậm / sắp hết kho  
- [ ] Policy ngắn: hoàn tiền, bảo hành/cấp lại, SLA Manual (vd. 2–8 giờ làm việc)  

Chưa cần: Partner, AI, CMS builder, multi-region, ledger doanh nghiệp, Zero Trust handbook.

---

## 9. Một câu định hướng

> KEYON giai đoạn đầu là **cửa hàng license + phòng máy xử lý đơn**, không phải “enterprise digital platform”. Kiến trúc phải **chắc ở tiền & key**, **mỏng ở nền tảng**; linh hoạt chủ yếu nhờ Variant/Fulfillment Type/Manual supplier — không nhờ phủ đủ Capability Map.

---

*Tài liệu rà soát tối giản theo vận hành · dùng kèm Review & đề xuất trước · không phải đặc tả code.*
