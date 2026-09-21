# ADR-006 — Storefront Information Architecture (Navigation)

**Status:** Accepted (Phase 1 + Phase 2 implemented)  
**Date:** 2026-08-04  
**Amended:** 2026-09-13 — rename hub **Tài nguyên `/resources` → Kiến thức `/knowledge`** (site pre-index; no `/resources` 301).  
**Amended:** 2026-09-20 — Category canonical URL **`/categories/{slug}`** (replaces `/products?cat=`); legacy `?cat=` 301.  
**Amended:** 2026-09-21 — Knowledge section public slugs Vietnamese (`chuyen-sau` / `huong-dan` / `tin-tuc`); Admin Chuyên mục vs Chủ đề.  
**Amended:** 2026-09-21 — Hub path **`/kien-thuc`**; topic archives; Tin tức is chuyên mục under Kiến thức. Pre-index: no permanent redirects from `/knowledge` required.  
**Decisions:** NAV-01 … NAV-05

---

## Context

KEYON sells software licenses (and later cloud/services). Early nav mixed Category DB, homepage anchors, blog, and contact into one flat header. That blurred **Brand ≠ Category ≠ Collection ≠ Solution ≠ Navigation**.

## Decision

### Principle

| Layer | Role | Example |
|-------|------|---------|
| Brand | Vendor identity | `/brands/microsoft` |
| Category | Catalog taxonomy | `/categories/office` |
| Collection | Merchandising group in Shop mega | “Windows”, “Backup” (`SHOP_COLLECTIONS`) |
| Solution | Problem-oriented landing | `/solutions/productivity` |
| Navigation | IA presentation layer | Header mega / footer |

**Navigation must not mirror Product Category 1:1.**

### NAV-01 — Products mega

**Brand + Shop Collections** (not Category DB tree).

- Brands → `/brands/{slug}` (or product search when brand SKU missing)
- Collections → `/categories/{slug}` (`SHOP_COLLECTIONS` in `ia.ts`)
- Legacy `/products?cat=` → **301** `/categories/{slug}`
- **No Prisma Collection table** (Phase 2 confirmed)
- **Do not** use `/products/{slug}` for categories (reserved for PDP)

### NAV-02 — License management URL

One canonical page: **`/solutions/license-management`**.  
Business nav **cross-links** only; no duplicate `/business/license-management`.

### NAV-03 — Knowledge hub (Phase 2; amended 2026-09-13; SEO 2026-09-21)

One Article engine (`blog.json` / `BlogPost`) with `section`: `insights` | `guides` | `news` (internal ids).

**Decision — hub is Kiến thức, not Tin tức:**  
Guides and expert analysis are not “news”. Putting Tin tức at the URL root mismatches search intent. Tin tức is one **chuyên mục** under the hub.

**Public URL tree (Vietnamese, SEO):**

| Role | Path |
|------|------|
| Hub | `/kien-thuc` |
| Chuyên mục Chuyên sâu | `/kien-thuc/chuyen-sau` |
| Chuyên mục Hướng dẫn | `/kien-thuc/huong-dan` |
| Chuyên mục Tin tức | `/kien-thuc/tin-tuc` |
| Bài viết | `/kien-thuc/{chuyen-muc}/{slug}` |
| Chủ đề (archive) | `/kien-thuc/chu-de/{topic}` |

| Canonical | Legacy (301) |
|-----------|--------------|
| `/kien-thuc/...` | `/knowledge/...`, EN section ids, `/blog` → `/kien-thuc/tin-tuc` |
| | `/blog/{slug}` → resolved bài viết |

Nav label: **Kiến thức**. Chuyên mục (nav): Chuyên sâu, Hướng dẫn, Tin tức.

**Chủ đề** (`category`): Bản quyền, Windows, Microsoft 365, Doanh nghiệp, Bảo mật — secondary taxonomy; own archive URLs + optional `?chu-de=` filter inside a chuyên mục.

Admin: **Chuyên mục** = `section` (URL); **Chủ đề** = `category` (filter / archive).

Section inference when omitted: `huong-dan` topic→guides, `tin-keyon`→news, topical→insights, else news.

### NAV-04 — Phase scope

| Phase | Ship | Skip |
|-------|------|------|
| 1 | Mega, landings, stubs | Taxonomy DB migrate |
| 2 | Article routes under `/kien-thuc`, 301 `/blog` + `/knowledge`, `SHOP_COLLECTIONS` export, admin section picker | Prisma Category/Collection |

### NAV-05 — Productivity naming

Solution label: **“Năng suất & Cộng tác”** → `/solutions/productivity`.

### Header shape

`KEYON | Sản phẩm⌄ Giải pháp⌄ Doanh nghiệp⌄ Kiến thức⌄ Hỗ trợ⌄ | 🔍 Tài khoản`  
(Admin link staff-only.)

### Source of truth

Code config: `web/src/storefront/nav/ia.ts`.  
CMS `nav.json` items are **legacy / secondary** (brand logo + tagline still from CMS). Header structure is IA-driven.

## Consequences

- Routes under `/solutions`, `/business`, `/kien-thuc`, `/support`, `/contact/quote`.
- Footer defaults updated in `defaultCmsFooter` (prod CMS JSON may need one-time sync; runtime remap `/resources` and `/knowledge` → `/kien-thuc`).
- Cloud/Backup landings use “đang mở rộng” tone when catalog is thin — no fake SKU claims.
- Sitemap emits `/kien-thuc/...` and `/categories/{slug}` URLs.
- Category path avoids collision with PDP `/products/{slug}`.

## Exit criteria

### Phase 1

- [x] Desktop mega opens for Sản phẩm / Giải pháp / Doanh nghiệp
- [x] Mobile accordion lists same destinations
- [x] `/solutions/license-management` and `/business` cross-link correctly
- [x] No reliance on `/#solutions` for primary nav
- [x] `/support` is a real hub (removed legacy redirect to `/faq`)

### Phase 2

- [x] `/kien-thuc/{chuyen-sau,huong-dan,tin-tuc}` list published articles (`/knowledge` 301)
- [x] `/kien-thuc/{chuyen-muc}/{slug}` detail reuses BlogDetailView
- [x] `/kien-thuc/chu-de/{topic}` topic archives
- [x] `/blog` and `/blog/{slug}` 301 to Kiến thức
- [x] Sitemap + home news use `/kien-thuc` URLs
- [x] Admin: Chuyên mục (`section`) + Chủ đề (`category`) on posts
- [x] Collections stay config (`SHOP_COLLECTIONS`), not DB
