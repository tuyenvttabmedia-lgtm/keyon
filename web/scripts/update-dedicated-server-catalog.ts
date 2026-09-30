/**
 * Create or update Dedicated Server as one bare-metal product.
 * Four plans × four terms. Term price is the period total, with no term discount.
 * Core, RAM and disk counts are catalog drafts. CPU model, ECC, disk type, RAID level,
 * port speed, IPv4, location and provisioning time stay unset until the provider confirms them.
 *
 * npx tsx scripts/update-dedicated-server-catalog.ts
 */
import { prisma } from "../src/lib/db";

const SLUG = "dedicated-server";
const LINUX_SLUG = "cloud-server";
const WINDOWS_SLUG = "vps-windows";

const MONTHLY = {
  basic: 3_490_000,
  standard: 4_490_000,
  business: 6_490_000,
  pro: 9_490_000,
} as const;

const TERM_MONTHS: Record<string, number> = {
  "1_MONTH": 1,
  "3_MONTHS": 3,
  "6_MONTHS": 6,
  "1_YEAR": 12,
};

const TERM_LABEL: Record<string, string> = {
  "1_MONTH": "1 tháng",
  "3_MONTHS": "3 tháng",
  "6_MONTHS": "6 tháng",
  "1_YEAR": "12 tháng",
};

const TERM_SKU: Record<string, string> = {
  "1_MONTH": "1M",
  "3_MONTHS": "3M",
  "6_MONTHS": "6M",
  "1_YEAR": "12M",
};

const PLANS = {
  basic: {
    sku: "BASIC",
    title: "Dedicated Server Basic",
    summary:
      "Máy chủ vật lý riêng dành cho website doanh nghiệp, ứng dụng, database và các workload cần tài nguyên phần cứng độc lập.",
    fit: "website doanh nghiệp, web application, database, API, mail server, hệ thống nội bộ và workload cần máy chủ vật lý riêng",
    cpu: "4 cores / 8 threads",
    ram: "16 GB",
    storage: "2 x 480 GB",
  },
  standard: {
    sku: "STD",
    title: "Dedicated Server Standard",
    summary:
      "Máy chủ vật lý riêng với 6 cores / 12 threads, 32 GB RAM và 2 x 960 GB storage, phù hợp cho website lớn, database, application server và hệ thống doanh nghiệp.",
    fit: "website thương mại điện tử, application server, database, API, ERP/CRM, hệ thống doanh nghiệp và production",
    cpu: "6 cores / 12 threads",
    ram: "32 GB",
    storage: "2 x 960 GB",
  },
  business: {
    sku: "BIZ",
    title: "Dedicated Server Business",
    summary:
      "Máy chủ vật lý với 8 cores / 16 threads, 64 GB RAM và 2 x 960 GB storage, dành cho hệ thống doanh nghiệp cần nhiều CPU, RAM và dung lượng lưu trữ.",
    fit: "thương mại điện tử, database, ERP, CRM, application server, SaaS, API và hệ thống production",
    cpu: "8 cores / 16 threads",
    ram: "64 GB",
    storage: "2 x 960 GB",
  },
  pro: {
    sku: "PRO",
    title: "Dedicated Server Pro",
    summary:
      "Máy chủ vật lý với 12 cores trở lên, 128 GB RAM và 2 x 1.92 TB storage, phù hợp cho database lớn, SaaS và hệ thống doanh nghiệp cần nhiều tài nguyên.",
    fit: "database lớn, SaaS, ứng dụng doanh nghiệp và hệ thống production cần nhiều tài nguyên",
    cpu: "12 cores trở lên",
    ram: "128 GB",
    storage: "2 x 1.92 TB",
  },
} as const;

type PlanKey = keyof typeof PLANS;

function planSpecs(plan: (typeof PLANS)[PlanKey]) {
  return [
    { label: "CPU", value: plan.cpu },
    { label: "RAM", value: plan.ram },
    { label: "Storage", value: plan.storage },
    { label: "RAID", value: "Theo cấu hình nhà cung cấp" },
    { label: "Băng thông", value: "Theo chính sách nhà cung cấp" },
    { label: "Loại dịch vụ", value: "Dedicated Server" },
    { label: "Hạ tầng", value: "Bare Metal" },
    { label: "Hệ điều hành", value: "Linux" },
    { label: "Quản trị", value: "Self-managed" },
    {
      label: "Provisioning",
      value: "Sau khi thanh toán và xác nhận đơn hàng",
    },
  ];
}

const DESCRIPTION = `
<p>Dedicated Server là máy chủ vật lý dành riêng cho một khách hàng. CPU, RAM và ổ cứng không chia sẻ với khách khác ở tầng máy chủ vật lý. Đây không phải VPS.</p>
<h2>Dedicated Server là gì?</h2>
<p>Khách thuê một máy vật lý, tự quản trị hệ điều hành, ứng dụng, database và cấu hình trên máy. KEYON không mô tả gói này là Managed Server.</p>
<h2>Dedicated Server phù hợp với ai?</h2>
<p>Phù hợp website, ứng dụng, database và hệ thống doanh nghiệp cần tài nguyên phần cứng riêng. Mức tài nguyên nằm trên từng gói: Basic, Standard, Business và Pro.</p>
<h2>Thông số phần cứng</h2>
<h3>CPU</h3>
<p>Số core và thread theo gói đang chọn.</p>
<h3>RAM</h3>
<p>Dung lượng RAM theo gói đang chọn.</p>
<h3>Storage</h3>
<p>Số lượng và dung lượng ổ theo gói. Loại ổ và mức RAID theo cấu hình nhà cung cấp.</p>
<h3>Network</h3>
<p>Băng thông theo chính sách nhà cung cấp.</p>
<h2>Điểm nổi bật</h2>
<ul>
<li>Máy chủ vật lý riêng.</li>
<li>Tài nguyên phần cứng không chia sẻ ở tầng máy vật lý.</li>
<li>Khách tự quản trị hệ điều hành và phần mềm.</li>
</ul>
<h2>Dedicated Server khác VPS như thế nào?</h2>
<p><a href="/products/cloud-server">VPS Linux</a> và <a href="/products/vps-windows">VPS Windows</a> là máy ảo. Dedicated Server là máy chủ vật lý riêng.</p>
<h2>Hệ điều hành hỗ trợ</h2>
<p>Gói trên trang ghi hệ điều hành Linux. Windows Server không nằm trong giá cơ bản.</p>
<h2>Quản trị máy chủ</h2>
<p>Self-managed. Khách tự quản trị hệ điều hành, ứng dụng, database và cấu hình. KEYON hỗ trợ kỹ thuật trong phạm vi gói, không gồm quản trị hệ thống chuyên sâu.</p>
<h2>Quy trình đăng ký Dedicated Server</h2>
<p>Chọn cấu hình, chọn thời hạn 1, 3, 6 hoặc 12 tháng, đặt hàng và thanh toán. KEYON xử lý provisioning sau khi thanh toán được xác nhận, rồi gửi thông tin truy cập.</p>
<h2>Câu hỏi thường gặp</h2>
<p>Các câu trả lời nằm ở mục câu hỏi thường gặp trên trang này.</p>
<p>Cần cấu hình riêng? <a href="/contact/quote">Yêu cầu báo giá</a>. Xem thêm <a href="/products">sản phẩm</a> và <a href="/solutions">giải pháp</a>.</p>
`.trim();

const USAGE_GUIDE = `
<h2>Chọn cấu hình</h2>
<p>Chọn gói Dedicated Server phù hợp nhu cầu.</p>
<h2>Chọn thời hạn</h2>
<p>Chọn 1 tháng, 3 tháng, 6 tháng hoặc 12 tháng.</p>
<h2>Đặt hàng và thanh toán</h2>
<p>Đặt hàng và thanh toán trên KEYON.</p>
<h2>KEYON xử lý provisioning</h2>
<p>KEYON tiếp nhận đơn sau khi thanh toán được xác nhận.</p>
<h2>Nhận thông tin máy chủ</h2>
<p>Thông tin truy cập được gửi khi máy đã được chuẩn bị.</p>
<h2>Đăng nhập và bắt đầu sử dụng</h2>
<p>Khách tự quản trị hệ điều hành, ứng dụng và cấu hình trên máy.</p>
`.trim();

const FAQS = [
  {
    id: "dedicated-la-gi",
    question: "Dedicated Server là gì?",
    answer:
      "Dedicated Server là máy chủ vật lý dành riêng cho một khách hàng. CPU, RAM và ổ cứng không chia sẻ với khách khác ở tầng máy chủ vật lý. Khách tự quản trị hệ điều hành và phần mềm. Đây không phải VPS.",
  },
  {
    id: "dedicated-khac-vps",
    question: "Dedicated Server khác VPS như thế nào?",
    answer:
      "VPS Linux và VPS Windows là máy ảo. Dedicated Server là máy chủ vật lý riêng, không dùng máy ảo làm hình thức cung cấp của gói này.",
  },
  {
    id: "dedicated-vat-ly",
    question: "Dedicated Server có phải máy chủ vật lý riêng không?",
    answer:
      "Có. Đây là máy chủ vật lý dành riêng cho một khách hàng, không chia sẻ CPU và RAM với khách khác ở tầng máy vật lý.",
  },
  {
    id: "dedicated-linux",
    question: "Tôi có thể cài Linux không?",
    answer:
      "Gói trên trang ghi hệ điều hành Linux. Khách tự quản trị hệ điều hành trên máy. Trang không nêu bản phân phối cụ thể.",
  },
  {
    id: "dedicated-windows",
    question: "Tôi có thể cài Windows Server không?",
    answer:
      "Windows Server không nằm trong giá cơ bản của gói này. Trang không mô tả license Windows Server đi kèm.",
  },
  {
    id: "dedicated-nang-cap",
    question: "Tôi có thể nâng cấp RAM và storage không?",
    answer:
      "Khi cần thêm tài nguyên, chọn gói cao hơn lúc đặt hàng. Trang này không mô tả nâng cấp nóng máy đang chạy.",
  },
  {
    id: "dedicated-managed",
    question: "Dedicated Server có Managed Service không?",
    answer:
      "Không. Gói này là self-managed. Khách tự quản trị hệ điều hành, ứng dụng và cấu hình. KEYON không mô tả gói này là Managed Server.",
  },
  {
    id: "dedicated-nhan-may",
    question: "Sau khi đặt hàng bao lâu tôi nhận được server?",
    answer:
      "Sau khi thanh toán được xác nhận, KEYON xử lý provisioning và gửi thông tin truy cập. Trang này không nêu một mốc giờ cố định.",
  },
  {
    id: "dedicated-phu-hop",
    question: "Dedicated Server phù hợp với website nào?",
    answer:
      "Basic phù hợp website doanh nghiệp, ứng dụng và database cần máy riêng. Standard và Business phù hợp website lớn hơn, application server và hệ thống doanh nghiệp. Pro phù hợp database lớn và hệ thống cần nhiều RAM hơn. Đây là định vị từng gói trên catalog.",
  },
  {
    id: "dedicated-docker",
    question: "Dedicated Server có thể chạy Docker không?",
    answer:
      "Khách tự cài phần mềm trên máy. KEYON không cài sẵn Docker và không mô tả nền tảng ảo hóa đi kèm gói.",
  },
];

function idList(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((item): item is string => typeof item === "string" && item.length > 0);
}

async function addRelated(productId: string, relatedId: string) {
  const current = await prisma.product.findUnique({
    where: { id: productId },
    select: { relatedProductIds: true },
  });
  if (!current) return;
  const ids = idList(current.relatedProductIds);
  if (ids.includes(relatedId)) return;
  await prisma.product.update({
    where: { id: productId },
    data: { relatedProductIds: [...ids, relatedId] },
  });
}

async function main() {
  const linux = await prisma.product.findUnique({ where: { slug: LINUX_SLUG } });
  const windows = await prisma.product.findUnique({ where: { slug: WINDOWS_SLUG } });
  if (!linux) throw new Error(`Missing product slug ${LINUX_SLUG}`);
  if (!windows) throw new Error(`Missing product slug ${WINDOWS_SLUG}`);

  const productData = {
    name: "Dedicated Server",
    brandId: linux.brandId,
    categoryKey: "cloud",
    offeringProfile: "INFRASTRUCTURE",
    shortDescription:
      "Máy chủ vật lý riêng, khách tự quản trị. Chọn cấu hình và thời hạn 1, 3, 6 hoặc 12 tháng.",
    description: DESCRIPTION,
    features: [
      "Máy chủ vật lý riêng|Dành cho một khách hàng",
      "Tài nguyên phần cứng độc lập|Không chia sẻ CPU và RAM ở tầng máy vật lý",
      "CPU, RAM và storage riêng|Theo cấu hình gói đã chọn",
      "Hệ điều hành Linux|Khách tự quản trị trên máy",
      "Phù hợp workload doanh nghiệp|Website, ứng dụng và database",
      "Hỗ trợ kỹ thuật từ KEYON|Trong phạm vi gói, không gồm quản trị hệ thống",
    ],
    specs: [
      { label: "Loại dịch vụ", value: "Dedicated Server" },
      { label: "Hạ tầng", value: "Bare Metal" },
      { label: "Hệ điều hành", value: "Linux" },
      { label: "Quản trị", value: "Self-managed" },
    ],
    faqs: FAQS,
    usageGuideHtml: USAGE_GUIDE,
    seoTitle: "Dedicated Server",
    seoDescription:
      "Dedicated Server vật lý, self-managed. Basic 16GB, Standard 32GB, Business 64GB, Pro 128GB RAM. Thuê 1, 3, 6 hoặc 12 tháng.",
    focusKeyword: "Dedicated Server",
    seoKeywords: [
      "thuê Dedicated Server",
      "máy chủ vật lý",
      "Dedicated Server Basic",
      "Dedicated Server Standard",
      "Dedicated Server Business",
      "Dedicated Server Pro",
    ],
    ogTitle: "Dedicated Server",
    ogDescription:
      "Máy chủ vật lý riêng, self-managed. Chọn Basic, Standard, Business hoặc Pro và thời hạn 1, 3, 6 hoặc 12 tháng.",
    licenseChannelDefault: null,
    activationMethodDefault: null,
    active: true,
  };

  const product = await prisma.product.upsert({
    where: { slug: SLUG },
    create: {
      slug: SLUG,
      ...productData,
      galleryUrls: linux.galleryUrls ?? [],
      relatedProductIds: [linux.id, windows.id],
    },
    update: { ...productData, relatedProductIds: [linux.id, windows.id] },
  });

  await addRelated(linux.id, product.id);
  await addRelated(windows.id, product.id);

  let variants = 0;
  for (const key of Object.keys(PLANS) as PlanKey[]) {
    const plan = PLANS[key];
    for (const term of Object.keys(TERM_MONTHS)) {
      const months = TERM_MONTHS[term]!;
      const sku = `KYN-DS-${plan.sku}-${TERM_SKU[term]}`;
      const data = {
        name: `${plan.title} · ${TERM_LABEL[term]}`,
        licenseModel: "SUBSCRIPTION" as const,
        fulfillmentStrategy: "MANUAL" as const,
        deliverableType: "ACCOUNT" as const,
        salesMotion: "SELF_SERVE" as const,
        priceVnd: MONTHLY[key] * months,
        compareAtPriceVnd: null,
        planSpecs: planSpecs(plan),
        planSummary: plan.summary,
        planFit: plan.fit,
        licenseTerm: term,
        slaPromise: null,
        regionCode: null,
        licenseChannel: null,
        activationMethod: null,
        active: true,
      };
      await prisma.productVariant.upsert({
        where: { sku },
        create: { sku, productId: product.id, ...data },
        update: data,
      });
      variants += 1;
    }
  }

  console.log(JSON.stringify({ slug: SLUG, productId: product.id, variants }));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
