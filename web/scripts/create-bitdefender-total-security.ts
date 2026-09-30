/**
 * Create or update Bitdefender Total Security as a draft catalog product.
 * One product, one subscription variant. Does not publish, does not invent
 * media URLs, and does not create a supplier.
 *
 * npx tsx scripts/create-bitdefender-total-security.ts
 */
import { prisma } from "../src/lib/db";
import { sanitizeBlogHtml } from "../src/lib/sanitize-blog-html";

const SLUG = "bitdefender-total-security";
const SKU = "BDF-TS-5D-1Y";

const DESCRIPTION = sanitizeBlogHtml(`
<p>Bitdefender Total Security là giải pháp bảo mật đa nền tảng giúp bảo vệ máy tính, Mac, smartphone và tablet trước các mối đe dọa trực tuyến như virus, ransomware, spyware, phishing và nhiều hình thức tấn công mạng khác.</p>
<p>Với gói 5 thiết bị trong 1 năm, người dùng có thể sử dụng một subscription để bảo vệ nhiều thiết bị cá nhân hoặc thiết bị trong gia đình trên Windows, macOS, Android và iOS.</p>
<p>Bitdefender Total Security kết hợp nhiều lớp bảo vệ, phát hiện hành vi đáng ngờ theo thời gian thực và các công cụ bảo vệ quyền riêng tư, giúp người dùng sử dụng Internet an toàn hơn.</p>
<h2>Bảo vệ thời gian thực trước mã độc</h2>
<p>Bitdefender Total Security liên tục theo dõi hoạt động trên thiết bị để phát hiện và ngăn chặn virus, worm, Trojan, ransomware, spyware và các loại mã độc khác.</p>
<h2>Advanced Threat Defense</h2>
<p>Công nghệ Advanced Threat Defense theo dõi hành vi của các ứng dụng đang hoạt động để phát hiện hoạt động bất thường và xử lý nguy cơ trước khi mã độc gây ảnh hưởng đến thiết bị.</p>
<h2>Network Threat Prevention</h2>
<p>Bitdefender có khả năng phân tích hoạt động mạng và nhận diện các dấu hiệu nguy hiểm, bao gồm URL liên quan đến malware, botnet hoặc các cuộc tấn công khai thác lỗ hổng.</p>
<h2>Bảo vệ ransomware nhiều lớp</h2>
<p>Bitdefender Total Security cung cấp nhiều lớp bảo vệ nhằm phát hiện và ngăn chặn hành vi đáng ngờ liên quan đến ransomware.</p>
<h2>Bảo vệ đa nền tảng</h2>
<ul>
<li>Windows</li>
<li>macOS</li>
<li>Android</li>
<li>iOS</li>
</ul>
<h2>Bảo vệ quyền riêng tư</h2>
<p>Total Security cung cấp các công cụ hỗ trợ bảo vệ hoạt động trực tuyến và dữ liệu cá nhân như Web Protection, Anti-Phishing, VPN và các tính năng bảo vệ quyền riêng tư theo subscription hiện hành.</p>
<h2>Device Optimizer</h2>
<p>Tích hợp các công cụ hỗ trợ tối ưu thiết bị và theo dõi một số vấn đề liên quan đến hiệu suất hệ thống.</p>
<h2>Phù hợp với ai?</h2>
<ul>
<li>Cá nhân sử dụng nhiều thiết bị.</li>
<li>Gia đình có máy tính và smartphone.</li>
<li>Người dùng Windows cần lớp bảo vệ nâng cao.</li>
<li>Người dùng thường xuyên làm việc và giao dịch trực tuyến.</li>
<li>Người dùng muốn quản lý bảo mật nhiều thiết bị từ một tài khoản.</li>
</ul>
<h2>Lưu ý trước khi mua</h2>
<p>Đây là bản quyền phần mềm dạng thuê bao, không phải giấy phép vĩnh viễn.</p>
<p>Gói hiện tại: 5 thiết bị – 1 năm.</p>
<p>Thiết bị phải đáp ứng yêu cầu hệ thống của Bitdefender.</p>
`);

const USAGE_GUIDE = sanitizeBlogHtml(`
<h2>Hướng dẫn kích hoạt Bitdefender Total Security</h2>
<h3>Bước 1 – Chuẩn bị tài khoản Bitdefender</h3>
<p>Truy cập Bitdefender Central và đăng nhập tài khoản. Nếu chưa có tài khoản, tạo tài khoản Bitdefender mới.</p>
<h3>Bước 2 – Mở My Subscriptions</h3>
<p>Chọn My Subscriptions, rồi chọn Activate with code.</p>
<h3>Bước 3 – Nhập activation code</h3>
<p>Nhập mã bản quyền Bitdefender Total Security do KEYON cung cấp.</p>
<h3>Bước 4 – Kích hoạt</h3>
<p>Nhấn Activate để thêm subscription vào tài khoản.</p>
<h3>Bước 5 – Cài đặt</h3>
<p>Sau khi kích hoạt thành công, chọn thiết bị cần bảo vệ và cài đặt Bitdefender.</p>
<h3>Lưu ý</h3>
<p>Kiểm tra hệ điều hành và cấu hình trước khi cài đặt. Không nên cài đồng thời nhiều phần mềm antivirus có chức năng bảo vệ thời gian thực nếu gây xung đột.</p>
`);

const FEATURES = [
  "Bảo vệ thời gian thực trước virus và malware",
  "Bảo vệ nhiều lớp chống ransomware",
  "Advanced Threat Defense",
  "Network Threat Prevention",
  "Bảo vệ chống phishing",
  "Cryptomining Protection",
  "Device Optimizer",
  "Privacy Protection",
  "VPN",
  "Anti-Theft",
  "Parental Control",
  "Bảo vệ đa nền tảng",
  "Windows",
  "macOS",
  "Android",
  "iOS",
  "Quản lý subscription qua Bitdefender Central",
];

const SPECS = [
  { group: "general", label: "Thương hiệu", value: "Bitdefender" },
  { group: "general", label: "Sản phẩm", value: "Total Security" },
  { group: "general", label: "Loại", value: "Security Software" },
  { group: "general", label: "Mô hình", value: "Subscription" },
  { group: "general", label: "Thời hạn", value: "1 năm" },
  { group: "general", label: "Số thiết bị", value: "5 thiết bị" },
  { group: "general", label: "Nền tảng", value: "Windows / macOS / Android / iOS" },
  { group: "general", label: "Kích hoạt", value: "Activation Code" },
  { group: "general", label: "Tài khoản", value: "Bitdefender Central" },
  { group: "general", label: "Khu vực", value: "Việt Nam" },
  { group: "general", label: "Hình thức giao hàng", value: "Digital Delivery" },
  { group: "system", label: "Hệ điều hành Windows", value: "Windows 7 SP1, Windows 8.1, Windows 10, Windows 11" },
  { group: "system", label: "RAM", value: "2 GB (Windows)" },
  { group: "system", label: "Ổ đĩa Windows", value: "2.5 GB trống" },
  { group: "system", label: "Hệ điều hành macOS", value: "macOS Big Sur 11.3 hoặc mới hơn" },
  { group: "system", label: "Ổ đĩa macOS", value: "1 GB trống" },
  { group: "system", label: "Hệ điều hành Android", value: "Android 7.0 hoặc mới hơn" },
  { group: "system", label: "Hệ điều hành iOS", value: "iOS 14 hoặc mới hơn" },
  { group: "system", label: "Kết nối", value: "Cần kết nối Internet để kích hoạt, cập nhật và dùng dịch vụ trực tuyến" },
];

const FAQS = [
  {
    id: "faq-1",
    question: "Bitdefender Total Security là gì?",
    answer:
      "Bitdefender Total Security là giải pháp bảo mật đa nền tảng giúp bảo vệ thiết bị trước virus, malware, ransomware, phishing và các mối đe dọa trực tuyến.",
  },
  {
    id: "faq-2",
    question: "Gói Bitdefender Total Security này dùng được bao nhiêu thiết bị?",
    answer: "Gói này hỗ trợ tối đa 5 thiết bị trong thời hạn 1 năm.",
  },
  {
    id: "faq-3",
    question: "Bitdefender Total Security hỗ trợ hệ điều hành nào?",
    answer: "Windows, macOS, Android và iOS.",
  },
  {
    id: "faq-4",
    question: "Tôi cần tài khoản Bitdefender để kích hoạt không?",
    answer: "Có. Activation code được thêm vào tài khoản Bitdefender Central.",
  },
  {
    id: "faq-5",
    question: "Tôi nhận sản phẩm như thế nào?",
    answer:
      "KEYON cung cấp mã kích hoạt kỹ thuật số theo đơn hàng sau khi thanh toán và xử lý thành công.",
  },
  {
    id: "faq-6",
    question: "Tôi có thể cài Bitdefender trên nhiều thiết bị không?",
    answer: "Có, trong phạm vi số lượng thiết bị mà subscription cho phép.",
  },
  {
    id: "faq-7",
    question: "Bitdefender Total Security có phải bản quyền vĩnh viễn không?",
    answer: "Không. Đây là subscription có thời hạn. Gói này có thời hạn 1 năm.",
  },
  {
    id: "faq-8",
    question: "Có thể dùng Bitdefender trên cả máy tính và điện thoại không?",
    answer: "Có. Total Security hỗ trợ Windows, macOS, Android và iOS.",
  },
  {
    id: "faq-9",
    question: "Bitdefender có VPN không?",
    answer:
      "Total Security có tính năng VPN theo phạm vi subscription và nền tảng sử dụng. Dung lượng và tính năng VPN có thể phụ thuộc vào subscription hiện hành.",
  },
  {
    id: "faq-10",
    question: "Cấu hình máy tối thiểu để chạy Bitdefender là bao nhiêu?",
    answer:
      "Trên Windows, Bitdefender hiện công bố tối thiểu 2 GB RAM và 2.5 GB dung lượng ổ đĩa trống. Các nền tảng khác có yêu cầu riêng.",
  },
];

const PRODUCT = {
  name: "Bitdefender Total Security",
  slug: SLUG,
  description: DESCRIPTION,
  shortDescription:
    "Bảo vệ toàn diện cho PC, Mac, smartphone và tablet với Bitdefender Total Security – giải pháp bảo mật đa nền tảng cho cá nhân và gia đình.",
  categoryKey: "security",
  offeringProfile: "SOFTWARE",
  badgeLabel: "Bán chạy",
  galleryUrls: [] as string[],
  features: FEATURES,
  specs: SPECS,
  faqs: FAQS,
  usageGuideHtml: USAGE_GUIDE,
  seoTitle: "Bitdefender Total Security 5 Thiết Bị 1 Năm | KEYON",
  seoDescription:
    "Bitdefender Total Security 5 thiết bị 1 năm. Bảo vệ Windows, macOS, Android và iOS với bản quyền chính hãng, kích hoạt bằng mã.",
  ogImageUrl: null,
  focusKeyword: "Bitdefender Total Security",
  seoKeywords: [
    "Bitdefender Total Security",
    "Bitdefender Total Security 5 thiết bị",
    "Bitdefender 5 thiết bị 1 năm",
    "mua Bitdefender Total Security",
    "Bitdefender bản quyền",
    "phần mềm diệt virus Bitdefender",
    "Bitdefender antivirus",
    "Bitdefender bản quyền 1 năm",
    "Bitdefender Windows",
    "Bitdefender macOS",
    "Bitdefender Android",
    "Bitdefender iOS",
  ],
  canonicalUrl: "https://keyon.vn/products/bitdefender-total-security",
  ogTitle: "Bitdefender Total Security – 5 Thiết Bị / 1 Năm",
  ogDescription:
    "Bảo vệ Windows, macOS, Android và iOS với Bitdefender Total Security. Bản quyền 5 thiết bị trong 1 năm, kích hoạt bằng mã.",
  platforms: ["windows", "macos", "android", "ios"],
  licenseChannelDefault: "SUBSCRIPTION",
  licenseTermDefault: "1_YEAR",
  seatsDefault: "5 thiết bị",
  activationMethodDefault: "PRODUCT_KEY",
  transferPolicy:
    "Không chuyển nhượng sau khi mã đã được kích hoạt. Mã chưa kích hoạt chỉ được chuyển giao theo chính sách của KEYON và nhà cung cấp.",
  upgradePolicy:
    "Gia hạn theo thời hạn sản phẩm và điều kiện của Bitdefender. Không tự động gia hạn nếu KEYON chỉ cung cấp activation code một lần.",
  accountRequired: "Tài khoản Bitdefender Central",
  active: false,
};

const VARIANT = {
  sku: SKU,
  name: "5 Devices – 1 Year",
  licenseModel: "SUBSCRIPTION" as const,
  fulfillmentStrategy: "MANUAL" as const,
  deliverableType: "KEY" as const,
  salesMotion: "SELF_SERVE" as const,
  slaPromise:
    "KEYON xử lý và gửi mã kích hoạt trong SLA sau khi thanh toán thành công.",
  priceVnd: 499_000,
  compareAtPriceVnd: 599_000,
  costVnd: 0,
  licenseChannel: "SUBSCRIPTION",
  licenseTerm: "1_YEAR",
  seatsLabel: "5 thiết bị",
  regionCode: "VN",
  activationMethod: "PRODUCT_KEY",
  active: true,
};

function assertNoPlaceholders(value: unknown, path = "root") {
  if (typeof value === "string") {
    if (/lorem ipsum|\bTODO\b|—/i.test(value)) {
      throw new Error(`Placeholder in ${path}`);
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoPlaceholders(item, `${path}[${index}]`));
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      assertNoPlaceholders(item, `${path}.${key}`);
    }
  }
}

async function main() {
  assertNoPlaceholders({ PRODUCT, VARIANT, DESCRIPTION, USAGE_GUIDE });

  const [slugOwner, skuOwner, brandHit, suppliers] = await Promise.all([
    prisma.product.findUnique({
      where: { slug: SLUG },
      select: { id: true, slug: true },
    }),
    prisma.productVariant.findUnique({
      where: { sku: SKU },
      select: { id: true, productId: true, sku: true },
    }),
    prisma.brand.findFirst({
      where: {
        OR: [
          { slug: "bitdefender" },
          { name: { equals: "Bitdefender", mode: "insensitive" } },
        ],
      },
      select: { id: true, name: true, slug: true },
    }),
    prisma.supplier.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (skuOwner && slugOwner && skuOwner.productId !== slugOwner.id) {
    throw new Error(`SKU ${SKU} belongs to another product`);
  }
  if (skuOwner && !slugOwner) {
    throw new Error(`SKU ${SKU} already exists on product ${skuOwner.productId}`);
  }

  const brand =
    brandHit ??
    (await prisma.brand.create({
      data: {
        name: "Bitdefender",
        slug: "bitdefender",
        active: true,
      },
      select: { id: true, name: true, slug: true },
    }));

  const pax8 =
    suppliers.find((row) => row.name.trim().toLowerCase() === "pax8") ??
    suppliers.find((row) => /pax8/i.test(row.name));

  const variantData = {
    ...VARIANT,
    supplierId: pax8?.id ?? null,
  };

  const product = slugOwner
    ? await prisma.product.update({
        where: { id: slugOwner.id },
        data: {
          ...PRODUCT,
          brandId: brand.id,
        },
        select: { id: true, slug: true, active: true },
      })
    : await prisma.product.create({
        data: {
          ...PRODUCT,
          brandId: brand.id,
        },
        select: { id: true, slug: true, active: true },
      });

  const variant = skuOwner
    ? await prisma.productVariant.update({
        where: { id: skuOwner.id },
        data: variantData,
        select: { id: true, sku: true, productId: true, supplierId: true },
      })
    : await prisma.productVariant.create({
        data: {
          ...variantData,
          productId: product.id,
        },
        select: { id: true, sku: true, productId: true, supplierId: true },
      });

  const [slugCount, skuCount, linked] = await Promise.all([
    prisma.product.count({ where: { slug: SLUG } }),
    prisma.productVariant.count({ where: { sku: SKU } }),
    prisma.product.findUnique({
      where: { id: product.id },
      select: {
        id: true,
        active: true,
        seoTitle: true,
        seoDescription: true,
        focusKeyword: true,
        canonicalUrl: true,
        ogTitle: true,
        ogImageUrl: true,
        galleryUrls: true,
        variants: {
          where: { sku: SKU },
          select: { id: true, sku: true, productId: true },
        },
      },
    }),
  ]);

  if (slugCount !== 1 || skuCount !== 1 || linked?.variants.length !== 1) {
    throw new Error("Slug, SKU, or product-variant link is not unique");
  }
  if (variant.productId !== product.id) {
    throw new Error("Variant is not linked to this product");
  }

  console.log(
    JSON.stringify(
      {
        productId: product.id,
        variantId: variant.id,
        sku: variant.sku,
        slug: product.slug,
        active: product.active,
        brandId: brand.id,
        brandCreated: !brandHit,
        supplierId: variant.supplierId,
        supplierName: pax8?.name ?? null,
        galleryCount: Array.isArray(linked?.galleryUrls) ? linked.galleryUrls.length : 0,
        seoTitle: linked?.seoTitle,
        canonicalUrl: linked?.canonicalUrl,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
