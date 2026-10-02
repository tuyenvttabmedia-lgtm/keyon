/**
 * Create or update one draft product: Kaspersky Premium, four subscription
 * variants. Does not publish and does not create a supplier or a brand.
 * Only the 1-device price is stored (NTS reference). Other device counts
 * stay unpriced and inactive until a supplier confirms them.
 * Gallery reuses Kaspersky Plus PDP images until replaced.
 *
 * From web/:
 *   KEYON_ENV_FILE=/opt/keyon/.env.production npx tsx scripts/create-kaspersky-premium.ts
 */
import { config } from "dotenv";
import { readFileSync } from "fs";
import path from "path";

if (process.env.KEYON_ENV_FILE) {
  config({ path: process.env.KEYON_ENV_FILE });
}

const SLUG = "kaspersky-premium";
const SLA =
  "KEYON xử lý đơn hàng trong SLA đã công bố. Thông tin kích hoạt được gửi sau khi đơn hàng và thanh toán được xác nhận.";

const GALLERY = [
  {
    url: "https://media.keyon.vn/media/2026/10/2dea1947e5649465-kaspersky-plus-main.webp",
    name: "kaspersky-premium-main.webp",
    alt: "Kaspersky Premium Total Security – License bảo mật cao cấp",
    mime: "image/webp",
  },
  {
    url: "https://media.keyon.vn/media/2026/10/c2f1e235be878682-kaspersky-plus-security-dashboard.png",
    name: "kaspersky-premium-security-dashboard.png",
    alt: "Giao diện Kaspersky Premium bảo vệ thiết bị và dữ liệu",
    mime: "image/png",
  },
  {
    url: "https://media.keyon.vn/media/2026/10/e78bf21058ff845d-kaspersky-plus-vpn.png",
    name: "kaspersky-premium-vpn.png",
    alt: "Kaspersky Premium VPN không giới hạn bảo vệ quyền riêng tư",
    mime: "image/png",
  },
  {
    url: "https://media.keyon.vn/media/2026/10/416c3ac7ec14c5d6-kaspersky-plus-password-manager.png",
    name: "kaspersky-premium-password-identity.png",
    alt: "Kaspersky Premium Password Manager và bảo vệ danh tính",
    mime: "image/png",
  },
  {
    url: "https://media.keyon.vn/media/2026/10/7cac3edd5bc20731-kaspersky-plus-performance.png",
    name: "kaspersky-premium-performance.png",
    alt: "Kaspersky Premium tối ưu hiệu suất và bảo vệ thiết bị",
    mime: "image/png",
  },
] as const;

const VARIANTS = [
  {
    sku: "KAS-PREMIUM-1D-1Y",
    name: "1 Device – 1 Year",
    seatsLabel: "1 thiết bị",
    priceVnd: 510_000,
  },
  {
    sku: "KAS-PREMIUM-3D-1Y",
    name: "3 Devices – 1 Year",
    seatsLabel: "3 thiết bị",
    priceVnd: 0,
  },
  {
    sku: "KAS-PREMIUM-5D-1Y",
    name: "5 Devices – 1 Year",
    seatsLabel: "5 thiết bị",
    priceVnd: 0,
  },
  {
    sku: "KAS-PREMIUM-10D-1Y",
    name: "10 Devices – 1 Year",
    seatsLabel: "10 thiết bị",
    priceVnd: 0,
  },
] as const;

const SKUS = VARIANTS.map((row) => row.sku);

const REQUIRED_HEADINGS = [
  "Kaspersky Premium – Bảo vệ toàn diện thiết bị, dữ liệu và danh tính",
  "Kaspersky Premium là gì?",
  "Những tính năng nổi bật của Kaspersky Premium",
  "Bảo vệ thời gian thực trước virus và malware",
  "Chống ransomware",
  "Chống phishing và website độc hại",
  "Bảo vệ thanh toán và giao dịch trực tuyến",
  "VPN nhanh và không giới hạn",
  "Password Manager và kho mật khẩu an toàn",
  "Bảo vệ danh tính",
  "Kiểm tra rò rỉ dữ liệu",
  "Bảo vệ mạng Wi-Fi và Smart Home",
  "Tối ưu hiệu suất thiết bị",
  "HDD Health Monitor",
  "Uninterrupted Entertainment",
  "Expert Virus Check",
  "Hỗ trợ kỹ thuật cao cấp 24/7",
  "Kaspersky Safe Kids",
  "Kaspersky Premium có gì khác Kaspersky Plus?",
  "Các gói Kaspersky Premium tại KEYON",
  "Kaspersky Premium 1 Device – 1 Year",
  "Kaspersky Premium 3 Devices – 1 Year",
  "Kaspersky Premium 5 Devices – 1 Year",
  "Kaspersky Premium 10 Devices – 1 Year",
  "Kaspersky Premium hỗ trợ những thiết bị nào?",
  "Yêu cầu hệ thống",
  "Hướng dẫn kích hoạt Kaspersky Premium",
  "Kaspersky Premium phù hợp với ai?",
  "Vì sao nên mua Kaspersky Premium tại KEYON?",
  "Lưu ý trước khi mua Kaspersky Premium",
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
      path.join(process.cwd(), "scripts/content/kaspersky-premium-pdp.html"),
      "utf8",
    ),
  );
  const usageGuideHtml = sanitizeBlogHtml(
    readFileSync(
      path.join(process.cwd(), "scripts/content/kaspersky-premium-guide.html"),
      "utf8",
    ),
  );

  for (const heading of REQUIRED_HEADINGS) {
    if (!description.includes(heading)) {
      throw new Error(`PDP is missing heading: ${heading}`);
    }
  }
  const words = wordCount(description);
  if (words < 1800) {
    throw new Error(`PDP word count ${words} is too short`);
  }
  for (const banned of [
    "chính hãng",
    "đại lý",
    "authorized",
    "100%",
    "tuyệt đối",
    "không thể bị virus",
  ]) {
    if (description.toLowerCase().includes(banned.toLowerCase())) {
      throw new Error(`PDP contains unconfirmed claim: ${banned}`);
    }
  }

  const ogPath = path.join(process.cwd(), "scripts/assets/kaspersky-premium-og.png");
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

  const [slugOwner, skuRows, related] = await Promise.all([
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
        supplierId: true,
        costVnd: true,
        priceVnd: true,
      },
    }),
    prisma.product.findMany({
      where: { slug: { in: ["kaspersky-plus", "kaspersky-standard"] } },
      select: { id: true, slug: true },
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
    where: { originalName: "kaspersky-premium-og.png" },
    orderBy: { createdAt: "desc" },
    select: { publicUrl: true },
  });
  let ogImageUrl = ogExisting?.publicUrl ?? "";
  if (!ogImageUrl.startsWith("https://")) {
    const uploaded = await uploadMedia({
      file: new File([new Uint8Array(ogBuf)], "kaspersky-premium-og.png", {
        type: "image/png",
      }),
      purpose: "product",
      altText: "Kaspersky Premium – Bảo Mật, Quyền Riêng Tư & Danh Tính",
      caption: "KEYON — Digital License & Solutions",
    });
    ogImageUrl = uploaded.publicUrl;
  }
  if (!ogImageUrl.startsWith("https://")) throw new Error("OG image URL is not public");
  if (galleryUrls.includes(ogImageUrl)) throw new Error("OG image must not be a gallery image");

  const productData = {
    brandId: brand.id,
    name: "Kaspersky Premium",
    slug: SLUG,
    description,
    shortDescription:
      "Bảo vệ toàn diện thiết bị, quyền riêng tư và danh tính với Kaspersky Premium – kết hợp antivirus, VPN không giới hạn, Password Manager, Identity Protection, tối ưu hiệu suất và hỗ trợ kỹ thuật cao cấp.",
    categoryKey: "security",
    offeringProfile: "SOFTWARE",
    badgeLabel: null,
    galleryUrls,
    features: [
      "Bảo vệ thời gian thực trước virus và malware",
      "Chống ransomware và các cuộc tấn công chiếm quyền",
      "Chống phishing và website độc hại",
      "Bảo vệ thanh toán và thông tin tài chính",
      "VPN nhanh, không giới hạn",
      "Password Manager và kho lưu trữ mật khẩu",
      "Identity Protection",
      "Kiểm tra rò rỉ dữ liệu",
      "Bảo vệ mạng Wi-Fi và thiết bị trong nhà",
      "Tối ưu hiệu suất thiết bị",
      "Theo dõi tình trạng ổ đĩa",
      "Uninterrupted Entertainment",
      "Expert Virus Check & Removal",
      "Hỗ trợ kỹ thuật cao cấp 24/7",
      "Kaspersky Safe Kids gói cơ bản",
      "Hỗ trợ Windows, macOS, Android, iOS và Linux*",
    ],
    specs: [
      { group: "general", label: "Thương hiệu", value: "Kaspersky" },
      { group: "general", label: "Sản phẩm", value: "Kaspersky Premium" },
      { group: "general", label: "Loại", value: "Security Software" },
      { group: "general", label: "Loại bản quyền", value: "Subscription" },
      { group: "general", label: "Thời hạn", value: "1 năm" },
      { group: "general", label: "Số thiết bị", value: "1 / 3 / 5 / 10 Devices" },
      { group: "general", label: "Windows", value: "Có" },
      { group: "general", label: "macOS", value: "Có" },
      { group: "general", label: "Android", value: "Có" },
      { group: "general", label: "iOS", value: "Có" },
      { group: "general", label: "Linux", value: "Có*" },
      { group: "general", label: "VPN", value: "Unlimited" },
      { group: "general", label: "Password Manager", value: "Có" },
      { group: "general", label: "Identity Protection", value: "Có" },
      { group: "general", label: "Data Leak Checker", value: "Có" },
      { group: "general", label: "Anti-Ransomware", value: "Có" },
      { group: "general", label: "Anti-Phishing", value: "Có" },
      { group: "general", label: "Safe Money", value: "Có" },
      { group: "general", label: "Performance Optimization", value: "Có" },
      { group: "general", label: "Smart Home Protection", value: "Có" },
      { group: "general", label: "Premium Support", value: "24/7" },
      { group: "general", label: "Tài khoản yêu cầu", value: "My Kaspersky" },
      { group: "general", label: "Kích hoạt", value: "Activation code qua My Kaspersky" },
      { group: "general", label: "Kết nối Internet", value: "Có" },
      { group: "general", label: "Region", value: "Theo SKU/license" },
      { group: "general", label: "Gia hạn tự động", value: "Theo loại license" },
    ],
    faqs: [
      {
        id: "faq-1",
        question: "Kaspersky Premium là gì?",
        answer:
          "Kaspersky Premium là gói bảo mật cao cấp dạng subscription, gồm antivirus, chống ransomware, quyền riêng tư, VPN không giới hạn, Password Manager, Identity Protection, tối ưu hiệu suất và hỗ trợ kỹ thuật cao cấp.",
      },
      {
        id: "faq-2",
        question: "Kaspersky Premium có VPN không?",
        answer:
          "Có. Premium gồm Unlimited VPN theo mô tả sản phẩm hiện tại của Kaspersky. Khả năng dùng còn phụ thuộc hệ điều hành và quy định nơi bạn kết nối.",
      },
      {
        id: "faq-3",
        question: "Kaspersky Premium có Password Manager không?",
        answer:
          "Có. Premium gồm Kaspersky Password Manager và kho lưu trữ mật khẩu.",
      },
      {
        id: "faq-4",
        question: "Kaspersky Premium có chống ransomware không?",
        answer:
          "Có lớp chống ransomware trong nhóm bảo mật của Premium. Nên giữ bản sao lưu cho tài liệu quan trọng.",
      },
      {
        id: "faq-5",
        question: "Kaspersky Premium có bảo vệ danh tính không?",
        answer:
          "Có. Identity Protection là một nhóm tính năng của Premium. Phạm vi theo nền tảng và tài liệu Kaspersky đang công bố.",
      },
      {
        id: "faq-6",
        question: "Kaspersky Premium có kiểm tra rò rỉ dữ liệu không?",
        answer: "Có. Premium gồm Data Leak Checker.",
      },
      {
        id: "faq-7",
        question: "Kaspersky Premium có hỗ trợ Windows 11 không?",
        answer:
          "Có, với các bản Windows Kaspersky còn hỗ trợ cho phiên bản Premium, gồm Windows 11 khi bản đó nằm trong danh sách của hãng.",
      },
      {
        id: "faq-8",
        question: "Kaspersky Premium có hỗ trợ macOS không?",
        answer: "Có. Premium hỗ trợ macOS theo dải phiên bản Kaspersky công bố.",
      },
      {
        id: "faq-9",
        question: "Kaspersky Premium có hỗ trợ Android không?",
        answer: "Có, theo phiên bản Android Kaspersky công bố cho bản di động.",
      },
      {
        id: "faq-10",
        question: "Kaspersky Premium có hỗ trợ iPhone/iPad không?",
        answer: "Có, với các tính năng tương ứng trên iOS. Phạm vi thường hẹp hơn bản Windows.",
      },
      {
        id: "faq-11",
        question: "Kaspersky Premium có hỗ trợ Linux không?",
        answer:
          "Kaspersky liệt kê Linux trên trang sản phẩm toàn cầu. Phạm vi tính năng cần được kiểm tra theo phiên bản và khu vực.",
      },
      {
        id: "faq-12",
        question: "Kaspersky Premium 1 Device dùng được cho bao nhiêu thiết bị?",
        answer: "Gói 1 Device dùng cho 1 thiết bị theo license.",
      },
      {
        id: "faq-13",
        question: "Kaspersky Premium 5 Devices có phù hợp cho gia đình không?",
        answer:
          "Có thể, nếu gia đình có nhiều thiết bị cần bảo vệ. Nên kiểm tra cách phân bổ thiết bị của SKU trước khi mua. Gói 5 thiết bị chưa nằm trong danh sách công khai của chương trình NTS tại Việt Nam.",
      },
      {
        id: "faq-14",
        question: "Có thể chuyển Kaspersky Premium sang máy tính khác không?",
        answer:
          "Việc chuyển phụ thuộc điều khoản và trạng thái kích hoạt của license. Không phải SKU nào cũng cho chuyển không giới hạn. Hãy liên hệ KEYON trước khi chuyển.",
      },
      {
        id: "faq-15",
        question: "Kaspersky Premium có tự động gia hạn không?",
        answer:
          "Không nên mặc định. KEYON không trừ tiền tự động cho kỳ tiếp theo. Gia hạn phụ thuộc loại subscription và phương thức kích hoạt.",
      },
      {
        id: "faq-16",
        question: "Sau khi mua bao lâu nhận được license?",
        answer:
          "Thời gian giao phụ thuộc phương thức xử lý đơn và trạng thái thanh toán. KEYON gửi thông tin kích hoạt sau khi đơn và thanh toán được xác nhận.",
      },
      {
        id: "faq-17",
        question: "Tôi có thể dùng Kaspersky Premium cho nhiều hệ điều hành không?",
        answer:
          "Premium hỗ trợ nhiều nền tảng, nhưng số thiết bị tính theo license. Phạm vi tính năng có thể khác giữa Windows, macOS, Android, iOS và Linux.",
      },
      {
        id: "faq-18",
        question: "Kaspersky Premium khác Kaspersky Plus như thế nào?",
        answer:
          "Premium mở từ nhóm Security và Privacy của Plus sang Identity Protection, hỗ trợ cao cấp và các mục bảo vệ thêm. Kaspersky công bố Plus có 17 protection features và Premium có 24.",
      },
      {
        id: "faq-19",
        question: "Có nên chọn Kaspersky Premium 1, 3, 5 hay 10 thiết bị?",
        answer:
          "Chọn theo số thiết bị thực tế cần bảo vệ. Gói 1 thiết bị / 1 năm đang có trong chương trình công khai. Gói 3, 5 và 10 thiết bị cần nhà cung cấp xác nhận trước khi mua.",
      },
    ],
    usageGuideHtml,
    seoTitle: "Kaspersky Premium – License Bảo Mật 1 Năm",
    seoDescription:
      "Kaspersky Premium bảo vệ thiết bị, dữ liệu và danh tính với antivirus, VPN không giới hạn, Password Manager, Identity Protection và hỗ trợ 24/7.",
    ogImageUrl,
    focusKeyword: "Kaspersky Premium",
    seoKeywords: [
      "Kaspersky Premium 1 năm",
      "Kaspersky Premium bản quyền",
      "Kaspersky Premium license",
      "Kaspersky Premium 1 thiết bị",
      "Kaspersky Premium 3 thiết bị",
      "Kaspersky Premium 5 thiết bị",
      "Kaspersky Premium 10 thiết bị",
      "mua Kaspersky Premium",
      "phần mềm Kaspersky Premium",
      "antivirus Kaspersky Premium",
      "Kaspersky Premium VPN",
      "Kaspersky Premium Password Manager",
      "Kaspersky Premium Identity Protection",
      "Kaspersky Premium chính hãng",
    ],
    canonicalUrl: "https://keyon.vn/products/kaspersky-premium",
    ogTitle: "Kaspersky Premium – Bảo Mật, Quyền Riêng Tư & Danh Tính",
    ogDescription:
      "Kaspersky Premium kết hợp antivirus, chống ransomware, VPN không giới hạn, Password Manager, Identity Protection, tối ưu hiệu suất và hỗ trợ kỹ thuật cao cấp.",
    relatedProductIds: related.map((row) => row.id),
    platforms: ["windows", "macos", "android", "ios", "linux"],
    language: "multilingual",
    licenseChannelDefault: "SUBSCRIPTION",
    licenseTermDefault: "1_YEAR",
    seatsDefault: "1 thiết bị",
    activationMethodDefault: "SUBSCRIPTION",
    transferPolicy:
      "Khả năng chuyển Kaspersky Premium sang máy hoặc tài khoản khác phụ thuộc điều khoản và trạng thái kích hoạt của license. Không phải SKU nào cũng cho chuyển không giới hạn. Khách hàng nên liên hệ KEYON trước khi chuyển để được kiểm tra.",
    upgradePolicy:
      "Việc đổi sang gói thiết bị khác hoặc lên Premium từ gói thấp hơn phụ thuộc loại license, thời hạn còn lại và chính sách tại thời điểm thực hiện. KEYON kiểm tra tình trạng bản quyền trước khi tư vấn phương án.",
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
    const priceVnd =
      spec.priceVnd > 0 ? spec.priceVnd : current && current.priceVnd > 0 ? current.priceVnd : 0;
    const data = {
      name: spec.name,
      licenseModel: "SUBSCRIPTION" as const,
      fulfillmentStrategy: "MANUAL" as const,
      deliverableType: "SUBSCRIPTION" as const,
      salesMotion: "SELF_SERVE" as const,
      slaPromise: SLA,
      supplierId: current?.supplierId ?? null,
      priceVnd,
      compareAtPriceVnd: null,
      costVnd: current && current.costVnd > 0 ? current.costVnd : 0,
      licenseChannel: "SUBSCRIPTION",
      licenseTerm: "1_YEAR",
      seatsLabel: spec.seatsLabel,
      activationMethod: "SUBSCRIPTION",
      active: priceVnd > 0,
    };
    const saved = current
      ? await prisma.productVariant.update({
          where: { id: current.id },
          data,
          select: {
            id: true,
            sku: true,
            name: true,
            priceVnd: true,
            active: true,
            supplierId: true,
          },
        })
      : await prisma.productVariant.create({
          data: { ...data, sku: spec.sku, productId: product.id },
          select: {
            id: true,
            sku: true,
            name: true,
            priceVnd: true,
            active: true,
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
        related: related.map((row) => row.slug),
        variants: savedVariants,
        warnings: [
          "Gallery is temporary Kaspersky Plus/Standard UI. VPN and Password/Identity slots are not Premium screenshots.",
          "Only 1 Device has a price: 510000 VND, stored as the NTS market reference. Cost and supplier are unset.",
          "3, 5 and 10 Devices have no price and stay inactive. The public NTS list for 01/08/2026–30/11/2026 does not include those Premium SKUs.",
          "Deliverable is SUBSCRIPTION, activated with the code supplied on the order via My Kaspersky. No fixed key length is stored.",
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
