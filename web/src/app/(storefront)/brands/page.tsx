import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Thương hiệu | KEYON",
  description: "Danh sách thương hiệu phần mềm trên KEYON",
};

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
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-navy">Thương hiệu</h1>
      <p className="mt-2 text-sm text-muted">
        Chọn brand để xem sản phẩm đang bán trên KEYON
      </p>

      {brands.length === 0 ? (
        <p className="mt-10 text-sm text-muted">Chưa có thương hiệu.</p>
      ) : (
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {brands.map((b) => (
            <li key={b.id}>
              <Link
                href={`/brands/${b.slug}`}
                className="flex gap-3 rounded-2xl border border-border bg-card p-4 transition hover:border-accent/40"
              >
                {b.logoUrl ? (
                  <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border bg-white">
                    <Image
                      src={b.logoUrl}
                      alt=""
                      fill
                      className="object-contain p-1"
                      unoptimized
                    />
                  </span>
                ) : (
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-navy-soft text-lg font-bold text-navy">
                    {(b.name[0] || "?").toUpperCase()}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-navy">
                    {b.name}
                    {b.featured ? (
                      <span className="ml-2 text-xs font-medium text-accent">
                        Featured
                      </span>
                    ) : null}
                  </p>
                  {b.shortDescription ? (
                    <p className="mt-0.5 line-clamp-2 text-sm text-muted">
                      {b.shortDescription}
                    </p>
                  ) : (
                    <p className="mt-0.5 text-sm text-muted">
                      {b._count.products} sản phẩm
                    </p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
