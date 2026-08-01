/**
 * Additive demo catalog for Ops UI review (Tồn kho / License).
 * Does NOT wipe DB. Does NOT remove engineering test SKUs.
 *
 * Usage: npm run seed:demo-ops
 */
import {
  DeliverableType,
  FulfillmentStrategy,
  IntegrationMode,
  LicenseModel,
  PrismaClient,
  SalesMotion,
  SupplierType,
} from "@prisma/client";
import { createCipheriv, randomBytes, scryptSync } from "crypto";

const prisma = new PrismaClient();

function encrypt(plain: string): string {
  const raw =
    process.env.DELIVERY_ENCRYPTION_KEY ?? "0123456789abcdef0123456789abcdef";
  const key = scryptSync(raw, "keyon-delivery", 32);
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString("base64url");
}

type DemoSpec = {
  brandSlug: string;
  brandName: string;
  productName: string;
  productSlug: string;
  sku: string;
  variantName: string;
  price: number;
  cost: number;
  /** Available keys to create (idempotent by payload not tracked — skip if SKU already has keys). */
  availableCount: number;
  lowStockThreshold: number;
  /** Create this many CONSUMED stubs for realism */
  consumedCount?: number;
};

const SPECS: DemoSpec[] = [
  {
    brandSlug: "microsoft",
    brandName: "Microsoft",
    productName: "Windows 11 Pro",
    productSlug: "ops-windows-11-pro",
    sku: "OPS-WIN11-PRO",
    variantName: "1 thiết bị",
    price: 2_490_000,
    cost: 1_800_000,
    availableCount: 125,
    lowStockThreshold: 20,
    consumedCount: 87,
  },
  {
    brandSlug: "microsoft",
    brandName: "Microsoft",
    productName: "Office 2024 Home",
    productSlug: "ops-office-2024-home",
    sku: "OPS-OFF2024-HOME",
    variantName: "1 PC",
    price: 1_890_000,
    cost: 1_200_000,
    availableCount: 48,
    lowStockThreshold: 15,
    consumedCount: 120,
  },
  {
    brandSlug: "adobe",
    brandName: "Adobe",
    productName: "Adobe Acrobat Pro",
    productSlug: "ops-adobe-acrobat-pro",
    sku: "OPS-ACR-PRO",
    variantName: "1 seat",
    price: 3_290_000,
    cost: 2_400_000,
    availableCount: 5,
    lowStockThreshold: 10,
    consumedCount: 40,
  },
  {
    brandSlug: "adobe",
    brandName: "Adobe",
    productName: "Photoshop Elements",
    productSlug: "ops-photoshop-elements",
    sku: "OPS-PSE",
    variantName: "Perpetual",
    price: 1_590_000,
    cost: 1_100_000,
    availableCount: 0,
    lowStockThreshold: 10,
    consumedCount: 55,
  },
  {
    brandSlug: "autodesk",
    brandName: "Autodesk",
    productName: "AutoCAD LT 2025",
    productSlug: "ops-autocad-lt-2025",
    sku: "OPS-ACAD-LT",
    variantName: "1 năm",
    price: 5_500_000,
    cost: 4_200_000,
    availableCount: 22,
    lowStockThreshold: 8,
    consumedCount: 30,
  },
  {
    brandSlug: "autodesk",
    brandName: "Autodesk",
    productName: "Revit LT",
    productSlug: "ops-revit-lt",
    sku: "OPS-REVIT-LT",
    variantName: "1 năm",
    price: 6_200_000,
    cost: 4_800_000,
    availableCount: 3,
    lowStockThreshold: 10,
    consumedCount: 18,
  },
  {
    brandSlug: "eset",
    brandName: "ESET",
    productName: "ESET NOD32 Antivirus",
    productSlug: "ops-eset-nod32",
    sku: "OPS-ESET-NOD32",
    variantName: "1 năm — 1 PC",
    price: 320_000,
    cost: 210_000,
    availableCount: 60,
    lowStockThreshold: 15,
    consumedCount: 200,
  },
  {
    brandSlug: "eset",
    brandName: "ESET",
    productName: "ESET Internet Security",
    productSlug: "ops-eset-is",
    sku: "OPS-ESET-IS",
    variantName: "1 năm — 3 thiết bị",
    price: 480_000,
    cost: 310_000,
    availableCount: 0,
    lowStockThreshold: 12,
    consumedCount: 90,
  },
  {
    brandSlug: "kaspersky",
    brandName: "Kaspersky",
    productName: "Kaspersky Internet Security",
    productSlug: "ops-kaspersky-is",
    sku: "OPS-KAV-IS",
    variantName: "1 năm — 1 thiết bị",
    price: 390_000,
    cost: 250_000,
    availableCount: 8,
    lowStockThreshold: 15,
    consumedCount: 70,
  },
  {
    brandSlug: "kaspersky",
    brandName: "Kaspersky",
    productName: "Kaspersky Total Security",
    productSlug: "ops-kaspersky-ts",
    sku: "OPS-KAV-TS",
    variantName: "1 năm — Account",
    price: 520_000,
    cost: 340_000,
    availableCount: 35,
    lowStockThreshold: 10,
    consumedCount: 45,
  },
  {
    brandSlug: "norton",
    brandName: "Norton",
    productName: "Norton 360 Deluxe",
    productSlug: "ops-norton-360",
    sku: "OPS-NORTON-360",
    variantName: "1 năm",
    price: 690_000,
    cost: 450_000,
    availableCount: 2,
    lowStockThreshold: 10,
    consumedCount: 110,
  },
  {
    brandSlug: "norton",
    brandName: "Norton",
    productName: "Norton Antivirus Plus",
    productSlug: "ops-norton-av",
    sku: "OPS-NORTON-AV",
    variantName: "1 năm — 1 PC",
    price: 290_000,
    cost: 180_000,
    availableCount: 0,
    lowStockThreshold: 8,
    consumedCount: 60,
  },
];

async function ensureSupplier() {
  const existing = await prisma.supplier.findFirst({
    where: { name: "KEYON Stock" },
  });
  if (existing) return existing;
  return prisma.supplier.create({
    data: {
      name: "KEYON Stock",
      supplierType: SupplierType.INTERNAL,
      integrationMode: IntegrationMode.NONE,
      notes: "Demo ops seed",
    },
  });
}

async function ensureBrand(slug: string, name: string, supplierId: string) {
  const existing = await prisma.brand.findUnique({ where: { slug } });
  if (existing) return existing;
  return prisma.brand.create({
    data: { name, slug, supplierId },
  });
}

async function main() {
  const stock = await ensureSupplier();
  let created = 0;
  let skipped = 0;

  for (const s of SPECS) {
    const brand = await ensureBrand(s.brandSlug, s.brandName, stock.id);

    const existingVariant = await prisma.productVariant.findUnique({
      where: { sku: s.sku },
    });
    if (existingVariant) {
      skipped += 1;
      continue;
    }

    let product = await prisma.product.findUnique({
      where: { slug: s.productSlug },
    });
    if (!product) {
      product = await prisma.product.create({
        data: {
          brandId: brand.id,
          name: s.productName,
          slug: s.productSlug,
          description: `Demo ops · ${s.productName}`,
          active: true,
        },
      });
    }

    const variant = await prisma.productVariant.create({
      data: {
        productId: product.id,
        sku: s.sku,
        name: s.variantName,
        licenseModel: LicenseModel.PERPETUAL,
        fulfillmentStrategy: FulfillmentStrategy.INSTANT,
        deliverableType: DeliverableType.KEY,
        salesMotion: SalesMotion.SELF_SERVE,
        slaPromise: "≤ 15 phút sau thanh toán",
        supplierId: stock.id,
        priceVnd: s.price,
        costVnd: s.cost,
        lowStockThreshold: s.lowStockThreshold,
        active: true,
      },
    });

    if (s.availableCount > 0) {
      await prisma.licenseItem.createMany({
        data: Array.from({ length: s.availableCount }, (_, i) => ({
          variantId: variant.id,
          payloadEnc: encrypt(
            `${s.sku}-A-${String(i + 1).padStart(4, "0")}`,
          ),
          status: "AVAILABLE" as const,
        })),
      });
    }

    const consumed = s.consumedCount ?? 0;
    if (consumed > 0) {
      const now = new Date();
      await prisma.licenseItem.createMany({
        data: Array.from({ length: consumed }, (_, i) => ({
          variantId: variant.id,
          payloadEnc: encrypt(
            `${s.sku}-C-${String(i + 1).padStart(4, "0")}`,
          ),
          status: "CONSUMED" as const,
          consumedAt: now,
        })),
      });
    }

    created += 1;
    const status =
      s.availableCount <= 0
        ? "OUT"
        : s.availableCount < s.lowStockThreshold
          ? "LOW"
          : "OK";
    console.log(
      `+ ${s.sku} · A=${s.availableCount} thr=${s.lowStockThreshold} → ${status}`,
    );
  }

  console.log(
    `\nDemo ops seed done — created ${created}, skipped existing ${skipped}`,
  );
  console.log("Review UI: /admin/inventory (filter brand Microsoft / Adobe / …)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
