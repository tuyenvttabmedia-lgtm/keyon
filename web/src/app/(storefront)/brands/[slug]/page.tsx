import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import {
  resolveWithGlobalFallback,
  toNextMetadata,
} from "@/server/seo/metadata";
import { loadSiteSettings } from "@/server/seo/settings";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [brand, settings] = await Promise.all([
    prisma.brand.findFirst({
      where: { slug, active: true },
    }),
    loadSiteSettings(),
  ]);
  if (!brand) return { title: "Brand" };

  const seo = resolveWithGlobalFallback(settings, {
    path: `/brands/${slug}`,
    title: brand.seoTitle?.trim() || `${brand.name} | KEYON`,
    description:
      brand.seoDescription?.trim() ||
      brand.shortDescription?.trim() ||
      undefined,
    ogImageUrl:
      brand.ogImageUrl?.trim() ||
      brand.bannerDesktopUrl?.trim() ||
      brand.logoUrl?.trim() ||
      null,
  });
  const meta = toNextMetadata(seo);
  if (brand.canonicalUrl?.trim()) {
    return {
      ...meta,
      alternates: { canonical: brand.canonicalUrl.trim() },
    };
  }
  return meta;
}

export default async function BrandLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = await prisma.brand.findFirst({
    where: { slug, active: true },
    include: {
      products: {
        where: { active: true },
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          slug: true,
          shortDescription: true,
          variants: {
            where: { active: true },
            orderBy: { priceVnd: "asc" },
            take: 1,
            select: { priceVnd: true },
          },
        },
      },
    },
  });
  if (!brand) notFound();

  const bannerDesktop = brand.bannerDesktopUrl?.trim() || null;
  const bannerMobile = brand.bannerMobileUrl?.trim() || bannerDesktop;
  const logo = brand.logoUrl?.trim() || null;

  return (
    <div>
      {bannerDesktop || bannerMobile ? (
        <div className="relative w-full overflow-hidden bg-navy">
          {bannerDesktop ? (
            <div className="relative hidden aspect-[21/7] w-full md:block">
              <Image
                src={bannerDesktop}
                alt=""
                fill
                className="object-cover"
                priority
                unoptimized
              />
            </div>
          ) : null}
          {bannerMobile ? (
            <div className="relative aspect-[4/3] w-full md:hidden">
              <Image
                src={bannerMobile}
                alt=""
                fill
                className="object-cover"
                priority
                unoptimized
              />
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-start gap-4">
          {logo ? (
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border bg-white">
              <Image
                src={logo}
                alt={brand.name}
                fill
                className="object-contain p-1"
                unoptimized
              />
            </div>
          ) : null}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Thương hiệu
              {brand.featured ? " · Featured" : ""}
            </p>
            <h1 className="mt-1 text-3xl font-bold text-navy">{brand.name}</h1>
            {brand.shortDescription ? (
              <p className="mt-2 text-sm text-muted">{brand.shortDescription}</p>
            ) : null}
            <p className="mt-2 text-sm text-muted">
              {brand.products.length} sản phẩm ·{" "}
              <Link href="/products" className="text-accent hover:underline">
                Xem shop
              </Link>
              {" · "}
              <Link href="/brands" className="text-accent hover:underline">
                Tất cả brand
              </Link>
            </p>
          </div>
        </div>

        {brand.description ? (
          <div className="mt-8 whitespace-pre-wrap text-sm leading-relaxed text-navy/90">
            {brand.description}
          </div>
        ) : null}

        {brand.products.length === 0 ? (
          <p className="mt-10 text-sm text-muted">Chưa có sản phẩm đang bán.</p>
        ) : (
          <ul className="mt-8 divide-y divide-border rounded-2xl border border-border bg-card">
            {brand.products.map((p) => {
              const price = p.variants[0]?.priceVnd;
              return (
                <li key={p.id}>
                  <Link
                    href={`/products/${p.slug}`}
                    className="flex flex-wrap items-center justify-between gap-2 px-4 py-4 hover:bg-[#f8fafc]"
                  >
                    <div>
                      <p className="font-semibold text-navy">{p.name}</p>
                      {p.shortDescription ? (
                        <p className="mt-0.5 line-clamp-1 text-sm text-muted">
                          {p.shortDescription}
                        </p>
                      ) : null}
                    </div>
                    <p className="text-sm font-semibold text-accent">
                      {price != null
                        ? `Từ ${price.toLocaleString("vi-VN")}đ`
                        : "Xem chi tiết"}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
