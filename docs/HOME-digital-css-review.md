# Đánh giá: CSS Design System ↔ Mockup Home Digital

> Nguồn: `OneDrive/Desktop/csss/*.css` + mockup `docs/mockups/home-digital-desktop.png`  
> Demo archive: **`/demo/home`** · **Home chính thức `/` đã áp dụng (2026-07-23)**

## Kết luận ngắn

**CSS khớp ~70–80% cấu trúc mockup** (container, navbar, hero 2 cột, grids category/product/news, footer).  

→ **Đã port sang Home chính thức** bằng React + Tailwind (không import DS CSS pack để tránh xung đột `.container` / `.btn` / reset).

## Production apply (storefront)

| Hạng mục | Token / UI |
|----------|------------|
| Accent | `#0EA5A4` / hover `#0B8D8D` / soft `#ECFEFF` |
| Navy / text | `#0F172A` / muted `#475569` |
| Footer | `#071F3B` |
| Container | `.home-container` **1200px** — toàn storefront |
| CTA label | `CTA_LABEL` 15px — nút lớn (h-11+); `CTA_COMPACT` 13px — Hiện/Chép/filter |
| Home sections | Hero → Partners → Categories → Featured(4) → Why → Solutions → News(4) → CTA |
| Shell | Header logo-mark + Đăng nhập/Đăng ký; Footer multi-col + payment chips |

Các trang About / FAQ / Products / Blog / Account / Auth / Checkout đồng bộ container + token qua shell chung.

### Typography (đầy đủ)

→ **`docs/STOREFRONT-TYPOGRAPHY.md`** (spec: scale, decision tree, ma trận surface, anti-patterns, PR checklist)  
→ Code: `web/src/storefront/typography.ts`

Tóm tắt: `CTA_LABEL` 15px (h-11+) ≠ `CTA_COMPACT` 13px (Hiện/Chép/filter); giá catalog ≠ portal; field profile cùng bậc ~14px (`FORM_LABEL` + `FIELD_VALUE` + `LINK_FIELD`).  
Mockup PNG trong `docs/mockups/` **không** override spec khi lệch localhost.

### Typography giá (catalog ≠ portal)

Nguồn: `web/src/storefront/typography.ts`

| Token | Dùng ở | Ghi chú |
|-------|--------|---------|
| `CARD_PRICE_CLASS` | Shop / Home product cards | 15px accent — bán hàng |
| `PDP_PRICE_CLASS` | PDP buy box only | Hero price — **không** dùng checkout/account |
| `INLINE_PRICE_CLASS` | Account lists, order lines, activity | Cùng cỡ `CARD_TITLE` (14px) |
| `SUMMARY_TOTAL_CLASS` | “Tổng thanh toán” | Một bậc nhẹ (`text-base`/`sm:text-lg`) |
| `STAT_VALUE_CLASS` | Dashboard tile lớn (hiếm) | Dense account card → dùng `FIELD_VALUE` / `INLINE_PRICE` |

**Quy tắc:** Portal không làm giá to hơn tiêu đề. Chỉ catalog/PDP được nhấn giá.

## Khớp tốt

| Mockup | CSS |
|--------|-----|
| Sticky header ~80px, logo + nav + CTA | `05-navbar.css` H82 |
| Hero 2 cột + badge + trust | `06-hero.css` + `hero-grid` |
| Category 5 cột | `.category-grid` |
| Product cards + hover lift | `.product-card` / `.card` |
| News 4 cột | `.news-grid` |
| Footer dark multi-col | `09-footer.css` |
| Teal primary, Inter, radius ~18 | `10-variables.css` `#0EA5A4` |

## Lệch / thiếu

| Hạng mục | Mockup | CSS / DS |
|----------|--------|----------|
| Container | ~1120–1200 (mắt) | **`--container-width: 1200px`** (không 1120) |
| Product grid | **6** cards | Default **5** cột (`.product-grid`) — demo override 6 |
| CTA banner | Navy flat, text trái + nút phải | `.cta-section` = **gradient teal**, center |
| “Vì sao chọn KEYON” | Intro + 2×3 features + art | Không có class sẵn — demo dùng helper |
| Logo cloud + ISO/PCI row | Có | Chỉ `.logo-cloud` — security pills demo-only |
| Hero media | Dashboard + floating cards | Class có; **thiếu asset ảnh** |
| Cart / search trong header | Có trong mockup | Navbar chưa cover đủ utility icons |
| Shadow / motion | Card nhẹ | DS dùng shadow + translateY hover (ổn với mockup digital) |

## Rủi ro kỹ thuật nếu gắn vào Next Home

1. **Xung đột class** với Tailwind (`.container`, `.flex`, `.btn`…) → demo dùng **iframe / static HTML**.
2. `01-reset.css` reset mạnh — không import vào `globals.css` chung.
3. Product 6 vs 5: cần sửa DS hoặc class riêng.

## Demo đã tối ưu (v7.1)

Bổ sung so với bản demo trước:
- Header: logo + subtitle, search, cart badge, Đăng nhập / Đăng ký
- Hero dashboard HTML (stats + lifecycle) + floating trusted card
- Partner logos + ISO/PCI pills
- Category icons SVG màu
- Product **6 cột**, box art gradient, giá đỏ, nút giỏ
- Why KEYON: 6 USP + shield SVG
- Solutions / News / CTA navy / Footer đủ cột + payment chips
- Container demo **1120px** (`demo-home.css`)

Xem: `/demo/home` hoặc `/demo/home-v7/index.html`
