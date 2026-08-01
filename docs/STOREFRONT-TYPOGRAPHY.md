# KEYON Storefront Typography

**Đi kèm:** Effects → [`docs/STOREFRONT-EFFECTS.md`](./STOREFRONT-EFFECTS.md) (motion / shadow / hover).  
**Nguồn code:** [`web/src/storefront/typography.ts`](../web/src/storefront/typography.ts)  
**Phạm vi:** Home, Shop, PDP, Checkout, Contact, Policy, Account (portal), Auth, Admin (cùng thang; H1 admin = `ADMIN_PAGE_TITLE`).  
**Không** lấy PNG trong `docs/mockups/` làm nguồn sự thật khi lệch với UI đang chạy.

---

## 1. Mục đích

Một catalog token → hết “chỉnh từng chữ trên từng trang”.  

**Mặc định khi implement mockup / UI mới:** chọn token từ spec này + `typography.ts` — không hard-code cỡ theo mắt hay PNG mockup.  
Mockup trong `docs/mockups/` chỉ tham chiếu layout/content; không override scale token khi lệch.  
Thiếu bậc → bổ sung token + cập nhật doc này, rồi mới dùng.

---

## 2. Type scale (cố định)

| px | Vai trò | Token chính |
|----|---------|-------------|
| 11 | Badge, caption, overline, sidebar section | `BADGE`, `FIELD_CAPTION`, `OVERLINE`, `SIDEBAR_SECTION` |
| 12 | Meta, giá gạch, breadcrumb | `CARD_META`, `COMPARE_PRICE`, `BREADCRUMB` |
| 13 | CTA/tab/filter/pagination gọn, field action | `CTA_COMPACT`, `TAB`, `LINK_FIELD` |
| 14 | Body, card title, form, nav, table, giá portal | `BODY`, `CARD_TITLE`, `FORM_LABEL`, `FIELD_VALUE`, `NAV_ITEM`, `TABLE_CELL`, `INLINE_PRICE`, `LINK` |
| 15 | CTA lớn, giá catalog, lead | `CTA_LABEL`, `CARD_PRICE`, `SECTION_LEAD` |
| 16–18 | Tổng thanh toán / KPI dashboard lớn | `SUMMARY_TOTAL`, `STAT_VALUE` |
| 20+ | Subsection → Section → PDP → Page → Hero | `SUBSECTION_TITLE` … `HERO_TITLE` |

**Nguyên tắc:** cùng bậc px, nhấn bằng **weight + màu**, không phóng size cho action.

---

## 3. Decision tree

```
Đang style gì?
│
├─ Tiêu đề trang / section / card lớn
│   └─ PAGE / SECTION / SUBSECTION / PDP / HERO / ADMIN_PAGE
│
├─ Đoạn mô tả dưới title
│   └─ PAGE_LEAD (hero/intro dài) · SECTION_LEAD (thường)
│
├─ Nút bấm
│   ├─ Primary/secondary h-11 / h-12  → CTA_LABEL
│   └─ Trong card / tab / filter / Hiện-Chép → CTA_COMPACT (h-8…h-10)
│
├─ Link chữ
│   ├─ “Xem tất cả”, footer card     → LINK_ACCENT
│   ├─ “Chỉnh sửa” cạnh field        → LINK_FIELD
│   └─ Micro (đánh dấu đã đọc)       → LINK_MICRO
│
├─ Form / hàng thông tin
│   ├─ Label                         → FORM_LABEL
│   ├─ Value đọc                    → FIELD_VALUE (số → FIELD_VALUE_NUM)
│   ├─ Input                        → INPUT_TEXT
│   └─ Lỗi / OK                     → FORM_ERROR / FORM_SUCCESS
│
├─ Giá
│   ├─ Shop / Home card             → CARD_PRICE
│   ├─ PDP buy-box                  → PDP_PRICE (chỉ đây)
│   ├─ Account / dòng đơn           → INLINE_PRICE
│   ├─ “Tổng thanh toán”            → SUMMARY_TOTAL
│   └─ Giá gạch                     → COMPARE_PRICE
│
├─ Stat số trên card profile dày
│   └─ FIELD_VALUE_NUM / INLINE_PRICE — CẤM STAT_VALUE
│
├─ Badge / chip / caption key
│   └─ BADGE · FIELD_CAPTION · OVERLINE
│
└─ Nav / breadcrumb / table
    └─ NAV_ITEM · BREADCRUMB · TABLE_HEADER · TABLE_CELL
```

---

## 4. Ma trận surface × token

| Surface | Title | Body | Action | Price / số |
|---------|-------|------|--------|------------|
| Hero | `HERO_TITLE` | `PAGE_LEAD` | `CTA_LABEL` | — |
| Shop / Home card | `CARD_TITLE` | `CARD_META` | `CTA_COMPACT` / nút card | `CARD_PRICE` |
| PDP buy-box | `PDP_TITLE` | `SECTION_LEAD` | `CTA_LABEL` | `PDP_PRICE` |
| Checkout summary | `SUBSECTION_TITLE` | `SECTION_LEAD` | `CTA_LABEL` | `SUMMARY_TOTAL` + dòng `INLINE_PRICE` |
| Account field row | `SUBSECTION_TITLE` (card) | `FORM_LABEL` + `FIELD_VALUE` | `LINK_FIELD` | — |
| Account dense stat | — | `FORM_LABEL` | — | `FIELD_VALUE_NUM` / `INLINE_PRICE` |
| License key box | — | `FIELD_CAPTION` + `MONO_VALUE` | `CTA_COMPACT` | — |
| Orders table | `PAGE_TITLE` | `TABLE_HEADER` / `CARD_TITLE` | `LINK_ACCENT` | `INLINE_PRICE` |
| Auth | `PAGE_TITLE` | `SECTION_LEAD` / `FORM_*` | `CTA_LABEL` | — |
| Admin | `ADMIN_PAGE_TITLE` | `BODY` / `FORM_*` / `TABLE_*` | `CTA_LABEL` / `CTA_COMPACT` | `STAT_VALUE` (KPI lớn) hoặc `FIELD_VALUE_NUM` |

---

## 5. Quy tắc cứng

1. Không hard-code `text-[Npx]` / `text-sm font-semibold` cho CTA nếu đã có token.
2. **CTA lớn ≠ CTA gọn** — `CTA_LABEL` (15) chỉ h-11/h-12; trong card dùng `CTA_COMPACT` (13).
3. **Giá catalog ≠ portal** — `CARD_PRICE`/`PDP_PRICE` vs `INLINE_PRICE`/`SUMMARY_TOTAL`.
4. Action trong card **không** to hơn value / card title.
5. Profile / stat dày: `FORM_LABEL` + `FIELD_VALUE*` — **cấm** `STAT_VALUE` / `CTA_LABEL`.
6. Admin H1 = `ADMIN_PAGE_TITLE`; còn lại dùng cùng token storefront.
7. Thiếu bậc → sửa `typography.ts` + doc này, không invent `text-[14.5px]`.

---

## 6. Anti-patterns

| Sai | Đúng |
|-----|------|
| `CTA_LABEL` cho Hiện / Chép | `CTA_COMPACT` |
| `CARD_META` (12) cho label “Họ và tên” | `FORM_LABEL` |
| `CARD_TITLE` bold cho mọi field value | `FIELD_VALUE` |
| `STAT_VALUE` trên card Đơn hàng / Tổng chi tiêu profile | `FIELD_VALUE_NUM` / `INLINE_PRICE` |
| `PDP_PRICE` trên checkout / account | `SUMMARY_TOTAL` hoặc `INLINE_PRICE` |
| `text-2xl` số liệu admin KPI nhỏ | `STAT_VALUE` hoặc `FIELD_VALUE_NUM` |
| Link “Chỉnh sửa” = `CTA_LABEL` | `LINK_FIELD` |

---

## 7. Ví dụ

```tsx
// Nút chính
className={`inline-flex h-11 … ${CTA_LABEL_CLASS}`}

// Hiện / Chép
className={`inline-flex h-8 … ${CTA_COMPACT_CLASS} text-accent`}

// Field profile
<p className={FORM_LABEL_CLASS}>Họ và tên</p>
<p className={FIELD_VALUE_CLASS}>{name}</p>
<button className={LINK_FIELD_CLASS}>Chỉnh sửa</button>

// License key
<p className={FIELD_CAPTION_CLASS}>License Key</p>
<p className={MONO_VALUE_CLASS}>{key}</p>

// Link xem tất cả
<Link className={LINK_ACCENT_CLASS} href="…">Xem tất cả →</Link>
```

---

## 8. PR checklist

- [ ] UI mới chỉ dùng token từ `typography.ts` (trừ marketing hero đã có token).
- [ ] Không thêm `CTA_LABEL` trong card dày / field row.
- [ ] Giá đúng surface (catalog vs portal).
- [ ] Guard khi review:  
  `rg "text-\[(1[0-9]|2[0-9])px\]" web/src/storefront`  
  (ad-hoc còn lại phải có lý do hoặc chuyển sang token).

---

## 9. Nhóm token (index)

**Titles:** `HERO_TITLE` · `PAGE_TITLE` · `PDP_TITLE` · `SECTION_TITLE` · `SUBSECTION_TITLE` · `ADMIN_PAGE_TITLE`  

**Body:** `PAGE_LEAD` · `SECTION_LEAD` · `BODY` · `BODY_MUTED`  

**Density:** `CARD_TITLE` · `CARD_META` · `FIELD_CAPTION` · `BADGE` · `OVERLINE`  

**Chrome:** `NAV_ITEM` · `NAV_ITEM_ACTIVE` · `BREADCRUMB` · `BREADCRUMB_CURRENT` · `SIDEBAR_SECTION`  

**Table / empty / tabs:** `TABLE_HEADER` · `TABLE_CELL` · `EMPTY_TITLE` · `EMPTY_BODY` · `TAB` · `TAB_ACTIVE`  

**Actions:** `CTA_LABEL` · `CTA_COMPACT` · `LINK` · `LINK_COMPACT` · `LINK_ACCENT` · `LINK_FIELD` · `LINK_MICRO`  

**Forms:** `FORM_LABEL` · `FIELD_VALUE` · `FIELD_VALUE_NUM` · `INPUT_TEXT` · `FORM_ERROR` · `FORM_SUCCESS` · `MONO_VALUE`  

**Prices:** `CARD_PRICE` · `PDP_PRICE` · `INLINE_PRICE` · `SUMMARY_TOTAL` · `STAT_VALUE` · `COMPARE_PRICE`
