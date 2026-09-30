/**
 * Reposition the existing Cloud Server product as VPS Linux.
 * One product, four plans, four terms each. Does not create products or URLs.
 * Term price is the period total (monthly list × months). No term discount.
 * Prices are catalog drafts until provider cost is confirmed. They are not labeled draft on the storefront.
 *
 * npx tsx scripts/update-vps-linux-catalog.ts
 */
import { prisma } from "../src/lib/db";

const SLUG = "cloud-server";

const MONTHLY = {
  basic: 149_000,
  standard: 299_000,
  business: 449_000,
  pro: 799_000,
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

const PLANS = {
  basic: {
    title: "VPS Linux Basic",
    summary:
      "VPS Linux entry-level với 1 vCPU, 1 GB RAM và 25 GB storage, phù hợp cho website cá nhân, landing page, blog, WordPress nhỏ và môi trường phát triển.",
    fit: "website cá nhân, landing page, blog, WordPress nhỏ, môi trường phát triển và ứng dụng nhẹ",
    cpu: "1 vCPU",
    ram: "1 GB",
    storage: "25 GB",
    bandwidth: "1 TB/tháng",
  },
  standard: {
    title: "VPS Linux Standard",
    summary:
      "VPS Linux cân bằng giữa hiệu năng và chi phí, phù hợp cho website doanh nghiệp nhỏ, WordPress, API, web application và cơ sở dữ liệu quy mô nhỏ.",
    fit: "website doanh nghiệp, WordPress, website giới thiệu dịch vụ, API, web application và database nhỏ",
    cpu: "2 vCPU",
    ram: "2 GB",
    storage: "50 GB",
    bandwidth: "2 TB/tháng",
  },
  business: {
    title: "VPS Linux Business",
    summary:
      "VPS Linux với 2 vCPU và 4 GB RAM, phù hợp cho website thương mại điện tử, web application, API và hệ thống cần nhiều tài nguyên hơn.",
    fit: "website thương mại điện tử, web application, API, database, website có traffic cao hơn và production",
    cpu: "2 vCPU",
    ram: "4 GB",
    storage: "80 GB",
    bandwidth: "3 TB/tháng",
  },
  pro: {
    title: "VPS Linux Pro",
    summary:
      "VPS Linux hiệu năng cao với 4 vCPU, 8 GB RAM và 160 GB storage, phù hợp cho website lớn, SaaS, application server và hệ thống production cần nhiều tài nguyên.",
    fit: "website lớn, SaaS, application server, database, API, production và hệ thống cần nhiều tài nguyên",
    cpu: "4 vCPU",
    ram: "8 GB",
    storage: "160 GB",
    bandwidth: "4 TB/tháng",
  },
} as const;

type PlanKey = keyof typeof PLANS;

function planKey(name: string): PlanKey | null {
  if (/business/i.test(name)) return "business";
  if (/\bpro\b/i.test(name)) return "pro";
  if (/standard/i.test(name)) return "standard";
  if (/basic/i.test(name)) return "basic";
  return null;
}

function planSpecs(plan: (typeof PLANS)[PlanKey]) {
  return [
    { label: "vCPU", value: plan.cpu },
    { label: "RAM", value: plan.ram },
    { label: "Storage", value: plan.storage },
    { label: "Băng thông", value: plan.bandwidth },
    { label: "Loại dịch vụ", value: "VPS Linux" },
    { label: "Loại máy chủ", value: "Virtual Machine" },
    { label: "Virtualization", value: "KVM" },
    { label: "Hệ điều hành", value: "Linux" },
    { label: "Quản trị", value: "Self-managed" },
    { label: "Loại lưu trữ", value: "SSD / NVMe" },
    {
      label: "Provisioning",
      value: "Sau khi thanh toán và xác nhận đơn hàng",
    },
  ];
}

const DESCRIPTION = `
<p>VPS Linux là máy ảo Linux, ảo hóa KVM. Khách tự quản trị hệ điều hành, package, web server, database, ứng dụng, firewall và cấu hình máy. Gói này không phải Managed VPS và không gồm quản trị hệ thống chuyên sâu.</p>
<p>Mỗi gói chọn một thời hạn: 1 tháng, 3 tháng, 6 tháng hoặc 12 tháng. Giá trên trang là tổng tiền của thời hạn đó. Dung lượng ghi theo GB. Loại đĩa hiển thị SSD / NVMe cho đến khi hạ tầng nhà cung cấp được xác nhận cụ thể.</p>
<h2>Điều kiện và lưu ý</h2>
<ul>
<li>Khách tự quản trị máy sau khi nhận thông tin truy cập.</li>
<li>Tài nguyên theo cấu hình đã chọn. Thời hạn chọn lúc đặt hàng.</li>
<li>KEYON xử lý provisioning sau khi thanh toán được xác nhận, rồi gửi thông tin truy cập.</li>
</ul>
<p>Xem <a href="/products">sản phẩm</a>, <a href="/solutions">giải pháp</a> hoặc <a href="/contact/quote">gửi yêu cầu tư vấn cấu hình</a>.</p>
`.trim();

const USAGE_GUIDE = `
<h2>Đặt hàng</h2>
<p>Chọn cấu hình VPS Linux, thời hạn và số lượng.</p>
<h2>Thanh toán</h2>
<p>Thanh toán đơn trên KEYON.</p>
<h2>KEYON xử lý provisioning</h2>
<p>KEYON tiếp nhận đơn sau khi thanh toán được xác nhận.</p>
<h2>Nhận thông tin VPS</h2>
<p>Thông tin truy cập được gửi khi máy đã được tạo.</p>
<h2>Đăng nhập và bắt đầu sử dụng</h2>
<p>Khách tự quản trị hệ điều hành, ứng dụng và cấu hình trên máy.</p>
`.trim();

const FAQS = [
  {
    id: "vps-linux-la-gi",
    question: "VPS Linux là gì?",
    answer:
      "VPS Linux là máy ảo Linux, ảo hóa KVM. Khách tự quản trị hệ điều hành, package, web server, database, ứng dụng, firewall và cấu hình máy. Đây không phải Managed VPS.",
  },
  {
    id: "vps-linux-phu-hop",
    question: "VPS Linux phù hợp với những website nào?",
    answer:
      "Basic phù hợp website cá nhân, landing page, blog, WordPress nhỏ và môi trường phát triển. Standard phù hợp website doanh nghiệp nhỏ, WordPress, API và web application. Business phù hợp website thương mại điện tử và ứng dụng cần nhiều RAM hơn. Pro phù hợp website lớn, SaaS và hệ thống production. Đây là định vị từng gói trên catalog.",
  },
  {
    id: "vps-linux-wordpress",
    question: "VPS Linux có thể cài WordPress không?",
    answer:
      "Khách tự cài phần mềm trên máy, gồm WordPress nếu tự chuẩn bị. KEYON không cài sẵn website và không quản trị ứng dụng.",
  },
  {
    id: "vps-linux-docker",
    question: "Tôi có thể cài Docker trên VPS Linux không?",
    answer:
      "Khách tự cài phần mềm trên máy. KEYON không cài sẵn Docker và không công bố image hệ điều hành trên trang này.",
  },
  {
    id: "vps-linux-nhan-may",
    question: "Sau khi thanh toán bao lâu tôi nhận được VPS?",
    answer:
      "Sau khi thanh toán được xác nhận, KEYON xử lý provisioning và gửi thông tin truy cập. Trang này không nêu một mốc giờ cố định.",
  },
  {
    id: "vps-linux-nang-cap",
    question: "Tôi có thể nâng cấp cấu hình VPS không?",
    answer:
      "Khi cần thêm tài nguyên, chọn gói cao hơn lúc đặt hàng. Trang này không mô tả nâng cấp nóng máy đang chạy.",
  },
  {
    id: "vps-linux-managed",
    question: "VPS Linux có phải Managed VPS không?",
    answer:
      "Không. VPS Linux là self-managed. Khách tự quản trị hệ điều hành và ứng dụng. KEYON không mô tả gói này là Managed VPS.",
  },
  {
    id: "vps-linux-cai-dat",
    question: "KEYON có hỗ trợ cài đặt VPS không?",
    answer:
      "KEYON xử lý provisioning và hỗ trợ kỹ thuật trong phạm vi gói. Gói không gồm quản trị hệ thống chuyên sâu hay cài đặt ứng dụng hộ khách.",
  },
  {
    id: "vps-linux-thoi-han",
    question: "Tôi có thể đổi thời hạn sử dụng VPS không?",
    answer:
      "Thời hạn chọn lúc đặt hàng: 1, 3, 6 hoặc 12 tháng. Đổi thời hạn của đơn đã tạo cần liên hệ KEYON.",
  },
];

async function main() {
  const product = await prisma.product.findUnique({
    where: { slug: SLUG },
    include: { variants: true },
  });
  if (!product) throw new Error(`Missing product slug ${SLUG}`);

  await prisma.product.update({
    where: { id: product.id },
    data: {
      name: "VPS Linux",
      shortDescription:
        "Máy ảo Linux KVM, khách tự quản trị. Chọn cấu hình và thời hạn 1, 3, 6 hoặc 12 tháng.",
      description: DESCRIPTION,
      features: [
        "VPS Linux hiệu năng ổn định|Tài nguyên theo cấu hình gói đã chọn",
        "Ảo hóa KVM|Máy ảo Linux",
        "Nhiều cấu hình lựa chọn|Basic, Standard, Business và Pro",
        "Provisioning sau xác nhận đơn|KEYON xử lý sau khi thanh toán được xác nhận",
        "Hỗ trợ kỹ thuật từ KEYON|Trong phạm vi gói, không gồm quản trị hệ thống",
      ],
      specs: [
        { label: "Loại dịch vụ", value: "VPS Linux" },
        { label: "Loại máy chủ", value: "Virtual Machine" },
        { label: "Virtualization", value: "KVM" },
        { label: "Hệ điều hành", value: "Linux" },
        { label: "Quản trị", value: "Self-managed" },
      ],
      faqs: FAQS,
      usageGuideHtml: USAGE_GUIDE,
      seoTitle: "VPS Linux",
      seoDescription:
        "VPS Linux KVM, self-managed. Basic 1 vCPU 1GB, Standard 2 vCPU 2GB, Business 2 vCPU 4GB, Pro 4 vCPU 8GB. Thuê 1, 3, 6 hoặc 12 tháng.",
      focusKeyword: "VPS Linux",
      seoKeywords: [
        "VPS Linux giá rẻ",
        "VPS Linux 1GB RAM",
        "VPS Linux 1 vCPU",
        "thuê VPS Linux",
        "VPS Linux giá tốt",
        "VPS Linux Basic",
        "VPS Linux Standard",
        "VPS Linux Business",
        "VPS Linux Pro",
      ],
      ogTitle: "VPS Linux",
      ogDescription:
        "VPS Linux KVM, self-managed. Chọn Basic, Standard, Business hoặc Pro và thời hạn 1, 3, 6 hoặc 12 tháng.",
      licenseChannelDefault: null,
      activationMethodDefault: null,
    },
  });

  let updated = 0;
  for (const variant of product.variants) {
    const key = planKey(variant.name);
    const term = variant.licenseTerm ?? "";
    const months = TERM_MONTHS[term];
    const termLabel = TERM_LABEL[term];
    if (!key || !months || !termLabel) {
      throw new Error(
        `Unmapped variant ${variant.id} name=${variant.name} term=${variant.licenseTerm}`,
      );
    }
    const plan = PLANS[key];
    await prisma.productVariant.update({
      where: { id: variant.id },
      data: {
        name: `${plan.title} · ${termLabel}`,
        priceVnd: MONTHLY[key] * months,
        compareAtPriceVnd: null,
        planSpecs: planSpecs(plan),
        planSummary: plan.summary,
        planFit: plan.fit,
        slaPromise: null,
        regionCode: null,
        licenseChannel: null,
        activationMethod: null,
      },
    });
    updated += 1;
  }

  console.log(
    JSON.stringify({
      slug: SLUG,
      productId: product.id,
      variants: updated,
    }),
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
