import { notFound } from "next/navigation";
import { readSession } from "@/lib/auth";
import { decryptPayload } from "@/lib/crypto";
import { prisma } from "@/lib/db";
import {
  defaultCmsCheckout,
  readJsonFile,
} from "@/server/cms/store";
import { CheckoutSuccessView } from "@/storefront/components/checkout/CheckoutSuccessView";
import type { ShopProduct } from "@/storefront/components/shop/types";
import { mergeCheckoutCms } from "@/storefront/lib/checkout-cms";
import {
  deliveryPromiseLabel,
  receiveFromDeliverable,
} from "@/storefront/lib/customer-labels";
import { parseStringList } from "@/storefront/lib/product-cms";
import { mapProductsToShopCards } from "@/storefront/lib/related-products";

export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const [order, cmsRaw, session] = await Promise.all([
    prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            variant: { include: { product: { include: { brand: true } } } },
            deliveries: { orderBy: { createdAt: "desc" }, take: 1 },
            fulfillmentJobs: { take: 1 },
          },
        },
        payments: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    }),
    readJsonFile("checkout.json", defaultCmsCheckout),
    readSession(),
  ]);
  if (!order) notFound();

  const cms = mergeCheckoutCms(cmsRaw);
  const payment = order.payments[0];
  const line = order.items[0];
  const product = line?.variant.product;
  const gallery = product ? parseStringList(product.galleryUrls) : [];
  const receive = line
    ? receiveFromDeliverable(line.variant.deliverableType)
    : null;
  const delivery = line
    ? deliveryPromiseLabel(line.variant.fulfillmentStrategy)
    : null;

  const deliveryRow = line?.deliveries[0];
  let licensePlain: string | null = null;
  if (deliveryRow) {
    try {
      licensePlain = decryptPayload(deliveryRow.payloadEnc);
    } catch {
      licensePlain = null;
    }
  }

  const paidAt =
    payment?.succeededAt ?? payment?.updatedAt ?? order.updatedAt;
  const paidAtLabel = paidAt.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const methodTitle =
    !payment ||
    payment.provider === "sepay" ||
    payment.provider === "sepay_qr"
      ? "VietQR"
      : (cms.paymentMethods.find((m) => m.provider === "sepay_qr")?.title ??
        "VietQR");

  const recommended = product
    ? await loadRecommended(product.id, product.brandId, product.categoryKey, product.brand.name)
    : await loadRecommended(null, null, null, null);

  const isLoggedIn = Boolean(session);
  const orderDetailHref = isLoggedIn
    ? `/account/orders/${order.id}`
    : `/login?next=${encodeURIComponent(`/account/orders/${order.id}`)}`;

  return (
    <CheckoutSuccessView
      cms={cms}
      isLoggedIn={isLoggedIn}
      orderDetailHref={orderDetailHref}
      paidAtLabel={paidAtLabel}
      methodTitle={methodTitle}
      licensePlain={licensePlain}
      recommended={recommended}
      order={{
        id: order.id,
        code: order.code,
        email: order.email,
        totalVnd: order.totalVnd,
        productHref: product ? `/products/${product.slug}` : "/products",
      }}
      item={
        line && product
          ? {
              title: line.title,
              productName: product.name,
              brandName: product.brand.name,
              variantName: line.variant.name,
              quantity: line.quantity,
              unitPriceVnd: line.unitPriceVnd,
              compareAtUnitVnd: line.variant.compareAtPriceVnd,
              imageUrl: gallery[0] ?? product.ogImageUrl ?? null,
              receiveLabel: receive?.label ?? "—",
              deliveryLabel: delivery ?? "—",
              fulfillmentInstant: line.variant.fulfillmentStrategy === "INSTANT",
            }
          : null
      }
    />
  );
}

async function loadRecommended(
  productId: string | null,
  brandId: string | null,
  categoryKey: string | null,
  brandName: string | null,
): Promise<ShopProduct[]> {
  let related: ShopProduct[] = [];

  if (productId) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { relatedProductIds: true },
    });
    const curatedIds = product
      ? parseStringList(product.relatedProductIds).slice(0, 8)
      : [];
    if (curatedIds.length) {
      const curatedDb = await prisma.product.findMany({
        where: {
          id: { in: curatedIds },
          active: true,
          NOT: { id: productId },
        },
        include: {
          brand: true,
          variants: {
            where: { active: true },
            orderBy: { priceVnd: "asc" },
            take: 1,
          },
        },
      });
      const byId = new Map(curatedDb.map((p) => [p.id, p]));
      const ordered = curatedIds
        .map((id) => byId.get(id))
        .filter((p): p is NonNullable<typeof p> => Boolean(p));
      related = mapProductsToShopCards(ordered).slice(0, 4);
    }
  }

  if (related.length < 4) {
    const excludeIds = [
      ...(productId ? [productId] : []),
      ...related.map((x) => x.id),
    ];
    const relatedDb = await prisma.product.findMany({
      where: {
        active: true,
        id: { notIn: excludeIds },
        ...(brandId || categoryKey || brandName
          ? {
              OR: [
                ...(brandId ? [{ brandId }] : []),
                ...(categoryKey ? [{ categoryKey }] : []),
                ...(brandName ? [{ name: { contains: brandName } }] : []),
              ],
            }
          : {}),
      },
      include: {
        brand: true,
        variants: {
          where: { active: true },
          orderBy: { priceVnd: "asc" },
          take: 1,
        },
      },
      take: 8,
    });
    related = [
      ...related,
      ...mapProductsToShopCards(relatedDb, related.length),
    ].slice(0, 4);
  }

  if (related.length < 4) {
    const excludeIds = [
      ...(productId ? [productId] : []),
      ...related.map((x) => x.id),
    ];
    const more = await prisma.product.findMany({
      where: { active: true, id: { notIn: excludeIds } },
      include: {
        brand: true,
        variants: {
          where: { active: true },
          orderBy: { priceVnd: "asc" },
          take: 1,
        },
      },
      take: 8,
    });
    related = [
      ...related,
      ...mapProductsToShopCards(more, related.length),
    ].slice(0, 4);
  }

  return related;
}
