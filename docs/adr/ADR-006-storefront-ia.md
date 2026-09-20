# ADR-006 — Storefront Information Architecture (Navigation)

**Status:** Accepted (Phase 1 + Phase 2 implemented)  
**Date:** 2026-08-04  
**Amended:** 2026-09-13 — rename hub **Tài nguyên `/resources` → Kiến thức `/knowledge`** (site pre-index; no `/resources` 301).  
**Amended:** 2026-09-20 — Category canonical URL **`/categories/{slug}`** (replaces `/products?cat=`); legacy `?cat=` 301.  
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

### NAV-03 — Knowledge hub (Phase 2; amended 2026-09-13)

One Article engine (`blog.json` / `BlogPost`) with optional `section`: `insights` | `guides` | `news`.

| Canonical | Legacy |
|-----------|--------|
| `/knowledge/{section}` | `/blog` → 301 `/knowledge/news` |
| `/knowledge/{section}/{slug}` | `/blog/{slug}` → 301 resolved section |

Hub label: **Kiến thức** (URL `/knowledge`). Sections: Chuyên sâu (`insights`), Hướng dẫn (`guides`), Tin tức (`news`).

Section inference when omitted: `huong-dan`→guides, `tin-keyon`→news, topical categories→insights, else news.

### NAV-04 — Phase scope

| Phase | Ship | Skip |
|-------|------|------|
| 1 | Mega, landings, stubs | Taxonomy DB migrate |
| 2 | Article routes under `/knowledge`, 301 `/blog`, `SHOP_COLLECTIONS` export, admin section picker | Prisma Category/Collection |

### NAV-05 — Productivity naming

Solution label: **“Năng suất & Cộng tác”** → `/solutions/productivity`.

### Header shape

`KEYON | Sản phẩm⌄ Giải pháp⌄ Doanh nghiệp⌄ Kiến thức⌄ Hỗ trợ⌄ | 🔍 Tài khoản`  
(Admin link staff-only.)

### Source of truth

Code config: `web/src/storefront/nav/ia.ts`.  
CMS `nav.json` items are **legacy / secondary** (brand logo + tagline still from CMS). Header structure is IA-driven.

## Consequences

- Routes under `/solutions`, `/business`, `/knowledge`, `/support`, `/contact/quote`.
- Footer defaults updated in `defaultCmsFooter` (prod CMS JSON may need one-time sync; runtime remap `/resources` → `/knowledge`).
- Cloud/Backup landings use “đang mở rộng” tone when catalog is thin — no fake SKU claims.
- Sitemap emits `/knowledge/...` and `/categories/{slug}` URLs.
- Category path avoids collision with PDP `/products/{slug}`.

## Exit criteria

### Phase 1

- [x] Desktop mega opens for Sản phẩm / Giải pháp / Doanh nghiệp
- [x] Mobile accordion lists same destinations
- [x] `/solutions/license-management` and `/business` cross-link correctly
- [x] No reliance on `/#solutions` for primary nav
- [x] `/support` is a real hub (removed legacy redirect to `/faq`)

### Phase 2

- [x] `/knowledge/{insights,guides,news}` list published articles
- [x] `/knowledge/{section}/{slug}` detail reuses BlogDetailView
- [x] `/blog` and `/blog/{slug}` 301 to Knowledge
- [x] Sitemap + home news use knowledge URLs
- [x] Admin can set `section` on posts
- [x] Collections stay config (`SHOP_COLLECTIONS`), not DB
