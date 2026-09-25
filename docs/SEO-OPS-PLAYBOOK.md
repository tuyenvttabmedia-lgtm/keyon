# KEYON — SEO operations playbook (Phase 3 ops)

Companion to code phases 0–2. Owner / ops checklist — no fake metrics.

## After every prod deploy

1. Confirm `NEXT_PUBLIC_APP_URL=https://keyon.vn` (or current prod origin).
2. Open `/robots.txt` and `/sitemap.xml` — expect allow + absolute URLs on that origin.
3. Admin → Settings → SEO: GSC token + GA4 **or** GTM filled when ready.
4. Spot-check: `/demo` is disallowed / noindex; `/login` has noindex and no home canonical.

## Google Search Console (first time)

1. Add URL-prefix or Domain property for the prod host.
2. Verification: paste **content** token into Admin → Settings → SEO → Search Console → Save → redeploy/refresh if needed → Verify in GSC.
3. Sitemaps → submit `https://<host>/sitemap.xml`.
4. URL Inspection: home, one PDP, one knowledge article, `/contact/quote`.

## Weekly (15–30 min)

- GSC → Performance: top queries / pages; fix thin titles/CTR outliers.
- GSC → Pages (indexing): resolve “Crawled – currently not indexed” / redirect / soft 404.
- Analytics (GA4 or GTM): sessions, `/products`, `view_item` → `begin_checkout` → `purchase`.

## Ecommerce events (wired in app)

| Event | When |
|-------|------|
| `view_item` | PDP — active variant |
| `begin_checkout` | Checkout step 2 mount |
| `purchase` | Success page when payment `SUCCEEDED` (deduped per order in session) |

Prefer GTM container when set; otherwise direct GA4. DebugView in GA4 to verify.

## Content / internal links (ongoing)

- Prefer `/kien-thuc/...` hub over legacy `/blog`.
- Each new product: fill Admin SEO tab (title ≤60, description ≤160, OG).
- Link related products + knowledge guides from PDP usage HTML when relevant.

## Do not

- Invent AggregateRating or fake review schema.
- Index staging (keep `SEO_NOINDEX` or non-prod APP_URL).
- Submit sitemap while APP_URL still points at localhost.
- Index `/demo` (design-system iframe).
