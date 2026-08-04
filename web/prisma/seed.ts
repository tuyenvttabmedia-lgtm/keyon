import {
  DeliverableType,
  FulfillmentStrategy,
  IntegrationMode,
  LicenseModel,
  PrismaClient,
  SalesMotion,
  SupplierType,
  UserRole,
} from "@prisma/client";
import { hash } from "bcryptjs";
import { createCipheriv, randomBytes, scryptSync } from "crypto";

const prisma = new PrismaClient();

function encrypt(plain: string): string {
  if (
    process.env.NODE_ENV === "production" &&
    !process.env.DELIVERY_ENCRYPTION_KEY
  ) {
    throw new Error(
      "DELIVERY_ENCRYPTION_KEY is required to seed in production (no weak fallback).",
    );
  }
  const raw =
    process.env.DELIVERY_ENCRYPTION_KEY ?? "0123456789abcdef0123456789abcdef";
  const key = scryptSync(raw, "keyon-delivery", 32);
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString("base64url");
}

async function main() {
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_PROD_SEED !== "1") {
    throw new Error(
      "Refusing to seed production. Set ALLOW_PROD_SEED=1 only on intentional staging resets. Seed credentials are for local/staging only.",
    );
  }

  await prisma.deliveryResend.deleteMany();
  await prisma.delivery.deleteMany();
  await prisma.fulfillmentJob.deleteMany();
  await prisma.paymentDomainEvent.deleteMany();
  await prisma.paymentWebhookReceipt.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.licenseEvent.deleteMany();
  await prisma.licenseItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await hash("Admin@123", 12);
  const users: {
    email: string;
    passwordHash: string;
    name: string;
    role: UserRole;
  }[] = [
    {
      email: "admin@keyon.local",
      passwordHash,
      name: "Admin KEYON",
      role: UserRole.ADMIN,
    },
    {
      email: "customer@keyon.local",
      passwordHash,
      name: "Demo Customer",
      role: UserRole.CUSTOMER,
    },
  ];
  // Opt-in only — do not recreate fulfill@keyon.local on accidental re-seed
  if (process.env.SEED_FULFILLMENT === "1") {
    users.push({
      email: "fulfill@keyon.local",
      passwordHash,
      name: "Fulfillment Staff",
      role: UserRole.FULFILLMENT,
    });
  }
  await prisma.user.createMany({ data: users });

  const stock = await prisma.supplier.create({
    data: {
      name: "KEYON Stock",
      supplierType: SupplierType.INTERNAL,
      integrationMode: IntegrationMode.NONE,
      notes: "Kho Instant nội bộ",
    },
  });
  const external = await prisma.supplier.create({
    data: {
      name: "NCC Manual Demo",
      supplierType: SupplierType.EXTERNAL,
      integrationMode: IntegrationMode.MANUAL_OPS,
      notes: "Lấy key tay / Zalo",
    },
  });
  const pax8 = await prisma.supplier.create({
    data: {
      name: "Pax8",
      supplierType: SupplierType.DISTRIBUTOR,
      integrationMode: IntegrationMode.API,
      notes: "Phase B — Semi-Automated",
    },
  });
  await prisma.supplier.create({
    data: {
      name: "PACISOFT",
      supplierType: SupplierType.DISTRIBUTOR,
      integrationMode: IntegrationMode.MANUAL_OPS,
      notes: "Distributor manual / báo giá",
    },
  });

  const ms = await prisma.brand.create({
    data: { name: "Microsoft", slug: "microsoft", supplierId: stock.id },
  });
  const adobe = await prisma.brand.create({
    data: { name: "Adobe", slug: "adobe", supplierId: stock.id },
  });
  const auto = await prisma.brand.create({
    data: { name: "Autodesk", slug: "autodesk", supplierId: stock.id },
  });
  const kas = await prisma.brand.create({
    data: { name: "Kaspersky", slug: "kaspersky", supplierId: external.id },
  });
  const eset = await prisma.brand.create({
    data: { name: "ESET", slug: "eset", supplierId: external.id },
  });
  const norton = await prisma.brand.create({
    data: { name: "Norton", slug: "norton", supplierId: external.id },
  });

  type Spec = {
    brandId: string;
    name: string;
    slug: string;
    description: string;
    sku: string;
    variantName: string;
    strategy: FulfillmentStrategy;
    deliverable: DeliverableType;
    license: LicenseModel;
    sales: SalesMotion;
    sla: string;
    supplierId: string;
    price: number;
    cost: number;
    stockKeys?: string[];
    active?: boolean;
    upstream?: string;
  };

  const specs: Spec[] = [
    // —— Instant (≥5) ——
    {
      brandId: ms.id,
      name: "Windows 11 Pro",
      slug: "windows-11-pro",
      description: "License bán lẻ — Instant từ kho KEYON",
      sku: "WIN11-PRO-RET",
      variantName: "Retail — 1 PC",
      strategy: FulfillmentStrategy.INSTANT,
      deliverable: DeliverableType.KEY,
      license: LicenseModel.PERPETUAL,
      sales: SalesMotion.SELF_SERVE,
      sla: "≤ 15 phút sau thanh toán",
      supplierId: stock.id,
      price: 2_490_000,
      cost: 1_800_000,
      stockKeys: ["WIN11-DEMO-KEY-001", "WIN11-DEMO-KEY-002", "WIN11-DEMO-KEY-003"],
    },
    {
      brandId: ms.id,
      name: "Office 2024 Home",
      slug: "office-2024-home",
      description: "Office perpetual — Instant",
      sku: "OFF2024-HOME",
      variantName: "Home — 1 PC",
      strategy: FulfillmentStrategy.INSTANT,
      deliverable: DeliverableType.KEY,
      license: LicenseModel.PERPETUAL,
      sales: SalesMotion.SELF_SERVE,
      sla: "≤ 15 phút sau thanh toán",
      supplierId: stock.id,
      price: 1_890_000,
      cost: 1_200_000,
      stockKeys: ["OFF2024-DEMO-001", "OFF2024-DEMO-002"],
    },
    {
      brandId: ms.id,
      name: "Windows Server 2022",
      slug: "windows-server-2022",
      description: "Server Standard — Instant key",
      sku: "WINSRV2022-STD",
      variantName: "Standard — 16 core",
      strategy: FulfillmentStrategy.INSTANT,
      deliverable: DeliverableType.KEY,
      license: LicenseModel.PERPETUAL,
      sales: SalesMotion.SELF_SERVE,
      sla: "≤ 15 phút sau thanh toán",
      supplierId: stock.id,
      price: 4_900_000,
      cost: 3_500_000,
      stockKeys: ["WINSRV-DEMO-001", "WINSRV-DEMO-002"],
    },
    {
      brandId: adobe.id,
      name: "Adobe Acrobat Pro 2024",
      slug: "adobe-acrobat-pro-2024",
      description: "PDF Pro — Instant",
      sku: "ACR-PRO-2024",
      variantName: "Perpetual — 1 seat",
      strategy: FulfillmentStrategy.INSTANT,
      deliverable: DeliverableType.KEY,
      license: LicenseModel.PERPETUAL,
      sales: SalesMotion.SELF_SERVE,
      sla: "≤ 15 phút sau thanh toán",
      supplierId: stock.id,
      price: 3_290_000,
      cost: 2_400_000,
      stockKeys: ["ACR-DEMO-001", "ACR-DEMO-002"],
    },
    {
      brandId: auto.id,
      name: "AutoCAD LT 2025",
      slug: "autocad-lt-2025",
      description: "CAD LT — Instant key demo",
      sku: "ACAD-LT-2025",
      variantName: "1 năm (key local)",
      strategy: FulfillmentStrategy.INSTANT,
      deliverable: DeliverableType.KEY,
      license: LicenseModel.SUBSCRIPTION,
      sales: SalesMotion.SELF_SERVE,
      sla: "≤ 15 phút sau thanh toán",
      supplierId: stock.id,
      price: 5_500_000,
      cost: 4_200_000,
      stockKeys: ["ACADLT-DEMO-001"],
    },
    // —— Manual (≥5) ——
    {
      brandId: kas.id,
      name: "Kaspersky Internet Security",
      slug: "kaspersky-internet-security",
      description: "Antivirus — Manual fulfillment",
      sku: "KAV-IS-1Y",
      variantName: "1 năm — 1 thiết bị",
      strategy: FulfillmentStrategy.MANUAL,
      deliverable: DeliverableType.KEY,
      license: LicenseModel.SUBSCRIPTION,
      sales: SalesMotion.SELF_SERVE,
      sla: "2–8 giờ làm việc",
      supplierId: external.id,
      price: 390_000,
      cost: 250_000,
    },
    {
      brandId: kas.id,
      name: "Kaspersky Total Security",
      slug: "kaspersky-total-security",
      description: "Total Security — Manual account",
      sku: "KAV-TS-ACC",
      variantName: "1 năm — Account",
      strategy: FulfillmentStrategy.MANUAL,
      deliverable: DeliverableType.ACCOUNT,
      license: LicenseModel.SUBSCRIPTION,
      sales: SalesMotion.SELF_SERVE,
      sla: "2–8 giờ làm việc",
      supplierId: external.id,
      price: 520_000,
      cost: 340_000,
    },
    {
      brandId: eset.id,
      name: "ESET NOD32 Antivirus",
      slug: "eset-nod32",
      description: "NOD32 — Manual key",
      sku: "ESET-NOD32-1Y",
      variantName: "1 năm — 1 PC",
      strategy: FulfillmentStrategy.MANUAL,
      deliverable: DeliverableType.KEY,
      license: LicenseModel.SUBSCRIPTION,
      sales: SalesMotion.SELF_SERVE,
      sla: "2–8 giờ làm việc",
      supplierId: external.id,
      price: 320_000,
      cost: 210_000,
    },
    {
      brandId: eset.id,
      name: "ESET Internet Security",
      slug: "eset-internet-security",
      description: "ESET IS — Manual",
      sku: "ESET-IS-1Y",
      variantName: "1 năm — 3 thiết bị",
      strategy: FulfillmentStrategy.MANUAL,
      deliverable: DeliverableType.KEY,
      license: LicenseModel.SUBSCRIPTION,
      sales: SalesMotion.SELF_SERVE,
      sla: "2–8 giờ làm việc",
      supplierId: external.id,
      price: 480_000,
      cost: 310_000,
    },
    {
      brandId: norton.id,
      name: "Norton 360 Deluxe",
      slug: "norton-360-deluxe",
      description: "Norton — Manual portal invite",
      sku: "NORTON-360-DLX",
      variantName: "1 năm — External portal",
      strategy: FulfillmentStrategy.MANUAL,
      deliverable: DeliverableType.EXTERNAL_PORTAL,
      license: LicenseModel.SUBSCRIPTION,
      sales: SalesMotion.SELF_SERVE,
      sla: "2–8 giờ làm việc",
      supplierId: external.id,
      price: 690_000,
      cost: 450_000,
    },
    // —— Phase B sample (quote) ——
    {
      brandId: ms.id,
      name: "Microsoft 365 Business Standard",
      slug: "microsoft-365-business-standard",
      description: "Phase B Semi-Automated via Pax8 — chưa mua ngay",
      sku: "M365-BS-PAX8",
      variantName: "1 user / tháng (Pax8 — Phase B)",
      strategy: FulfillmentStrategy.SEMI_AUTOMATED,
      deliverable: DeliverableType.EXTERNAL_PORTAL,
      license: LicenseModel.SUBSCRIPTION,
      sales: SalesMotion.QUOTE_REQUIRED,
      sla: "Đang kích hoạt với NCC",
      supplierId: pax8.id,
      price: 320_000,
      cost: 250_000,
      upstream: "pax8-product-placeholder",
    },
  ];

  for (const s of specs) {
    const product = await prisma.product.create({
      data: {
        brandId: s.brandId,
        name: s.name,
        slug: s.slug,
        description: s.description,
      },
    });
    const variant = await prisma.productVariant.create({
      data: {
        productId: product.id,
        sku: s.sku,
        name: s.variantName,
        licenseModel: s.license,
        fulfillmentStrategy: s.strategy,
        deliverableType: s.deliverable,
        salesMotion: s.sales,
        slaPromise: s.sla,
        supplierId: s.supplierId,
        upstreamProductRef: s.upstream,
        priceVnd: s.price,
        costVnd: s.cost,
        active: s.active ?? true,
      },
    });
    for (const key of s.stockKeys ?? []) {
      await prisma.licenseItem.create({
        data: {
          variantId: variant.id,
          payloadEnc: encrypt(key),
          status: "AVAILABLE",
        },
      });
    }
  }

  console.log("Seed OK — Instant ≥5 + Manual ≥5 + Phase B sample");
  console.log("Seed OK (staging/local only).");
  console.log("Admin: admin@keyon.local / Admin@123 — CHANGE before production pilot");
  if (process.env.SEED_FULFILLMENT === "1") {
    console.log("Fulfillment: fulfill@keyon.local / Admin@123");
  }
  console.log("Customer: customer@keyon.local / Admin@123");
  console.log("Staff roles require TOTP before /admin (enable at /account/security).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
