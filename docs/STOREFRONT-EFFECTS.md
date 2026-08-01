# KEYON Storefront Effects

**Nguồn code:** [`web/src/storefront/effects.ts`](../web/src/storefront/effects.ts)  
**Phạm vi:** Home, Shop, PDP, Checkout, Contact, Policy, Account (portal), Auth, Admin.  
**Đi kèm:** Typography → [`docs/STOREFRONT-TYPOGRAPHY.md`](./STOREFRONT-TYPOGRAPHY.md).  
**Không** lấy PNG mockup làm nguồn sự thật khi lệch với UI đang chạy.

---

## 1. Mục đích

Một catalog token cho **mọi hiệu ứng visual/interaction**:

- motion (duration, easing, property)
- elevation (shadow)
- opacity / disabled
- hover · focus · active · pressed
- transform (lift / scale)
- overlay layering (z-index)
- chart rendering
- loading / skeleton
- `prefers-reduced-motion`

**Mặc định khi implement mockup / UI mới:** chọn token từ spec này + `effects.ts` — không invent `shadow-[…]`, `duration-[Nms]`, `hover:-translate-y-*` ad-hoc khi đã có token.

Thiếu bậc → bổ sung token + cập nhật doc này, rồi mới dùng.

---

## 2. Nguyên tắc cứng

1. **Hiệu ứng phục vụ đọc / hành động** — không trang trí vô nghĩa.
2. **Surface quyết định elevation** — Marketing (Home/Shop/PDP) ≠ Portal (Account) ≠ Overlay.
3. **Một tốc độ chuẩn** — mặc định `MOTION_NORMAL` (200ms); chỉ dùng fast/slow khi có lý do.
4. **Hover = đổi border / màu / opacity nhẹ** trước; lift + shadow chỉ ở surface cho phép.
5. **Account / Auth dense UI: flat** — card = border only, **không** `shadow-sm` trên panel.
6. **Cấm** glow tím/neon, multi-layer soft glow, bounce, infinite pulse CTA, parallax hero.
7. **Luôn tôn trọng** `prefers-reduced-motion: reduce`.
8. Chart = **dữ liệu thật** + nét mỏng; không animate loop / fake sparkline cố định.

---

## 3. Motion tokens

| Token | Duration | Easing | Dùng khi |
|-------|----------|--------|----------|
| `MOTION_INSTANT` | 0 | — | reduced-motion / toggle tức thì |
| `MOTION_FAST` | 120ms | standard | màu chữ, opacity link, icon micro |
| `MOTION_NORMAL` | **200ms** | standard | **mặc định** button, input, border, tab |
| `MOTION_SLOW` | 320ms | standard | panel lớn, accordion, sticky morph |
| `MOTION_ENTER` | 200ms | emphasized | dropdown / modal enter |
| `MOTION_EXIT` | 150ms | standard | dropdown / modal exit |

**Easing (chuẩn KEYON):**

| Token | Value |
|-------|-------|
| `EASE_STANDARD` | `cubic-bezier(0.2, 0, 0, 1)` |
| `EASE_EMPHASIZED` | `cubic-bezier(0.2, 0, 0, 1)` (cùng curve; dùng khi enter overlay) |

**Property whitelist (ưu tiên):**

| Token class | Properties |
|-------------|------------|
| `TRANSITION_COLORS` | `color`, `background-color`, `border-color`, `text-decoration-color`, `fill`, `stroke` |
| `TRANSITION_SHADOW` | `box-shadow` (+ border-color khi cần) |
| `TRANSITION_TRANSFORM` | `transform` |
| `TRANSITION_UI` | colors + border + opacity + shadow (default interactive) |
| `TRANSITION_PANEL` | colors + shadow + transform (marketing card) |

**Tailwind shorthand hợp lệ:**

- `transition duration-200` ≈ `TRANSITION_UI` + `MOTION_NORMAL` (đủ cho hầu hết control).
- Prefer `duration-150` / `duration-200` / `duration-300` khớp bảng trên (120→150, 200→200, 320→300).

---

## 4. Elevation (shadow)

### 4.1 Thang

| Level | Token | Giá trị gợi ý | Vai trò |
|-------|-------|---------------|---------|
| 0 | `ELEVATION_NONE` | none | Account card, Auth card, flat panel |
| 1 | `ELEVATION_HAIRLINE` | `0 1px 2px rgba(15,23,42,0.03)` | Shop/Home card nghỉ |
| 2 | `ELEVATION_CARD_HOVER` | `0 10px 28px rgba(15,23,42,0.07)` | Marketing card hover |
| 3 | `ELEVATION_FLOAT` | `0 12px 32px rgba(15,23,42,0.12)` | Hero float chip / sticky bar nhẹ |
| 4 | `ELEVATION_DROPDOWN` | Tailwind `shadow-md` | Menu ⋮, select popover |
| 5 | `ELEVATION_MODAL` | `0 20px 50px rgba(15,23,42,0.16)` | Dialog / drawer |
| CTA | `ELEVATION_CTA_HOVER` | `0 8px 20px rgba(14,165,164,0.28)` | Primary button hover (accent glow) |

### 4.2 Ma trận surface × elevation

| Surface | Rest | Hover | Ghi chú |
|---------|------|-------|---------|
| **Account portal** card / table / empty | `NONE` | border / `bg-surface` — **không** lift | Flat khớp sidebar |
| **Auth** form card | `NONE` | border accent | Flat |
| **Admin** panel | `NONE` hoặc hairline tối đa | border | Ưu tiên flat |
| **Home / Shop / PDP** product card | `HAIRLINE` | `CARD_HOVER` + lift **2px** max | Marketing OK |
| **Hero** decorative panel | `FLOAT` (có kiểm soát) | tăng 1 bậc | Không multi-glow |
| **Checkout** summary card | `NONE` | border | Portal-like |
| **Dropdown / popover** | `DROPDOWN` | — | Bắt buộc có shadow để tách lớp |
| **Modal / toast** | `MODAL` | — | |
| **Primary CTA** (h-11/h-12) | `shadow-sm` optional | `CTA_HOVER` | Chỉ primary/accent |
| **Outline / ghost button** | none | **không** CTA glow | Đổi border/bg |

> **Cấm** `shadow-sm` hàng loạt trên mọi Account card (đã gây lệch cột trái/phải).

---

## 5. Opacity

| Token | Value | Dùng |
|-------|-------|------|
| `OPACITY_DISABLED` | 0.4 | `disabled:opacity-40` |
| `OPACITY_MUTED_ICON` | 0.55 | icon phụ |
| `OPACITY_OVERLAY_SCRIM` | 0.45–0.55 | modal backdrop |
| `OPACITY_HEADER_BLUR` | ~0.92 | sticky header bg |
| `OPACITY_CHART_FILL` | 0.08–0.12 | area dưới line chart |
| `OPACITY_WATERMARK` | 0.08–0.12 | chữ K / mark trang trí |

Disabled: luôn kèm `disabled:pointer-events-none` hoặc `disabled:cursor-not-allowed` khi là control.

---

## 6. Interactive states

### 6.1 Decision tree

```
Control / surface nào?
│
├─ Text link (breadcrumb, “Xem tất cả”)
│   └─ MOTION_FAST · hover:text-accent · không underline nhảy · không shadow
│
├─ Nav item (sidebar / header)
│   └─ MOTION_FAST–NORMAL · hover:bg-soft · active = border-l + bg-accent-soft
│
├─ Button primary (h-11/h-12)
│   └─ MOTION_NORMAL · hover:bg-accent · optional ELEVATION_CTA_HOVER
│
├─ Button outline / compact (trong card)
│   └─ MOTION_NORMAL · hover:border-accent · hover:bg-accent · hover:text-white
│      (hoặc soft fill) — không translateY · không CTA glow bắt buộc
│
├─ Input / select
│   └─ MOTION_NORMAL · focus:border-accent · không ring dày trừ a11y
│
├─ Row list / table row
│   └─ MOTION_NORMAL · hover:bg-navy-soft/30 hoặc opacity-90 · không shadow
│
├─ Marketing product / news / category card
│   └─ TRANSITION_PANEL · hover:-translate-y-0.5 (2px) · ELEVATION_CARD_HOVER
│
├─ Account portal card
│   └─ ELEVATION_NONE · hover tối đa border-accent trên interactive child
│
└─ Icon-only / pagination
    └─ MOTION_NORMAL · hover:border-accent · hover:bg-accent · hover:text-white
```

### 6.2 Focus (a11y)

- Keyboard focus **phải** thấy được: `focus-visible:border-accent` hoặc `focus-visible:ring-2 focus-visible:ring-accent/40`.
- Không thay focus bằng chỉ đổi màu quá mỏng trên nền trắng.
- Mouse click: tránh ring vĩnh viễn — ưu tiên `focus-visible:`.

### 6.3 Active / pressed

- `active:bg-surface` hoặc tối màu 1 bậc — **không** scale xuống < 0.97 trừ marketing micro-interaction đã token hóa.
- Tab active = border/token typography (`TAB_ACTIVE`), không shadow.

### 6.4 Transform whitelist

| Cho phép | Cấm |
|----------|-----|
| Marketing card: `-translate-y-0.5` (2px) | `-translate-y-1`+ trên portal |
| Group icon micro: `scale-105` trong frame `overflow-hidden` | Bounce / spring CTA |
| Image zoom `scale-1.02` trong crop | Parallax scroll hero |
| Chevron rotate 180° accordion | Rotate/spin vô hạn |

---

## 7. Z-index

| Token | Value | Layer |
|-------|-------|-------|
| `Z_BASE` | 1 | nội dung |
| `Z_STICKY` | 20 | sticky subnav |
| `Z_HEADER` | 30 | site header |
| `Z_BANNER` | 40 | global banner |
| `Z_DROPDOWN` | 50 | menu ⋮, popover |
| `Z_OVERLAY` | 60 | modal backdrop |
| `Z_MODAL` | 70 | dialog |
| `Z_TOAST` | 80 | toast |
| `Z_TOOLTIP` | 90 | chart tooltip / tip |

Không invent `z-[9999]`. Sticky checkout bar = `Z_HEADER`…`Z_BANNER` band (thường `z-40`).

---

## 8. Charts (Account / Dashboard)

Áp dụng Overview spend, Orders sparkline, License donut, KPI tương lai.

| Quy tắc | Chi tiết |
|---------|----------|
| **Data** | Chỉ series từ DB / props thật — **cấm** path SVG trang trí cố định khi gắn kỳ hạn |
| **Stroke** | 1.25–1.75px; `vector-effect: non-scaling-stroke` khi SVG scale full width |
| **Points** | r ≤ 2 mặc định; hover ≤ 3.5 |
| **Fill** | `OPACITY_CHART_FILL` dưới line |
| **Curve** | Smooth (Catmull/Bezier) OK; không phóng đậm để “đẹp” |
| **Size** | Chart **ôm full** bề ngang card (`w-full` + aspect hoặc `meet` khớp ratio) — không co giữa |
| **Donut** | Stroke 12–14 trên size ~120–132; legend có mật độ (không để card trống đáy) |
| **Tooltip** | Hiện khi hover; `Z_TOOLTIP`; không animate bounce |
| **Motion** | Không loop; optional fade-in 1 lần `MOTION_NORMAL` khi mount (tắt nếu reduced-motion) |

---

## 9. Loading · skeleton · enter

| Pattern | Token / rule |
|---------|----------------|
| Skeleton pulse | `animate-pulse` + `bg-surface` — **chỉ** chỗ chờ data |
| Content enter | fade/slide nhẹ `MOTION_NORMAL` — Home đã có `home-fade-up` |
| Spinner CTA | opacity disable + optional spinner — không pulse màu CTA |
| Image | scrim/bg trước; fade-in `MOTION_NORMAL` |
| Accordion | height `MOTION_NORMAL`; reduced-motion = instant |

**Cấm:** skeleton vĩnh viễn, shimmer cầu kỳ trên portal dense.

---

## 10. Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  /* Tắt transform lift, fade-up loop, accordion animate */
}
```

Trong React/Tailwind:

- Dùng `motion-safe:` / `motion-reduce:` khi có lift / enter animation.
- Ví dụ: `motion-safe:hover:-translate-y-0.5 motion-reduce:transition-none`.

Bắt buộc khi thêm animation mới (Home hero, accordion, chart enter).

---

## 11. Ma trận surface (tóm tắt)

| Surface | Shadow card | Hover lift | CTA glow | Duration default |
|---------|-------------|------------|----------|------------------|
| Home / Shop / PDP marketing | Hairline → Card hover | 2px OK | Primary OK | 200–300 |
| Checkout | None | Không | Primary OK | 200 |
| Account portal | **None** | **Không** | Primary OK (nút lớn) | 200 |
| Auth | None | Không | Primary OK | 200 |
| Admin | None / hairline | Không | Primary nhẹ | 150–200 |
| Overlay (menu/modal) | Dropdown / Modal | — | — | enter 200 / exit 150 |

---

## 12. Anti-patterns

| Sai | Đúng |
|-----|------|
| `shadow-sm` mọi Account card | `ELEVATION_NONE` + `border-border` |
| Chart stroke 2.25+ scale full width → nét thô | `non-scaling-stroke` + 1.5px |
| Sparkline SVG cố định khi user đổi 6/12 tháng | Series theo `spendPeriod` / data thật |
| `hover:-translate-y-1` trên portal row | `hover:bg-surface` |
| `hover:shadow-[0_8px_20px_accent]` trên outline button trong list | Chỉ primary CTA |
| `duration-500` / `duration-1000` UI thường | `MOTION_NORMAL` / `SLOW` |
| `z-[9999]` dropdown | `Z_DROPDOWN` (50) |
| Infinite `animate-bounce` trên CTA | Cấm |
| Card portal trống đáy + donut bé | Enlarge chart + legend density / `min-h` fill |

---

## 13. Ví dụ

```tsx
import {
  ELEVATION_NONE,
  ELEVATION_DROPDOWN,
  ELEVATION_CTA_HOVER,
  MOTION_NORMAL,
  TRANSITION_UI,
  HOVER_LIFT_CARD,
} from "@/storefront/effects";

// Account card — flat
<section className={`rounded-2xl border border-border bg-white p-5 ${ELEVATION_NONE}`}>

// Primary CTA
<button
  className={`… bg-navy text-white ${TRANSITION_UI} ${MOTION_NORMAL} hover:bg-accent ${ELEVATION_CTA_HOVER}`}
/>

// Marketing product card
<article
  className={`… border bg-white shadow-[…] ${TRANSITION_UI} ${MOTION_NORMAL} ${HOVER_LIFT_CARD}`}
/>

// Dropdown
<div className={`absolute z-50 … ${ELEVATION_DROPDOWN}`}>
```

---

## 14. PR checklist

- [ ] UI mới dùng token `effects.ts` (hoặc class khớp bảng) — không invent shadow/duration lạ.
- [ ] Account / Auth / Checkout panel: **không** thêm elevation card.
- [ ] Marketing hover lift ≤ 2px + `motion-safe:`.
- [ ] Primary CTA mới: glow chỉ qua `ELEVATION_CTA_HOVER`.
- [ ] Chart: data thật, full width card, nét mỏng + non-scaling stroke.
- [ ] Overlay: z-index trong thang §7.
- [ ] Có animation mới → có nhánh `prefers-reduced-motion`.
- [ ] Guard gợi ý:  
  `rg "shadow-sm" web/src/storefront/components/account`  
  `rg "hover:-translate-y-" web/src/storefront/components/account`  
  `rg "duration-500|duration-700|duration-1000" web/src/storefront`

---

## 15. Quan hệ với spec khác

| Doc | Vai trò |
|-----|---------|
| `STOREFRONT-TYPOGRAPHY.md` | cỡ / weight chữ |
| `PRODUCTION-UI-SPEC-01-HOME.md` §2.8–2.11 | nguồn gốc radius/shadow/motion Home (đồng bộ vào doc này) |
| `effects.ts` | class string export — nguồn sự thật khi code |

Khi Home spec và doc này lệch: **ưu tiên doc này + `effects.ts`**, rồi back-port số vào Home spec nếu cần.

---

## 16. Index token (`effects.ts`)

**Motion:** `MOTION_FAST` · `MOTION_NORMAL` · `MOTION_SLOW` · `EASE_STANDARD`  

**Transition:** `TRANSITION_COLORS` · `TRANSITION_UI` · `TRANSITION_PANEL`  

**Elevation:** `ELEVATION_NONE` · `ELEVATION_HAIRLINE` · `ELEVATION_CARD_HOVER` · `ELEVATION_FLOAT` · `ELEVATION_FLOAT_HOVER` · `ELEVATION_HERO_HOVER` · `ELEVATION_STICKY_UP` · `ELEVATION_DROPDOWN` · `ELEVATION_MODAL` · `ELEVATION_CTA_HOVER`  

**Hover presets:** `HOVER_LIFT_CARD` · `HOVER_ROW` · `HOVER_FADE` · `HOVER_SOFT` · `HOVER_LINK_ACCENT` · `HOVER_OUTLINE_FILL`  

**Opacity:** `OPACITY_DISABLED` · `OPACITY_DISABLED_BUSY` · `OPACITY_CHART_FILL`  

**Z-index:** `Z_DROPDOWN` · `Z_OVERLAY` · `Z_MODAL` · `Z_TOAST` · `Z_TOOLTIP`  

**Chart:** `CHART_STROKE` · `CHART_POINT` · `CHART_FILL_OPACITY`
