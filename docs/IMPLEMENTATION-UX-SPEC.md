# KEYON — Implementation UX Specification

> **TRẠNG THÁI:** THAM KHẢO ONLY · **Tài liệu chính:** [`KEYON-MVP-SPEC.md`](./KEYON-MVP-SPEC.md)

**Document type:** Implementation Spec (Developer handoff)  
**Source:** `docs/PRODUCT-UX-BLUEPRINT.md` (không lặp lại IA/Journey/Persona)  
**Status:** SUPERSEDED for implementation detail → xem `docs/PRODUCTION-UI-SPEC-01-HOME.md`  
**Note:** Business Goal / section list / CMS mapping **khóa** tại đây; Visual·Tokens·Components·Behavior·Admin detail·Checklist nằm ở Production UI Spec.  
**Screen 01 CHƯA được phép implement** cho đến khi Production UI Spec được Approve.  
**Cấm:** Screen 02 cho đến khi Screen 01 xong + approve riêng.

---

# SCREEN 01 — HOME PAGE

| Field | Value |
|-------|--------|
| Screen ID | `FE-01` |
| Route | `/` |
| Auth | Public (Guest + logged-in cùng layout; CTA account đổi theo session) |
| Layout shell | `StorefrontShell` = Global Banner (optional) + Header + Main + Footer |
| Primary CTA | Đi tới Catalog / PDP featured |
| Secondary CTA | “Cách giao hàng” → `/how-it-works` |
| SEO | Page type `home` — title/description/OG từ SEO Manager |

---

## 1. Business Goal

1. Trong **3 giây**: khách hiểu KEYON là Digital License Platform (không phải shop key rẻ).  
2. Trong **1 click**: vào luồng mua (Catalog hoặc Featured product).  
3. Giảm nghi ngờ: trust + how-it-works + FAQ ngắn trên trang.  
4. **100% copy/ảnh/section visibility** điều khiển từ Admin — không hard-code marketing content trong repo sau khi CMS sẵn.

**Success metrics (product, không phải code KPI):** CTR Hero primary · CTR Featured · bounce sau 5s giảm · ticket “KEYON bán gì?” giảm.

---

## 2. Wireframe (ASCII)

### 2.1 Desktop (≥1200px)

```
+==============================================================================+
| [GLOBAL BANNER — optional, full width, dismissible]                          |
+==============================================================================+
| LOGO    Sản phẩm  Thương hiệu  Cách giao hàng  Chính sách  Hỗ trợ            |
|                                              [Tìm kiếm....]  [Đăng nhập/Account]|
+==============================================================================+
|                                                                              |
|  HERO (full-bleed visual plane)                                              |
|  ------------------------------------------------------------------------    |
|  | Brand mark KEYON (hero-level)                                         |    |
|  | Heading (1 dòng ưu tiên)                                              |    |
|  | Supporting sentence (1–2 dòng)                                        |    |
|  | [Primary CTA]  [Secondary CTA]                                        |    |
|  | Search box (optional in hero — same Search component as header)       |    |
|  | Trust strip: 3–5 badges (icons+label)                                 |    |
|  ------------------------------------------------------------------------    |
|                                                                              |
+==============================================================================+
| SECTION: CATEGORY SHORTCUTS                                                  |
|  [Cat1] [Cat2] [Cat3] [Cat4] [Cat5]     → "Xem tất cả sản phẩm"             |
+==============================================================================+
| SECTION: FEATURED PRODUCTS                                                   |
|  Title + subtitle                                                            |
|  +--------+  +--------+  +--------+  +--------+                              |
|  | Card   |  | Card   |  | Card   |  | Card   |   (4–8 items)                 |
|  +--------+  +--------+  +--------+  +--------+                              |
|  [Xem tất cả]                                                                |
+==============================================================================+
| SECTION: BRANDS                                                              |
|  Title                                                                       |
|  [Logo] [Logo] [Logo] [Logo] [Logo] [Logo]                                   |
+==============================================================================+
| SECTION: HOW IT WORKS                                                        |
|  Title                                                                       |
|  (1) Chọn gói   (2) Thanh toán   (3) Nhận tài sản   (4) Hỗ trợ/resend         |
+==============================================================================+
| SECTION: WHY KEYON                                                           |
|  3–4 value props (icon + title + 1 câu)                                      |
+==============================================================================+
| SECTION: REVIEWS / SOCIAL PROOF                                              |
|  Title                                                                       |
|  [Quote cards 2–3]  hoặc  [Logo khách / rating summary]                      |
+==============================================================================+
| SECTION: FAQ TEASER                                                          |
|  Title + 4–6 accordion items + link "Xem tất cả FAQ"                         |
+==============================================================================+
| SECTION: BOTTOM CTA                                                          |
|  Heading + [Primary CTA]                                                     |
+==============================================================================+
| FOOTER                                                                       |
|  Col1 Brand/about | Col2 Sản phẩm | Col3 Hỗ trợ | Col4 Pháp lý               |
|  Social | Copyright | Payment/trust mini                                     |
+==============================================================================+
```

### 2.2 Tablet (768–1199px)

```
Banner
Header (logo + hamburger hoặc nav rút gọn + search icon + account)
Hero (full width; CTA stack dọc nếu hẹp)
Category: horizontal scroll chips
Featured: 2 cột
Brands: wrap 3–4/hàng
How it works: 2×2 grid
Why KEYON: 2 cột
Reviews: 1–2 cột
FAQ: full width
Bottom CTA
Footer: 2 cột rồi collapse
```

### 2.3 Mobile (≤767px)

```
Banner (1 dòng + dismiss)
Header: Logo | Search icon | Account | Menu
Hero: brand + heading + 1 sentence + CTA stack (primary full width)
Category: horizontal scroll
Featured: 1 cột (card đầy đủ) hoặc 1.2 cột peek-scroll
Brands: 3 cột logo nhỏ
How it works: vertical steps
Why KEYON: stack
Reviews: carousel 1 card
FAQ: accordion
Bottom CTA
Footer: accordion columns
```

---

## 3. Mục đích từng section

| Order | Section ID | Mục đích | Bắt buộc UX-A? |
|------:|------------|----------|----------------|
| 0 | `global_banner` | Thông báo vận hành/campaign; có thể ẩn | Có (có thể empty = ẩn) |
| 1 | `header` | Điều hướng + search + auth | Có |
| 2 | `hero` | Brand + 1 CTA chính | Có |
| 3 | `category_shortcuts` | Nhảy nhanh nhóm sản phẩm | Có (có thể ẩn nếu chưa có data) |
| 4 | `featured_products` | Chuyển đổi mua | Có |
| 5 | `brands` | Uy tín thương hiệu phân phối | Có |
| 6 | `how_it_works` | Giáo dục: không hứa “key” sai loại | Có |
| 7 | `why_keyon` | Khác biệt platform vs shop key | Có |
| 8 | `reviews` | Social proof | Có (có thể ẩn nếu 0 review published) |
| 9 | `faq_teaser` | Giảm ticket trước khi contact | Có |
| 10 | `bottom_cta` | CTA cuối trang | Có |
| 11 | `footer` | Liên kết sâu + pháp lý | Có |

**Thứ tự section trên trang = `Homepage Builder.sort_order`.**  
Section có `visibility=hidden` → không render (không để khoảng trống).

---

## 4. Component trong từng section

### 4.0 Global Banner

| Component | Props / content | Behavior |
|-----------|-----------------|----------|
| `BannerBar` | `message`, `tone` (info/warning/critical), `link_label`, `link_href`, `dismissible` | Click link → internal/external; dismiss → localStorage key `banner:{id}` đến khi `banner.updated_at` đổi |
| `BannerClose` | icon | Chỉ hiện nếu dismissible |

### 4.1 Header

| Component | Mô tả |
|-----------|--------|
| `Logo` | Image + alt + link `/` |
| `PrimaryNav` | List `{label, href, open_in_new}` — **không** hard-code item trong code sau CMS |
| `HeaderSearch` | Input + submit → `/search?q=` |
| `AuthEntry` | Guest: “Đăng nhập”; User: avatar/menu → Portal |
| `MobileMenu` | Drawer chứa PrimaryNav + Auth + Search |

### 4.2 Hero

| Component | Bắt buộc | Mô tả |
|-----------|----------|--------|
| `HeroBackground` | Có | Image hoặc gradient token **từ CMS** (không purple-default cứng trong spec design token — theo brand KEYON đã chọn ở Design tokens sprint) |
| `HeroBrand` | Có | Tên/logo KEYON mức hero (lớn hơn nav logo) |
| `HeroHeading` | Có | H1 duy nhất trang |
| `HeroDescription` | Có | 1 câu hỗ trợ |
| `HeroPrimaryButton` | Có | label + href |
| `HeroSecondaryButton` | Optional | label + href |
| `HeroSearch` | Optional | Reuse `HeaderSearch` style lớn hơn |
| `HeroTrustStrip` | Optional | 3–5 `TrustBadge` |
| `HeroFloatingCards` | Optional UX-B | Không bắt buộc UX-A; nếu bật: max 2 card, **không** overlay che CTA |

**Cấm trên Hero:** badge “INSTANT/MANUAL”, stats strip, schedule, địa chỉ, promo sticker chồng media.

### 4.3 Category Shortcuts

| Component | Mô tả |
|-----------|--------|
| `SectionHeader` | title, optional subtitle |
| `CategoryChip` | label, href, optional icon |
| `SectionLink` | “Xem tất cả sản phẩm” → `/products` |

### 4.4 Featured Products

| Component | Mô tả |
|-----------|--------|
| `SectionHeader` | |
| `ProductCard` | xem field bắt buộc bên dưới |
| `SectionLink` | → `/products` |

**`ProductCard` fields (customer language):**

| UI field | Nguồn | Không được hiện |
|----------|-------|-----------------|
| Ảnh | Product/Variant image | |
| Brand name | Brand | |
| Product name | Product | |
| Package name | Variant display name (“Gói”) | raw SKU trừ khi Admin bật |
| Price | Variant price VND formatted | |
| Delivery promise label | **Mapped copy** từ fulfillment strategy | raw `INSTANT`/`MANUAL`/`SEMI_AUTOMATED` |
| CTA | “Xem gói” → PDP | |

### 4.5 Brands

| Component | Mô tả |
|-----------|--------|
| `SectionHeader` | |
| `BrandLogoLink` | logo, name, href `/brands/{slug}` |

### 4.6 How It Works

| Component | Mô tả |
|-----------|--------|
| `SectionHeader` | |
| `StepItem` | `step_number`, `title`, `description`, optional icon | Max 4 steps |

Copy **không** được nói “nhận key ngay” nếu platform bán cả account/portal.

### 4.7 Why KEYON

| Component | Mô tả |
|-----------|--------|
| `ValuePropCard` | icon, title, body (≤140 chars) | 3 hoặc 4 items |

### 4.8 Reviews

| Component | Mô tả |
|-----------|--------|
| `ReviewCard` | quote, author_name, author_role_optional, rating_optional |
| `RatingSummary` | optional aggregate nếu Review Manager có |

### 4.9 FAQ Teaser

| Component | Mô tả |
|-----------|--------|
| `FaqAccordion` | items `{question, answer_html_or_md}` — chỉ published + `show_on_home=true` |
| `SectionLink` | → `/faq` |

### 4.10 Bottom CTA

| Component | Mô tả |
|-----------|--------|
| `CtaBand` | heading, optional sub, primary button |

### 4.11 Footer

| Component | Mô tả |
|-----------|--------|
| `FooterColumn` | title + links[] |
| `FooterSocial` | icons + href |
| `FooterLegal` | copyright, terms, privacy |
| `FooterTrustMini` | optional payment/trust icons |

---

## 5. Admin cấu hình được gì (map 100% UI → Admin)

| UI trên Home | Admin module | Field Admin được sửa | Visibility |
|--------------|--------------|----------------------|------------|
| Global banner | **Banner Manager** | message, tone, link, schedule start/end, dismissible, priority | on/off + schedule |
| Logo header/footer | **Brand / System Settings** | logo light/dark, alt, favicon | — |
| Primary nav | **Navigation Manager** | items order, label, href, visible | per item |
| Header search placeholder | **UI Strings** (hoặc Navigation settings) | placeholder text | — |
| Hero toàn bộ | **Hero Manager** | brand_text, title, subtitle, primary_cta{label,href}, secondary_cta{}, background_asset, show_search, trust_badge_ids[], floating_cards[] | section on/off |
| Trust badges trong hero | **Trust Badges Manager** | icon, label, sort | publish |
| Category shortcuts | **Merchandising Manager** → Home categories | category refs / custom chips {label,href,icon} | section on/off |
| Featured products | **Merchandising Manager** → Featured | product/variant IDs, sort, max_items | section on/off |
| Brands row | **Merchandising Manager** → Home brands **hoặc** Brand flag `show_on_home` | brand IDs, sort | section on/off |
| How it works | **How-it-works Editor** | steps[1..4], section title | section on/off |
| Why KEYON | **Homepage Builder** / Section blocks | value props[] | section on/off |
| Reviews | **Review Manager** | reviews, `show_on_home`, sort | section on/off nếu 0 |
| FAQ teaser | **FAQ Manager** | FAQ flag `show_on_home`, order | section on/off |
| Bottom CTA | **Homepage Builder** | heading, button | section on/off |
| Footer | **Footer Builder** | columns, links, social, copyright | — |
| Section order | **Homepage Builder** | sort_order per section | hide section |
| SEO home | **SEO Manager** | title, description, og_image, canonical | — |
| Announcement vs maintenance | **Banner Manager** + **Maintenance** | maintenance message riêng khi flag on | system |

**Publish workflow (bắt buộc khi CMS live):** Draft → Preview → Publish · mỗi Publish ghi Audit `cms.publish` với entity + actor.

---

## 6. Responsive rules (cụ thể)

| Breakpoint | Hero | Featured grid | Nav |
|------------|------|---------------|-----|
| Desktop ≥1200 | Heading ≤ 2 dòng; CTA ngang | 4 cột | Full text nav |
| Tablet 768–1199 | CTA có thể wrap | 2 cột | Nav rút hoặc hamburger |
| Mobile ≤767 | Primary CTA full width; Secondary dưới | 1 cột | Hamburger + search icon |

**Touch:** mọi CTA ≥ 44px chiều cao.  
**Không** horizontal page scroll. Category chips được phép scroll ngang trong section.

---

## 7. Empty State

| Tình huống | UI |
|------------|-----|
| Không có Featured | Ẩn section `featured_products` **hoặc** hiện empty: “Đang cập nhật danh mục” + CTA `/products` — chọn 1 behavior trong Homepage Builder: `hide` \| `placeholder` (default **hide**) |
| Không có Brands | Ẩn section brands |
| Không có Reviews published | Ẩn section reviews |
| Không có FAQ `show_on_home` | Ẩn FAQ teaser |
| Category rỗng | Ẩn category shortcuts |
| Search no results (từ header) | Không xử lý trên Home — thuộc Screen Search |

---

## 8. Loading State

| Vùng | Behavior |
|------|----------|
| First paint shell | Header + Footer skeleton ngay (layout stable) |
| Hero | Skeleton block full-bleed (không CLS lớn): chỗ H1 + 2 button |
| Featured | 4 skeleton cards cùng tỉ lệ card thật |
| Brands | 6 skeleton circles/rects |
| FAQ | 4 skeleton rows |

**Timeout:** nếu CMS payload > 3s → hiện shell + toast/inline “Đang tải nội dung” + vẫn cho click nav tới `/products`.

---

## 9. Error State

| Lỗi | UI | Recovery |
|-----|-----|----------|
| CMS home payload fail | Page vẫn render Header/Footer từ fallback cache nếu có; main: message “Không tải được trang chủ” + button Retry + link Catalog | Retry fetch; không crash app |
| Featured products API fail | Ẩn section hoặc error inline trong section (“Không tải sản phẩm nổi bật”) — **không** fail cả trang | Retry section |
| Search navigate fail | N/A trên Home | — |
| 500 toàn cục | FE-22 branded error (screen riêng) | — |

**Không** hiện stack trace. **Không** hiện Prisma/enum nội bộ.

---

## 10. API cần gọi

> Contract tên gợi ý cho FE. Implement thật có thể map BFF. **Không** gọi Domain write. **Không** đụng License Pool / Payment từ Home.

| # | Method | Endpoint (đề xuất) | Mục đích | Cache |
|---|--------|-------------------|----------|-------|
| 1 | `GET` | `/api/storefront/home` | Aggregate: sections config + resolved entities cho Home | CDN/ISR ok; revalidate on publish |
| 2 | `GET` | `/api/storefront/seo?path=/` | SEO meta home | cache |
| 3 | `GET` | `/api/storefront/banner/active` | Banner đang hiệu lực | short cache |
| 4 | (optional tách) `GET` | `/api/storefront/merchandising/featured` | Nếu không embed trong home aggregate | cache |
| 5 | (nav) `GET` | `/api/storefront/navigation?menu=primary` | Header links | cache |
| 6 | (footer) `GET` | `/api/storefront/footer` | Footer columns | cache |

### 10.1 `GET /api/storefront/home` — response shape (logical)

```
{
  sections: [
    {
      id: "hero" | "category_shortcuts" | "featured_products" | ...,
      visible: boolean,
      sort_order: number,
      payload: { ... per section }
    }
  ],
  published_at: iso
}
```

**Hero payload:** title, subtitle, brand_text, background_url, primary_cta, secondary_cta?, show_search, trust_badges[]  
**Featured payload:** items[]: `{ product_slug, product_name, brand_name, package_name, price_vnd, image_url, delivery_label, href }`  
**FAQ payload:** items[]: `{ id, question, answer }`  
**How it works payload:** steps[]  
**Reviews payload:** items[]  

### 10.2 Cấm trên Home

- `POST` checkout  
- Gọi Payment / Pool / Admin monitoring  
- Query raw `fulfillmentStrategy` ra JSON public mà không map `delivery_label`

---

## 11. Core Stable — không ảnh hưởng

| Được làm | Không được làm |
|----------|----------------|
| Đọc Product/Brand/Variant **đã publish** qua Storefront read API / read model | Sửa schema Order/Payment/Pool |
| CMS tables/content (Outer Layer) | Business logic thanh toán trên Home |
| Map strategy → `delivery_label` ở **presentation layer** | Expose Inventory count thô nếu chưa có policy (Home chỉ featured, không “còn X kho” trừ khi Merchandising bật flag sau) |
| ISR/cache invalidation khi CMS publish | Gọi `LicensePoolService` từ page Home |

Home **fail CMS** không được làm hỏng checkout route khác.

---

## 12. Copy rules (Developer phải tuân)

1. H1 chỉ một trên trang (Hero).  
2. Không dùng từ: Instant, Manual, Semi-Automated, SKU, Variant, Pool, Webhook, Provider.  
3. Delivery label ví dụ đã duyệt:  
   - Instant → “Giao ngay sau thanh toán”  
   - Manual → “KEYON xử lý trong SLA”  
   - Semi → “Kích hoạt qua đối tác”  
4. Giá: `vi-VN` + “đ” hoặc “VND” — thống nhất theo System Settings `currency_display`.

---

## 13. Acceptance Criteria — Screen 01 Home

Developer/QA tick trước khi coi Home xong:

- [ ] Đủ section theo Homepage Builder order; section ẩn không để lỗ trống  
- [ ] Hero có Brand + H1 + 1 supporting + Primary CTA  
- [ ] Không overlay sticker trên hero media  
- [ ] Featured cards không lộ enum kỹ thuật  
- [ ] Mọi text/ảnh marketing đổi được từ Admin modules ở §5 (hoặc flagged “CMS stub” rõ trong PR nếu CMS chưa build — temporary fixture **một nơi**)  
- [ ] Loading skeleton không làm nhảy layout nặng  
- [ ] Lỗi featured không làm trắng toàn trang  
- [ ] Responsive 3 breakpoint đúng §6  
- [ ] Không import/call Core write services  
- [ ] SEO title/description từ SEO Manager (hoặc stub có cấu trúc sẵn)

---

## 14. Out of scope — Screen 01

- Product Listing filters (Screen 02)  
- PDP (03)  
- Checkout/Payment (04–06)  
- Admin UI của Hero Manager (spec Admin riêng sau) — **Home chỉ consume API**  
- A/B testing  
- Personalization theo user  

---

# Trạng thái tài liệu

| Screen | Spec status |
|--------|-------------|
| **01 Home** | **DONE — chờ approve** |
| 02 Product Listing | Chưa viết — chờ approve 01 |
| 03–16 … | Chưa viết |
| Admin screens | Chưa viết |

**Sau khi Founder/PO approve Screen 01:** viết tiếp **Screen 02 — Product Listing** cùng format §1–11.
