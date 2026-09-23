/**
 * Upsert Windows 11 Home catalog sample (idempotent).
 * Usage: cd web && npx tsx prisma/seed-windows-11-home.ts
 * Safe for prod when ALLOW_PROD_SEED=1 or NODE_ENV !== production.
 */
import {
  DeliverableType,
  FulfillmentStrategy,
  LicenseModel,
  PrismaClient,
  SalesMotion,
} from "@prisma/client";

const prisma = new PrismaClient();

const SLUG = "windows-11-home";

async function main() {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ALLOW_PROD_SEED !== "1"
  ) {
    throw new Error(
      "Refusing prod seed. Set ALLOW_PROD_SEED=1 for intentional upsert.",
    );
  }

  const brand = await prisma.brand.upsert({
    where: { slug: "microsoft" },
    create: {
      name: "Microsoft",
      slug: "microsoft",
      active: true,
    },
    update: { name: "Microsoft", active: true },
  });

  const supplier =
    (await prisma.supplier.findFirst({
      where: { name: { contains: "KEYON", mode: "insensitive" } },
    })) ??
    (await prisma.supplier.findFirst({ orderBy: { createdAt: "asc" } }));

  const features = [
    "Giao diện Windows 11 hiện đại, tối ưu đa nhiệm",
    "Bảo mật tích hợp Windows Hello & BitLocker (theo phiên bản)",
    "Nhận license số sau thanh toán qua Tài khoản KEYON",
    "Hỗ trợ kích hoạt và gửi lại khi cần",
  ];

  const specs = [
    { label: "Nhà phát hành", value: "Microsoft" },
    { label: "Phiên bản", value: "Windows 11 Home" },
    { label: "Loại phân phối", value: "Digital License" },
    { group: "system", label: "Bộ xử lý", value: "1 GHz trở lên, 2+ lõi, tương thích 64-bit" },
    { group: "system", label: "RAM", value: "4 GB trở lên" },
    { group: "system", label: "Lưu trữ", value: "64 GB trở lên" },
    { group: "system", label: "Firmware", value: "UEFI, Secure Boot capable" },
    { group: "system", label: "TPM", value: "TPM 2.0" },
    { group: "system", label: "Đồ họa", value: "DirectX 12 tương thích / WDDM 2.0" },
  ];

  const faqs = [
    {
      id: "faq-1",
      question: "Windows 11 Home phù hợp máy nào?",
      answer:
        "Dành cho máy tính cá nhân đáp ứng yêu cầu hệ thống Windows 11 (TPM 2.0, Secure Boot, CPU tương thích).",
    },
    {
      id: "faq-2",
      question: "Retail và OEM khác nhau thế nào?",
      answer:
        "Retail thường chuyển được giữa thiết bị theo chính sách Microsoft; OEM gắn với thiết bị gốc. Chọn đúng gói trên trang sản phẩm.",
    },
    {
      id: "faq-3",
      question: "Nhận license như thế nào?",
      answer:
        "Sau thanh toán thành công, license hiển thị trong Tài khoản KEYON → Tài sản. Có thể gửi lại khi cần.",
    },
  ];

  const productData = {
    brandId: brand.id,
    name: "Windows 11 Home",
    description:
      "Windows 11 Home — hệ điều hành bản quyền số chính hãng. Chọn gói Retail hoặc OEM, thanh toán rõ ràng, nhận license trong Tài khoản KEYON.",
    shortDescription:
      "Hệ điều hành Windows 11 Home bản quyền số — giao qua Tài khoản KEYON sau thanh toán.",
    categoryKey: "windows",
    badgeLabel: "HỆ ĐIỀU HÀNH",
    galleryUrls: [] as string[],
    features,
    specs,
    faqs,
    seoTitle: "Mua Windows 11 Home bản quyền | KEYON",
    seoDescription:
      "Windows 11 Home bản quyền số chính hãng. Retail / OEM, giao qua Tài khoản KEYON, hỗ trợ kích hoạt.",
    focusKeyword: "windows 11 home",
    seoKeywords: [
      "windows 11",
      "windows 11 home bản quyền",
      "mua windows 11",
      "license windows 11",
    ],
    ogTitle: "Windows 11 Home bản quyền | KEYON",
    ogDescription:
      "Bản quyền số Windows 11 Home — chọn Retail hoặc OEM, thanh toán rõ, nhận trong Tài khoản.",
    platforms: ["windows"],
    language: "multilingual",
    licenseChannelDefault: "RETAIL",
    licenseTermDefault: "PERPETUAL",
    seatsDefault: "1 thiết bị",
    activationMethodDefault: "PRODUCT_KEY",
    transferPolicy:
      "Theo chính sách Microsoft cho từng loại (Retail thường linh hoạt hơn OEM).",
    upgradePolicy: "Nâng cấp lên Pro theo chương trình Microsoft / KEYON khi có.",
    accountRequired: "Không bắt buộc Microsoft account để kích hoạt bằng product key",
    active: true,
  };

  const existing = await prisma.product.findUnique({ where: { slug: SLUG } });

  const product = existing
    ? await prisma.product.update({
        where: { id: existing.id },
        data: productData,
      })
    : await prisma.product.create({
        data: { ...productData, slug: SLUG },
      });

  const variantsSpec = [
    {
      sku: "MS-W11-HOME-RTL",
      name: "Retail · 1 thiết bị",
      priceVnd: 2490000,
      compareAtPriceVnd: 2990000,
      licenseChannel: "RETAIL",
      licenseTerm: "PERPETUAL",
      seatsLabel: "1 thiết bị",
      regionCode: "GLOBAL",
      activationMethod: "PRODUCT_KEY",
    },
    {
      sku: "MS-W11-HOME-OEM",
      name: "OEM · 1 thiết bị",
      priceVnd: 1890000,
      compareAtPriceVnd: 2290000,
      licenseChannel: "OEM",
      licenseTerm: "PERPETUAL",
      seatsLabel: "1 thiết bị (OEM)",
      regionCode: "GLOBAL",
      activationMethod: "PRODUCT_KEY",
    },
  ] as const;

  for (const v of variantsSpec) {
    const taken = await prisma.productVariant.findUnique({
      where: { sku: v.sku },
    });
    const payload = {
      productId: product.id,
      name: v.name,
      licenseModel: LicenseModel.PERPETUAL,
      fulfillmentStrategy: FulfillmentStrategy.MANUAL,
      deliverableType: DeliverableType.KEY,
      salesMotion: SalesMotion.SELF_SERVE,
      slaPromise: "KEYON xử lý trong giờ làm việc",
      supplierId: supplier?.id ?? null,
      priceVnd: v.priceVnd,
      compareAtPriceVnd: v.compareAtPriceVnd,
      costVnd: 0,
      lowStockThreshold: 10,
      licenseChannel: v.licenseChannel,
      licenseTerm: v.licenseTerm,
      seatsLabel: v.seatsLabel,
      regionCode: v.regionCode,
      activationMethod: v.activationMethod,
      active: true,
    };
    if (taken) {
      await prisma.productVariant.update({
        where: { id: taken.id },
        data: payload,
      });
    } else {
      await prisma.productVariant.create({
        data: { ...payload, sku: v.sku },
      });
    }
  }

  console.log(`OK: /products/${SLUG} (brand=${brand.slug})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
