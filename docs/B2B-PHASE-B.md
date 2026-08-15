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
3. **Customer portal = account scope.** Chỉ Order của chính `userId` / email tài khoản. Không “cùng domain xem chung đơn”.
4. **Org trước, access sau.** Nhiều user một doanh nghiệp → `Organization` + `OrganizationMembership` **trước**. Đó là nền bắt buộc trước company-wide order/license access.
5. **HĐ/PO không thay Order.** Đầu: metadata reference gắn Order nếu chỉ cần số HĐ/PO. `CommercialAgreement` chỉ khi một agreement **liên kết nhiều Order** hoặc có lifecycle/term riêng.
6. **Service SKU không dùng License Pool.** Tái sử dụng Order + Payment; fulfillment manual/service. **Không** `ServiceOrder` / `ServicePayment` song song.
7. **Freeze gate.** Đụng abstraction Core đã freeze → dừng, đề xuất ADR, không migrate.

---

## Hiện trạng (sau B1–B2)

| Có | Không |
|----|--------|
| `QuoteRequest.companyName` (lead) | Organization, Membership |
| Admin lọc Order theo domain / tên lead (**gợi ý**) | `organizationId` trên Quote hoặc Order |
| Portal: Order theo account | Company-wide access |
| Order / Payment / Fulfillment / Pool như ADR | Contract table, ServiceOrder |

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

### B3.2 Company-wide order/license access (sau B3.1)

Gắn `Order.organizationId` / đọc license theo org = **đụng Order + quyền trên deliverable** → **dừng**, ADR (có thể amend phạm vi Order access, không đổi máy trạng thái Order nếu không cần).

**Cấm:** suy ra membership từ domain; gắn `organizationId` lên QuoteRequest “cho tiện”.

---

## B4 — Commercial reference → CommercialAgreement

**Trigger A (reference):** ops cần số HĐ/PO trên **một** Order.  
**Trigger B (agreement):** một khung thương mại **nhiều Order** hoặc term/lifecycle riêng (hiệu lực, renew, thanh toán theo kỳ).

### B4.1 Reference trên Order (ưu tiên đầu)

| | |
|--|--|
| **Schema** | Field tham chiếu trên **Order** (vd. `poNumber`, `contractRef`) = **đụng Core Order**. |
| **Migration** | **Cấm** cho đến khi ADR PASS. Tạm thời: `OrderNote` (staff) — Outer, không schema Order. |
| **API** | Admin ghi/đọc reference. Không API “ký HĐ”. |
| **State** | **Không** thêm Order status. PAID/COMPLETED giữ ADR-004/005. |
| **ADR** | **Bắt buộc** trước khi thêm cột Order. |

### B4.2 CommercialAgreement

Chỉ khi Trigger B.

| | |
|--|--|
| **Schema** | Bảng mới `CommercialAgreement`; Order *trỏ tới* agreement (`agreementId`). Header ≠ Order. |
| **Migration** | Sau ADR. Additive. Không thay `Order.status`. |
| **API** | Admin CRUD agreement; list Order theo agreement. |
| **State** | Lifecycle **của agreement** (nếu có) tách khỏi Order/Payment. |
| **ADR** | **Bắt buộc.** Cấm thay thế Order bằng Contract. Cấm Payment đi agreement mà bỏ Order. |

---

## B5 — Service SKU (khi có gói bán thật)

**Trigger:** KEYON bán gói triển khai/dịch vụ như SKU (giá, thanh toán), không chỉ form lead.

| | |
|--|--|
| **Schema** | Ưu tiên **enum hiện có**: `SalesMotion.QUOTE_REQUIRED` + `FulfillmentStrategy.MANUAL`. **Cấm** License Pool consume. **Cấm** `ServiceOrder` / `ServicePayment`. Deliverable type mới (vd. SERVICE) = đổi Variant/Fulfillment abstraction → **dừng + ADR**. |
| **Migration** | Catalog rows nếu không đổi enum. Đổi enum/strategy → sau ADR. |
| **API** | Checkout/quote → **Order** + **Payment** như hiện tại; job fulfillment MANUAL/inbox. |
| **State** | Cùng Order/Payment/Fulfillment. Không state máy song song. Webhook → Payment → Fulfillment — **không** webhook → Pool. |
| **ADR** | Không nếu chỉ dùng MANUAL + QUOTE_REQUIRED đã freeze. **Có** nếu thêm strategy/deliverable/state. ADR-002: dịch vụ **không** vào Pool. |

---

## Gate trước mỗi PR Phase B

1. Có đụng Core Stable besides Outer / bugfix có bằng chứng? → Reject hoặc ADR.  
2. Heuristic domain/companyName có lọt sang authorization? → Reject.  
3. Portal có đọc Order ngoài account? → Reject (trừ sau B3.2 + ADR).  
4. Có ServiceOrder/ServicePayment/Contract-as-Order? → Reject.  
5. Có migrate trước ADR khi đụng abstraction freeze? → Reject.

## Thứ tự

```
B1 intake (lead)
 → B2 admin heuristic (suggestion only)
 → B3.1 Org + Membership
 → B3.2 org-scoped access (ADR)
 → B4.1 Order reference (ADR) hoặc OrderNote tạm
 → B4.2 CommercialAgreement khi đủ trigger (ADR)
 → B5 service SKU (Pool cấm; ADR nếu đổi enum)
```
