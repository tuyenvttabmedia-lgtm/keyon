import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";
import { BrandForm } from "../brand-form";

export const dynamic = "force-dynamic";

export default async function AdminBrandEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [brand, suppliers] = await Promise.all([
    prisma.brand.findUnique({ where: { id } }),
    prisma.supplier.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);
  if (!brand) notFound();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link
            href="/admin/brands"
            className="text-sm font-medium text-accent hover:underline"
          >
            ← Thương hiệu
          </Link>
          <h1 className={`${ADMIN_PAGE_TITLE_CLASS} mt-2`}>{brand.name}</h1>
          <p className="font-mono text-xs text-muted">
            /brands/{brand.slug}
            {!brand.active ? " · Archived" : ""}
            {brand.featured ? " · Featured" : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={`/brands/${brand.slug}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-border px-3 py-2 text-sm font-semibold text-navy"
          >
            Xem Landing
          </a>
          <Link
            href={`/admin/catalog?brand=${encodeURIComponent(brand.slug)}`}
            className="rounded-lg border border-border px-3 py-2 text-sm font-semibold text-navy"
          >
            Catalog
          </Link>
        </div>
      </div>
      <BrandForm
        mode="edit"
        brandId={brand.id}
        initial={{
          name: brand.name,
          slug: brand.slug,
          supplierId: brand.supplierId,
          logoUrl: brand.logoUrl,
          bannerDesktopUrl: brand.bannerDesktopUrl,
          bannerMobileUrl: brand.bannerMobileUrl,
          shortDescription: brand.shortDescription,
          description: brand.description,
          seoTitle: brand.seoTitle,
          seoDescription: brand.seoDescription,
          ogImageUrl: brand.ogImageUrl,
          canonicalUrl: brand.canonicalUrl,
          featured: brand.featured,
          sortOrder: brand.sortOrder,
          active: brand.active,
        }}
        suppliers={suppliers}
      />
    </div>
  );
}
