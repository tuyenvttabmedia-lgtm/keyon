import type { Metadata } from "next";
import { IaHubPage } from "@/storefront/components/marketing/IaLanding";
import { buildMainPageMetadata } from "@/server/seo/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildMainPageMetadata("/support");
}

export default function SupportHubPage() {
  return (
    <IaHubPage
      title="Trung tâm hỗ trợ"
      subtitle="Hướng dẫn, FAQ, ticket và liên hệ — hỗ trợ tiếng Việt sau khi mua."
      items={[
        {
          label: "Hướng dẫn sử dụng",
          href: "/resources/guides",
          description: "How-to kích hoạt, nhập key, dùng Tài khoản KEYON",
        },
        {
          label: "FAQ",
          href: "/faq",
          description: "Câu hỏi thường gặp",
        },
        {
          label: "Gửi yêu cầu hỗ trợ",
          href: "/account/tickets",
          description: "Ticket trong Tài khoản (cần đăng nhập)",
        },
        {
          label: "Liên hệ",
          href: "/contact",
          description: "Email / form liên hệ chung",
        },
        {
          label: "Liên hệ kinh doanh",
          href: "/contact/sales",
          description: "Tư vấn B2B và báo giá",
        },
      ]}
    />
  );
}
