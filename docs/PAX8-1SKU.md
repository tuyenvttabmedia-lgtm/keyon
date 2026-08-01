# KEYON — Pax8 Sprint 2 (1 SKU only)

**Status:** ✅ ALL X1–X8 PASS · Evidence: `npm run test:pax8`  
**Layer:** Outer — Supplier Integration (không đổi Core Stable Order/Payment/Pool)  
**Related:** ADR-005 · [`OPS-SPRINTS.md`](./OPS-SPRINTS.md) · [`PILOT.md`](./PILOT.md)

> Roadmap: sau Internal Test / Pilot Gate. Scope **đúng 1 Supplier · 1 Product · 1 SKU**.  
> Không tích hợp catalog Pax8 hàng loạt. Không Instant qua Pax8.

---

## 1. Phạm vi

```
1 Supplier (Pax8)
      ↓
1 Product
      ↓
1 SKU (Variant: SEMI_AUTOMATED)
      ↓
Provision (adapter)
      ↓
Delivery (subscription / external_portal)
      ↓
Order COMPLETED
```

| Trong scope | Ngoài scope |
|-------------|-------------|
| Supplier adapter interface | Multi-SKU catalog sync |
| Pax8 **stub/sandbox** driver | Production Pax8 live bắt buộc trong X |
| SEMI_AUTOMATED → provision → delivery | Managed Subscription lifecycle |
| Idempotent `requestId` | Instant → Pax8 |
| 1 SKU E2E | Quote/VAT / Partner |

---

## 2. Architecture (không đụng Core)

```
Payment succeeded
      ↓
Fulfillment engine
      ↓
SEMI_AUTOMATED strategy
      ↓
SupplierProvisioner (interface)
      ↓
Pax8StubProvider | Pax8HttpProvider (sau)
      ↓
Delivery + job SUCCEEDED
```

- **Không** gọi `LicensePool` từ Semi-Automated.  
- **Không** gọi Pax8 từ Payment webhook.  
- Credentials: Admin **Cài đặt → NCC / Pax8** (AES) hybrid với ENV `PAX8_*` — không commit secret.

---

## 3. Exit Criteria X1–X8

| ID | Điều kiện |
|----|-----------|
| **X1** | Interface `SupplierProvisioner` + registry theo driver |
| **X2** | Seed/fixture: 1 Supplier Pax8 · 1 Product · 1 SKU `SEMI_AUTOMATED` + `upstreamProductRef` |
| **X3** | Checkout chấp nhận `SEMI_AUTOMATED` (không Instant-only) |
| **X4** | SA strategy gọi adapter — **không** `LicensePool.consume` |
| **X5** | Provision idempotent: cùng `requestId` → cùng `provisionId` |
| **X6** | Delivery tạo với type `SUBSCRIPTION` hoặc `EXTERNAL_PORTAL` |
| **X7** | E2E: Order → Payment → SA fulfill → Delivery → Order `COMPLETED` |
| **X8** | Instant regression: Pool path vẫn PASS (không đi Pax8) |

Evidence: `cd web && npm run test:pax8`

---

## 4. Credentials (Admin + ENV)

**Khuyến nghị:** Admin → Cài đặt → **NCC / Pax8** — driver, base URL, client id/secret (mã hóa), company id. Field trống → ENV.

```
PAX8_DRIVER=stub
PAX8_BASE_URL=
PAX8_CLIENT_ID=
PAX8_CLIENT_SECRET=
PAX8_COMPANY_ID=
```

Stub/sandbox không cần secret thật. Production secrets chỉ trên server / Admin.  
`http` lưu credential được; live adapter chưa bật (Sprint 2 exit vẫn stub).
