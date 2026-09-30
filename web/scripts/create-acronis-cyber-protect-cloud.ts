/**
 * Create or update Acronis Cyber Protect Cloud as one infrastructure product
 * with four KEYON commercial packages. Prices are KEYON list prices.
 * Does not write a Pax8 cost, an upstream product id, or any other product.
 *
 * npx tsx scripts/create-acronis-cyber-protect-cloud.ts
 */
import { prisma } from "../src/lib/db";
import { sanitizeBlogHtml } from "../src/lib/sanitize-blog-html";

const SLUG = "acronis-cyber-protect-cloud";

const DESCRIPTION = sanitizeBlogHtml(`
<h2>Acronis Cyber Protect Cloud là gì?</h2>
<p>Acronis Cyber Protect Cloud là nền tảng backup và bảo vệ dữ liệu cho workstation, server và VM. Dịch vụ trên KEYON được đóng thành các gói tháng, gồm sao lưu, khôi phục và quản lý tập trung theo phạm vi của từng gói.</p>
<p>Starter, Business, Professional và Enterprise là tên gói thương mại của KEYON. Đây không phải tên SKU chính thức của Acronis hay Pax8.</p>
<h2>Bảo vệ dữ liệu toàn diện cho doanh nghiệp</h2>
<p>Mỗi gói xác định workload được bảo vệ và dung lượng backup storage. Workstation, VM và server được tách theo gói, để phạm vi sử dụng rõ trước khi đăng ký.</p>
<p>KEYON xử lý đơn thủ công sau khi thanh toán được xác nhận, rồi gửi thông tin subscription theo gói đã chọn.</p>
<h2>Các tính năng nổi bật</h2>
<p>Các gói đều gồm full image backup, quản lý tập trung và encryption. Incremental backup, cloud restore, bare-metal recovery, monitoring, reporting và hỗ trợ ưu tiên chỉ có ở những gói đã ghi nhận tính năng đó.</p>
<h2>Các gói dịch vụ</h2>
<ul>
<li>Starter: 1 workstation, 100 GB backup storage.</li>
<li>Business: 1 workstation hoặc VM, 250 GB backup storage.</li>
<li>Professional: 1 server hoặc VM, 500 GB backup storage.</li>
<li>Enterprise: nhiều workload, backup storage từ 1 TB.</li>
</ul>
<h2>Ai nên sử dụng Acronis Cyber Protect Cloud?</h2>
<p>Starter phù hợp cá nhân chuyên nghiệp, freelancer, startup và máy tính văn phòng. Business phù hợp doanh nghiệp nhỏ, văn phòng, agency và SMB. Professional phù hợp VPS, dedicated server, web server, application server, database server và SMB. Enterprise phù hợp doanh nghiệp vừa và lớn, nhiều server, hạ tầng virtualization, công ty có IT riêng và MSP hoặc IT service.</p>
<h2>Quy trình đăng ký và kích hoạt</h2>
<p>Chọn gói tháng, thanh toán trên KEYON, nhận thông tin subscription sau khi KEYON xử lý đơn, rồi kích hoạt theo hướng dẫn kèm đơn. Thời điểm bắt đầu sao lưu phụ thuộc việc hoàn tất kích hoạt và workload đã chọn.</p>
`);

const USAGE_GUIDE = sanitizeBlogHtml(`
<h2>Chọn gói</h2>
<p>Chọn Starter, Business, Professional hoặc Enterprise. Mỗi gói là một subscription tháng.</p>
<h2>Thanh toán</h2>
<p>Thanh toán đơn trên KEYON. Giá hiển thị là giá bán của KEYON cho một tháng.</p>
<h2>KEYON xử lý đơn</h2>
<p>KEYON tiếp nhận và xử lý thủ công sau khi thanh toán được xác nhận.</p>
<h2>Nhận thông tin subscription</h2>
<p>Thông tin kích hoạt được gửi theo gói đã mua. KEYON không gửi product key cho dịch vụ này.</p>
<h2>Kích hoạt và bắt đầu sao lưu</h2>
<p>Làm theo hướng dẫn kèm đơn để kích hoạt subscription, rồi thiết lập backup cho workload trong phạm vi gói.</p>
`);

const FEATURES = [
  "Full Image Backup|Sao lưu image cho workload trong gói đã chọn.",
  "Centralized Management|Quản lý tập trung các tác vụ backup của gói.",
  "Encryption|Mã hóa dữ liệu backup theo gói đã chọn.",
];

const SPECS = [
  { group: "general", label: "Thương hiệu", value: "Acronis" },
  { group: "general", label: "Sản phẩm", value: "Acronis Cyber Protect Cloud" },
  { group: "general", label: "Danh mục", value: "Backup & Storage" },
  { group: "general", label: "Loại", value: "Cloud Service / Subscription" },
  { group: "general", label: "Mô hình", value: "Monthly Subscription" },
  { group: "general", label: "License", value: "Subscription" },
  { group: "general", label: "Fulfillment", value: "KEYON xử lý thủ công" },
  { group: "general", label: "Nhà cung cấp", value: "Pax8 / Acronis" },
];

const FAQS = [
  {
    id: "acronis-cpc-la-gi",
    question: "Acronis Cyber Protect Cloud trên KEYON là gì?",
    answer:
      "Đây là dịch vụ backup và bảo vệ dữ liệu theo tháng cho workstation, server và VM. Bốn gói Starter, Business, Professional và Enterprise là gói thương mại của KEYON.",
  },
  {
    id: "acronis-cpc-khac-nhau",
    question: "Bốn gói khác nhau ở điểm nào?",
    answer:
      "Mỗi gói khác workload, dung lượng backup storage và nhóm tính năng được liệt kê trên trang. Professional là gói cho 1 server hoặc VM với 500 GB backup storage.",
  },
  {
    id: "acronis-cpc-gia",
    question: "Giá trên trang là giá vốn nhà cung cấp?",
    answer:
      "Không. Giá hiển thị là giá bán đề xuất hiện tại của KEYON cho một tháng. KEYON không công bố giá vốn Pax8 trên trang này.",
  },
  {
    id: "acronis-cpc-kich-hoat",
    question: "Sau khi thanh toán thì nhận gì?",
    answer:
      "KEYON xử lý đơn thủ công rồi gửi thông tin subscription. Khách kích hoạt theo hướng dẫn kèm đơn.",
  },
  {
    id: "acronis-cpc-ten-goi",
    question: "Starter, Business, Professional và Enterprise có phải SKU của Acronis?",
    answer:
      "Không. Đó là tên gói thương mại của KEYON. Mã sản phẩm phía Pax8 và Acronis được gắn sau, khi có mã chính thức.",
  },
];

const PRODUCT = {
  name: "Acronis Cyber Protect Cloud",
  slug: SLUG,
  description: DESCRIPTION,
  shortDescription: "Backup & Protection cho Workstation, Server và VM",
  categoryKey: "backup",
  offeringProfile: "INFRASTRUCTURE",
  badgeLabel: null as string | null,
  features: FEATURES,
  specs: SPECS,
  faqs: FAQS,
  usageGuideHtml: USAGE_GUIDE,
  seoTitle: "Acronis Cyber Protect Cloud | Backup & Bảo vệ dữ liệu",
  seoDescription:
    "Acronis Cyber Protect Cloud giúp backup và bảo vệ dữ liệu cho workstation, server và VM với quản lý tập trung, khôi phục linh hoạt.",
  focusKeyword: "Acronis Cyber Protect Cloud",
  seoKeywords: [
    "Acronis backup",
    "Acronis Cloud Backup",
    "backup server",
    "backup VPS",
    "backup doanh nghiệp",
    "cloud backup",
    "server backup",
  ],
  canonicalUrl: "https://keyon.vn/products/acronis-cyber-protect-cloud",
  ogTitle: "Acronis Cyber Protect Cloud – Backup & Protection",
  ogDescription:
    "Giải pháp backup và bảo vệ dữ liệu cho workstation, server và VM cùng KEYON.",
  platforms: [] as string[],
  licenseChannelDefault: "SUBSCRIPTION",
  licenseTermDefault: "1_MONTH",
  seatsDefault: null as string | null,
  activationMethodDefault: "SUBSCRIPTION",
  transferPolicy:
    "Subscription được cấp theo gói KEYON đã mua và điều kiện của nhà cung cấp. Việc chuyển gói thực hiện theo hướng dẫn KEYON gửi kèm đơn.",
  upgradePolicy:
    "Có thể đổi sang gói KEYON khác khi đặt kỳ tiếp theo. Phạm vi tính năng theo gói được chọn tại thời điểm đăng ký.",
  accountRequired: null as string | null,
};

type Flag = "Có" | "Không gồm";

const PLANS = [
  {
    sku: "ACRONIS-CPC-STARTER",
    name: "Acronis Cyber Protect Cloud – Starter",
    priceVnd: 199_000,
    workload: "1 Workstation",
    storage: "100 GB",
    file: "Có" as Flag,
    image: "Có" as Flag,
    incremental: "Không gồm" as Flag,
    application: "Không gồm" as Flag,
    cloudRestore: "Có" as Flag,
    bareMetal: "Không gồm" as Flag,
    central: "Có" as Flag,
    monitoring: "Không gồm" as Flag,
    reporting: "Không gồm" as Flag,
    support: "Email thông báo",
    backupType: "File & Folder, Full Image, Automated, Scheduled",
    recovery: "Cloud Restore",
    management: "Centralized Management",
    planFit: "Cá nhân chuyên nghiệp, freelancer, startup và máy tính văn phòng",
    planSummary:
      "Gói tháng cho 1 workstation, với 100 GB backup storage, sao lưu file và image, khôi phục từ cloud và quản lý tập trung.",
  },
  {
    sku: "ACRONIS-CPC-BUSINESS",
    name: "Acronis Cyber Protect Cloud – Business",
    priceVnd: 349_000,
    workload: "1 Workstation / VM",
    storage: "250 GB",
    file: "Có" as Flag,
    image: "Có" as Flag,
    incremental: "Có" as Flag,
    application: "Không gồm" as Flag,
    cloudRestore: "Có" as Flag,
    bareMetal: "Không gồm" as Flag,
    central: "Có" as Flag,
    monitoring: "Có" as Flag,
    reporting: "Có" as Flag,
    support: "Theo gói",
    backupType: "File & Folder, Full Image, Incremental, Scheduled",
    recovery: "Cloud Restore",
    management: "Centralized Management",
    planFit: "Doanh nghiệp nhỏ, văn phòng, agency và SMB",
    planSummary:
      "Gói tháng cho 1 workstation hoặc VM, với 250 GB backup storage, thêm incremental backup, theo dõi và báo cáo.",
  },
  {
    sku: "ACRONIS-CPC-PRO",
    name: "Acronis Cyber Protect Cloud – Professional",
    priceVnd: 699_000,
    workload: "1 Server / VM",
    storage: "500 GB",
    file: "Không gồm" as Flag,
    image: "Có" as Flag,
    incremental: "Có" as Flag,
    application: "Có" as Flag,
    cloudRestore: "Có" as Flag,
    bareMetal: "Có" as Flag,
    central: "Có" as Flag,
    monitoring: "Có" as Flag,
    reporting: "Có" as Flag,
    support: "Ưu tiên",
    backupType: "Full Image, Incremental, Scheduled, Application-aware",
    recovery: "Cloud Restore, Bare-metal Recovery",
    management: "Centralized Management",
    planFit:
      "VPS, dedicated server, web server, application server, database server và SMB",
    planSummary:
      "Gói tháng cho 1 server hoặc VM, với 500 GB backup storage, application-aware backup, bare-metal recovery và hỗ trợ ưu tiên.",
  },
  {
    sku: "ACRONIS-CPC-ENTERPRISE",
    name: "Acronis Cyber Protect Cloud – Enterprise",
    priceVnd: 1_499_000,
    workload: "Multiple Workloads",
    storage: "1 TB+",
    file: "Không gồm" as Flag,
    image: "Có" as Flag,
    incremental: "Có" as Flag,
    application: "Có" as Flag,
    cloudRestore: "Không gồm" as Flag,
    bareMetal: "Có" as Flag,
    central: "Có" as Flag,
    monitoring: "Có" as Flag,
    reporting: "Có" as Flag,
    support: "Ưu tiên",
    backupType: "Full Image, Incremental, Application-aware",
    recovery: "Bare-metal Recovery",
    management: "Centralized Management, Policy-based Protection",
    planFit:
      "Doanh nghiệp vừa và lớn, nhiều server, hạ tầng virtualization, công ty có IT riêng và MSP hoặc IT service",
    planSummary:
      "Gói tháng cho nhiều workload, backup storage từ 1 TB, với policy-based protection, báo cáo và hỗ trợ ưu tiên.",
  },
] as const;

function planSpecs(plan: (typeof PLANS)[number]) {
  return [
    { label: "Workload", value: plan.workload },
    { label: "Backup Storage", value: plan.storage },
    { label: "File & Folder Backup", value: plan.file },
    { label: "Image Backup", value: plan.image },
    { label: "Incremental Backup", value: plan.incremental },
    { label: "Application-aware Backup", value: plan.application },
    { label: "Cloud Restore", value: plan.cloudRestore },
    { label: "Bare-metal Recovery", value: plan.bareMetal },
    { label: "Centralized Management", value: plan.central },
    { label: "Monitoring", value: plan.monitoring },
    { label: "Reporting", value: plan.reporting },
    { label: "Encryption", value: "Có" },
    { label: "Support", value: plan.support },
    { label: "Billing Term", value: "Monthly Subscription" },
    { label: "License Type", value: "Subscription" },
    { label: "Backup Type", value: plan.backupType },
    { label: "Recovery", value: plan.recovery },
    { label: "Management", value: plan.management },
  ];
}

function variantData(plan: (typeof PLANS)[number], supplierId: string | null) {
  return {
    sku: plan.sku,
    name: plan.name,
    licenseModel: "SUBSCRIPTION" as const,
    fulfillmentStrategy: "MANUAL" as const,
    deliverableType: "SUBSCRIPTION" as const,
    salesMotion: "SELF_SERVE" as const,
    slaPromise: "KEYON xử lý thủ công sau khi thanh toán được xác nhận.",
    supplierId,
    priceVnd: plan.priceVnd,
    compareAtPriceVnd: null,
    licenseChannel: "SUBSCRIPTION",
    licenseTerm: "1_MONTH",
    seatsLabel: null,
    regionCode: null,
    activationMethod: "SUBSCRIPTION",
    planSpecs: planSpecs(plan),
    planSummary: plan.planSummary,
    planFit: plan.planFit,
    active: true,
  };
}

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
  assertNoPlaceholders({ PRODUCT, PLANS, DESCRIPTION, USAGE_GUIDE });

  const skus = PLANS.map((plan) => plan.sku);
  const [slugOwner, skuOwners, brandHit, suppliers, media] = await Promise.all([
    prisma.product.findUnique({
      where: { slug: SLUG },
      select: {
        id: true,
        slug: true,
        name: true,
        active: true,
        galleryUrls: true,
        ogImageUrl: true,
      },
    }),
    prisma.productVariant.findMany({
      where: { sku: { in: skus } },
      select: { id: true, sku: true, productId: true },
    }),
    prisma.brand.findFirst({
      where: {
        OR: [
          { slug: "acronis" },
          { name: { equals: "Acronis", mode: "insensitive" } },
        ],
      },
      select: { id: true, name: true, slug: true },
    }),
    prisma.supplier.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.mediaAsset.findMany({
      where: {
        OR: [
          { originalName: { contains: "acronis", mode: "insensitive" } },
          { filename: { contains: "acronis", mode: "insensitive" } },
        ],
      },
      select: { publicUrl: true, originalName: true, filename: true, purpose: true, mimeType: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  if (slugOwner && slugOwner.name !== PRODUCT.name) {
    throw new Error(`Slug ${SLUG} belongs to ${slugOwner.name}`);
  }
  for (const owner of skuOwners) {
    if (slugOwner && owner.productId !== slugOwner.id) {
      throw new Error(`SKU ${owner.sku} belongs to another product`);
    }
    if (!slugOwner) {
      throw new Error(`SKU ${owner.sku} already exists on product ${owner.productId}`);
    }
  }

  const brand =
    brandHit ??
    (await prisma.brand.create({
      data: { name: "Acronis", slug: "acronis", active: true },
      select: { id: true, name: true, slug: true },
    }));

  const pax8 =
    suppliers.find((row) => row.name.trim().toLowerCase() === "pax8") ??
    suppliers.find((row) => /pax8/i.test(row.name)) ??
    null;

  const existingGallery = httpsUrls(slugOwner?.galleryUrls);
  const acronisGallery = media
    .filter(
      (row) =>
        row.mimeType.startsWith("image/") &&
        row.publicUrl.startsWith("https://") &&
        row.purpose !== "brand" &&
        !/logo/i.test(`${row.originalName} ${row.filename}`),
    )
    .map((row) => row.publicUrl);
  const galleryUrls = existingGallery.length ? existingGallery : acronisGallery;
  const ogImageUrl = existingGallery.length
    ? slugOwner?.ogImageUrl ?? galleryUrls[0] ?? null
    : galleryUrls[0] ?? null;

  const product = slugOwner
    ? await prisma.product.update({
        where: { id: slugOwner.id },
        data: {
          ...PRODUCT,
          brandId: brand.id,
          galleryUrls,
          ogImageUrl,
          active: slugOwner.active,
        },
        select: { id: true, slug: true, active: true },
      })
    : await prisma.product.create({
        data: {
          ...PRODUCT,
          brandId: brand.id,
          galleryUrls,
          ogImageUrl,
          active: true,
        },
        select: { id: true, slug: true, active: true },
      });

  const variants = [];
  for (const plan of PLANS) {
    const data = variantData(plan, pax8?.id ?? null);
    const existing = skuOwners.find((row) => row.sku === plan.sku);
    const variant = existing
      ? await prisma.productVariant.update({
          where: { id: existing.id },
          data,
          select: { id: true, sku: true, productId: true, priceVnd: true, supplierId: true },
        })
      : await prisma.productVariant.create({
          data: {
            ...data,
            upstreamProductRef: null,
            costVnd: 0,
            productId: product.id,
          },
          select: { id: true, sku: true, productId: true, priceVnd: true, supplierId: true },
        });
    if (variant.productId !== product.id) {
      throw new Error(`SKU ${plan.sku} is not linked to ${product.id}`);
    }
    variants.push(variant);
  }

  console.log(
    JSON.stringify(
      {
        productId: product.id,
        slug: product.slug,
        active: product.active,
        brandId: brand.id,
        brandCreated: !brandHit,
        supplierId: pax8?.id ?? null,
        supplierName: pax8?.name ?? null,
        galleryCount: galleryUrls.length,
        ogImageUrl,
        variants,
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
