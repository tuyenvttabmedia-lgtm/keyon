import type { Metadata } from "next";
import { HowItWorksLanding } from "@/storefront/components/support/HowItWorksLanding";
import { buildMainPageMetadata } from "@/server/seo/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    ...(await buildMainPageMetadata("/how-it-works")),
    title: "Cách KEYON hoạt động | KEYON",
    description:
      "Ba bước: chọn gói, thanh toán VietQR, nhận deliverable trong Tài khoản. Thanh toán thành công chưa phải đã giao.",
  };
}

export default function HowItWorksPage() {
  return <HowItWorksLanding />;
}
