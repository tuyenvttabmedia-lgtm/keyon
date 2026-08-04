# ADR-006 — Storefront Information Architecture (Navigation)

**Status:** Accepted (Phase 1 + Phase 2 implemented)  
**Date:** 2026-08-04  
**Decisions:** NAV-01 … NAV-05

---

## Context

KEYON sells software licenses (and later cloud/services). Early nav mixed Category DB, homepage anchors, blog, and contact into one flat header. That blurred **Brand ≠ Category ≠ Collection ≠ Solution ≠ Navigation**.

## Decision

### Principle

| Layer | Role | Example |
|-------|------|---------|
| Brand | Vendor identity | `/brands/microsoft` |
| Category | Catalog taxonomy (DB / `cat=`) | `?cat=office` |
| Collection | Merchandising group in Shop mega | “Windows”, “Backup” (`SHOP_COLLECTIONS`) |
| Solution | Problem-oriented landing | `/solutions/productivity` |
| Navigation | IA presentation layer | Header mega / footer |

**Navigation must not mirror Product Category 1:1.**

### NAV-01 — Products mega

**Brand + Shop Collections** (not Category DB tree).

- Brands → `/brands/{slug}` (or product search when brand SKU missing)
- Collections → existing `/products?cat=` / `?q=` filters (`SHOP_COLLECTIONS` in `ia.ts`)
- **No Prisma Collection table** (Phase 2 confirmed)

### NAV-02 — License management URL

One canonical page: **`/solutions/license-management`**.  
Business nav **cross-links** only; no duplicate `/business/license-management`.

### NAV-03 — Resources (Phase 2)

One Article engine (`blog.json` / `BlogPost`) with optional `section`: `insights` | `guides` | `news`.

| Canonical | Legacy |
|-----------|--------|
| `/resources/{section}` | `/blog` → 301 `/resources/news` |
| `/resources/{section}/{slug}` | `/blog/{slug}` → 301 resolved section |

Section inference when omitted: `huong-dan`→guides, `tin-keyon`→news, topical categories→insights, else news.

### NAV-04 — Phase scope

| Phase | Ship | Skip |
|-------|------|------|
| 1 | Mega, landings, stubs | Taxonomy DB migrate |
| 2 | Article routes under `/resources`, 301 `/blog`, `SHOP_COLLECTIONS` export, admin section picker | Prisma Category/Collection |

### NAV-05 — Productivity naming

Solution label: **“Năng suất & Cộng tác”** → `/solutions/productivity`.

### Header shape

`KEYON | Sản phẩm⌄ Giải pháp⌄ Doanh nghiệp⌄ Tài nguyên⌄ Hỗ trợ⌄ | 🔍 Tài khoản`  
(Admin link staff-only.)

### Source of truth

Code config: `web/src/storefront/nav/ia.ts`.  
CMS `nav.json` items are **legacy / secondary** (brand logo + tagline still from CMS). Header structure is IA-driven.

## Consequences

- New routes under `/solutions`, `/business`, `/resources`, `/support`, `/contact/sales`.
- Footer defaults updated in `defaultCmsFooter` (prod CMS JSON may need one-time sync).
- Cloud/Backup landings use “đang mở rộng” tone when catalog is thin — no fake SKU claims.
- Sitemap emits `/resources/...` URLs.

## Exit criteria

### Phase 1

- [x] Desktop mega opens for Sản phẩm / Giải pháp / Doanh nghiệp
- [x] Mobile accordion lists same destinations
- [x] `/solutions/license-management` and `/business` cross-link correctly
- [x] No reliance on `/#solutions` for primary nav
- [x] `/support` is a real hub (removed legacy redirect to `/faq`)

### Phase 2

- [x] `/resources/{insights,guides,news}` list published articles
- [x] `/resources/{section}/{slug}` detail reuses BlogDetailView
- [x] `/blog` and `/blog/{slug}` 301 to Resources
- [x] Sitemap + home news use resource URLs
- [x] Admin can set `section` on posts
- [x] Collections stay config (`SHOP_COLLECTIONS`), not DB
