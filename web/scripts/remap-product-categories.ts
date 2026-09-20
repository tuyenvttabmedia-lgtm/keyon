/**
 * Remap Product.categoryKey to KEYON Phase-1 taxonomy.
 * Safe to re-run. Uses brand + name heuristics (same as inferCategory).
 *
 * Usage (from web/): npx tsx scripts/remap-product-categories.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const KEYS = [
  "windows",
  "office",
  "adobe",
  "cloud",
  "security",
  "backup",
  "autodesk",
  "other",
] as const;

type Cat = (typeof KEYS)[number];

function inferCategory(brand: string, name: string): Cat {
  const hay = `${brand} ${name}`.toLowerCase();
  if (/autodesk|autocad|revit|3ds\s?max|maya|inventor|civil\s?3d/.test(hay))
    return "autodesk";
  if (
    /adobe|creative|photoshop|illustrator|premiere|acrobat|lightroom|after\s?effects/.test(
      hay,
    )
  )
    return "adobe";
  if (
    /kaspersky|eset|norton|mcafee|defender|security|antivirus|nod32|bitdefender|avast|avg/.test(
      hay,
    )
  )
    return "security";
  if (/acronis|backup|veeam|storage|s3|object\s?storage/.test(hay)) return "backup";
  if (/server|vmware|azure|aws|cloud|vps|hosting/.test(hay)) return "cloud";
  if (/office|365|word|excel|powerpoint|outlook|teams/.test(hay)) return "office";
  if (/windows|win\s?1[01]/.test(hay)) return "windows";
  return "other";
}

async function main() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      categoryKey: true,
      brand: { select: { name: true } },
    },
  });

  let updated = 0;
  const tallies: Record<Cat, number> = {
    windows: 0,
    office: 0,
    adobe: 0,
    cloud: 0,
    security: 0,
    backup: 0,
    autodesk: 0,
    other: 0,
  };

  for (const p of products) {
    const next = inferCategory(p.brand.name, p.name);
    tallies[next] += 1;
    if (p.categoryKey === next) continue;
    await prisma.product.update({
      where: { id: p.id },
      data: { categoryKey: next },
    });
    updated += 1;
    console.log(`${p.categoryKey ?? "null"} → ${next} · ${p.name}`);
  }

  console.log("\nRemapped", updated, "of", products.length);
  console.log("Tallies:", tallies);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
