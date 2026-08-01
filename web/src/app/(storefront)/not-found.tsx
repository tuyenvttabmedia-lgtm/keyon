import Link from "next/link";
import { StoreButton } from "@/storefront/components/StoreButton";
import { PAGE_TITLE_CLASS } from "@/storefront/typography";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-accent">404</p>
      <h1 className={`mt-2 ${PAGE_TITLE_CLASS}`}>
        Không tìm thấy trang
      </h1>
      <p className="mt-3 text-muted">
        Liên kết có thể đã đổi hoặc trang không tồn tại.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <StoreButton href="/">Về trang chủ</StoreButton>
        <StoreButton href="/products" variant="secondary">
          Xem sản phẩm
        </StoreButton>
      </div>
      <p className="mt-6 text-sm">
        <Link href="/contact" className="text-accent hover:underline">
          Liên hệ hỗ trợ
        </Link>
      </p>
    </div>
  );
}
