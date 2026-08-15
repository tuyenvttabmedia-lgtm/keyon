/**
 * Upsert B5 service SKU: QUOTE_REQUIRED + MANUAL + DIGITAL_FILE.
 * Does not wipe catalog. Does not create LicenseItem rows.
 * npm run catalog:ensure-service-sku
 */
import {
  DeliverableType,
  FulfillmentStrategy,
  IntegrationMode,
  LicenseModel,
  SalesMotion,
  SupplierType,
} from "@prisma/client";
import { prisma } from "../src/lib/db";
import {
  SERVICE_HANDOVER_DEFAULT_PRICE_VND,
  SERVICE_HANDOVER_SKU,
  SERVICE_HANDOVER_SLUG,
} from "../src/storefront/lib/service-sku";

async function main() {
  let brand = await prisma.brand.findFirst({
    where: { slug: "keyon" },
  });
  if (!brand) {
    brand = await prisma.brand.create({
      data: {
        name: "KEYON",
        slug: "keyon",
        shortDescription: "Dịch vụ bàn giao bản quyền KEYON",
        active: true,
      },
    });
  }

  let supplier = await prisma.supplier.findFirst({
    where: { name: "KEYON Services" },
  });
  if (!supplier) {
    supplier = await prisma.supplier.create({
      data: {
        name: "KEYON Services",
        supplierType: SupplierType.INTERNAL,
        integrationMode: IntegrationMode.MANUAL_OPS,
        notes: "Bàn giao / triển khai — không License Pool",
      },
    });
  }

  const description =
    "Gói bàn giao và kích hoạt bản quyền theo phạm vi KEYON (không MSP cloud). Thanh toán trên KEYON; nhân sự xử lý inbox. Quy mô/phạm vi khác → báo giá.";

  const product = await prisma.product.upsert({
    where: { slug: SERVICE_HANDOVER_SLUG },
    create: {
      brandId: brand.id,
      slug: SERVICE_HANDOVER_SLUG,
      name: "Bàn giao bản quyền KEYON",
      description,
      shortDescription: "Thanh toán gói chuẩn hoặc gửi báo giá tùy chỉnh.",
      categoryKey: "other",
      badgeLabel: "DỊCH VỤ",
      active: true,
    },
    update: {
      brandId: brand.id,
      name: "Bàn giao bản quyền KEYON",
      description,
      shortDescription: "Thanh toán gói chuẩn hoặc gửi báo giá tùy chỉnh.",
      categoryKey: "other",
      badgeLabel: "DỊCH VỤ",
      active: true,
    },
  });

  const existing = await prisma.productVariant.findUnique({
    where: { sku: SERVICE_HANDOVER_SKU },
  });

  const variant = existing
    ? await prisma.productVariant.update({
        where: { sku: SERVICE_HANDOVER_SKU },
        data: {
          productId: product.id,
          name: "Gói chuẩn",
          licenseModel: LicenseModel.MAINTENANCE,
          fulfillmentStrategy: FulfillmentStrategy.MANUAL,
          deliverableType: DeliverableType.DIGITAL_FILE,
          salesMotion: SalesMotion.QUOTE_REQUIRED,
          slaPromise: "Theo lịch sau thanh toán (giờ làm việc)",
          supplierId: supplier.id,
          active: true,
        },
      })
    : await prisma.productVariant.create({
        data: {
          productId: product.id,
          sku: SERVICE_HANDOVER_SKU,
          name: "Gói chuẩn",
          licenseModel: LicenseModel.MAINTENANCE,
          fulfillmentStrategy: FulfillmentStrategy.MANUAL,
          deliverableType: DeliverableType.DIGITAL_FILE,
          salesMotion: SalesMotion.QUOTE_REQUIRED,
          slaPromise: "Theo lịch sau thanh toán (giờ làm việc)",
          supplierId: supplier.id,
          priceVnd: SERVICE_HANDOVER_DEFAULT_PRICE_VND,
          costVnd: 0,
          active: true,
        },
      });

  const poolCount = await prisma.licenseItem.count({
    where: { variantId: variant.id },
  });

  console.log(
    JSON.stringify(
      {
        slug: SERVICE_HANDOVER_SLUG,
        sku: variant.sku,
        strategy: variant.fulfillmentStrategy,
        deliverable: variant.deliverableType,
        salesMotion: variant.salesMotion,
        priceVnd: variant.priceVnd,
        licenseItems: poolCount,
      },
      null,
      2,
    ),
  );

  if (poolCount > 0) {
    throw new Error("Service SKU must not have LicenseItem rows");
  }
}

void main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
