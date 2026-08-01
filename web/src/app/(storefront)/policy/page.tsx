import { PolicyView } from "@/storefront/components/policy/PolicyView";
import { loadPolicyCms } from "@/storefront/components/policy/load-policy-cms";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Chính sách — KEYON",
  description:
    "Điều khoản, giao hàng, hoàn tiền, bảo hành, bảo mật và hỗ trợ tại KEYON.",
};

export default async function PolicyPage() {
  const cms = await loadPolicyCms();
  return <PolicyView cms={cms} />;
}
