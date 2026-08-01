# KEYON — Production UI Specification  
## Screen 01 — Home (`FE-01`)

> **TRẠNG THÁI:** THAM KHẢO ONLY · **Tài liệu chính:** [`KEYON-MVP-SPEC.md`](./KEYON-MVP-SPEC.md)  
> Không implement full Production Spec. Home MVP theo section list trong MVP Spec.

**Document type:** Production UI Spec (tài liệu cuối trước khi code)  
**Status:** READY FOR APPROVAL → chỉ sau approve mới được implement  
**Locked from:** `docs/IMPLEMENTATION-UX-SPEC.md` (Screen 01)  
**Không đổi:** Business Goal · User Flow · Core Stable · CMS Mapping (tên module)  
**Cấm:** Screen 02 · code · React · CSS · tự thiết kế ngoài spec này  

> Developer: mọi số đo, token, prop, state, admin field đều nằm trong tài liệu này.  
> Nếu thiếu → hỏi PO cập nhật spec, **không** tự suy.

---

# LOCKED REFERENCES (không sửa nội dung)

| Mục | Nguồn khóa |
|-----|------------|
| Business Goal | Implementation UX Spec §1 |
| Section list + order mặc định | Implementation UX Spec §3 |
| CMS module names (Hero Manager, …) | Implementation UX Spec §5 |
| API endpoints logical | Implementation UX Spec §10 |
| Core Stable boundary | Implementation UX Spec §11 |
| Route `/` · Screen ID `FE-01` | Implementation UX Spec header |

Phần dưới **chỉ bổ sung** Visual · Tokens · Components · Behavior · Admin detail · Checklist.

---

# PHẦN 1 — VISUAL SPECIFICATION

## 1.0 Page canvas

| Token / rule | Value |
|--------------|-------|
| Page background | `color.bg.canvas` |
| Content max width (sections trừ Hero/Banner full-bleed) | `layout.container.lg` = **1120px** |
| Content padding inline Desktop | `spacing.6` (24px) mỗi bên khi viewport > container |
| Content padding inline Tablet | `spacing.5` (20px) |
| Content padding inline Mobile | `spacing.4` (16px) |
| Section stack gap (giữa các section trong `<main>`) | `spacing.16` (64px) Desktop · `spacing.12` (48px) Tablet · `spacing.10` (40px) Mobile |
| First section after Header | Hero (0 gap trên — dính header) |
| Last section before Footer | Bottom CTA; gap dưới CTA → Footer = `spacing.0` (Footer tự có border-top) |

---

## 1.1 Global Banner

| Property | Desktop | Tablet | Mobile |
|----------|---------|--------|--------|
| Height | **40px** min; auto nếu wrap 2 dòng (max 64px) | 40px | min 36px; text 1–2 dòng |
| Width | 100vw full-bleed | 100vw | 100vw |
| Padding inline | `spacing.6` | `spacing.5` | `spacing.4` |
| Padding block | `spacing.2` (8px) | 8px | 6px |
| Alignment | text center; close button absolute right `spacing.4` | same | same |
| Z-index | `z.banner` = 40 | | |
| Typography | `type.caption` medium | | |

---

## 1.2 Header

| Property | Desktop | Tablet | Mobile |
|----------|---------|--------|--------|
| Height | **64px** | **64px** | **56px** |
| Width | 100% full-bleed bg | | |
| Inner max width | `layout.container.lg` 1120px | 100% + padding | 100% + padding |
| Padding inline | cân container | 20px | 16px |
| Logo height | **28px** | 28px | **24px** |
| Nav gap giữa items | `spacing.6` (24px) | — (ẩn vào menu) | — |
| Search width | **240px** | icon-only → expand overlay | icon → full-width sheet |
| Auth control | button height 36px | 36px | 36px hit area 44px |
| Position | `sticky` top: 0 (dưới banner nếu banner visible: `top = bannerHeight`) | sticky | sticky |
| Border bottom | `border.subtle` 1px | | |
| Background | `color.bg.surface` / `opacity.header` = 0.92 + blur token (xem Behavior) | | |
| Z-index | `z.header` = 30 | | |

**Grid Header Desktop (12 col trong container):**

```
[Logo 2] [Nav 6] [Search 2] [Auth 2]
```

---

## 1.3 Hero

| Property | Desktop | Tablet | Mobile |
|----------|---------|--------|--------|
| Width | 100vw full-bleed | 100vw | 100vw |
| Min height | **520px** | **440px** | **auto min 420px** |
| Max height | **680px** | 560px | none |
| Inner content max width | **720px** (text column) | 640px | 100% − 32px |
| Content alignment | **Left** trong container (không center text block) | Left | Left |
| Vertical alignment content | center trong hero min-height | center | padding-top `spacing.10` |
| Padding top | `spacing.16` (64px) | 48px | 40px |
| Padding bottom | `spacing.16` (64px) | 48px | 40px |
| Padding inline | theo container 1120 + 24 | 20 | 16 |
| Gap Brand → Heading | `spacing.4` (16px) | 16px | 12px |
| Gap Heading → Description | `spacing.3` (12px) | 12px | 12px |
| Gap Description → CTA row | `spacing.6` (24px) | 24px | 20px |
| Gap CTA row → Search (nếu có) | `spacing.5` (20px) | 20px | 16px |
| Gap Search → Trust strip | `spacing.6` (24px) | 20px | 16px |
| CTA row gap | `spacing.3` (12px) | 12px | 12px; **stack** full width |
| Background image | `object-fit: cover`; focal point CMS default **center** | | |
| Overlay | scrim `color.overlay.hero` opacity **0.45** trên ảnh (đảm bảo contrast chữ) | | |
| Floating cards | **UX-A: OFF** (không render). UX-B mới bật — max 2, ngoài cột text, không đè CTA | | |

**Hero text column grid:** 1 cột. Không 2-cột media|text trên UX-A.

---

## 1.4 Category Shortcuts

| Property | Desktop | Tablet | Mobile |
|----------|---------|--------|--------|
| Container | `layout.container.lg` | | |
| Padding top/bottom | `spacing.2` trong section (section gap đã có) | | |
| SectionHeader → chips gap | `spacing.5` (20px) | 20px | 16px |
| Chips layout | flex wrap, gap `spacing.3` | wrap | **horizontal scroll**, gap 12px; hide scrollbar đẹp |
| Chip height | **40px** | 40px | 40px |
| Chip padding inline | 16px | 16px | 14px |
| Chip radius | `radius.full` | | |
| Section link | right-aligned same row as header trên Desktop | dưới header | dưới header |

---

## 1.5 Featured Products

| Property | Desktop | Tablet | Mobile |
|----------|---------|--------|--------|
| Container | 1120px | | |
| SectionHeader → grid gap | `spacing.6` (24px) | 24px | 20px |
| Grid | **4 columns** | **2 columns** | **1 column** |
| Column gap | `spacing.5` (20px) | 20px | — |
| Row gap | `spacing.5` (20px) | 20px | 16px |
| Card width | `1fr` (≈ **265px** trong 1120−gaps) | `1fr` | 100% |
| Card min height | **360px** | 360px | auto min 340px |
| Image ratio | **4:3** (width:height) | 4:3 | 4:3 |
| Image area height | derived from ratio | | |
| Card padding (body dưới ảnh) | `spacing.4` (16px) | 16px | 16px |
| Internal gap body | `spacing.2` (8px) | 8px | 8px |
| Price → CTA gap | `spacing.4` (16px) | | |
| Max items default | **8** (Merchandising limit) | hiển thị hết trong grid | |

---

## 1.6 Brands

| Property | Desktop | Tablet | Mobile |
|----------|---------|--------|--------|
| Container | 1120px | | |
| Grid | **6 columns** | **4 columns** | **3 columns** |
| Gap | `spacing.6` (24px) | 20px | 16px |
| Logo box | **120×48px** max; object-fit contain | 100×40 | 96×36 |
| Alignment | center trong cell | | |
| Grayscale default | **yes** opacity 0.85; hover → full color | | |

---

## 1.7 How It Works

| Property | Desktop | Tablet | Mobile |
|----------|---------|--------|--------|
| Container | 1120px | | |
| Steps layout | **4 columns** | **2×2** | **1 cột** vertical |
| Gap | `spacing.6` | 24px | 20px |
| Step number size | 32px circle | 32px | 28px |
| Step title → body gap | 8px | | |
| Max steps | **4** | | |

---

## 1.8 Why KEYON

| Property | Desktop | Tablet | Mobile |
|----------|---------|--------|--------|
| Container | 1120px | | |
| Cards | **4 columns** nếu 4 items; **3** nếu 3 items | 2 columns | 1 column |
| Card padding | `spacing.5` (20px) | 20px | 16px |
| Card min height | **160px** | 160px | auto |
| Icon size | `icon.lg` 24px | 24px | 24px |
| Gap icon → title | 12px | | |

---

## 1.9 Reviews

| Property | Desktop | Tablet | Mobile |
|----------|---------|--------|--------|
| Container | 1120px | | |
| Layout | **3 columns** (max 3 cards) | 2 columns | **carousel** 1 card peek 12% next |
| Card padding | 20px | 20px | 16px |
| Quote max lines | 5 (line-clamp) | 5 | 6 |
| Gap | 20px | 20px | 16px |

---

## 1.10 FAQ Teaser

| Property | Desktop | Tablet | Mobile |
|----------|---------|--------|--------|
| Container | **720px** max width, **centered** trong 1120 | 100% | 100% |
| Item min height | 48px header row | 48px | 48px |
| Gap giữa items | 0 (chia bằng border) | | |
| Answer padding | 0 0 16px 0 khi expand | | |
| Max items on home | **6** | | |

---

## 1.11 Bottom CTA

| Property | Desktop | Tablet | Mobile |
|----------|---------|--------|--------|
| Container | 1120px | | |
| Min height | **160px** | 140px | 120px |
| Padding | 48px 24px | 40px 20px | 32px 16px |
| Alignment | **center** text + button | center | center |
| Gap heading → button | 20px | 16px | 16px |
| Background | `color.bg.muted` + optional border radius `radius.lg` | | |

---

## 1.12 Footer

| Property | Desktop | Tablet | Mobile |
|----------|---------|--------|--------|
| Width | full-bleed `color.bg.inverse` | | |
| Inner container | 1120px | | |
| Padding top/bottom | 64px / 32px | 48/24 | 40/24 |
| Columns | **4 columns** equal | **2×2** | **accordion** 1 cột |
| Column gap | 32px | 24px | 0 |
| Link stack gap | 8px | 8px | 8px |
| Social row gap | 12px | | |
| Copyright row | border-top 1px `border.inverse-subtle`; padding-top 24px; `type.caption` | | |

---

# PHẦN 2 — DESIGN TOKENS

Không viết CSS. Implement map token → theme.

## 2.1 Breakpoints

| Token | Value | Dùng |
|-------|-------|------|
| `bp.sm` | 0–767px | Mobile |
| `bp.md` | 768–1199px | Tablet |
| `bp.lg` | ≥1200px | Desktop |
| `bp.xl` | ≥1440px | optional: vẫn container 1120, chỉ tăng margin ngoài |

## 2.2 Layout

| Token | Value |
|-------|-------|
| `layout.container.sm` | 640px |
| `layout.container.md` | 880px |
| `layout.container.lg` | **1120px** |
| `layout.container.faq` | **720px** |
| `layout.hero.text` | **720px** |

## 2.3 Spacing scale

| Token | px |
|-------|-----|
| `spacing.0` | 0 |
| `spacing.1` | 4 |
| `spacing.2` | 8 |
| `spacing.3` | 12 |
| `spacing.4` | 16 |
| `spacing.5` | 20 |
| `spacing.6` | 24 |
| `spacing.8` | 32 |
| `spacing.10` | 40 |
| `spacing.12` | 48 |
| `spacing.16` | 64 |
| `spacing.20` | 80 |
| `spacing.24` | 96 |

## 2.4 Typography

| Token | Size / Line / Weight / Letter | Dùng |
|-------|-------------------------------|------|
| `type.display` | 40/48 · Semibold · -0.02em | Hero brand optional |
| `type.h1` | **36/44** Desktop · **28/36** Mobile · Semibold · -0.02em | Hero H1 only |
| `type.h2` | **28/36** · Semibold | Section titles |
| `type.h3` | **20/28** · Semibold | Card titles, step titles |
| `type.body` | **16/24** · Regular | Description, FAQ answer |
| `type.body-sm` | **14/20** · Regular | Secondary |
| `type.caption` | **12/16** · Medium | Badge, copyright, banner |
| `type.label` | **14/20** · Medium | Button, nav, chip |
| `type.price` | **18/24** · Semibold | ProductCard price |

Font families (spec, không file):  
- `font.sans` — UI/body (vd. nguồn: modern grotesque; **cấm** Inter/Roboto/Arial-as-brand nếu có webfont brand)  
- `font.display` — headings (cùng family hoặc display riêng; **một** display đã chọn cho KEYON)

## 2.5 Color tokens

### Brand & surface

| Token | Role |
|-------|------|
| `color.brand.primary` | CTA primary, link emphasis |
| `color.brand.primary-hover` | Primary hover |
| `color.brand.primary-active` | Primary pressed |
| `color.brand.on-primary` | Text trên primary button |
| `color.bg.canvas` | Page background |
| `color.bg.surface` | Header, cards |
| `color.bg.muted` | Bottom CTA band, chip bg |
| `color.bg.inverse` | Footer bg |
| `color.text.primary` | Main text |
| `color.text.secondary` | Muted |
| `color.text.inverse` | Trên inverse/footer/hero khi trên scrim |
| `color.text.link` | Inline links |
| `color.border.subtle` | Default border |
| `color.border.strong` | Focus ring companion |
| `color.overlay.hero` | Scrim trên hero image |
| `color.overlay.modal` | (shell; Home ít dùng) |

### Status

| Token | Role |
|-------|------|
| `color.status.success` | Success |
| `color.status.success-bg` | Soft bg |
| `color.status.warning` | Warning / banner warning |
| `color.status.warning-bg` | |
| `color.status.danger` | Error / banner critical |
| `color.status.danger-bg` | |
| `color.status.info` | Info banner |
| `color.status.info-bg` | |
| `color.neutral.0` … `color.neutral.900` | Scale xám (10 bậc tối thiểu: 0,50,100,200,300,400,500,600,700,800,900) |

**Brand direction (khóa cho Screen 01):** nền sáng trung tính · chữ gần ink/navy · accent **teal-blue chuyên nghiệp** (Stripe/Paddle-like).  
**Cấm token theme:** purple-gradient default · cream+#terracotta cliché · glow neon.

Exact hex chọn trong Design Tokens PR **một lần** và điền bảng hex phụ lục; đến khi có hex, implement dùng CSS variables named đúng token trên — **không** invent màu ngoài scale đã approve.

## 2.6 Button tokens

| Token | Value |
|-------|-------|
| `button.height.md` | 40px |
| `button.height.lg` | 48px (Hero primary) |
| `button.height.sm` | 32px |
| `button.padding-x.md` | 16px |
| `button.padding-x.lg` | 24px |
| `button.radius` | `radius.md` |
| `button.font` | `type.label` |

## 2.7 Input / Search

| Token | Value |
|-------|-------|
| `input.height` | 40px |
| `input.height.lg` | 48px (Hero search) |
| `input.padding-x` | 12px |
| `input.radius` | `radius.md` |
| `input.border` | `color.border.subtle` |
| `input.border-focus` | `color.brand.primary` |
| `input.bg` | `color.bg.surface` |

## 2.8 Card / radius / border / shadow

| Token | Value |
|-------|-------|
| `radius.sm` | 6px |
| `radius.md` | 10px |
| `radius.lg` | 16px |
| `radius.full` | 9999px |
| `border.width` | 1px |
| `shadow.none` | none |
| `shadow.card` | **none** trên UX-A Home (flat; border subtle) |
| `shadow.header` | optional 0 1px 0 border only |
| `card.radius` | `radius.lg` |
| `card.border` | `color.border.subtle` |

> Shadow: **cấm** multi-layer soft glow. Home flat.

## 2.9 Icon size

| Token | px |
|-------|-----|
| `icon.sm` | 16 |
| `icon.md` | 20 |
| `icon.lg` | 24 |
| `icon.xl` | 32 |

## 2.10 Z-index

| Token | Value |
|-------|-------|
| `z.base` | 1 |
| `z.sticky` | 20 |
| `z.header` | 30 |
| `z.banner` | 40 |
| `z.dropdown` | 50 |
| `z.overlay` | 60 |
| `z.toast` | 70 |

## 2.11 Motion

| Token | Value |
|-------|-------|
| `motion.fast` | 120ms |
| `motion.normal` | 200ms |
| `motion.slow` | 320ms |
| `motion.easing.standard` | cubic-bezier(0.2, 0, 0, 1) |
| `motion.easing.emphasized` | cubic-bezier(0.2, 0, 0, 1) |

Home allowed animations: fade/slide **nhẹ** skeleton → content; accordion height; sticky header blur.  
**Cấm:** parallax hero, bounce, infinite pulse CTA.

## 2.12 Opacity

| Token | Value |
|-------|-------|
| `opacity.header` | 0.92 |
| `opacity.disabled` | 0.4 |
| `opacity.brand-logo` | 0.85 |
| `opacity.overlay.hero` | 0.45 |

---

# PHẦN 3 — COMPONENT SPECIFICATION

## 3.0 Inventory (Screen 01)

`StorefrontShell` · `GlobalBanner` · `SiteHeader` · `Logo` · `PrimaryNav` · `SearchBox` · `AuthEntry` · `MobileMenu` · `Hero` · `TrustBadge` · `SectionHeader` · `CategoryChip` · `ProductCard` · `BrandLogoLink` · `StepItem` · `ValuePropCard` · `ReviewCard` · `FaqAccordion` · `CtaBand` · `Footer` · `FooterColumn` · `Button` · `Skeleton` · `InlineError` · `EmptySection`

---

### `Button`

| | |
|--|--|
| **Purpose** | CTA duy nhất cho hành động |
| **Props** | `variant`: primary \| secondary \| ghost \| danger · `size`: sm \| md \| lg · `label`: string · `href?` · `onClick?` · `disabled?` · `loading?` · `leftIcon?` · `fullWidth?` |
| **Variants** | primary = brand fill · secondary = border + surface · ghost = text only · danger = status.danger (Home: **không dùng** trừ Admin preview) |
| **States** | default · hover · active · focus-visible · disabled · loading (spinner `icon.sm`, label giữ hoặc “Đang xử lý”) |
| **Interaction** | click → navigate hoặc handler; Enter/Space khi focus |
| **Responsive** | Hero: lg + fullWidth on mobile |
| **A11y** | focus ring 2px `color.brand.primary`; loading ⇒ `aria-busy` |
| **Reuse** | Toàn storefront |

### `SearchBox`

| | |
|--|--|
| **Purpose** | Tìm sản phẩm → `/search?q=` |
| **Props** | `size`: md \| lg · `placeholder` · `defaultValue?` · `id` |
| **Variants** | header · hero |
| **States** | empty · filled · focus · disabled |
| **Interaction** | Submit on Enter hoặc icon button; trim query; reject empty submit |
| **Responsive** | Mobile header: icon mở sheet full width |
| **A11y** | `<label>` sr-only “Tìm kiếm”; `role="search"` |
| **Reuse** | Header, Hero |

### `GlobalBanner`

| | |
|--|--|
| **Purpose** | Thông báo site-wide |
| **Props** | `id` · `message` · `tone` · `link?` · `dismissible` |
| **Variants** | info · warning · critical |
| **States** | visible · dismissed |
| **Interaction** | dismiss → persist; link navigate |
| **A11y** | `role="status"` (info) hoặc `alert` (critical) |
| **Reuse** | Mọi storefront page |

### `SiteHeader`

| | |
|--|--|
| **Purpose** | Nav + search + auth |
| **Props** | `navItems[]` · `logo` · `searchPlaceholder` · `user?: {name}` |
| **States** | default · sticky scrolled (`shadow`/border stronger) · menuOpen |
| **Interaction** | sticky; mobile menu toggle |
| **A11y** | `banner` landmark; nav `navigation` |
| **Reuse** | Shell |

### `Hero`

| | |
|--|--|
| **Purpose** | Brand + primary conversion |
| **Props** | đúng Hero payload §10 Implementation Spec |
| **Variants** | withSearch \| noSearch · withTrust \| noTrust |
| **States** | loading skeleton · ready · error (fallback bg + text) |
| **Interaction** | CTA click; search submit |
| **Responsive** | §1.3 |
| **A11y** | đúng 1 `h1`; contrast text trên scrim ≥ 4.5:1 |
| **Reuse** | Chỉ Home (instance) |

### `SectionHeader`

| | |
|--|--|
| **Purpose** | Tiêu đề section |
| **Props** | `title` · `subtitle?` · `action?: {label,href}` · `align`: left \| center |
| **Reuse** | Mọi section |

### `CategoryChip`

| | |
|--|--|
| **Purpose** | Shortcut category |
| **Props** | `label` · `href` · `icon?` |
| **States** | default · hover · focus |
| **A11y** | link với tên rõ |

### `ProductCard`

| | |
|--|--|
| **Purpose** | Featured product teaser |
| **Props** | `imageUrl` · `brandName` · `productName` · `packageName` · `priceVnd` · `deliveryLabel` · `href` |
| **Variants** | default only trên Home |
| **States** | default · hover (border strong, **không** lift shadow) · focus · loading skeleton |
| **Interaction** | whole card clickable (link wrapping) |
| **A11y** | alt ảnh = productName; price đọc được |
| **Reuse** | Catalog (Screen 02 sau — cùng contract) |

### `BrandLogoLink`

| | |
|--|--|
| **Purpose** | Brand row |
| **Props** | `name` · `logoUrl` · `href` |
| **States** | default grayscale · hover color |
| **A11y** | alt = name |

### `TrustBadge`

| | |
|--|--|
| **Purpose** | Trust strip |
| **Props** | `icon` · `label` |
| **Layout** | icon 20 + label caption |

### `StepItem`

| | |
|--|--|
| **Purpose** | How it works step |
| **Props** | `index` 1–4 · `title` · `description` · `icon?` |

### `ValuePropCard`

| | |
|--|--|
| **Purpose** | Why KEYON |
| **Props** | `icon` · `title` · `body` (≤140 chars enforced CMS) |

### `ReviewCard`

| | |
|--|--|
| **Purpose** | Social proof |
| **Props** | `quote` · `authorName` · `authorRole?` · `rating?` 1–5 |
| **States** | line-clamp; expand không bắt buộc trên Home |

### `FaqAccordion`

| | |
|--|--|
| **Purpose** | FAQ teaser |
| **Props** | `items[{id,question,answer}]` · `allowMultiple`: **false** (chỉ 1 mở) |
| **States** | collapsed · expanded · focus |
| **Interaction** | click header toggle; Esc đóng |
| **A11y** | `aria-expanded`; header `button`; panel `region` |

### `CtaBand`

| | |
|--|--|
| **Purpose** | Bottom CTA |
| **Props** | `heading` · `sub?` · `button: Button props` |

### `Footer` / `FooterColumn`

| | |
|--|--|
| **Purpose** | Links pháp lý & IA |
| **Props** | `columns[{title,links[]}]` · `social[]` · `copyright` · `legalLinks[]` |
| **Mobile** | accordion: column title là button |

### `Skeleton`

| | |
|--|--|
| **Purpose** | Loading placeholders |
| **Props** | `variant`: hero \| card \| line \| circle · `width?` · `height?` |
| **Motion** | pulse opacity 0.6↔1 trong `motion.slow` |

### `InlineError`

| | |
|--|--|
| **Purpose** | Section-level error |
| **Props** | `message` · `onRetry?` |
| **Reuse** | Featured fail, Home payload fail partial |

### `EmptySection`

| | |
|--|--|
| **Purpose** | Khi policy = placeholder (hiếm; default hide) |
| **Props** | `message` · `cta?` |

---

# PHẦN 4 — UX BEHAVIOR

## 4.1 Header

| Behavior | Spec |
|----------|------|
| Sticky | Luôn sticky; khi `scrollY > 8` thêm border-bottom strong |
| Banner coexistence | `top` offset = banner height nếu banner visible |
| Blur | background `color.bg.surface` @ `opacity.header` + backdrop-blur **8px** |
| Mobile menu | open: trap focus; Esc close; body scroll lock |
| Auth | Guest → `/login?next=/` · User → menu: Tài sản, Đơn hàng, Đăng xuất |

## 4.2 Hero

| Behavior | Spec |
|----------|------|
| Image load | hiện scrim+bg color trước; image fade-in `motion.normal` |
| CTA hover | primary → `color.brand.primary-hover` `motion.fast` |
| No parallax | |
| Reduced motion | `prefers-reduced-motion: reduce` → tắt fade |

## 4.3 Search

| Behavior | Spec |
|----------|------|
| Empty submit | không navigate; focus input |
| Query | trim; max length **120** chars |
| Encode | `encodeURIComponent` |

## 4.4 ProductCard

| Behavior | Spec |
|----------|------|
| Hover | border → `color.border.strong`; image scale **1.02** trong frame `overflow hidden` `motion.normal` |
| Focus | focus ring trên card link |
| Click | navigate PDP |

## 4.5 Brands

| Behavior | Spec |
|----------|------|
| Hover | grayscale 0 → 1 color `motion.fast` |

## 4.6 FAQ

| Behavior | Spec |
|----------|------|
| Accordion | chỉ 1 panel open |
| Animation | height auto animate `motion.normal`; reduced-motion = instant |
| Keyboard | Tab to headers; Enter/Space toggle |

## 4.7 Sections visibility

| Behavior | Spec |
|----------|------|
| `visible=false` | **unmount** — không stub khoảng trống |
| Empty featured + policy hide | unmount |
| Empty featured + policy placeholder | `EmptySection` |

## 4.8 Loading

| Behavior | Spec |
|----------|------|
| Initial | Shell Header/Footer sync; Main skeletons |
| Section stream (optional) | Hero first; featured sau — nhưng CLS: reserve min-height Hero 520 desktop |
| Max wait | 3s: hiện Retry trên vùng lỗi |

## 4.9 Error / Retry

| Behavior | Spec |
|----------|------|
| Home aggregate fail | InlineError full main + Retry (refetch) + link Catalog |
| Featured only fail | InlineError trong section; rest page OK |
| Retry | 1 click; debounce 500ms |

## 4.10 Banner dismiss

| Behavior | Spec |
|----------|------|
| Storage key | `keyon.banner.dismissed.{bannerId}.{updatedAt}` |
| Re-show | khi Admin đổi nội dung → `updatedAt` mới |

## 4.11 Analytics hooks (optional UX-A)

Events tên cố định (implement sau cũng được, **không đổi tên**):  
`home_hero_cta_click` · `home_featured_click` · `home_search_submit` · `home_faq_open`

---

# PHẦN 5 — ADMIN CONFIGURATION DETAIL

CMS Mapping **giữ nguyên module names**. Dưới đây là field/validation/workflow đủ để build Admin + API.

## 5.0 Common workflow (mọi module nội dung)

| Step | Rule |
|------|------|
| Draft | Sửa không lên site |
| Preview | Token preview URL `/_preview/home?token=` TTL 1h |
| Publish | Chỉ role `cms.publish` |
| Schedule | optional `publish_at` / `unpublish_at` ISO |
| Rollback | khôi phục revision trước; tạo revision mới |
| Audit | `actor_id`, `entity`, `action`, `revision_id`, timestamp |

**Permission capabilities:** `cms.read` · `cms.write` · `cms.publish` · `cms.rollback`

---

## 5.1 Hero Manager

| Field | Type | Validation | Required |
|-------|------|------------|----------|
| `brand_text` | string | max 40 | yes |
| `title` | string | max 80; không HTML | yes |
| `subtitle` | string | max 160 | yes |
| `background_asset_id` | media | image ≥ 1920px wide recommended; mime jpg/png/webp; max 3MB | yes |
| `focal_point` | enum | center\|left\|right\|top\|bottom | default center |
| `primary_cta_label` | string | max 32 | yes |
| `primary_cta_href` | path/url | internal path ưu tiên `/…` | yes |
| `secondary_cta_label` | string | max 32 | no |
| `secondary_cta_href` | path/url | required if label set | conditional |
| `show_search` | boolean | | default false UX-A |
| `trust_badge_ids` | id[] | max 5 | no |
| `visible` | boolean | | default true |

**Preview:** desktop/tablet/mobile frames.  
**Publish:** invalidates `GET /api/storefront/home`.  
**Rollback:** last 20 revisions.

---

## 5.2 Banner Manager

| Field | Type | Validation |
|-------|------|------------|
| `message` | string | max 140 |
| `tone` | info\|warning\|critical | |
| `link_label` / `link_href` | optional | max 40 / url |
| `dismissible` | boolean | |
| `starts_at` / `ends_at` | datetime | ends > starts |
| `priority` | int | higher wins nếu overlap |
| `active` | boolean | |

**Permission:** Ops + Marketing `cms.write`; publish cần `cms.publish`.

---

## 5.3 Navigation Manager

| Field | Type | Validation |
|-------|------|------------|
| `menu_key` | `primary` \| `footer` | |
| `items[]` | label max 24, href, visible, sort_order | max 8 primary |
| | | cấm external không `rel` policy |

---

## 5.4 Homepage Builder

| Field | Type | Validation |
|-------|------|------------|
| `sections[]` | id enum cố định §3 Implementation | sort_order unique |
| `sections[].visible` | boolean | |
| `featured_empty_policy` | hide \| placeholder | default **hide** |
| `why_items[]` | title max 40, body max 140, icon | 3 hoặc 4 |
| `bottom_cta` | heading max 60, button | |

---

## 5.5 Merchandising Manager

### Featured

| Field | Validation |
|-------|------------|
| `variant_ids[]` hoặc `product_ids[]` | max **8**; chỉ `active` + `sales_motion` cho phép hiện storefront |
| `sort_order` | manual |
| `limit` | 4–8 |

### Home categories

| Field | Validation |
|-------|------------|
| chips `label` max 24, `href`, `icon?` | max 8 |

### Home brands

| Field | Validation |
|-------|------------|
| `brand_ids[]` | max 12; brand must have logo |

**Publish** → revalidate home + catalog fragments.

---

## 5.6 Trust Badges Manager

| Field | Validation |
|-------|------------|
| `icon` | enum curated set |
| `label` | max 28 |
| `sort_order` | |
| `published` | boolean |

---

## 5.7 How-it-works Editor

| Field | Validation |
|-------|------------|
| `section_title` | max 60 |
| `steps[1..4]` | title max 40, description max 120 |
| Copy lint (manual QA) | không chứa “key” như lời hứa toàn site |

---

## 5.8 Review Manager

| Field | Validation |
|-------|------------|
| `quote` | max 280 |
| `author_name` | max 60 |
| `author_role` | max 60 optional |
| `rating` | 1–5 optional |
| `show_on_home` | boolean |
| `published` | boolean |
| Home pick | max 3 `show_on_home=true` theo sort |

---

## 5.9 FAQ Manager

| Field | Validation |
|-------|------------|
| `question` | max 120 |
| `answer` | max 2000; markdown subset |
| `show_on_home` | boolean |
| `published` | boolean |
| Home | max 6 |

---

## 5.10 Footer Builder

| Field | Validation |
|-------|------------|
| `columns` | exactly 4 Desktop model; title max 24; links max 8/col |
| `social[]` | type enum + url |
| `copyright` | max 120 |

---

## 5.11 SEO Manager (path `/`)

| Field | Validation |
|-------|------------|
| `title` | max 60 |
| `description` | max 160 |
| `og_image_asset_id` | optional; default hero image |
| `canonical` | default site `/` |
| `robots` | index,follow default |

---

## 5.12 Brand / System Settings (logo)

| Field | Validation |
|-------|------------|
| `logo_light` / `logo_dark` | svg/png; height display 28px |
| `favicon` | |
| `currency_display` | `đ` \| `VND` |

---

## 5.13 Media Library (dependency)

Upload dùng chung: virus scan optional · width metadata · deny executable.  
Hero/Brand/Product images chỉ chọn từ Media Library.

---

# PHẦN 6 — IMPLEMENTATION CHECKLIST

## Visual & layout

- [ ] Page canvas + container 1120px  
- [ ] Global Banner đo đúng §1.1  
- [ ] Header 64/56 sticky + offset banner  
- [ ] Hero height/padding/alignment §1.3  
- [ ] Category chips layout §1.4  
- [ ] Featured grid 4/2/1 + card 4:3 §1.5  
- [ ] Brands 6/4/3 §1.6  
- [ ] How it works 4/2/1 §1.7  
- [ ] Why KEYON §1.8  
- [ ] Reviews §1.9  
- [ ] FAQ 720 centered §1.10  
- [ ] Bottom CTA §1.11  
- [ ] Footer §1.12  

## Tokens

- [ ] Typography tokens mapped  
- [ ] Color tokens mapped (no forbidden themes)  
- [ ] Spacing / radius / motion / z-index  

## Components

- [ ] Button (primary/secondary/ghost + states)  
- [ ] SearchBox header + hero  
- [ ] GlobalBanner  
- [ ] SiteHeader + MobileMenu  
- [ ] Hero  
- [ ] SectionHeader  
- [ ] CategoryChip  
- [ ] ProductCard  
- [ ] BrandLogoLink  
- [ ] TrustBadge  
- [ ] StepItem  
- [ ] ValuePropCard  
- [ ] ReviewCard  
- [ ] FaqAccordion  
- [ ] CtaBand  
- [ ] Footer / FooterColumn  
- [ ] Skeleton / InlineError / EmptySection  

## UX behavior

- [ ] Sticky header  
- [ ] Banner dismiss persistence  
- [ ] Hover/focus ProductCard  
- [ ] FAQ accordion a11y  
- [ ] Reduced motion  
- [ ] Search empty reject  
- [ ] Section unmount when hidden  

## States

- [ ] Skeleton initial load  
- [ ] Empty policies (hide/placeholder)  
- [ ] Error + Retry (page + section)  

## Content / Admin / API

- [ ] Admin field parity §5 (hoặc CMS stub **một** fixture file đúng shape)  
- [ ] SEO Manager fields trên `<head>`  
- [ ] `GET /api/storefront/home` shape đúng  
- [ ] delivery_label mapped — **zero** raw enums  
- [ ] Publish invalidation documented  

## Quality gates

- [ ] Accessibility: 1 H1, landmarks, focus ring, contrast hero  
- [ ] Responsive: sm/md/lg checked  
- [ ] Performance: LCP hero image priority; no layout thrash  
- [ ] Core Stable: không gọi Pool/Payment write  
- [ ] QA sign-off trên Acceptance + checklist này  

## Process

- [ ] PO/Founder **Approve Production UI Spec Screen 01**  
- [ ] Mới được mở PR implement Home  
- [ ] Screen 02 **chưa** được phép viết/code  

---

# APPROVAL BLOCK

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Founder / PO | | | ☐ Approve Screen 01 Production UI Spec |
| Design (nếu có) | | | ☐ |
| Tech Lead | | | ☐ (scope Core Stable OK) |

**Sau Approve:** được phép code **chỉ** Screen 01 Home theo tài liệu này.  
**Chưa Approve:** cấm implement. Cấm Screen 02.
