import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { buildMainPageMetadata } from "@/server/seo/metadata";
import { BrandsIndexView } from "@/storefront/components/brands/BrandsIndexView";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildMainPageMetadata("/brands");
}

export default async function BrandsIndexPage() {
  const brands = await prisma.brand.findMany({
    where: { active: true },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      logoUrl: true,
      shortDescription: true,
      featured: true,
      _count: { select: { products: { where: { active: true } } } },
    },
  });

  return (
    <BrandsIndexView
      brands={brands.map((b) => ({
        id: b.id,
        name: b.name,
        slug: b.slug,
        logoUrl: b.logoUrl,
        shortDescription: b.shortDescription,
        featured: b.featured,
        productCount: b._count.products,
      }))}
    />
  );
}
