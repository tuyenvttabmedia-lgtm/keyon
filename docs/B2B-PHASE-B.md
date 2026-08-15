# KEYON — Phase B (B2B org / hợp đồng / dịch vụ)

**Status:** Working design — **not** a Frozen ADR  
**Date:** 2026-08-15  
**Does not amend:** ADR-001…006, Core Stable (Order, Payment, Fulfillment, License Pool, Inventory, Supplier, Product, Variant)

Mọi phase dưới đây phải trả lời đủ 5 mục **trước khi code**: schema · migration · API · state · ADR.  
Thay đổi abstraction Product / Order / Payment / Fulfillment đã freeze → **dừng trước migration**, viết ADR theo Architecture Amendment Rule.

---

## Principles (locked)

1. **QuoteRequest = lead.** `companyName` (và tương đương Business Request) là dữ liệu lead. Không giả định Organization. **Không** thêm `organizationId` khi chưa có Org domain.
2. **Admin heuristic ≠ identity.** Email domain + `QuoteRequest.companyName` chỉ để **tìm / hiển thị gợi ý**. Cấm dùng cho authorization hoặc customer data access.
3. **Customer portal mặc định = account scope.** Share đơn/license chỉ qua membership ACTIVE (ADR-008). Không “cùng domain xem chung đơn”.
4. **Org trước, access sau.** Nhiều user một doanh nghiệp → `Organization` + `OrganizationMembership` **trước**. Đó là nền bắt buộc trước company-wide order/license access.
5. **HĐ/PO không thay Order.** Đầu: metadata reference gắn Order nếu chỉ cần số HĐ/PO. `CommercialAgreement` chỉ khi một agreement **liên kết nhiều Order** hoặc có lifecycle/term riêng.
6. **Service SKU không dùng License Pool.** Tái sử dụng Order + Payment; fulfillment manual/service. **Không** `ServiceOrder` / `ServicePayment` song song.
7. **Freeze gate.** Đụng abstraction Core đã freeze → dừng, đề xuất ADR, không migrate.

---

## Hiện trạng (sau B4.2 + B5)

| Có | Không |
|----|--------|
| `QuoteRequest.companyName` (lead) | `organizationId` trên Quote / Order |
| Admin heuristic domain/tên lead | Auto-join từ email domain |
| Organization + Membership (staff gán tay) | Pin Order vào org (B3.3) |
| Portal: Order/license account **+ peer ACTIVE cùng org** | Share tickets / domain auth |
| HĐ/PO staff qua `OrderNote` (ADR-009) | Cột `poNumber` trên Order |
| Khung HĐ nhiều đơn (ADR-010 join) | `Order.agreementId`; Payment trên HĐ |
| SKU bàn giao: `QUOTE_REQUIRED` + `MANUAL` + `DIGITAL_FILE` | `ServiceOrder` / enum `SERVICE` / Pool cho dịch vụ |

---

## B1 — Business Request / Quote Intake

**Mục tiêu:** Intake B2B (báo giá, tư vấn, triển khai) là ticket lead, không phải Company.

| | |
|--|--|
| **Schema** | Giữ `QuoteRequest`. `companyName` = free-text lead. **Cấm** `organizationId`. `requestType` string hiện có (`GENERAL`, `VOLUME_LICENSING`, `IMPLEMENTATION`, …) — không cần enum Core. |
| **Migration** | Không. |
| **API** | `POST /api/quote` như hiện tại. Không resolve/create Org. |
| **State** | `QuoteRequestStatus` (NEW → …). **Không** đụng `OrderStatus` / `PaymentStatus`. Quote **không** tạo Order. |
| **ADR** | Không. Outer Layer. |

**Exit:** Form intake ghi lead; admin/ops đọc được; không có FK org.

---

## B2 — Admin Company Heuristic

**Mục tiêu:** Sales/ops lọc danh sách Order bằng gợi ý (domain email, tên trên quote).

| | |
|--|--|
| **Schema** | Không. Đọc `Order.email` + `QuoteRequest.companyName`. |
| **Migration** | Không. |
| **API** | Query admin `?company=` — **chỉ** `/admin/orders`. Không API khách, không session grant. |
| **State** | Không. Không đổi quyền đọc Order phía storefront. |
| **ADR** | Không. |

**Cấm:** dùng cùng heuristic cho `/account/orders`, license portal, hay “user A thấy đơn user B”.

**Exit:** UI ghi rõ *gợi ý tìm kiếm*; portal vẫn account-scoped.

---

## B3 — Organization + Membership (khi có nhu cầu thật)

**Trigger:** ≥2 user cần cùng thấy đơn/license của **một** doanh nghiệp đã xác minh — không phải vì “cùng domain email”.

### B3.1 Nền tảng (làm trước)

| | |
|--|--|
| **Schema** | Bảng **mới** `Organization`, `OrganizationMembership` (userId, orgId, role). **Không** sửa Order/Payment/Pool. **Không** backfill từ email domain. |
| **Migration** | Additive, bảng mới. Không đụng bảng Core. |
| **API** | Admin tạo/gán org. Portal chưa mở wide access. |
| **State** | Membership status (invited/active) — **không** phải Order state. |
| **ADR** | **Có ADR mới** (identity/B2B), vì đây là mô hình ủy quyền. **Không** sửa ADR-002…005. |

### B3.2 Company-wide order/license access — **ADR-008, đã implement**

Đọc Order/license theo membership ACTIVE. **Không** `Order.organizationId`. Chi tiết: `docs/adr/ADR-008-org-order-access.md`.

**Cấm:** suy ra membership từ domain; gắn `organizationId` lên QuoteRequest “cho tiện”.

---

## B4 — Commercial reference → CommercialAgreement

**Trigger A (reference):** ops cần số HĐ/PO trên **một** Order.  
**Trigger B (agreement):** một khung thương mại **nhiều Order** hoặc term/lifecycle riêng (hiệu lực, renew, thanh toán theo kỳ).

### B4.1 Reference trên Order — **ADR-009, đã implement (OrderNote)**

Staff ghi số PO/HĐ bằng `OrderNote` marker `[KEYON-COMMERCIAL]`. **Không** cột Order. Chi tiết: `docs/adr/ADR-009-order-commercial-ref.md`.

Cột `poNumber`/`contractRef` trên Order = B4.1b, **sau ADR + migrate** nếu cần index.

### B4.2 CommercialAgreement — **ADR-010, đã implement (join, không cột Order)**

Bảng `CommercialAgreement` + `CommercialAgreementOrder`. **Không** `Order.agreementId`. Admin `/admin/agreements`. Không Payment trên HĐ. Chi tiết: `docs/adr/ADR-010-commercial-agreement.md`.

---

## B5 — Service SKU — **đã implement (enum hiện có)**

Gói bàn giao: `SalesMotion.QUOTE_REQUIRED` + `FulfillmentStrategy.MANUAL` + `DeliverableType.DIGITAL_FILE`. Checkout được (trả tiền → inbox). **Không** License Pool. Pax8 `QUOTE_REQUIRED` + `SEMI_AUTOMATED` vẫn chỉ báo giá.

SKU: `KEYON-SVC-HANDOVER` · slug `keyon-license-handover`. Upsert: `npm run catalog:ensure-service-sku`.

---

## Gate trước mỗi PR Phase B

1. Có đụng Core Stable besides Outer / bugfix có bằng chứng? → Reject hoặc ADR.  
2. Heuristic domain/companyName có lọt sang authorization? → Reject.  
3. Portal có đọc Order ngoài account? → Chỉ qua ADR-008 membership ACTIVE; domain = Reject.  
4. Có ServiceOrder/ServicePayment/Contract-as-Order? → Reject.  
5. Có migrate trước ADR khi đụng abstraction freeze? → Reject.

## Thứ tự

```
B1 intake (lead)
 → B2 admin heuristic (suggestion only)
 → B3.1 Org + Membership
 → B3.2 org-scoped access (ADR-008, xong)
 → B4.1 Order reference (ADR-009 OrderNote, xong)
 → B4.2 CommercialAgreement (ADR-010 join, xong)
 → B5 service SKU (MANUAL + DIGITAL_FILE, xong)
```
