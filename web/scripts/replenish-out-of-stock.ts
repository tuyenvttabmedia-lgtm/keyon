/**
 * Dev/ops helper: add AVAILABLE license keys for SKUs with zero available stock.
 * Usage: npx tsx --env-file=.env.local --env-file=.env scripts/replenish-out-of-stock.ts
 */
import { PrismaClient } from "@prisma/client";
import { encryptPayload } from "../src/lib/crypto";

const prisma = new PrismaClient();
const PER_SKU = Number(process.env.REPLENISH_COUNT ?? 15);

async function main() {
  const variants = await prisma.productVariant.findMany({
    where: { active: true },
    select: {
      id: true,
      sku: true,
      name: true,
      product: { select: { name: true } },
      _count: {
        select: { licenseItems: { where: { status: "AVAILABLE" } } },
      },
    },
  });

  const empty = variants.filter((v) => v._count.licenseItems === 0);
  console.log(`Variants with 0 AVAILABLE: ${empty.length}`);

  let added = 0;
  for (const v of empty) {
    const keys = Array.from({ length: PER_SKU }, (_, i) =>
      `KEYON-REPL-${v.sku}-${Date.now()}-${i + 1}`,
    );
    await prisma.licenseItem.createMany({
      data: keys.map((k) => ({
        variantId: v.id,
        payloadEnc: encryptPayload(k),
        status: "AVAILABLE" as const,
      })),
    });
    added += keys.length;
    console.log(`+ ${v.sku} (${v.product.name}) → ${PER_SKU} keys`);
  }

  console.log(`Done. Added ${added} AVAILABLE items across ${empty.length} SKUs.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
