/**
 * Create or update one draft product: Kaspersky Standard, four subscription
 * variants. Does not publish, does not invent prices, and does not create a
 * supplier or a brand.
 *
 * From web/:
 *   KEYON_ENV_FILE=/opt/keyon/.env.production npx tsx scripts/create-kaspersky-standard.ts
 */
import { config } from "dotenv";
import { readFileSync } from "fs";
import path from "path";

if (process.env.KEYON_ENV_FILE) {
  config({ path: process.env.KEYON_ENV_FILE });
}

const SLUG = "kaspersky-standard";
const SKUS = [
  "KAS-STD-1D-1Y",
  "KAS-STD-3D-1Y",
  "KAS-STD-5D-1Y",
  "KAS-STD-10D-1Y",
] as const;

const SLA =
  "KEYON xử lý đơn hàng trong SLA đã công bố. Thông tin kích hoạt được gửi sau khi đơn hàng và thanh toán được xác nhận.";

const GALLERY = [
  {
    url: "https://content.kaspersky-labs.com/fm/site-editor/63/63577fae6bc5acc880a78942499d5ff6/processed/standard-q93.webp",
    name: "kaspersky-standard-main.webp",
    alt: "Kaspersky Standard – Product Main Image",
    mime: "image/webp",
  },
  {
    url: "https://content.kaspersky-labs.com/fm/site-editor/94/94c06e38b26fd3dff06aaaaab441f4fc/processed/detailandmedia-2-q93.png",
    name: "kaspersky-standard-realtime.png",
    alt: "Kaspersky Standard – Real-Time Antivirus & Anti-Malware",
    mime: "image/png",
  },
  {
    url: "https://content.kaspersky-labs.com/fm/site-editor/cc/ccb4cc0484eaad22b954870ae7636189/processed/image-1-4-sea-q75.png",
    name: "kaspersky-standard-performance.png",
    alt: "Kaspersky Standard – Performance Optimization",
    mime: "image/png",
  },
  {
    url: "https://content.kaspersky-labs.com/fm/site-editor/9f/9fd44b35cbf2cc86a15685ce9b3c4917/processed/image-1-1-sea-q75.png",
    name: "kaspersky-standard-disk-cleanup.png",
    alt: "Kaspersky Standard – Disk space clean-up",
    mime: "image/png",
  },
  {
    url: "https://content.kaspersky-labs.com/fm/site-editor/4c/4cabec00e79c82d3c724eaa18e59fa57/processed/image-1-2-sea-q75.png",
    name: "kaspersky-standard-do-not-disturb.png",
    alt: "Kaspersky Standard – Do Not Disturb",
    mime: "image/png",
  },
] as const;

const VARIANTS = [
  { sku: "KAS-STD-1D-1Y", name: "1 Device – 1 Year", seatsLabel: "1 thiết bị" },
  { sku: "KAS-STD-3D-1Y", name: "3 Devices – 1 Year", seatsLabel: "3 thiết bị" },
  { sku: "KAS-STD-5D-1Y", name: "5 Devices – 1 Year", seatsLabel: "5 thiết bị" },
  { sku: "KAS-STD-10D-1Y", name: "10 Devices – 1 Year", seatsLabel: "10 thiết bị" },
] as const;

const REQUIRED_HEADINGS = [
  "Kaspersky Standard – Bảo mật toàn diện cho máy tính và thiết bị cá nhân",
  "Kaspersky Standard là gì?",
  "Kaspersky Standard có những tính năng gì?",
  "Bảo vệ thời gian thực trước virus và malware",
  "Bảo vệ trước ransomware",
  "Chống phishing và website nguy hiểm",
  "Bảo vệ thanh toán và giao dịch trực tuyến",
  "Công cụ hỗ trợ tối ưu hiệu năng",
  "Bảo vệ nhiều thiết bị",
  "Quản lý bản quyền qua My Kaspersky",
  "Kaspersky Standard hỗ trợ những thiết bị nào?",
  "Các gói Kaspersky Standard tại KEYON",
  "Kaspersky Standard phù hợp với ai?",
  "Người dùng máy tính cá nhân",
  "Gia đình có nhiều thiết bị",
  "Người thường xuyên giao dịch trực tuyến",
  "Người cần quản lý nhiều thiết bị",
  "Yêu cầu hệ thống",
  "Hướng dẫn kích hoạt Kaspersky Standard",
  "Bước 1: Tải và cài đặt Kaspersky",
  "Bước 2: Đăng nhập My Kaspersky",
  "Bước 3: Kích hoạt bản quyền",
  "Bước 4: Kiểm tra trạng thái license",
  "Bước 5: Cập nhật phần mềm",
  "Vì sao nên mua Kaspersky Standard tại KEYON?",
  "Kết luận",
];

function wordCount(html: string): number {
  return html
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

async function download(url: string): Promise<Buffer> {
  const res = await fetch(url, {
    headers: { "user-agent": "Mozilla/5.0" },
  });
  if (!res.ok) throw new Error(`Download failed ${res.status} ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing. Set KEYON_ENV_FILE on the server.");
  }

  const { prisma } = await import("../src/lib/db");
  const { sanitizeBlogHtml } = await import("../src/lib/sanitize-blog-html");
  const { uploadMedia } = await import("../src/server/media/service");
  const imageSize = (await import("image-size")).default;

  const description = sanitizeBlogHtml(
    readFileSync(
      path.join(process.cwd(), "scripts/content/kaspersky-standard-pdp.html"),
      "utf8",
    ),
  );
  const usageGuideHtml = sanitizeBlogHtml(
    readFileSync(
      path.join(process.cwd(), "scripts/content/kaspersky-standard-guide.html"),
      "utf8",
    ),
  );

  for (const heading of REQUIRED_HEADINGS) {
    if (!description.includes(heading)) {
      throw new Error(`PDP is missing heading: ${heading}`);
    }
  }
  const words = wordCount(description);
  if (words < 2500 || words > 3500) {
    throw new Error(`PDP word count ${words} is outside 2500–3500`);
  }
  for (const banned of ["chính hãng", "đại lý", "authorized", "100%", "lifetime", "OEM"]) {
    if (description.toLowerCase().includes(banned.toLowerCase())) {
      throw new Error(`PDP contains unconfirmed claim: ${banned}`);
    }
  }

  const ogPath = path.join(
    process.cwd(),
    "scripts/assets/kaspersky-standard-og.png",
  );
  const ogBuf = readFileSync(ogPath);
  const ogDim = imageSize(ogBuf);
  if (ogDim.width !== 1200 || ogDim.height !== 630) {
    throw new Error(`OG image must be 1200×630, got ${ogDim.width}×${ogDim.height}`);
  }

  const brand = await prisma.brand.findFirst({
    where: {
      OR: [
        { slug: "kaspersky" },
        { name: { equals: "Kaspersky", mode: "insensitive" } },
      ],
    },
    select: { id: true, name: true, slug: true },
  });
  if (!brand) throw new Error("Brand Kaspersky does not exist. Not creating one.");

  const [slugOwner, skuRows] = await Promise.all([
    prisma.product.findUnique({
      where: { slug: SLUG },
      select: { id: true, active: true },
    }),
    prisma.productVariant.findMany({
      where: { sku: { in: [...SKUS] } },
      select: {
        id: true,
        sku: true,
        productId: true,
        priceVnd: true,
        compareAtPriceVnd: true,
        costVnd: true,
        supplierId: true,
      },
    }),
  ]);

  for (const row of skuRows) {
    if (slugOwner && row.productId !== slugOwner.id) {
      throw new Error(`SKU ${row.sku} belongs to another product`);
    }
    if (!slugOwner) {
      throw new Error(`SKU ${row.sku} already exists on product ${row.productId}`);
    }
  }

  async function ensureRemote(item: (typeof GALLERY)[number]): Promise<string> {
    const existing = await prisma.mediaAsset.findFirst({
      where: { originalName: item.name },
      orderBy: { createdAt: "desc" },
      select: { publicUrl: true },
    });
    if (existing?.publicUrl.startsWith("https://")) return existing.publicUrl;
    const buf = await download(item.url);
    const uploaded = await uploadMedia({
      file: new File([new Uint8Array(buf)], item.name, { type: item.mime }),
      purpose: "product",
      altText: item.alt,
      caption: item.alt,
    });
    if (!uploaded.publicUrl.startsWith("https://")) {
      throw new Error(`Media URL is not public: ${item.name}`);
    }
    return uploaded.publicUrl;
  }

  const galleryUrls: string[] = [];
  for (const item of GALLERY) {
    galleryUrls.push(await ensureRemote(item));
  }

  const ogExisting = await prisma.mediaAsset.findFirst({
    where: { originalName: "kaspersky-standard-og.png" },
    orderBy: { createdAt: "desc" },
    select: { publicUrl: true },
  });
  let ogImageUrl = ogExisting?.publicUrl ?? "";
  if (!ogImageUrl.startsWith("https://")) {
    const uploaded = await uploadMedia({
      file: new File([new Uint8Array(ogBuf)], "kaspersky-standard-og.png", { type: "image/png" }),
      purpose: "product",
      altText: "Kaspersky Standard – Bảo mật toàn diện cho thiết bị",
      caption: "KEYON — Digital License & Solutions",
    });
    ogImageUrl = uploaded.publicUrl;
  }
  if (!ogImageUrl.startsWith("https://")) throw new Error("OG image URL is not public");
  if (galleryUrls.includes(ogImageUrl)) {
    throw new Error("OG image must not be a gallery image");
  }

  const priced = skuRows.length === SKUS.length && skuRows.every((row) => row.priceVnd > 0);
  const active = Boolean(slugOwner?.active && priced);

  const productData = {
    brandId: brand.id,
    name: "Kaspersky Standard",
    slug: SLUG,
    description,
    shortDescription:
      "Kaspersky Standard là giải pháp bảo mật toàn diện giúp bảo vệ máy tính và thiết bị cá nhân trước virus, malware, ransomware, phishing và các mối đe dọa trực tuyến, đồng thời hỗ trợ bảo vệ thanh toán và tối ưu hiệu năng thiết bị.",
    categoryKey: "security",
    offeringProfile: "SOFTWARE",
    badgeLabel: null,
    galleryUrls,
    features: [
      "Bảo vệ thời gian thực trước virus và malware",
      "Chống ransomware và các mối đe dọa trực tuyến",
      "Anti-phishing giúp bảo vệ khi duyệt web",
      "Bảo vệ thanh toán và giao dịch trực tuyến với Safe Money",
      "Công cụ hỗ trợ tối ưu hiệu năng thiết bị",
      "Bảo vệ nhiều thiết bị trong cùng một gói",
      "Hỗ trợ Windows, macOS, Android và iOS",
      "Quản lý bản quyền thông qua My Kaspersky",
    ],
    specs: [
      { group: "general", label: "Thương hiệu", value: "Kaspersky" },
      { group: "general", label: "Sản phẩm", value: "Kaspersky Standard" },
      { group: "general", label: "Loại bản quyền", value: "Subscription" },
      { group: "general", label: "Thời hạn", value: "1 năm" },
      { group: "general", label: "Số thiết bị", value: "1 / 3 / 5 / 10 tùy variant" },
      { group: "general", label: "Nền tảng", value: "Windows, macOS, Android, iOS, Linux*" },
      { group: "general", label: "Kích hoạt", value: "My Kaspersky" },
      { group: "general", label: "Tài khoản yêu cầu", value: "My Kaspersky account" },
      { group: "general", label: "Kết nối Internet", value: "Có" },
      { group: "general", label: "Bảo vệ thời gian thực", value: "Có" },
      { group: "general", label: "Anti-Malware", value: "Có" },
      { group: "general", label: "Anti-Phishing", value: "Có" },
      { group: "general", label: "Ransomware Protection", value: "Có" },
      { group: "general", label: "Online Payment Protection", value: "Có" },
      { group: "general", label: "Performance Optimization", value: "Có" },
    ],
    faqs: [
      {
        id: "faq-1",
        question: "Kaspersky Standard là gì?",
        answer:
          "Kaspersky Standard là phần mềm bảo mật dạng subscription cho máy tính và thiết bị cá nhân. Gói hỗ trợ phát hiện virus, malware, ransomware và phishing, kèm công cụ hiệu năng và lớp bảo vệ thanh toán.",
      },
      {
        id: "faq-2",
        question: "Kaspersky Standard có thời hạn bao lâu?",
        answer: "Các gói Kaspersky Standard tại KEYON có thời hạn 1 năm.",
      },
      {
        id: "faq-3",
        question: "Kaspersky Standard có những gói nào?",
        answer:
          "Có bốn gói: 1 Device – 1 Year, 3 Devices – 1 Year, 5 Devices – 1 Year và 10 Devices – 1 Year.",
      },
      {
        id: "faq-4",
        question: "Kaspersky Standard có dùng được trên nhiều máy tính không?",
        answer:
          "Có, trong số thiết bị của gói đã mua. Gói 1 thiết bị dùng cho một máy. Gói 3, 5 và 10 thiết bị phủ thêm máy tương ứng.",
      },
      {
        id: "faq-5",
        question: "Kaspersky Standard hỗ trợ Windows không?",
        answer:
          "Có. Windows nằm trong danh sách nền tảng, với các phiên bản Kaspersky công bố cho gói này.",
      },
      {
        id: "faq-6",
        question: "Kaspersky Standard có hỗ trợ macOS không?",
        answer:
          "Có. macOS nằm trong danh sách nền tảng, theo dải phiên bản Kaspersky công bố.",
      },
      {
        id: "faq-7",
        question: "Kaspersky Standard có hỗ trợ Android và iPhone không?",
        answer:
          "Có. Android và iOS nằm trong danh sách nền tảng, theo phiên bản hệ điều hành Kaspersky công bố.",
      },
      {
        id: "faq-8",
        question: "Tôi có cần tài khoản My Kaspersky không?",
        answer:
          "Có. Cần tài khoản My Kaspersky để kích hoạt và theo dõi thời hạn cùng số thiết bị.",
      },
      {
        id: "faq-9",
        question: "Có cần Internet để kích hoạt không?",
        answer:
          "Có. Cần Internet để kích hoạt, cập nhật cơ sở dữ liệu và dùng các dịch vụ trực tuyến của gói.",
      },
      {
        id: "faq-10",
        question: "Kaspersky Standard có bảo vệ thanh toán online không?",
        answer:
          "Có. Safe Money là lớp Kaspersky mô tả cho thanh toán và giao dịch trực tuyến. Phạm vi có thể khác nhau giữa máy tính và điện thoại.",
      },
      {
        id: "faq-11",
        question: "Kaspersky Standard có chống ransomware không?",
        answer:
          "Có lớp chống ransomware theo mô tả của gói. Nên giữ bản sao lưu cho tài liệu quan trọng.",
      },
      {
        id: "faq-12",
        question: "Sau khi mua, KEYON có hỗ trợ kích hoạt không?",
        answer:
          "Có. Sau khi đơn hàng và thanh toán được xác nhận, KEYON gửi thông tin kích hoạt và hỗ trợ đối chiếu nếu bước kích hoạt báo lỗi.",
      },
      {
        id: "faq-13",
        question: "License Kaspersky Standard có chuyển sang thiết bị khác được không?",
        answer:
          "Khả năng chuyển phụ thuộc loại license và điều kiện kích hoạt. Hãy liên hệ KEYON trước khi chuyển để được kiểm tra tình trạng bản quyền.",
      },
      {
        id: "faq-14",
        question: "Kaspersky Standard có tự động gia hạn không?",
        answer:
          "KEYON không trừ tiền tự động cho kỳ tiếp theo. Việc gia hạn phụ thuộc điều kiện subscription và chính sách của Kaspersky khi gói sắp hết hạn.",
      },
    ],
    usageGuideHtml,
    seoTitle: "Kaspersky Standard – License Bảo Mật 1 Năm",
    seoDescription:
      "Kaspersky Standard bảo vệ thiết bị trước virus, malware, ransomware và phishing. Chọn gói 1, 3, 5 hoặc 10 thiết bị, thời hạn 1 năm.",
    ogImageUrl,
    focusKeyword: "Kaspersky Standard",
    seoKeywords: [
      "Kaspersky Standard chính hãng",
      "Kaspersky Standard 1 năm",
      "mua Kaspersky Standard",
      "Kaspersky Standard 1 Device",
      "Kaspersky Standard 3 Devices",
      "Kaspersky Standard 5 Devices",
      "Kaspersky Standard 10 Devices",
      "Kaspersky antivirus",
      "Kaspersky bản quyền",
      "license Kaspersky",
      "phần mềm diệt virus Kaspersky",
      "Kaspersky Standard license",
    ],
    canonicalUrl: "https://keyon.vn/products/kaspersky-standard",
    ogTitle: "Kaspersky Standard – Bảo mật toàn diện cho thiết bị",
    ogDescription:
      "Kaspersky Standard license 1 năm, hỗ trợ bảo vệ thiết bị trước virus, malware, ransomware và phishing. Nhiều lựa chọn từ 1 đến 10 thiết bị.",
    platforms: ["windows", "macos", "android", "ios", "linux"],
    language: "multilingual",
    licenseChannelDefault: "SUBSCRIPTION",
    licenseTermDefault: "1_YEAR",
    seatsDefault: "1 thiết bị",
    activationMethodDefault: "ACCOUNT",
    transferPolicy:
      "Bản quyền Kaspersky Standard được quản lý theo tài khoản/gói bản quyền và điều kiện của nhà cung cấp. Khả năng chuyển sang tài khoản hoặc thiết bị khác phụ thuộc loại license và điều kiện kích hoạt thực tế. Khách hàng nên liên hệ KEYON trước khi yêu cầu chuyển nhượng để được kiểm tra tình trạng bản quyền.",
    upgradePolicy:
      "Có thể nâng cấp hoặc thay đổi gói Kaspersky tùy theo loại license và chính sách của Kaspersky tại thời điểm thực hiện. KEYON hỗ trợ kiểm tra tình trạng bản quyền và tư vấn phương án phù hợp trước khi nâng cấp.",
    accountRequired: "My Kaspersky account",
    active,
  };

  const product = slugOwner
    ? await prisma.product.update({
        where: { id: slugOwner.id },
        data: productData,
        select: { id: true, name: true, slug: true, active: true },
      })
    : await prisma.product.create({
        data: productData,
        select: { id: true, name: true, slug: true, active: true },
      });

  const variantIds: { sku: string; id: string; priceVnd: number; supplierId: string | null }[] =
    [];
  for (const spec of VARIANTS) {
    const current = skuRows.find((row) => row.sku === spec.sku);
    const keepPrice = Boolean(current && current.priceVnd > 0);
    const data = {
      name: spec.name,
      licenseModel: "SUBSCRIPTION" as const,
      fulfillmentStrategy: "MANUAL" as const,
      deliverableType: "SUBSCRIPTION" as const,
      salesMotion: "SELF_SERVE" as const,
      slaPromise: SLA,
      supplierId: keepPrice ? current!.supplierId : null,
      priceVnd: keepPrice ? current!.priceVnd : 0,
      compareAtPriceVnd: keepPrice ? current!.compareAtPriceVnd : null,
      costVnd: keepPrice ? current!.costVnd : 0,
      licenseChannel: "SUBSCRIPTION",
      licenseTerm: "1_YEAR",
      seatsLabel: spec.seatsLabel,
      activationMethod: "ACCOUNT",
      active: true,
    };
    const saved = current
      ? await prisma.productVariant.update({
          where: { id: current.id },
          data,
          select: { id: true, sku: true, priceVnd: true, supplierId: true },
        })
      : await prisma.productVariant.create({
          data: { ...data, sku: spec.sku, productId: product.id },
          select: { id: true, sku: true, priceVnd: true, supplierId: true },
        });
    variantIds.push(saved);
  }

  const check = await prisma.product.findUnique({
    where: { id: product.id },
    select: {
      id: true,
      name: true,
      slug: true,
      active: true,
      seoTitle: true,
      seoDescription: true,
      focusKeyword: true,
      canonicalUrl: true,
      ogTitle: true,
      ogDescription: true,
      ogImageUrl: true,
      galleryUrls: true,
      variants: {
        where: { sku: { in: [...SKUS] } },
        select: { id: true, sku: true, priceVnd: true, supplierId: true },
        orderBy: { sku: "asc" },
      },
    },
  });
  if (!check || check.variants.length !== 4) {
    throw new Error("Product does not have exactly four Kaspersky Standard variants");
  }
  const slugCount = await prisma.product.count({ where: { slug: SLUG } });
  if (slugCount !== 1) throw new Error("Slug is not unique");

  console.log(
    JSON.stringify(
      {
        action: slugOwner ? "updated" : "created",
        productId: check.id,
        name: check.name,
        slug: check.slug,
        active: check.active,
        status: check.active ? "active" : "draft",
        wordCount: words,
        galleryCount: Array.isArray(check.galleryUrls) ? check.galleryUrls.length : 0,
        ogImageUrl: check.ogImageUrl,
        seoTitle: check.seoTitle,
        seoDescription: check.seoDescription,
        focusKeyword: check.focusKeyword,
        canonicalUrl: check.canonicalUrl,
        ogTitle: check.ogTitle,
        ogDescription: check.ogDescription,
        variants: check.variants,
        missing: [
          "priceVnd",
          "compareAtPriceVnd",
          "costVnd",
          "supplierId",
          "confirmed deliverable artifact",
        ],
      },
      null,
      2,
    ),
  );

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
