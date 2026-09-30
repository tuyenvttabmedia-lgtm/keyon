/**
 * Create or update Adobe Illustrator as a draft subscription product.
 * One product, one Individual / 1 Year variant. Does not publish, does not
 * create a supplier, and does not edit other products.
 *
 * npx tsx scripts/create-adobe-illustrator.ts
 */
import { prisma } from "../src/lib/db";
import { sanitizeBlogHtml } from "../src/lib/sanitize-blog-html";

const SLUG = "adobe-illustrator";
const SKU = "ADOBE-ILLUSTRATOR-IND-1Y";

const DESCRIPTION = sanitizeBlogHtml(`
<h2>Adobe Illustrator – Thiết kế vector chuyên nghiệp</h2>
<p>Adobe Illustrator là phần mềm đồ họa vector chuyên nghiệp của Adobe, được sử dụng để xây dựng logo, biểu tượng, nhận diện thương hiệu, typography, minh họa và nhiều loại thiết kế cần khả năng mở rộng mà vẫn giữ độ sắc nét.</p>
<p>Khác với công cụ chỉnh sửa ảnh raster, Illustrator làm việc chủ yếu với đồ họa vector, cho phép các đối tượng được tạo và chỉnh sửa bằng đường path, shape, màu sắc và hiệu ứng.</p>
<p>Điều này giúp Illustrator phù hợp với cả những thiết kế nhỏ như icon, logo và những sản phẩm cần kích thước lớn như poster, signage, packaging hoặc artwork phục vụ in ấn.</p>
<h2>Thiết kế logo và nhận diện thương hiệu</h2>
<p>Illustrator phù hợp cho quá trình xây dựng logo và hệ thống nhận diện thương hiệu.</p>
<p>Có thể tạo:</p>
<ul>
<li>Logo</li>
<li>Symbol</li>
<li>Icon</li>
<li>Brand mark</li>
<li>Pattern</li>
<li>Typography</li>
<li>Bộ nhận diện thương hiệu</li>
</ul>
<h2>Đồ họa vector chính xác</h2>
<p>Illustrator cung cấp hệ thống công cụ để tạo và chỉnh sửa vector với độ chính xác cao.</p>
<p>Các công cụ tiêu biểu:</p>
<ul>
<li>Pen Tool</li>
<li>Pencil Tool</li>
<li>Shape Builder</li>
<li>Pathfinder</li>
<li>Layers</li>
<li>Gradient</li>
<li>Brushes</li>
<li>Appearance</li>
<li>Effects</li>
</ul>
<h2>Typography chuyên nghiệp</h2>
<p>Illustrator cung cấp các công cụ typography dành cho thiết kế chuyên nghiệp.</p>
<p>Có thể:</p>
<ul>
<li>Tạo headline</li>
<li>Thiết kế typography</li>
<li>Điều chỉnh character và paragraph</li>
<li>Kết hợp text với vector</li>
<li>Tạo hiệu ứng chữ</li>
<li>Đưa text theo path</li>
<li>Chuyển đổi chữ thành outline khi cần</li>
</ul>
<h2>Minh họa vector</h2>
<p>Illustrator phù hợp để tạo:</p>
<ul>
<li>Character</li>
<li>Flat illustration</li>
<li>Infographic</li>
<li>Social media artwork</li>
<li>Editorial illustration</li>
<li>Icon system</li>
<li>Web graphics</li>
</ul>
<h2>Thiết kế bao bì và sản phẩm in ấn</h2>
<p>Illustrator phù hợp với:</p>
<ul>
<li>Packaging</li>
<li>Label</li>
<li>Poster</li>
<li>Brochure</li>
<li>Business card</li>
<li>Signage</li>
<li>Marketing material</li>
</ul>
<h2>Làm việc trên desktop, iPad và web</h2>
<p>Illustrator hiện được cung cấp trên:</p>
<ul>
<li>Windows</li>
<li>macOS</li>
<li>iPad</li>
<li>Web</li>
</ul>
<h2>Tích hợp hệ sinh thái Adobe</h2>
<p>Illustrator hoạt động trong hệ sinh thái Creative Cloud và có thể kết hợp với các công cụ Adobe khác tùy theo subscription.</p>
<h2>Công cụ AI hỗ trợ quy trình sáng tạo</h2>
<p>Các phiên bản Illustrator mới có các tính năng AI hỗ trợ workflow sáng tạo. Tính năng cụ thể phụ thuộc phiên bản, subscription và khu vực.</p>
<h2>Adobe Illustrator phù hợp với ai?</h2>
<ul>
<li>Graphic Designer</li>
<li>Brand Designer</li>
<li>Visual Designer</li>
<li>Illustrator</li>
<li>Marketing Designer</li>
<li>Freelancer</li>
<li>Agency</li>
<li>Doanh nghiệp</li>
<li>Sinh viên thiết kế</li>
<li>Content Creator</li>
</ul>
<h2>Lưu ý trước khi mua</h2>
<p>Adobe Illustrator hiện được cung cấp dưới dạng subscription, không phải license vĩnh viễn.</p>
<p>Gói hiện tại: Adobe Illustrator – Individual – 1 Year.</p>
<p>Subscription được kích hoạt hoặc gán theo Adobe Account và điều kiện của SKU.</p>
`);

const USAGE_GUIDE = sanitizeBlogHtml(`
<h2>Hướng dẫn kích hoạt Adobe Illustrator</h2>
<h3>Bước 1 – Chuẩn bị Adobe Account</h3>
<p>Đăng nhập hoặc tạo tài khoản Adobe chính chủ.</p>
<h3>Bước 2 – Nhận thông tin bản quyền</h3>
<p>Sau khi KEYON hoàn tất đơn hàng, khách hàng nhận thông tin activation hoặc subscription theo SKU.</p>
<h3>Bước 3 – Kích hoạt subscription</h3>
<p>Thực hiện redemption hoặc activation theo hướng dẫn KEYON.</p>
<h3>Bước 4 – Cài Creative Cloud</h3>
<p>Cài Adobe Creative Cloud Desktop App.</p>
<h3>Bước 5 – Cài Illustrator</h3>
<p>Đăng nhập Adobe Account và chọn Illustrator, rồi chọn Install.</p>
<h3>Bước 6 – Bắt đầu sử dụng</h3>
<p>Mở Illustrator và bắt đầu thiết kế.</p>
`);

const FEATURES = [
  "Thiết kế đồ họa vector chuyên nghiệp",
  "Thiết kế logo và nhận diện thương hiệu",
  "Tạo icon và biểu tượng",
  "Typography chuyên nghiệp",
  "Pen Tool",
  "Pencil Tool",
  "Shape Builder",
  "Pathfinder",
  "Vector illustration",
  "Thiết kế packaging",
  "Poster và marketing materials",
  "Artboard linh hoạt",
  "Gradient và effects",
  "Desktop",
  "iPad",
  "Web",
  "Creative Cloud integration",
  "Adobe Express Premium theo gói hiện hành",
  "100 GB cloud storage theo gói hiện hành",
  "AI creative features theo phiên bản hiện hành",
];

const SPECS = [
  { group: "general", label: "Thương hiệu", value: "Adobe" },
  { group: "general", label: "Sản phẩm", value: "Adobe Illustrator" },
  { group: "general", label: "Loại", value: "Creative Software" },
  { group: "general", label: "Mô hình", value: "Subscription" },
  { group: "general", label: "Thời hạn", value: "1 năm" },
  { group: "general", label: "License", value: "Individual" },
  { group: "general", label: "Nền tảng", value: "Windows / macOS / iPad / Web" },
  { group: "general", label: "Tài khoản", value: "Adobe Account" },
  { group: "general", label: "Kích hoạt", value: "Subscription Activation / Redemption" },
  { group: "general", label: "Hình thức giao hàng", value: "Digital" },
  { group: "general", label: "Cloud storage", value: "100 GB theo gói hiện hành" },
  {
    group: "system",
    label: "Hệ điều hành Windows",
    value: "Windows 11 v24H2, v23H2; Windows 10 v22H2, v21H2 LTSC",
  },
  {
    group: "system",
    label: "CPU",
    value:
      "Intel 64-bit đa nhân, SSE 4.2 trở lên, hoặc AMD Athlon 64 SSE 4.2 trở lên",
  },
  {
    group: "system",
    label: "RAM",
    value: "Tối thiểu 8 GB. Khuyến nghị 16 GB.",
  },
  {
    group: "system",
    label: "Ổ đĩa",
    value: "Windows tối thiểu 2 GB trống. macOS tối thiểu 3 GB trống. Khuyến nghị SSD.",
  },
  {
    group: "system",
    label: "GPU",
    value:
      "Windows: tối thiểu 1 GB VRAM, khuyến nghị 4 GB, DirectX 12 hoặc OpenGL 4.0 trở lên. macOS: tối thiểu 1 GB VRAM, khuyến nghị 2 GB, cần Metal để dùng GPU tốt nhất.",
  },
  {
    group: "system",
    label: "Hệ điều hành macOS",
    value: "macOS 26 Tahoe, macOS 15 Sequoia, macOS 14 Sonoma, macOS 13 Ventura",
  },
  {
    group: "system",
    label: "Màn hình",
    value: "Tối thiểu 1024 × 768. Khuyến nghị 1920 × 1080.",
  },
  {
    group: "system",
    label: "Internet",
    value:
      "Cần kết nối Internet để kích hoạt, xác thực subscription và dùng dịch vụ trực tuyến.",
  },
];

const FAQS = [
  {
    id: "faq-1",
    question: "Adobe Illustrator là gì?",
    answer:
      "Adobe Illustrator là phần mềm thiết kế đồ họa vector chuyên nghiệp của Adobe, được sử dụng để tạo logo, icon, typography, illustration và nhiều loại artwork khác.",
  },
  {
    id: "faq-2",
    question: "Adobe Illustrator có phải bản quyền vĩnh viễn không?",
    answer: "Không. Illustrator hiện được cung cấp theo mô hình subscription.",
  },
  {
    id: "faq-3",
    question: "Gói này có thời hạn bao lâu?",
    answer: "1 năm.",
  },
  {
    id: "faq-4",
    question: "Illustrator hỗ trợ Windows và macOS không?",
    answer: "Có, theo yêu cầu hệ thống của từng phiên bản.",
  },
  {
    id: "faq-5",
    question: "Illustrator có dùng được trên iPad không?",
    answer: "Có.",
  },
  {
    id: "faq-6",
    question: "Tôi có cần Adobe Account không?",
    answer: "Có. Subscription được quản lý thông qua Adobe Account.",
  },
  {
    id: "faq-7",
    question: "Illustrator có phù hợp để thiết kế logo không?",
    answer: "Có. Đây là một trong những trường hợp sử dụng phổ biến của Illustrator.",
  },
  {
    id: "faq-8",
    question: "Illustrator có thiết kế poster và banner được không?",
    answer: "Có.",
  },
  {
    id: "faq-9",
    question: "Illustrator có hỗ trợ AI không?",
    answer:
      "Các phiên bản mới có các tính năng AI hỗ trợ workflow sáng tạo. Tính năng cụ thể phụ thuộc phiên bản và subscription.",
  },
  {
    id: "faq-10",
    question: "Máy cần bao nhiêu RAM?",
    answer:
      "Adobe hiện yêu cầu tối thiểu 8 GB RAM và khuyến nghị 16 GB RAM cho Illustrator 30.0 trở lên.",
  },
];

const PRODUCT = {
  name: "Adobe Illustrator",
  slug: SLUG,
  description: DESCRIPTION,
  shortDescription:
    "Adobe Illustrator là phần mềm đồ họa vector chuyên nghiệp dành cho thiết kế logo, nhận diện thương hiệu, icon, typography, minh họa và các ấn phẩm cần khả năng mở rộng chính xác.",
  categoryKey: "adobe",
  offeringProfile: "SOFTWARE",
  badgeLabel: "Bán chạy",
  features: FEATURES,
  specs: SPECS,
  faqs: FAQS,
  usageGuideHtml: USAGE_GUIDE,
  seoTitle: "Adobe Illustrator Bản Quyền 1 Năm | KEYON",
  seoDescription:
    "Adobe Illustrator bản quyền 1 năm cho thiết kế vector, logo, icon, typography và minh họa chuyên nghiệp. Kích hoạt trên tài khoản Adobe.",
  ogImageUrl: null,
  focusKeyword: "Adobe Illustrator",
  seoKeywords: [
    "Adobe Illustrator",
    "Adobe Illustrator bản quyền",
    "mua Adobe Illustrator",
    "Adobe Illustrator 1 năm",
    "Adobe Illustrator chính hãng",
    "phần mềm Adobe Illustrator",
    "Adobe Illustrator bản quyền 1 năm",
    "phần mềm thiết kế vector",
    "phần mềm thiết kế logo",
    "phần mềm thiết kế đồ họa",
    "Illustrator bản quyền",
    "Adobe Creative Cloud Illustrator",
  ],
  canonicalUrl: "https://keyon.vn/products/adobe-illustrator",
  ogTitle: "Adobe Illustrator – Bản Quyền 1 Năm",
  ogDescription:
    "Adobe Illustrator bản quyền 1 năm. Thiết kế logo, vector, typography và minh họa chuyên nghiệp trên Windows, macOS, iPad và web.",
  platforms: ["windows", "macos", "ios", "web"],
  licenseChannelDefault: "SUBSCRIPTION",
  licenseTermDefault: "1_YEAR",
  seatsDefault: "Individual",
  activationMethodDefault: "SUBSCRIPTION",
  transferPolicy:
    "Subscription được cấp cho tài khoản Adobe theo SKU và điều kiện của nhà cung cấp. Không chuyển nhượng subscription sau khi đã kích hoạt hoặc gán vào tài khoản, trừ trường hợp Adobe hoặc nhà cung cấp cho phép.",
  upgradePolicy:
    "Subscription được duy trì và gia hạn theo thời hạn của gói. Việc nâng cấp sang Creative Cloud hoặc thay đổi loại subscription thực hiện theo chính sách và điều kiện hiện hành của Adobe.",
  accountRequired: "Tài khoản Adobe",
};

const VARIANT = {
  sku: SKU,
  name: "Adobe Illustrator – Individual – 1 Year",
  licenseModel: "SUBSCRIPTION" as const,
  fulfillmentStrategy: "MANUAL" as const,
  deliverableType: "SUBSCRIPTION" as const,
  salesMotion: "SELF_SERVE" as const,
  slaPromise:
    "KEYON xử lý và kích hoạt/cung cấp thông tin bản quyền trong SLA sau khi thanh toán thành công.",
  priceVnd: 6_490_000,
  compareAtPriceVnd: 6_990_000,
  costVnd: 0,
  licenseChannel: "SUBSCRIPTION",
  licenseTerm: "1_YEAR",
  seatsLabel: "Individual",
  regionCode: null,
  activationMethod: "SUBSCRIPTION",
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

function httpsUrls(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (item): item is string => typeof item === "string" && item.startsWith("https://"),
  );
}

async function main() {
  assertNoPlaceholders({ PRODUCT, VARIANT, DESCRIPTION, USAGE_GUIDE });

  const [slugOwner, skuOwner, brandHit, suppliers, linux] = await Promise.all([
    prisma.product.findUnique({
      where: { slug: SLUG },
      select: { id: true, slug: true, name: true, active: true, galleryUrls: true },
    }),
    prisma.productVariant.findUnique({
      where: { sku: SKU },
      select: { id: true, productId: true, sku: true },
    }),
    prisma.brand.findFirst({
      where: {
        OR: [
          { slug: "adobe" },
          { name: { equals: "Adobe", mode: "insensitive" } },
        ],
      },
      select: { id: true, name: true, slug: true },
    }),
    prisma.supplier.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.product.findUnique({
      where: { slug: "cloud-server" },
      select: { galleryUrls: true },
    }),
  ]);

  if (slugOwner && slugOwner.name !== "Adobe Illustrator") {
    throw new Error(`Slug ${SLUG} belongs to ${slugOwner.name}`);
  }
  if (skuOwner && slugOwner && skuOwner.productId !== slugOwner.id) {
    throw new Error(`SKU ${SKU} belongs to another product`);
  }
  if (skuOwner && !slugOwner) {
    throw new Error(`SKU ${SKU} already exists on product ${skuOwner.productId}`);
  }

  const brand =
    brandHit ??
    (await prisma.brand.create({
      data: { name: "Adobe", slug: "adobe", active: true },
      select: { id: true, name: true, slug: true },
    }));

  const pax8 =
    suppliers.find((row) => row.name.trim().toLowerCase() === "pax8") ??
    suppliers.find((row) => /pax8/i.test(row.name));

  const existingGallery = httpsUrls(slugOwner?.galleryUrls);
  const linuxImage = httpsUrls(linux?.galleryUrls)[0] ?? null;
  const galleryUrls = existingGallery.length
    ? existingGallery
    : linuxImage
      ? [linuxImage]
      : [];

  const product = slugOwner
    ? await prisma.product.update({
        where: { id: slugOwner.id },
        data: {
          ...PRODUCT,
          brandId: brand.id,
          galleryUrls,
          active: slugOwner.active,
        },
        select: { id: true, slug: true, active: true },
      })
    : await prisma.product.create({
        data: {
          ...PRODUCT,
          brandId: brand.id,
          galleryUrls,
          active: false,
        },
        select: { id: true, slug: true, active: true },
      });

  const variant = skuOwner
    ? await prisma.productVariant.update({
        where: { id: skuOwner.id },
        data: { ...VARIANT, supplierId: pax8?.id ?? null },
        select: { id: true, sku: true, productId: true, supplierId: true },
      })
    : await prisma.productVariant.create({
        data: {
          ...VARIANT,
          supplierId: pax8?.id ?? null,
          productId: product.id,
        },
        select: { id: true, sku: true, productId: true, supplierId: true },
      });

  const [slugCount, skuCount] = await Promise.all([
    prisma.product.count({ where: { slug: SLUG } }),
    prisma.productVariant.count({ where: { sku: SKU } }),
  ]);
  if (slugCount !== 1 || skuCount !== 1 || variant.productId !== product.id) {
    throw new Error("Slug, SKU, or product-variant link is not unique");
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
        galleryCount: galleryUrls.length,
        temporaryImage: !existingGallery.length && Boolean(linuxImage),
        ogImageUrl: null,
        seatsLabel: VARIANT.seatsLabel,
        activationMethod: VARIANT.activationMethod,
        deliverableType: VARIANT.deliverableType,
        regionCode: VARIANT.regionCode,
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
