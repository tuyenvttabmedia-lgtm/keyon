/**
 * Point VPS Linux, VPS Windows and Dedicated Server at their uploaded PDP images.
 * Gallery lives on the product, so every plan of that product uses the same photo.
 * Does not touch other products.
 *
 * npx tsx scripts/set-infra-pdp-images.ts
 */
import { prisma } from "../src/lib/db";

const ASSIGNMENTS = [
  { slug: "cloud-server", originalName: "Vps-linux-keyon.webp" },
  { slug: "vps-windows", originalName: "Vps-windows-keyon.webp" },
  { slug: "dedicated-server", originalName: "Dedicated-Server-keyon.webp" },
] as const;

async function main() {
  const report = [];
  for (const row of ASSIGNMENTS) {
    const [product, asset] = await Promise.all([
      prisma.product.findUnique({
        where: { slug: row.slug },
        select: { id: true, slug: true, name: true, ogImageUrl: true, galleryUrls: true },
      }),
      prisma.mediaAsset.findFirst({
        where: { originalName: { equals: row.originalName, mode: "insensitive" } },
        orderBy: { createdAt: "desc" },
        select: { publicUrl: true, originalName: true },
      }),
    ]);
    if (!product) throw new Error(`Missing product ${row.slug}`);
    if (!asset?.publicUrl.startsWith("https://")) {
      throw new Error(`Missing media ${row.originalName}`);
    }
    const previous = Array.isArray(product.galleryUrls) ? product.galleryUrls[0] : null;
    const ogWasShared =
      !product.ogImageUrl || product.ogImageUrl === previous;
    await prisma.product.update({
      where: { id: product.id },
      data: {
        galleryUrls: [asset.publicUrl],
        ...(ogWasShared ? { ogImageUrl: asset.publicUrl } : {}),
      },
    });
    report.push({
      slug: product.slug,
      name: product.name,
      image: asset.publicUrl,
      ogUpdated: ogWasShared,
    });
  }
  console.log(JSON.stringify(report, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
