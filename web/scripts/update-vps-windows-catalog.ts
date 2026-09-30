/**
 * Create or update the VPS Windows catalog as one product.
 * Four plans × four terms. Term price is the period total, with no term discount.
 * Prices are catalog drafts until Windows Server license cost and provider cost are confirmed.
 * Does not claim a Windows version, license included, NVMe, IPv4, backup, SLA, location, or provisioning time.
 *
 * npx tsx scripts/update-vps-windows-catalog.ts
 */
import { prisma } from "../src/lib/db";

const SLUG = "vps-windows";
const LINUX_SLUG = "cloud-server";

const MONTHLY = {
  basic: 399_000,
  standard: 599_000,
  business: 799_000,
  pro: 1_199_000,
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
    title: "VPS Windows Basic",
    summary:
      "VPS Windows entry-level với 2 vCPU, 4 GB RAM và 60 GB storage, phù hợp cho ứng dụng Windows nhẹ, website IIS, Remote Desktop và môi trường thử nghiệm.",
    fit: "website IIS, ứng dụng Windows nhẹ, Remote Desktop cho công việc phù hợp, môi trường thử nghiệm và phần mềm doanh nghiệp nhẹ",
    cpu: "2 vCPU",
    ram: "4 GB",
    storage: "60 GB",
    bandwidth: "1 TB/tháng",
  },
  standard: {
    sku: "STD",
    title: "VPS Windows Standard",
    summary:
      "VPS Windows cân bằng giữa chi phí và hiệu năng, với 2 vCPU và 8 GB RAM, phù hợp cho website IIS, ứng dụng doanh nghiệp và các workload Windows cần nhiều RAM hơn.",
    fit: "website doanh nghiệp, IIS, web application, database nhỏ, phần mềm quản lý doanh nghiệp và quản trị từ xa",
    cpu: "2 vCPU",
    ram: "8 GB",
    storage: "100 GB",
    bandwidth: "2 TB/tháng",
  },
  business: {
    sku: "BIZ",
    title: "VPS Windows Business",
    summary:
      "VPS Windows với 4 vCPU, 8 GB RAM và 160 GB storage, phù hợp cho ứng dụng doanh nghiệp, website có lưu lượng cao hơn, API và các hệ thống Windows production.",
    fit: "website doanh nghiệp, IIS, web application, API, database, phần mềm doanh nghiệp và production",
    cpu: "4 vCPU",
    ram: "8 GB",
    storage: "160 GB",
    bandwidth: "3 TB/tháng",
  },
  pro: {
    sku: "PRO",
    title: "VPS Windows Pro",
    summary:
      "VPS Windows hiệu năng cao với 4 vCPU và 16 GB RAM, phù hợp cho hệ thống doanh nghiệp, ứng dụng Windows cần nhiều bộ nhớ và workload production.",
    fit: "application server, website lớn, database, ERP/CRM, phần mềm doanh nghiệp và production",
    cpu: "4 vCPU",
    ram: "16 GB",
    storage: "240 GB",
    bandwidth: "4 TB/tháng",
  },
} as const;

type PlanKey = keyof typeof PLANS;

function planSpecs(plan: (typeof PLANS)[PlanKey]) {
  return [
    { label: "vCPU", value: plan.cpu },
    { label: "RAM", value: plan.ram },
    { label: "Storage", value: plan.storage },
    { label: "Băng thông", value: plan.bandwidth },
    { label: "Loại dịch vụ", value: "VPS Windows" },
    { label: "Loại máy chủ", value: "Virtual Machine" },
    { label: "Hệ điều hành", value: "Windows Server" },
    { label: "Quản trị", value: "Self-managed" },
    {
      label: "Provisioning",
      value: "Sau khi thanh toán và xác nhận đơn hàng",
    },
  ];
}

const DESCRIPTION = `
<p>VPS Windows là máy ảo chạy Windows Server. Khách tự quản trị Windows Server, IIS, ứng dụng, database, firewall, tài khoản và cấu hình hệ thống. Gói này không phải Managed VPS và không gồm quản trị hệ thống chuyên sâu.</p>
<p>Mỗi gói chọn một thời hạn: 1 tháng, 3 tháng, 6 tháng hoặc 12 tháng. Giá trên trang là tổng tiền của thời hạn đó. Dung lượng ghi theo GB.</p>
<h2>Điều kiện và lưu ý</h2>
<ul>
<li>Khách tự quản trị máy sau khi nhận thông tin truy cập.</li>
<li>Tài nguyên theo cấu hình đã chọn. Thời hạn chọn lúc đặt hàng.</li>
<li>KEYON xử lý provisioning sau khi thanh toán được xác nhận, rồi gửi thông tin truy cập.</li>
</ul>
<p>Xem <a href="/products/cloud-server">VPS Linux</a>, <a href="/products">sản phẩm</a>, <a href="/solutions">giải pháp</a> hoặc <a href="/contact/quote">gửi yêu cầu tư vấn cấu hình</a>.</p>
`.trim();

const USAGE_GUIDE = `
<h2>Chọn cấu hình</h2>
<p>Chọn gói VPS Windows phù hợp nhu cầu.</p>
<h2>Chọn thời hạn</h2>
<p>Chọn 1 tháng, 3 tháng, 6 tháng hoặc 12 tháng.</p>
<h2>Đặt hàng và thanh toán</h2>
<p>Đặt hàng và thanh toán trên KEYON.</p>
<h2>KEYON xử lý provisioning</h2>
<p>KEYON tiếp nhận đơn sau khi thanh toán được xác nhận.</p>
<h2>Nhận thông tin VPS Windows</h2>
<p>Thông tin truy cập được gửi khi máy đã được tạo.</p>
<h2>Đăng nhập và bắt đầu sử dụng</h2>
<p>Khách tự quản trị Windows Server, ứng dụng và cấu hình trên máy.</p>
`.trim();

const FAQS = [
  {
    id: "vps-windows-la-gi",
    question: "VPS Windows là gì?",
    answer:
      "VPS Windows là máy ảo chạy Windows Server. Khách tự quản trị Windows Server, IIS, ứng dụng, database, firewall, tài khoản và cấu hình hệ thống. Đây không phải Managed VPS.",
  },
  {
    id: "vps-windows-iis",
    question: "Tôi có thể cài IIS trên VPS Windows không?",
    answer:
      "Khách tự cài phần mềm trên máy, gồm IIS nếu tự chuẩn bị. KEYON không cài sẵn website và không quản trị ứng dụng.",
  },
  {
    id: "vps-windows-phan-mem",
    question: "VPS Windows có thể chạy phần mềm doanh nghiệp không?",
    answer:
      "Khách tự cài phần mềm trên máy. KEYON không cam kết phần mềm cụ thể chạy được trên gói.",
  },
  {
    id: "vps-windows-database",
    question: "Tôi có thể cài database trên VPS Windows không?",
    answer:
      "Khách tự cài phần mềm trên máy, gồm database nếu tự chuẩn bị. KEYON không cài sẵn database và không quản trị dữ liệu.",
  },
  {
    id: "vps-windows-nang-cap",
    question: "Tôi có thể nâng cấp RAM và CPU không?",
    answer:
      "Khi cần thêm tài nguyên, chọn gói cao hơn lúc đặt hàng. Trang này không mô tả nâng cấp nóng máy đang chạy.",
  },
  {
    id: "vps-windows-managed",
    question: "VPS Windows có phải Managed VPS không?",
    answer:
      "Không. VPS Windows là self-managed. Khách tự quản trị Windows Server và ứng dụng. KEYON không mô tả gói này là Managed VPS.",
  },
  {
    id: "vps-windows-cai-dat",
    question: "KEYON có hỗ trợ cài đặt phần mềm trên VPS không?",
    answer:
      "KEYON xử lý provisioning và hỗ trợ kỹ thuật trong phạm vi gói. Gói không gồm quản trị hệ thống chuyên sâu hay cài đặt phần mềm hộ khách.",
  },
  {
    id: "vps-windows-nhan-may",
    question: "Sau khi thanh toán bao lâu tôi nhận được VPS?",
    answer:
      "Sau khi thanh toán được xác nhận, KEYON xử lý provisioning và gửi thông tin truy cập. Trang này không nêu một mốc giờ cố định.",
  },
  {
    id: "vps-windows-thoi-han",
    question: "Tôi có thể sử dụng VPS trong 3, 6 hoặc 12 tháng không?",
    answer:
      "Có. Thời hạn chọn lúc đặt hàng: 1, 3, 6 hoặc 12 tháng. Giá là tổng tiền của thời hạn đó.",
  },
];

function idList(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((item): item is string => typeof item === "string" && item.length > 0);
}

async function main() {
  const linux = await prisma.product.findUnique({ where: { slug: LINUX_SLUG } });
  if (!linux) throw new Error(`Missing product slug ${LINUX_SLUG}`);

  const productData = {
    name: "VPS Windows",
    brandId: linux.brandId,
    categoryKey: "cloud",
    offeringProfile: "INFRASTRUCTURE",
    shortDescription:
      "Máy ảo chạy Windows Server, khách tự quản trị. Chọn cấu hình và thời hạn 1, 3, 6 hoặc 12 tháng.",
    description: DESCRIPTION,
    features: [
      "VPS Windows sẵn sàng triển khai|Máy ảo Windows Server theo cấu hình đã chọn",
      "Môi trường Windows Server|Khách tự quản trị hệ điều hành",
      "Virtual Machine linh hoạt|Chọn cấu hình theo nhu cầu",
      "Nhiều cấu hình lựa chọn|Basic, Standard, Business và Pro",
      "Phù hợp ứng dụng Windows và IIS|Khách tự cài phần mềm trên máy",
      "Hỗ trợ kỹ thuật từ KEYON|Trong phạm vi gói, không gồm quản trị hệ thống",
    ],
    specs: [
      { label: "Loại dịch vụ", value: "VPS Windows" },
      { label: "Loại máy chủ", value: "Virtual Machine" },
      { label: "Hệ điều hành", value: "Windows Server" },
      { label: "Quản trị", value: "Self-managed" },
    ],
    faqs: FAQS,
    usageGuideHtml: USAGE_GUIDE,
    seoTitle: "VPS Windows",
    seoDescription:
      "VPS Windows self-managed. Basic 2 vCPU 4GB, Standard 2 vCPU 8GB, Business 4 vCPU 8GB, Pro 4 vCPU 16GB. Thuê 1, 3, 6 hoặc 12 tháng.",
    focusKeyword: "VPS Windows",
    seoKeywords: [
      "thuê VPS Windows",
      "VPS Windows Server",
      "VPS Windows Basic",
      "VPS Windows Standard",
      "VPS Windows Business",
      "VPS Windows Pro",
    ],
    ogTitle: "VPS Windows",
    ogDescription:
      "VPS Windows self-managed. Chọn Basic, Standard, Business hoặc Pro và thời hạn 1, 3, 6 hoặc 12 tháng.",
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
      relatedProductIds: [linux.id],
    },
    update: { ...productData, relatedProductIds: [linux.id] },
  });

  const linuxRelated = idList(linux.relatedProductIds);
  if (!linuxRelated.includes(product.id)) {
    await prisma.product.update({
      where: { id: linux.id },
      data: { relatedProductIds: [...linuxRelated, product.id] },
    });
  }

  let variants = 0;
  for (const key of Object.keys(PLANS) as PlanKey[]) {
    const plan = PLANS[key];
    for (const term of Object.keys(TERM_MONTHS)) {
      const months = TERM_MONTHS[term]!;
      const sku = `KYN-VPSW-${plan.sku}-${TERM_SKU[term]}`;
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
