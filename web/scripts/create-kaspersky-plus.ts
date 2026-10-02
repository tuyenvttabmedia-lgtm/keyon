/**
 * Create or update one draft product: Kaspersky Plus, four subscription
 * variants. Does not publish and does not create a supplier or a brand.
 * Sale prices are the figures supplied for this seed. Cost stays unset.
 * Gallery reuses the Kaspersky Standard PDP images until replaced.
 *
 * From web/:
 *   KEYON_ENV_FILE=/opt/keyon/.env.production npx tsx scripts/create-kaspersky-plus.ts
 */
import { config } from "dotenv";
import { readFileSync } from "fs";
import path from "path";

if (process.env.KEYON_ENV_FILE) {
  config({ path: process.env.KEYON_ENV_FILE });
}

const SLUG = "kaspersky-plus";
const SLA =
  "KEYON xử lý đơn hàng trong SLA đã công bố. Thông tin kích hoạt được gửi sau khi đơn hàng và thanh toán được xác nhận.";

const GALLERY = [
  {
    url: "https://media.keyon.vn/media/2026/10/82da6382b780cee9-kaspersky-standard-main.webp",
    name: "kaspersky-plus-main.webp",
    alt: "Kaspersky Plus – Main Product Image",
    mime: "image/webp",
  },
  {
    url: "https://media.keyon.vn/media/2026/10/e098fbf18c6d8c21-kaspersky-standard-realtime.png",
    name: "kaspersky-plus-security-dashboard.png",
    alt: "Kaspersky Plus – Security Dashboard",
    mime: "image/png",
  },
  {
    url: "https://media.keyon.vn/media/2026/10/4d80c615f4433c58-kaspersky-standard-do-not-disturb.png",
    name: "kaspersky-plus-vpn.png",
    alt: "Kaspersky Plus – VPN / Privacy Protection",
    mime: "image/png",
  },
  {
    url: "https://media.keyon.vn/media/2026/10/1e8473c97c64f04f-kaspersky-standard-disk-cleanup.png",
    name: "kaspersky-plus-password-manager.png",
    alt: "Kaspersky Plus – Password Manager",
    mime: "image/png",
  },
  {
    url: "https://media.keyon.vn/media/2026/10/4a7680d0dc6458b4-kaspersky-standard-performance.png",
    name: "kaspersky-plus-performance.png",
    alt: "Kaspersky Plus – Performance Optimization",
    mime: "image/png",
  },
] as const;

const VARIANTS = [
  {
    sku: "KAS-PLUS-1D-1Y",
    name: "1 Device – 1 Year",
    seatsLabel: "1 thiết bị",
    priceVnd: 399_000,
    compareAtPriceVnd: 410_000,
  },
  {
    sku: "KAS-PLUS-3D-1Y",
    name: "3 Devices – 1 Year",
    seatsLabel: "3 thiết bị",
    priceVnd: 629_000,
    compareAtPriceVnd: 650_000,
  },
  {
    sku: "KAS-PLUS-5D-1Y",
    name: "5 Devices – 1 Year",
    seatsLabel: "5 thiết bị",
    priceVnd: 869_000,
    compareAtPriceVnd: 900_000,
  },
  {
    sku: "KAS-PLUS-10D-1Y",
    name: "10 Devices – 1 Year",
    seatsLabel: "10 thiết bị",
    priceVnd: 799_000,
    compareAtPriceVnd: 800_000,
  },
] as const;

const SKUS = VARIANTS.map((row) => row.sku);

const REQUIRED_HEADINGS = [
  "Kaspersky Plus – Bảo mật nâng cao, hiệu năng và quyền riêng tư trong một giải pháp",
  "Kaspersky Plus là gì?",
  "Kaspersky Plus có những tính năng gì?",
  "Bảo vệ thời gian thực trước virus và malware",
  "Bảo vệ trước ransomware",
  "Anti-Phishing và bảo vệ khi truy cập Internet",
  "Firewall bảo vệ kết nối mạng",
  "Bảo vệ thanh toán trực tuyến",
  "VPN không giới hạn – tăng cường quyền riêng tư",
  "Password Manager – quản lý mật khẩu",
  "Công cụ tối ưu hiệu năng",
  "HDD Health Monitoring",
  "Kaspersky Plus hỗ trợ những nền tảng nào?",
  "Các gói Kaspersky Plus tại KEYON",
  "Kaspersky Plus phù hợp với ai?",
  "Người dùng máy tính cá nhân",
  "Người thường xuyên giao dịch trực tuyến",
  "Người quan tâm đến quyền riêng tư",
  "Người có nhiều thiết bị",
  "Gia đình",
  "Kaspersky Plus và nhu cầu bảo mật hiện đại",
  "Security",
  "Privacy",
  "Performance",
  "Quản lý Kaspersky Plus qua My Kaspersky",
  "Yêu cầu hệ thống",
  "Windows",
  "macOS",
  "Android",
  "iPhone / iPad",
  "Linux",
  "Hướng dẫn kích hoạt Kaspersky Plus",
  "Bước 1: Tải và cài đặt Kaspersky",
  "Bước 2: Đăng nhập My Kaspersky",
  "Bước 3: Kích hoạt license",
  "Bước 4: Kiểm tra trạng thái bản quyền",
  "Bước 5: Cập nhật Kaspersky",
  "Vì sao nên mua Kaspersky Plus tại KEYON?",
  "Kết luận",
];

function wordCount(html: string): number {
  return html
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

async function download(url: string): Promise<Buffer> {
  const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
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
      path.join(process.cwd(), "scripts/content/kaspersky-plus-pdp.html"),
      "utf8",
    ),
  );
  const usageGuideHtml = sanitizeBlogHtml(
    readFileSync(
      path.join(process.cwd(), "scripts/content/kaspersky-plus-guide.html"),
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

  const ogPath = path.join(process.cwd(), "scripts/assets/kaspersky-plus-og.png");
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
      select: { id: true, sku: true, productId: true, supplierId: true, costVnd: true },
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
  for (const item of GALLERY) galleryUrls.push(await ensureRemote(item));

  const ogExisting = await prisma.mediaAsset.findFirst({
    where: { originalName: "kaspersky-plus-og.png" },
    orderBy: { createdAt: "desc" },
    select: { publicUrl: true },
  });
  let ogImageUrl = ogExisting?.publicUrl ?? "";
  if (!ogImageUrl.startsWith("https://")) {
    const uploaded = await uploadMedia({
      file: new File([new Uint8Array(ogBuf)], "kaspersky-plus-og.png", {
        type: "image/png",
      }),
      purpose: "product",
      altText: "Kaspersky Plus – Bảo mật, Hiệu năng & Quyền riêng tư",
      caption: "KEYON — Digital License & Solutions",
    });
    ogImageUrl = uploaded.publicUrl;
  }
  if (!ogImageUrl.startsWith("https://")) throw new Error("OG image URL is not public");
  if (galleryUrls.includes(ogImageUrl)) throw new Error("OG image must not be a gallery image");

  const productData = {
    brandId: brand.id,
    name: "Kaspersky Plus",
    slug: SLUG,
    description,
    shortDescription:
      "Kaspersky Plus là giải pháp bảo mật nâng cao giúp bảo vệ thiết bị trước virus, malware, ransomware và phishing, đồng thời tích hợp VPN không giới hạn, trình quản lý mật khẩu, bảo vệ thanh toán và các công cụ tối ưu hiệu năng.",
    categoryKey: "security",
    offeringProfile: "SOFTWARE",
    badgeLabel: null,
    galleryUrls,
    features: [
      "Bảo vệ thời gian thực trước virus và malware",
      "Chống ransomware và các mối đe dọa trực tuyến",
      "Anti-phishing và bảo vệ khi duyệt web",
      "Firewall bảo vệ kết nối mạng",
      "Bảo vệ thanh toán trực tuyến với Safe Money",
      "VPN không giới hạn giúp tăng cường quyền riêng tư",
      "Password Manager quản lý mật khẩu",
      "Công cụ tối ưu hiệu năng thiết bị",
      "HDD Health Monitoring",
      "Hỗ trợ nhiều thiết bị trong cùng một gói",
      "Quản lý license thông qua My Kaspersky",
      "Hỗ trợ Windows, macOS, Android, iOS và Linux*",
    ],
    specs: [
      { group: "general", label: "Thương hiệu", value: "Kaspersky" },
      { group: "general", label: "Sản phẩm", value: "Kaspersky Plus" },
      { group: "general", label: "Loại bản quyền", value: "Subscription" },
      { group: "general", label: "Thời hạn", value: "1 năm" },
      { group: "general", label: "Số thiết bị", value: "1 / 3 / 5 / 10 tùy variant" },
      { group: "general", label: "Nền tảng", value: "Windows, macOS, Android, iOS, Linux*" },
      { group: "general", label: "Kích hoạt", value: "My Kaspersky" },
      { group: "general", label: "Tài khoản yêu cầu", value: "My Kaspersky account" },
      { group: "general", label: "Kết nối Internet", value: "Có" },
      { group: "general", label: "Anti-Malware", value: "Có" },
      { group: "general", label: "Anti-Ransomware", value: "Có" },
      { group: "general", label: "Anti-Phishing", value: "Có" },
      { group: "general", label: "Firewall", value: "Có" },
      { group: "general", label: "Online Payment Protection", value: "Có" },
      { group: "general", label: "VPN", value: "Unlimited VPN" },
      { group: "general", label: "Password Manager", value: "Có" },
      { group: "general", label: "Performance Optimization", value: "Có" },
      { group: "general", label: "HDD Health Monitoring", value: "Có" },
    ],
    faqs: [
      {
        id: "faq-1",
        question: "Kaspersky Plus là gì?",
        answer:
          "Kaspersky Plus là phần mềm bảo mật dạng subscription, gồm antivirus, chống ransomware, anti-phishing, tường lửa, bảo vệ thanh toán, VPN, trình quản lý mật khẩu và công cụ hiệu năng.",
      },
      {
        id: "faq-2",
        question: "Kaspersky Plus có thời hạn bao lâu?",
        answer: "Các gói Kaspersky Plus tại KEYON có thời hạn 1 năm.",
      },
      {
        id: "faq-3",
        question: "Kaspersky Plus có những gói nào?",
        answer:
          "Có bốn gói: 1 Device – 1 Year, 3 Devices – 1 Year, 5 Devices – 1 Year và 10 Devices – 1 Year.",
      },
      {
        id: "faq-4",
        question: "Kaspersky Plus có dùng được trên nhiều thiết bị không?",
        answer:
          "Có, trong số thiết bị của gói đã mua. Gói 1 thiết bị dùng cho một máy. Gói 3, 5 và 10 thiết bị phủ thêm máy tương ứng.",
      },
      {
        id: "faq-5",
        question: "Kaspersky Plus hỗ trợ Windows không?",
        answer: "Có. Windows nằm trong danh sách nền tảng Kaspersky công bố cho gói này.",
      },
      {
        id: "faq-6",
        question: "Kaspersky Plus có hỗ trợ macOS không?",
        answer: "Có. macOS nằm trong danh sách nền tảng, theo dải phiên bản Kaspersky công bố.",
      },
      {
        id: "faq-7",
        question: "Kaspersky Plus có hỗ trợ Android không?",
        answer: "Có. Android nằm trong danh sách nền tảng, theo phiên bản Kaspersky công bố.",
      },
      {
        id: "faq-8",
        question: "Kaspersky Plus có hỗ trợ iPhone/iPad không?",
        answer: "Có. iOS nằm trong danh sách nền tảng, theo phiên bản Kaspersky công bố.",
      },
      {
        id: "faq-9",
        question: "Kaspersky Plus có VPN không?",
        answer:
          "Có. Kaspersky mô tả VPN trong Plus là không giới hạn dung lượng. Khả năng dùng còn phụ thuộc hệ điều hành và quy định nơi bạn kết nối.",
      },
      {
        id: "faq-10",
        question: "Kaspersky Plus có Password Manager không?",
        answer:
          "Có. Gói có trình quản lý mật khẩu theo mô tả Kaspersky, để lưu và điền mật khẩu từ tài khoản My Kaspersky.",
      },
      {
        id: "faq-11",
        question: "Kaspersky Plus có bảo vệ thanh toán online không?",
        answer:
          "Có lớp bảo vệ thanh toán trực tuyến. Phạm vi có thể khác giữa máy tính và ứng dụng ngân hàng trên điện thoại.",
      },
      {
        id: "faq-12",
        question: "Kaspersky Plus có chống ransomware không?",
        answer: "Có lớp chống ransomware theo mô tả của gói. Nên giữ bản sao lưu cho tài liệu quan trọng.",
      },
      {
        id: "faq-13",
        question: "Tôi có cần My Kaspersky account không?",
        answer: "Có. Cần tài khoản My Kaspersky để kích hoạt, theo dõi thời hạn và số thiết bị.",
      },
      {
        id: "faq-14",
        question: "Có cần Internet để kích hoạt không?",
        answer: "Có. Cần Internet để kích hoạt, cập nhật và dùng VPN cùng các dịch vụ gắn tài khoản.",
      },
      {
        id: "faq-15",
        question: "Kaspersky Plus có tự động gia hạn không?",
        answer:
          "KEYON không trừ tiền tự động cho kỳ tiếp theo. Việc gia hạn phụ thuộc điều kiện subscription và chính sách của Kaspersky khi gói sắp hết hạn.",
      },
      {
        id: "faq-16",
        question: "Có thể chuyển license sang thiết bị khác không?",
        answer:
          "Khả năng chuyển phụ thuộc loại license và điều kiện kích hoạt. Hãy liên hệ KEYON trước khi chuyển để được kiểm tra.",
      },
      {
        id: "faq-17",
        question: "KEYON có hỗ trợ kích hoạt không?",
        answer:
          "Có. Sau khi đơn và thanh toán được xác nhận, KEYON gửi thông tin kích hoạt và hỗ trợ đối chiếu nếu bước kích hoạt báo lỗi.",
      },
    ],
    usageGuideHtml,
    seoTitle: "Kaspersky Plus – License Bảo Mật 1 Năm",
    seoDescription:
      "Kaspersky Plus bảo vệ thiết bị trước virus, ransomware và phishing, tích hợp VPN không giới hạn, Password Manager và bảo vệ thanh toán. License 1 năm.",
    ogImageUrl,
    focusKeyword: "Kaspersky Plus",
    seoKeywords: [
      "Kaspersky Plus chính hãng",
      "Kaspersky Plus 1 năm",
      "mua Kaspersky Plus",
      "Kaspersky Plus 1 Device",
      "Kaspersky Plus 3 Devices",
      "Kaspersky Plus 5 Devices",
      "Kaspersky Plus 10 Devices",
      "Kaspersky Plus license",
      "Kaspersky bản quyền",
      "Kaspersky antivirus",
      "phần mềm diệt virus Kaspersky",
      "Kaspersky VPN",
      "Kaspersky Password Manager",
      "Kaspersky Internet Security",
    ],
    canonicalUrl: "https://keyon.vn/products/kaspersky-plus",
    ogTitle: "Kaspersky Plus – Bảo mật, Hiệu năng & Quyền riêng tư",
    ogDescription:
      "Kaspersky Plus license 1 năm với bảo vệ nâng cao, VPN không giới hạn, Password Manager, chống ransomware và công cụ tối ưu hiệu năng.",
    platforms: ["windows", "macos", "android", "ios", "linux"],
    language: "multilingual",
    licenseChannelDefault: "SUBSCRIPTION",
    licenseTermDefault: "1_YEAR",
    seatsDefault: "1 thiết bị",
    activationMethodDefault: "ACCOUNT",
    transferPolicy:
      "Bản quyền Kaspersky Plus được quản lý theo tài khoản và điều kiện của gói license. Khả năng chuyển sang tài khoản hoặc thiết bị khác phụ thuộc loại license, phương thức kích hoạt và điều kiện của nhà cung cấp. Khách hàng nên liên hệ KEYON trước khi yêu cầu chuyển nhượng để được kiểm tra tình trạng bản quyền.",
    upgradePolicy:
      "Việc nâng cấp hoặc thay đổi gói Kaspersky Plus phụ thuộc vào loại license, thời hạn còn lại và chính sách áp dụng tại thời điểm thực hiện. KEYON hỗ trợ kiểm tra tình trạng bản quyền và tư vấn phương án phù hợp trước khi nâng cấp.",
    accountRequired: "My Kaspersky account",
    active: slugOwner?.active === true,
  };

  const product = slugOwner
    ? await prisma.product.update({
        where: { id: slugOwner.id },
        data: productData,
        select: { id: true, name: true, slug: true, active: true },
      })
    : await prisma.product.create({
        data: { ...productData, active: false },
        select: { id: true, name: true, slug: true, active: true },
      });

  const savedVariants = [];
  for (const spec of VARIANTS) {
    const current = skuRows.find((row) => row.sku === spec.sku);
    const data = {
      name: spec.name,
      licenseModel: "SUBSCRIPTION" as const,
      fulfillmentStrategy: "MANUAL" as const,
      deliverableType: "SUBSCRIPTION" as const,
      salesMotion: "SELF_SERVE" as const,
      slaPromise: SLA,
      supplierId: current?.supplierId ?? null,
      priceVnd: spec.priceVnd,
      compareAtPriceVnd: spec.compareAtPriceVnd,
      costVnd: current && current.costVnd > 0 ? current.costVnd : 0,
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
          select: {
            id: true,
            sku: true,
            priceVnd: true,
            compareAtPriceVnd: true,
            supplierId: true,
          },
        })
      : await prisma.productVariant.create({
          data: { ...data, sku: spec.sku, productId: product.id },
          select: {
            id: true,
            sku: true,
            priceVnd: true,
            compareAtPriceVnd: true,
            supplierId: true,
          },
        });
    savedVariants.push(saved);
  }

  const slugCount = await prisma.product.count({ where: { slug: SLUG } });
  if (slugCount !== 1 || savedVariants.length !== 4) {
    throw new Error("Slug or variant count is not unique");
  }

  console.log(
    JSON.stringify(
      {
        action: slugOwner ? "updated" : "created",
        productId: product.id,
        name: product.name,
        slug: product.slug,
        active: product.active,
        status: product.active ? "active" : "draft",
        wordCount: words,
        galleryUrls,
        ogImageUrl,
        seoTitle: productData.seoTitle,
        seoDescription: productData.seoDescription,
        focusKeyword: productData.focusKeyword,
        canonicalUrl: productData.canonicalUrl,
        ogTitle: productData.ogTitle,
        ogDescription: productData.ogDescription,
        variants: savedVariants,
        warnings: [
          "Gallery is temporary Kaspersky Standard UI. Slots 3 and 4 are not VPN or Password Manager screenshots.",
          "10 Devices price is provisional and lower than the 5 Devices price. Regional availability is not confirmed.",
          "Deliverable is SUBSCRIPTION (Kích hoạt), not a product key. Supplier and cost are unset.",
          "Visible title does not claim chính hãng. Product stays draft unless it was already published.",
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
