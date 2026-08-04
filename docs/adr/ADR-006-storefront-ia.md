# ADR-006 — Storefront Information Architecture (Navigation)

**Status:** Accepted (Phase 1 implemented)  
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
| Collection | Merchandising group in Shop mega | “Windows”, “Backup” |
| Solution | Problem-oriented landing | `/solutions/productivity` |
| Navigation | IA presentation layer | Header mega / footer |

**Navigation must not mirror Product Category 1:1.**

### NAV-01 — Products mega

**Brand + Shop Collections** (not Category DB tree).

- Brands → `/brands/{slug}` (or product search when brand SKU missing)
- Collections → existing `/products?cat=` / `?q=` filters

### NAV-02 — License management URL

One canonical page: **`/solutions/license-management`**.  
Business nav **cross-links** only; no duplicate `/business/license-management`.

### NAV-03 — Resources

Content under **`/resources/{insights,guides,news}`**.  
One Article engine behind the scenes. Phase 1 may keep `/blog` live; later 301 after SEO audit.

### NAV-04 — Phase 1 scope

Ship: mega + mobile accordion, Solutions / Business / Resources / Support landings + stubs, footer defaults, SEO titles.  
**Do not** migrate Prisma Category/Collection schema in Phase 1.

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

## Exit criteria (Phase 1)

- [x] Desktop mega opens for Sản phẩm / Giải pháp / Doanh nghiệp
- [x] Mobile accordion lists same destinations
- [x] `/solutions/license-management` and `/business` cross-link correctly
- [x] `/resources/news` points users to `/blog` with alias note
- [x] No reliance on `/#solutions` for primary nav
- [x] `/support` is a real hub (removed legacy redirect to `/faq`)
