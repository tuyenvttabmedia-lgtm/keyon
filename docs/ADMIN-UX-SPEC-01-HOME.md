# KEYON — Admin UX Specification  
## Screen 01 · Home Management

> **TRẠNG THÁI:** THAM KHẢO ONLY · **Tài liệu chính:** [`KEYON-MVP-SPEC.md`](./KEYON-MVP-SPEC.md)  
> Không triển khai 12 module Admin. CMS MVP gộp: Home · Banner · FAQ · Footer · Navigation.

**Document type:** Admin UX Spec (operator console — không phải storefront)  
**Status:** READY FOR FOUNDER APPROVAL  
**Controls:** Production UI Spec Screen 01 (`docs/PRODUCTION-UI-SPEC-01-HOME.md`)  
**Cấm:** Code · React · CSS · Backend/API contract · Screen 02 · thay đổi Core Stable  

**Tư duy Admin:** Shopify Admin · Stripe Dashboard · Microsoft Admin Center  
**Không:** WordPress theme customizer / shortcode / “sửa HTML thô”.

**Nguyên tắc vận hành:** Người không biết lập trình cấu hình được Home 100%. Mọi thay đổi có Draft → Preview → Publish → Rollback → Audit.

---

# 0. ADMIN SHELL (dùng chung mọi module Home)

## 0.1 Entry

| Item | Spec |
|------|------|
| Nav group | **Nội dung (CMS)** → **Trang chủ** |
| Hub route (logical) | `/admin/cms/home` |
| Hub title | **Trang chủ** |
| Hub subtitle | Quản lý toàn bộ nội dung khách thấy trên `/` |

## 0.2 Hub wireframe

```
+------------------------------------------------------------------+
| Sidebar (Admin)     | Trang chủ                                   |
| ...                 | Cập nhật lần cuối: {datetime} · {actor}     |
| Nội dung            |                                              |
|   › Trang chủ  *    | [Xem site]  [Preview nháp]  [Lịch sử]        |
|   Media             |                                              |
|                     | +------------------+ +------------------+    |
|                     | | Homepage Builder | | Hero Manager     |    |
|                     | +------------------+ +------------------+    |
|                     | | Banner           | | Navigation       |    |
|                     | | Merchandising    | | Brands           |    |
|                     | | Trust Badges     | | Reviews          |    |
|                     | | FAQ              | | SEO              |    |
|                     | | Footer           | | Media Library    |    |
|                     | +------------------+ +------------------+    |
|                     |                                              |
|                     | Trạng thái publish: Live · Draft có thay đổi?|
+------------------------------------------------------------------+
```

## 0.3 Shared chrome (mọi module editor)

```
Breadcrumb: Nội dung / Trang chủ / {Module}
----------------------------------------------------------------
Title                          [Preview] [Lưu nháp] [Publish…]
Status pill: Draft | Scheduled | Live
----------------------------------------------------------------
Tabs (nếu có): Nội dung | Cài đặt | Lịch sử
----------------------------------------------------------------
| Main form (60–65%)          | Preview panel (35–40%)         |
|                             | [Desktop] [Tablet] [Mobile]    |
|                             | iframe/canvas read-only         |
----------------------------------------------------------------
Sticky action bar (bottom, khi dirty):
  Có thay đổi chưa publish · [Hủy] [Lưu nháp] [Publish]
```

## 0.4 Shared layout rules

| Element | Spec |
|---------|------|
| Sidebar | Admin global — width 240px Desktop; collapse icon Tablet |
| Toolbar | Title left; primary actions right |
| Preview | Sticky trong viewport editor; breakpoint toggles |
| Publish modal | Checklist validation → Confirm → optional schedule |
| Density | Comfortable (Stripe-like), không bảng WordPress dày đặc |
| Language | Tiếng Việt UI Admin; field key English trong data |

## 0.5 Shared states

| State | UI |
|-------|-----|
| Empty (chưa từng cấu hình) | Illustration + “Thiết lập {module}” + CTA primary |
| Loading | Skeleton form + skeleton preview |
| Error load | Inline banner + Retry |
| Save conflict | “Có bản mới hơn từ {actor}” · Reload / Overwrite (chỉ Owner) |
| Dirty | Dot trên tab + disable navigate without confirm |

## 0.6 Shared accessibility (Admin)

- Focus ring rõ trên mọi control  
- Publish/Delete = dialog với focus trap  
- Preview iframe `title="Xem trước trang chủ"`  
- Bảng History: sortable headers + keyboard  

---

# 1. HOMEPAGE BUILDER

## 1.1 Business Goal

Điều khiển **thứ tự, bật/tắt section**, empty-policy Featured, Why KEYON blocks, Bottom CTA — một nơi “cấu trúc trang”, không sửa từng pixel.

## 1.2 User

| Role | Quyền dùng module |
|------|-------------------|
| Marketing | Write + Publish (nếu được cấp) |
| Admin / Owner | Full |
| Support | Read-only (hiểu cấu trúc khi troubleshoot) |
| Fulfillment / Finance | Không vào |

## 1.3 Wireframe ASCII

```
Nội dung / Trang chủ / Homepage Builder
----------------------------------------------------------------
Homepage Builder                    [Preview] [Lưu nháp] [Publish]
Live · có 2 thay đổi nháp
----------------------------------------------------------------
[Cấu trúc] [Why KEYON] [Bottom CTA] [Cài đặt] [Lịch sử]
----------------------------------------------------------------
Cấu trúc trang                         Preview
+--------------------------------+    [Desktop|Tablet|Mobile]
| ≡ Hero              [On]  ⋮   |    +----------------------+
| ≡ Category shortcuts [On] ⋮   |    | (Home preview)       |
| ≡ Featured products  [On] ⋮   |    +----------------------+
| ≡ Brands             [On] ⋮   |
| ≡ How it works       [On] ⋮   |
| ≡ Why KEYON          [On] ⋮   |
| ≡ Reviews            [Off]⋮   |
| ≡ FAQ teaser         [On] ⋮   |
| ≡ Bottom CTA         [On] ⋮   |
+--------------------------------+
Kéo ≡ để đổi thứ tự · Off = ẩn trên site
----------------------------------------------------------------
```

## 1.4 Layout

List builder trái · Preview phải · Tabs cho Why/CTA · không WYSIWYG HTML.

## 1.5 Fields

| Field | UI control | Notes |
|-------|------------|-------|
| `sections[].id` | fixed enum | Không cho tạo section lạ |
| `sections[].visible` | Toggle | |
| `sections[].sort_order` | Drag handle | |
| `featured_empty_policy` | Radio: Ẩn section / Hiện placeholder | Default Ẩn |
| `why_items[]` | Repeater 3–4 | icon select, title, body |
| `bottom_cta.heading` | Text | |
| `bottom_cta.sub` | Text optional | |
| `bottom_cta.button_label` | Text | |
| `bottom_cta.button_href` | Path picker | |

## 1.6 Validation

- Đúng **một** section `hero` luôn tồn tại; không xóa khỏi list (chỉ được Off nếu Owner — **khuyến nghị không Off hero**)  
- Why items: 3 hoặc 4; title ≤40; body ≤140; no HTML  
- Bottom CTA heading ≤60; href internal path  
- sort_order unique  

## 1.7 Workflow

Draft → Preview → Publish → Schedule (optional) → Rollback → Archive revision.  
**Delete module:** không — chỉ archive revision.

## 1.8 Permission

`cms.read` · `cms.write` · `cms.publish` · `cms.rollback`

## 1.9–1.11 Empty / Loading / Error

Empty: CTA “Dùng cấu trúc mặc định KEYON”. Loading/Error: theo shell §0.5.

## 1.12 Audit Log

`homepage_builder.update` · `homepage_builder.publish` · diff section visibility/order.

## 1.13 Version History

List revisions: time, actor, summary (“Ẩn Reviews · đổi CTA”). Restore → tạo draft từ revision.

## 1.14 Responsive (Admin UI)

Preview breakpoints; list drag disable trên Mobile Admin → dùng Up/Down buttons.

## 1.15 Accessibility

Drag handle có alternative Move up/down; toggles có label.

---

# 2. HERO MANAGER

## 2.1 Business Goal

Cấu hình toàn bộ Hero Home (brand, H1, copy, CTA, nền, trust, search) đúng Production Visual Spec — không code.

## 2.2 User

Marketing (chính) · Admin · Support read-only.

## 2.3 Wireframe ASCII

```
Nội dung / Trang chủ / Hero Manager
----------------------------------------------------------------
Hero Manager                         [Preview] [Lưu nháp] [Publish]
----------------------------------------------------------------
[Nội dung] [Hình nền] [CTA] [Trust] [Cài đặt] [Lịch sử]
----------------------------------------------------------------
Nội dung                              Preview
Brand text  [________________]        [Desktop|Tablet|Mobile]
Title (H1)  [________________]        +----------------------+
Subtitle    [________________]        | KEYON                |
              80/80                   | Heading...           |
Show search [ ]                       | [CTA] [Secondary]    |
Visibility  [On]                      +----------------------+
----------------------------------------------------------------
Hình nền: [Chọn từ Media] [Thay]  Focal: (•) Center ○ Left ...
Overlay: cố định theo Design Token (read-only note)
----------------------------------------------------------------
```

## 2.4 Layout

Form tabs + Preview sticky. Không cho sửa Overlay opacity (khóa token — chỉ hiện note).

## 2.5 Fields

| Field | Control |
|-------|---------|
| brand_text | Text |
| title | Text + counter |
| subtitle | Textarea 2 rows + counter |
| background_asset | Media picker (image) |
| focal_point | Segmented: center/left/right/top/bottom |
| primary_cta_label / href | Text + Path picker |
| secondary_cta_label / href | Text + Path (optional pair) |
| show_search | Toggle |
| trust_badge_ids | Multi-select từ Trust Badge Manager (max 5) |
| visible | Toggle |
| animation | **Không có** field (cấm bật parallax) — hiện helper “Motion theo Design Token hệ thống” |

## 2.6 Validation

- title ≤80, no HTML/script  
- subtitle ≤160  
- brand_text ≤40  
- background bắt buộc khi Publish  
- primary CTA bắt buộc  
- secondary: đủ cặp label+href hoặc cả hai trống  
- href: internal `/…` hoặc allowlist domain  
- image: mime jpg/png/webp; recommend ≥1920w; max 3MB (Media enforce)  

## 2.7 Workflow

Draft → Preview (3 breakpoints) → Publish → Schedule → Rollback.  
Archive: ẩn khỏi editor list revisions cũ > N.

## 2.8 Permission

write / publish / rollback / read. Support: read + Preview only.

## 2.9 Empty

“Chưa có Hero — Tạo Hero mặc định” (prefill copy an toàn).

## 2.10 Loading / 2.11 Error

Skeleton; Retry; nếu Media fail: banner trên field ảnh.

## 2.12 Audit

Field-level diff title/cta/background id.

## 2.13 Version History

Thumbnail nền + title snippet mỗi revision.

## 2.14 Responsive Admin

Tabs stack; Preview trên Mobile Admin = drawer “Xem trước”.

## 2.15 Accessibility

Counters `aria-live`; Media picker labeled; focal_point fieldset.

---

# 3. BANNER MANAGER

## 3.1 Business Goal

Thông báo toàn site phía trên Header (campaign / bảo trì nhẹ / cảnh báo) có lịch và ưu tiên.

## 3.2 User

Marketing · Ops · Admin. Support: read.

## 3.3 Wireframe

```
Banner Manager
----------------------------------------------------------------
Danh sách banner                    [Tạo banner]
+--------------------------------------------------------------+
| Active now: "Bảo trì 23:00…"  warning   12:00–14:00   [Sửa] |
| Scheduled:  "Sale…"           info      Mai 09:00     [Sửa] |
| Archived …                                                |
+--------------------------------------------------------------+

Editor:
Message [________________________] 140
Tone    (•) Info  ○ Warning  ○ Critical
Link    Label [____]  URL [____]
Dismissible [x]
Lịch: Start [datetime] End [datetime]
Priority [ 10 ]
Active [x]
                    Preview bar live
                    [Lưu nháp] [Publish]
```

## 3.4 Layout

List → Editor drawer/page. Preview = mock banner strip trên đỉnh Preview home.

## 3.5 Fields

message · tone · link_label · link_href · dismissible · starts_at · ends_at · priority · active.

## 3.6 Validation

message ≤140; ends > starts; priority integer ≥0; critical tone confirm modal khi Publish.

## 3.7 Workflow

Draft → Publish (có thể nhiều bản; **chỉ 1 active hiển thị** = priority cao nhất trong cửa sổ thời gian) → Schedule → Archive · Delete (soft).

## 3.8 Permission

Ops có publish critical; Marketing publish info/warning.

## 3.9–3.11 Empty / Loading / Error

Empty: “Không có banner — site không hiện thanh thông báo”.

## 3.12–3.13 Audit / History

Mọi publish/archive; history theo banner id.

## 3.14–3.15 Responsive / A11y

Tone màu + text label (không chỉ màu).

---

# 4. NAVIGATION MANAGER

## 4.1 Business Goal

Cấu hình Primary nav Header (và optional footer nav sync note — Footer Builder sở hữu cột footer).

## 4.2 User

Marketing · Admin.

## 4.3 Wireframe

```
Navigation Manager · Menu: Primary
----------------------------------------------------------------
Items (max 8)                          Preview Header
≡ Sản phẩm      /products      [On] [Sửa]
≡ Thương hiệu   /brands        [On]
≡ Cách giao hàng /how-it-works [On]
≡ Chính sách    /policy        [On]
≡ Hỗ trợ        /faq           [On]
[+ Thêm mục]
```

## 4.4 Layout

Ordered list + Preview header chrome.

## 4.5 Fields

label ≤24 · href · visible · sort_order · open_in_new (default off; confirm nếu external).

## 4.6 Validation

Max 8 primary; label unique khuyến nghị; cấm javascript: URL.

## 4.7–4.8 Workflow / Permission

Draft → Publish. write/publish.

## 4.9 Empty

Prefill 5 mục mặc định KEYON (một click).

## 4.10–4.15

Chuẩn shell; History; a11y drag alternatives.

---

# 5. MERCHANDISING MANAGER

## 5.1 Business Goal

Chọn Featured products, category chips, brands row trên Home — không đụng giá/strategy Core (chỉ chọn entity đã có).

## 5.2 User

Marketing + Catalog admin · Admin.

## 5.3 Wireframe

```
Merchandising Manager
----------------------------------------------------------------
[Featured] [Categories] [Brands on Home] [Lịch sử]
----------------------------------------------------------------
Featured (max 8)                       Preview grid
[+ Thêm sản phẩm/gói]
1. [thumb] Name · Brand · Gói · Giá   ≡  [Xóa]
2. ...
Limit display: [8 ▾]
Chỉ hiện gói đang bán (active) — filter cứng
----------------------------------------------------------------
```

## 5.4 Layout

Tabs ba vùng merchandising · picker modal tìm Product/Variant.

## 5.5 Fields

**Featured:** variant_id (ưu tiên) · sort · limit 4–8  
**Categories:** label · href · icon · sort · max 8  
**Brands:** brand_id[] max 12 · sort  

## 5.6 Validation

- Chỉ variant `active` + được phép storefront  
- Không chọn bản nháp catalog  
- Trùng id bị chặn  
- Delivery label **không** edit tại đây (read-only map hệ thống)

## 5.7 Workflow

Draft → Preview → Publish. Không Schedule từng card (theo Homepage publish hoặc publish riêng module).

## 5.8 Permission

`merchandising.write` ⊆ cms.write · publish.

## 5.9 Empty

Featured empty: warning “Section Featured sẽ ẩn (policy hide)” + CTA thêm.

## 5.10–5.11 Loading / Error

Picker skeleton; lỗi catalog read → Retry.

## 5.12–5.13 Audit / History

Log add/remove/reorder featured.

## 5.14–5.15

Preview 4/2/1 columns theo breakpoint toggle.

**Cấm:** sửa price, stock, pool, strategy trong màn này.

---

# 6. BRAND MANAGER

## 6.1 Business Goal

Quản lý Brand entity hiển thị storefront (logo, tên, slug, show_on_home) — phục vụ hàng Brands trên Home + trang Brand.

## 6.2 User

Catalog · Marketing · Admin.

## 6.3 Wireframe

```
Brand Manager
----------------------------------------------------------------
Search [____]  [Tạo brand]
Table: Logo | Name | Slug | Show on Home | Products | Status | ⋮
----------------------------------------------------------------
Editor Brand
Name [____] Slug [____] auto
Logo [Media]
Show on Home [ ]
Published [ ]
Description (optional, for Brand page)
```

## 6.4 Layout

List + Editor side panel (Shopify style).

## 6.5 Fields

name · slug · logo_asset · show_on_home · published · description_optional.

## 6.6 Validation

slug unique kebab; logo required nếu show_on_home; name ≤60.

## 6.7 Workflow

Draft brand → Publish brand. Delete: chỉ khi 0 products (block nếu còn).

## 6.8 Permission

`catalog.write` · `cms.publish` cho show_on_home ảnh hưởng Home.

## 6.9–6.15

Empty “Chưa có brand”; History; a11y table.

**Note:** Home brands order có thể override bởi Merchandising; Brand Manager chỉ flag `show_on_home`.

---

# 7. TRUST BADGE MANAGER

## 7.1 Business Goal

Thư viện badge tin cậy gắn vào Hero trust strip.

## 7.2 User

Marketing · Admin.

## 7.3 Wireframe

```
Trust Badge Manager
List: Icon | Label | Used on Hero? | Published | ⋮
Editor: Icon [dropdown curated] Label [____] Published [ ]
```

## 7.4–7.6

label ≤28; icon từ enum cố định (không upload SVG tùy tiện — tránh XSS); max library 20.

## 7.7–7.8

Publish badge ≠ tự gắn Hero; gắn tại Hero Manager.

## 7.9–7.15

Chuẩn list/editor; audit.

---

# 8. REVIEW MANAGER

## 8.1 Business Goal

Quản lý social proof; chọn max 3 hiện Home (`show_on_home`).

## 8.2 User

Marketing · CS (gợi ý nội dung) · Admin.

## 8.3 Wireframe

```
Review Manager
Filters: Published | On Home | All
Table: Quote excerpt | Author | Rating | On Home | Published | ⋮
----------------------------------------------------------------
Editor
Quote [textarea 280]
Author name [____] Role [____]
Rating [1–5 stars optional]
Show on Home [ ]  (disabled nếu đã đủ 3 unless uncheck other)
Published [ ]
```

## 8.4 Layout

Table + Editor.

## 8.5–8.6

quote ≤280; author ≤60; max 3 show_on_home published.

## 8.7 Workflow

Draft → Publish → Archive. Moderate: unpublish 1 click.

## 8.8 Permission

CS: write draft; Marketing: publish.

## 8.9 Empty

CTA “Thêm đánh giá đầu tiên” hoặc ẩn section (Homepage Builder).

## 8.10–8.15

Chuẩn; History; a11y stars radiogroup.

---

# 9. FAQ MANAGER

## 9.1 Business Goal

FAQ published; đánh dấu `show_on_home` max 6 cho teaser.

## 9.2 User

CS · Marketing · Admin. Support: read + suggest.

## 9.3 Wireframe

```
FAQ Manager
Search · Filter On Home
[+ FAQ]
List reorder On-Home items separately
Editor:
Question [____] 120
Answer [Markdown subset editor — toolbar: bold, list, link]
Show on Home [ ]
Published [ ]
Category optional
```

## 9.4 Layout

Split list/editor; **Markdown subset chỉ**, không raw HTML source.

## 9.5–9.6

answer ≤2000; strip script; link allowlist; max 6 on home.

## 9.7–9.8

Draft → Publish; CS write; publish marketing/admin.

## 9.9–9.15

Empty; preview answer; audit; History; a11y editor toolbar.

---

# 10. SEO MANAGER

## 10.1 Business Goal

SEO cho path `/` (và pattern cho path khác — **scope Screen 01: chỉ `/`**).

## 10.2 User

Marketing · Admin.

## 10.3 Wireframe

```
SEO Manager · Path: /
----------------------------------------------------------------
Title       [________________________] 60
Description [________________________] 160
OG Image    [Media] (default: Hero background)
Canonical   [/] read-only default
Robots      Index [x] Follow [x]
----------------------------------------------------------------
SERP Preview (Google mock)
KEYON Title...
https://keyon.example/
Description...
----------------------------------------------------------------
[Lưu nháp] [Publish]
```

## 10.4 Layout

Form + SERP preview + optional social card preview.

## 10.5–10.6

title ≤60; description ≤160; no HTML; og optional.

## 10.7–10.8

Publish SEO độc lập; permission cms.publish.

## 10.9–10.15

Empty prefill từ Hero title; History; a11y counters.

---

# 11. FOOTER BUILDER

## 11.1 Business Goal

4 cột link + social + copyright — khớp Visual Spec Footer.

## 11.2 User

Marketing · Admin.

## 11.3 Wireframe

```
Footer Builder
----------------------------------------------------------------
Columns
[Col1 Title ____]  [Col2] [Col3] [Col4]
 Links list + add · drag
Social: + Facebook/YouTube/LinkedIn/Zalo urls
Copyright [____]
Legal shortcuts: Terms | Privacy (path picker)
----------------------------------------------------------------
Preview Footer inverse
```

## 11.4 Layout

4 column editors ngang Desktop; stack Tablet Admin.

## 11.5–11.6

đúng 4 cột; ≤8 links/col; label ≤24; copyright ≤120.

## 11.7–11.15

Draft → Publish; audit; History; empty prefill legal columns.

---

# 12. MEDIA LIBRARY

## 12.1 Business Goal

Kho media cho Hero, Brand logo, OG, Product images (Home dùng subset) — một nguồn chọn file, không upload lung tung mỗi form.

## 12.2 User

Marketing · Catalog · Admin. Support: read.

## 12.3 Wireframe

```
Media Library
----------------------------------------------------------------
Search [____]  Type: All|Image  [Upload]
Grid thumbs
----------------------------------------------------------------
Detail drawer:
Preview · Filename · Size · Dimensions · Used by (Hero, Brand…)
Alt text [____] required for publish usage
Replace file · Archive
----------------------------------------------------------------
Picker mode (modal từ Hero):
Same grid · [Chọn] · multi=false
```

## 12.4 Layout

Grid + detail drawer; Upload dropzone.

## 12.5 Fields

file · alt · tags optional · folder optional.

## 12.6 Validation

mime allowlist; max 3MB image Home; min width warning <1920 for hero; alt ≤120; cấm SVG scriptable nếu policy deny SVG (khuyến nghị PNG/WebP cho hero).

## 12.7 Workflow

Upload → (processing) → Ready → Archive. Delete blocked nếu `used_by` > 0 (force chỉ Owner).

## 12.8 Permission

`media.read` · `media.write` · `media.delete`

## 12.9 Empty

Dropzone lớn “Tải ảnh lên”.

## 12.10 Loading

Upload progress bar per file.

## 12.11 Error

File too large / type / virus (nếu có) — message rõ.

## 12.12 Audit

upload/replace/archive/delete.

## 12.13 Version History

Replace = new version; giữ bản cũ để rollback reference.

## 12.14 Responsive

Grid 6/3/2 columns Admin breakpoints.

## 12.15 Accessibility

Alt bắt buộc khi gắn vào Hero publish; grid keyboard selectable.

---

# 13. CROSS-MODULE RULES (Home Management)

## 13.1 Publish dependency

| Muốn Live trên Home | Cần |
|---------------------|-----|
| Hero hiện | Hero published + Media ready |
| Featured hiện | Merchandising published + variants active |
| Trust trên Hero | Badges published + selected in Hero |
| FAQ teaser | FAQ published + show_on_home |
| Brands row | Brands published + logo + merchandising/flag |
| Banner | Banner active + schedule window |

Homepage Builder Publish **không** publish Hero content — chỉ structure. Mỗi module nội dung publish riêng **hoặc** “Publish all home drafts” (Owner bulk) với checklist.

## 13.2 Bulk action (Owner)

Modal: list dirty modules → Publish selected → một audit batch.

## 13.3 Preview isolation

Preview luôn đọc **draft** của user hiện tại; không lộ draft cho khách.

## 13.4 Không WordPress

Cấm: shortcode, PHP, raw HTML block trên Home builders, theme file edit, “Custom CSS” field trên Screen 01 Admin.

## 13.5 Core Stable

Admin Home **không** có màn sửa Order/Payment/Pool. Merchandising chỉ **chọn** Variant ID.

---

# 14. ADMIN IMPLEMENTATION CHECKLIST (Screen 01 Home Management)

- [ ] Hub `/admin/cms/home`  
- [ ] Shared shell (breadcrumb, sticky actions, preview breakpoints)  
- [ ] Homepage Builder  
- [ ] Hero Manager  
- [ ] Banner Manager  
- [ ] Navigation Manager  
- [ ] Merchandising Manager  
- [ ] Brand Manager  
- [ ] Trust Badge Manager  
- [ ] Review Manager  
- [ ] FAQ Manager  
- [ ] SEO Manager (`/`)  
- [ ] Footer Builder  
- [ ] Media Library + picker  
- [ ] Draft / Preview / Publish / Rollback / History mỗi module nội dung  
- [ ] Permission matrix enforce  
- [ ] Audit log viewer filter `cms.*`  
- [ ] Empty / Loading / Error mỗi module  
- [ ] A11y dialogs + counters  
- [ ] No Custom CSS / raw HTML  
- [ ] Founder Approve block below  

---

# 15. APPROVAL BLOCK

| Role | Date | |
|------|------|--|
| Founder / PO | | ☐ **Approve Admin UX Spec — Screen 01 Home Management** |
| Ops lead | | ☐ |
| Tech Lead (scope only) | | ☐ Không đụng Core Stable |

**Sau Approve:** được phép code **Admin modules Screen 01** (+ Storefront Home nếu Production UI Spec cũng đã Approve).  
**Chưa Approve:** cấm code.  
**Cấm:** Screen 02.
