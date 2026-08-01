# KEYON Home — Mockup v6 (Design only)

> Thiết kế lại sau v5. **Chưa implement.**  
> Files: `docs/mockups/home-v6-desktop.png` · `docs/mockups/home-v6-mobile.png`

## Mục tiêu sửa so với v5

1. **Container rõ ràng:** content max **1120px**, căn giữa — mọi section cùng một cạnh trái/phải.
2. **Không dùng layout “intro trái + content phải”** cho How / Products / News (đó là nguồn lệch implement).
3. **Cùng một nhịp section:** Title row full-width → Content row full-width.
4. Typography cân: H1 ~48 · H2 ~28 · card title ~16–18 · body 15 · meta 13.

## Layout rules (SOURCE OF TRUTH khi chốt)

```
Page
└─ mỗi section
   └─ .container (max 1120, pad 24/20/16)
        ├─ [optional] header row: H2 | link
        └─ content row: 1 × N columns (full width của container)
```

### CẤM khi implement sau này
- ❌ `home-container` + `lg:flex-row` với cột intro 260px bên trái
- ❌ Gắn `flex`/`grid` layout section trực tiếp lên class container (container chỉ width + padding)
- ❌ Mesh / glow / glass / blur / shadow nặng

## Desktop (1120)

| Block | Layout |
|-------|--------|
| Header | Logo · Nav · Login — H72 |
| Hero | 2 cột: text+CTA · illustration — illustration ẩn ≤480 |
| Value bar | 1 hàng 3 cột, divider, trong container |
| How it works | H2 + subtitle **full width trên** → dưới: **3 bước ngang full width** |
| Products | H2 trái + “Xem tất cả →” phải → dưới: **3 product cards ngang** |
| News | H2 trái + “Xem tất cả →” phải → dưới: **3 news cards ngang** |
| Footer | Full-bleed navy · inner 1120 · 5 cột |

### Product card
Icon trái · badge góc phải · tên · mô tả · giá teal · nút → tròn

### News card
Ảnh trên (16:10, r16) · ngày · title · excerpt — **không** border card nặng  
*(Mobile có thể thumb trái + text phải)*

## Mobile (~390)

- Header: logo + hamburger
- Hero: 1 cột, CTA full width stack, **không** illustration
- Value / How / Products / News: **stack dọc**
- Footer: cột xếp dọc

## Tokens

| Token | Value |
|-------|--------|
| Container | 1120px |
| Primary | #00B4A6 |
| Navy | #102A43 |
| Body | #52606D |
| Border | #E7EDF3 |
| Footer | #0F2747 |
| Font | Inter |
| Radius button | 12 · card 16–20 · hero graphic 24 |

## Chốt

Khi OK mockup v6 → copy thành `home-locked.png` (+ mobile locked) rồi mới implement theo file này.
