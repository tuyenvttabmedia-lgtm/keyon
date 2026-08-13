import Link from "next/link";
import { redirect } from "next/navigation";
import { readSession } from "@/lib/auth";
import { AuthCard, AuthOrDivider } from "@/storefront/components/auth/AuthCard";
import { AuthSplitShell } from "@/storefront/components/auth/AuthSplitShell";
import {
  BODY_MUTED_CLASS,
  LINK_ACCENT_CLASS,
} from "@/storefront/typography";
import { RegisterForm } from "./register-form";

const REGISTER_FEATURES = [
  {
    title: "Thông tin tài khoản đầy đủ",
    detail: "Họ tên, SĐT, ngày sinh và địa chỉ — dùng lại khi hỗ trợ đơn hàng.",
  },
  {
    title: "Bảo mật từ lúc tạo tài khoản",
    detail: "Mật khẩu riêng; đổi và quản lý sau trong mục Bảo mật.",
  },
  {
    title: "License trong Tài khoản",
    detail: "Sau thanh toán, key/license lưu ở Tài sản — xem lại mọi lúc.",
  },
  {
    title: "Theo dõi đơn & thông báo",
    detail: "Trạng thái đơn, giao license và hỗ trợ tập trung một nơi.",
  },
];

export default async function RegisterPage() {
  const session = await readSession();
  if (session) redirect("/account");

  return (
    <AuthSplitShell
      headline="Tạo tài khoản để quản lý giấy phép trong KEYON"
      subtext="Điền thông tin một lần — KEYON dùng để giao license, hỗ trợ và lưu trong Tài khoản."
      features={REGISTER_FEATURES}
      bullets={[
        "Thanh toán rõ · giao hàng tách biệt",
        "Đúng loại nhận: key / tài khoản / kích hoạt",
        "Chỉnh sửa hồ sơ bất cứ lúc nào",
      ]}
    >
      <AuthCard
        title="Tạo tài khoản"
        subtitle="Các trường khớp với Thông tin tài khoản"
        footer={
          <>
            <AuthOrDivider />
            <p className={`text-center ${BODY_MUTED_CLASS}`}>
              Đã có tài khoản?{" "}
              <Link href="/login" className={LINK_ACCENT_CLASS}>
                Đăng nhập
              </Link>
            </p>
          </>
        }
      >
        <RegisterForm />
      </AuthCard>
    </AuthSplitShell>
  );
}
