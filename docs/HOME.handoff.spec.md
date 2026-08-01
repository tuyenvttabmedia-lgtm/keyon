# KEYON – Home Page
## Figma Handoff Specification v1.0

> SOURCE OF TRUTH — Desktop 1536 / Mobile export. Sai số cho phép ±2–4px.
> Implemented in `web/src` via `.home-container` + storefront home components.

### Artboard / Container
- Desktop content: **1288px** (margin 124 trên frame 1536)
- Tablet 1024: content **944px**, margin 40, gutter 20
- Mobile: 100%, padding inline **24px**
- ≥1440: 1288 · 1280: 1180 · 1024: 944 · 768: 704 · ≤480: 100% + 24px

### Typography (Inter) — calibrated vs mockup (handoff px over-measured)
| Token | Size | Use |
|-------|------|-----|
| `.type-display` | 48/800/56 | Hero H1 only |
| `.type-section` | 32/700/40 | Section H2 |
| `.type-card` | 18/700/26 | Product / News title |
| `.type-label` | 16/600/24 | Feature / step title |
| `.type-lead` | 18/400/28 | Hero subtitle |
| `.type-body` | 15/400/24 | All descriptions |
| `.type-meta` | 13/400/20 | Dates, captions |
| `.type-price` | 22/700/28 | Product price |
| Nav | 15/500/22 | Header links |

> Raw handoff (64/40/28/26) looked jarring in browser — keep visual hierarchy above literal px.

### Color
- Primary #00A8A8 · Hover #009696 · Dark #0F2747
- Body #52606D · Muted #7B8794 · Border #E6EDF3 · Divider #EEF2F6
- BG #FFFFFF · Footer #071F3B
- Success #12B981 · Warning #F59E0B · Blue #2563EB

### Radius
Button/Input 12 · Card 20 · Hero 24 · Badge/Circle 999

### Shadow
Default none · Hover `0 8px 24px rgba(15,39,71,.08)` · No glass/blur/glow

### Header
H 76 · Logo 208×48 · Nav gap 48 · Login 132×48 r12

### Hero
Left 552 · Gap 72 · Right 664 · PT 44 · PB 48
Graphic H 352 r24 · CTA 204×56 gap 20

### Feature Bar
H 96 · 3×429 · Pad 32 · Divider 1 · Icon circle 56 / icon 24

### How it works
Intro 288 · Steps 936 gap 40 · Num 64/300 #CDEFED · Icon circle 56

### Product
Card ~328×176 r20 pad 24 · Image 72 · Badge h24 · Price 28/700 · Action 40
(Desktop row fills container with 3 equal columns + gap 24)

### News
3 cards gap 32 · Image 180×120 r16 · Title 26/700/34 · Date 13 · horizontal layout

### Footer
BG #071F3B · H~248 · 5 cols gap 64 · PT 48 · PB 28

### Icons
Lucide · stroke 2px · rounded

### CẤM
Không đổi layout/typography · Không thêm shadow/mesh/gradient/glow/glass · Spacing chỉ hệ 4–120
