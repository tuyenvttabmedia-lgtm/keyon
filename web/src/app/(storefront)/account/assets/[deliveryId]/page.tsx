import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { readSession, isStaff } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { decryptPayload } from "@/lib/crypto";
import { defaultCmsAccount, readJsonFile } from "@/server/cms/store";
import { resolveAccountCopy } from "@/storefront/lib/account-cms";
import { receiveFromDeliverable } from "@/storefront/lib/customer-labels";
import { ResendButton } from "../../orders/[orderId]/resend-button";
import { LicenseKeyReveal } from "@/storefront/components/checkout/LicenseKeyReveal";
import {
  BREADCRUMB_CLASS,
  BREADCRUMB_CURRENT_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  LINK_ACCENT_CLASS,
  PAGE_TITLE_CLASS,
  SECTION_LEAD_CLASS,
  SUBSECTION_TITLE_CLASS,
} from "@/storefront/typography";
import { CARD_PORTAL, HOVER_LINK_ACCENT } from "@/storefront/effects";
import { customerCanAccessOrder } from "@/server/org/customer-order-access";

export const dynamic = "force-dynamic";

export default async function AssetDetailPage({
  params,
}: {
  params: Promise<{ deliveryId: string }>;
}) {
  const session = await readSession();
  if (!session) redirect("/login");
  const { deliveryId } = await params;

  const [cmsRaw, delivery] = await Promise.all([
    readJsonFile("account.json", defaultCmsAccount),
    prisma.delivery.findUnique({
      where: { id: deliveryId },
      include: {
        orderItem: {
          include: {
            order: true,
            variant: { include: { product: { include: { brand: true } } } },
          },
        },
      },
    }),
  ]);
  if (!delivery) notFound();

  const cms = resolveAccountCopy(cmsRaw);
  const order = delivery.orderItem.order;
  const staff = isStaff(session.role);
  const allowed =
    staff ||
    (await customerCanAccessOrder(
      { id: session.id, email: session.email },
      order,
    ));
  if (!allowed) redirect("/account/assets");

  const owner = await prisma.user.findUnique({
    where: { id: session.id },
    select: { emailVerifiedAt: true },
  });
  const emailVerified = Boolean(owner?.emailVerifiedAt) || staff;

  let revealed: string | null = null;
  if (emailVerified) {
    try {
      revealed = decryptPayload(delivery.payloadEnc);
    } catch {
      revealed = "(không giải mã được)";
    }
  }

  const receive = receiveFromDeliverable(delivery.deliverableType);
  const product = delivery.orderItem.variant.product;

  return (
    <div className="space-y-5">
      <nav className={`flex flex-wrap items-center gap-1.5 ${BREADCRUMB_CLASS}`}>
        <Link
          href="/account/assets"
          className={HOVER_LINK_ACCENT}
        >
          {cms.licensesPageTitle}
        </Link>
        <span aria-hidden>›</span>
        <span className={BREADCRUMB_CURRENT_CLASS}>Chi tiết</span>
      </nav>

      <div>
        <p className={CARD_META_CLASS}>{product.brand.name}</p>
        <h1 className={`mt-1 ${PAGE_TITLE_CLASS}`}>{delivery.orderItem.title}</h1>
        <p className={`mt-2 ${SECTION_LEAD_CLASS}`}>
          Loại nhận:{" "}
          <span className={`${CARD_TITLE_CLASS} inline`}>{receive.label}</span>
          {" · "}
          Nhận ngày {delivery.createdAt.toLocaleString("vi-VN")}
        </p>
      </div>

      <div className={CARD_PORTAL}>
        <h2 className={SUBSECTION_TITLE_CLASS}>{cms.licensesKeyLabel}</h2>
        {delivery.displayHint ? (
          <p className={`mt-1 ${SECTION_LEAD_CLASS}`}>{delivery.displayHint}</p>
        ) : null}
        <div className="mt-4">
          {revealed ? (
            <LicenseKeyReveal
              value={revealed}
              label={cms.licensesKeyLabel}
              showLabel="Hiện"
              hideLabel="Ẩn"
              copyLabel="Sao chép"
            />
          ) : (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <p className={CARD_TITLE_CLASS}>Xác thực email để xem license</p>
              <p className={`mt-1 ${SECTION_LEAD_CLASS} !text-amber-950`}>
                License đã được giao.{" "}
                <Link href="/account/security" className={LINK_ACCENT_CLASS}>
                  Xác thực email
                </Link>{" "}
                để xem nội dung.
              </p>
            </div>
          )}
        </div>
        <p className={`mt-3 ${CARD_META_CLASS}`}>
          Gửi lại: {delivery.resendCount}/5 · Đơn{" "}
          <Link href={`/account/orders/${order.id}`} className={LINK_ACCENT_CLASS}>
            {order.code}
          </Link>
        </p>
        <div className="mt-4">
          <ResendButton deliveryId={delivery.id} />
        </div>
      </div>
    </div>
  );
}
