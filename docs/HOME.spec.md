# HOME.spec.md (v1)

> **SOURCE OF TRUTH** — home-v5-desktop / home-v5-mobile.  
> Container: **1120px** (đồng bộ toàn storefront).

## Global

Container:
  class: "home-container" → max-width **1120px**
  padding-desktop: 24px
  padding-tablet: 20px
  padding-mobile: 16px

Page Background:
  color: "#FFFFFF"

Font:
  family: Inter

Primary: "#00B4A6"
Navy: "#102A43"
Body: "#52606D"
Border: "#E7EDF3"
Footer: "#0F2747"

Section Gap:
  desktop: 72px
  tablet: 64px
  mobile: 48px

Border Radius System:
  xs: 8px
  sm: 12px
  md: 16px
  lg: 20px
  xl: 24px

Shadow:
  default: none
  hover: subtle only

## Header

Height: 72px
Logo: width 180px
Navigation: font-size 15px, font-weight 500, gap 40px
Login Button: height 44px, width 116px, radius 12px

## HERO

Desktop:
  columns: 2
  Left width: 500px
  Right width: 556px
  Gap: 64px
  Padding Top: 48px
  Padding Bottom: 40px

Hero Title:
  Size: 48px (desktop) / Weight 800 / LH 1.12 / LS -0.03em / Color #102A43 / Max Width 520px
  Note: mockup visual ~48 — không dùng 60/64 (quá to)

Hero Description:
  Size: 18px / Weight 400 / LH 32px / Color #52606D / MT 24px / Max Width 520px

CTA:
  Gap 16px
  Primary/Secondary: Width 200px, Height 52px, Radius 12px

Hero Illustration:
  Width 560px / Radius 24px / Border 1px #E7EDF3 / Shadow none
  ❌ No glow / mesh / blur / gradient

## VALUE BAR

Height: 92px
Columns: 3 / Gap 0 / Divider 1px / Padding 24px
Icon: 48px circle
Title: 20px / Body: 15px

## HOW IT WORKS / PRODUCT / NEWS (cùng layout)

```
.home-container                    ← chỉ max-width 1120 + padding
  └─ flex row (inner, không gắn lên .home-container)
       ├─ left intro ~260px         title + subtitle + optional link
       └─ right flex-1              steps | product cards | news cards
```

Left Intro: width 260px
Right gap: 48px (lg:gap-12)
Step Number: 56px / Weight 300 / Color #D7F4F2
Icon Circle: 56px / Icon 24px
Product Cards: 3 / Gap 24px · badge top-right
News Cards: 3 / Image 16:10 r16 · no card border

❌ Không gắn `flex` / `grid` trực tiếp lên `.home-container`

## FOOTER

Background: #0F2747
Padding Top: 56px / Bottom: 32px
Columns: 5 / Gap 56px

## MOBILE

Header: Height 64px / Logo 160px / Menu right
Hero: 1 col / Illustration hidden / Text left / Title 48px / Body 18px / Buttons full width 52px
Value Bar: stack
How It Works: stack
Products / News: stack → 1–2 cols

## CẤM

❌ Không thêm shadow / mesh / gradient / glow
❌ Mockup home-v5 là SOURCE OF TRUTH
