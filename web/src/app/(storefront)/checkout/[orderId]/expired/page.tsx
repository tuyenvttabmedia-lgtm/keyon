import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { StoreButton } from "@/storefront/components/StoreButton";
import { ELEVATION_NONE } from "@/storefront/effects";
import { PAGE_TITLE_CLASS } from "@/storefront/typography";

export const dynamic = "force-dynamic";

export default async function CheckoutExpiredPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, payments: { orderBy: { createdAt: "desc" }, take: 1 } },
  });
  if (!order) notFound();

  const variantId = order.items[0]?.variantId;

  return (
    <div className="mx-auto max-w-lg px-4 py-12 md:py-16">
      <div className={`rounded-2xl border border-border bg-card p-8 text-center ${ELEVATION_NONE}`}>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-2xl text-amber-700">
          ⏱
        </div>
        <h1 className={`mt-6 ${PAGE_TITLE_CLASS}`}>
          QR / phiên thanh toán hết hạn
        </h1>
        <p className="mt-2 text-sm text-muted">
          Đơn <strong className="text-navy">{order.code}</strong> đã quá thời gian chờ thanh
          toán. Tạo đơn mới để nhận QR mới — không chuyển khoản theo nội dung cũ.
        </p>
        <p className="mt-4 text-lg font-semibold tabular-nums text-navy">
          {order.totalVnd.toLocaleString("vi-VN")} đ
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {variantId ? (
            <StoreButton href={`/products`}>Mua lại / chọn gói</StoreButton>
          ) : (
            <StoreButton href="/products">Xem sản phẩm</StoreButton>
          )}
          <StoreButton href="/account/orders" variant="secondary">
            Đơn hàng của tôi
          </StoreButton>
        </div>
        <p className="mt-6 text-xs text-muted">
          <Link href="/faq" className="text-accent hover:underline">
            Cần hỗ trợ?
          </Link>
        </p>
      </div>
    </div>
  );
}
