import { redirect } from "next/navigation";
import type { DeliverableType } from "@prisma/client";
import { readSession } from "@/lib/auth";
import { decryptPayload } from "@/lib/crypto";
import { prisma } from "@/lib/db";
import { defaultCmsAccount, readJsonFile } from "@/server/cms/store";
import { resolveAccountCopy } from "@/storefront/lib/account-cms";
import {
  LicensesView,
  type LicenseListItem,
  type LicenseListStatus,
} from "@/storefront/components/account/LicensesView";
import { receiveFromDeliverable } from "@/storefront/lib/customer-labels";
import { parseStringList } from "@/storefront/lib/product-cms";
import { CATEGORY_LABELS } from "@/storefront/components/shop/shop-utils";
import type { ShopCategoryId } from "@/storefront/components/shop/types";
import { customerOrderWhere } from "@/server/org/customer-order-access";

export const dynamic = "force-dynamic";

function resolveStatus(
  type: DeliverableType,
  expiresAt: Date | null,
): LicenseListStatus {
  if (expiresAt && expiresAt.getTime() < Date.now()) return "expired";
  if (type === "EXTERNAL_PORTAL" || type === "SUBSCRIPTION") return "pending";
  return "active";
}

function categoryLabel(key: string | null | undefined) {
  if (key && key in CATEGORY_LABELS) {
    return CATEGORY_LABELS[key as ShopCategoryId];
  }
  return key || "License";
}

export default async function AssetsPage() {
  const session = await readSession();
  if (!session) redirect("/login");

  const orderWhere = await customerOrderWhere({
    id: session.id,
    email: session.email,
  });

  const [cmsRaw, deliveries] = await Promise.all([
    readJsonFile("account.json", defaultCmsAccount),
    prisma.delivery.findMany({
      where: {
        orderItem: {
          order: orderWhere,
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        orderItem: {
          include: {
            order: true,
            variant: { include: { product: { include: { brand: true } } } },
            consumedLicenses: {
              orderBy: { consumedAt: "desc" },
              take: 1,
              select: { expiresAt: true, disabledAt: true },
            },
          },
        },
      },
      take: 100,
    }),
  ]);

  const cms = resolveAccountCopy(cmsRaw);

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { emailVerifiedAt: true },
  });
  const emailVerified = Boolean(user?.emailVerifiedAt);

  const items: LicenseListItem[] = deliveries.map((d) => {
    const product = d.orderItem.variant.product;
    const gallery = parseStringList(product.galleryUrls);
    const licenseMeta = d.orderItem.consumedLicenses[0];
    const expiresAt = licenseMeta?.expiresAt ?? null;
    let status = resolveStatus(d.deliverableType, expiresAt);
    if (licenseMeta?.disabledAt) status = "expired";

    let payloadPlain: string | null = null;
    if (emailVerified) {
      try {
        payloadPlain = decryptPayload(d.payloadEnc);
      } catch {
        payloadPlain = null;
      }
    }

    const receive = receiveFromDeliverable(d.deliverableType);

    return {
      id: d.id,
      title: d.orderItem.title,
      brandName: product.brand.name,
      categoryLabel: categoryLabel(product.categoryKey),
      imageUrl: gallery[0] ?? product.ogImageUrl ?? null,
      quantity: d.orderItem.quantity,
      status,
      payloadPlain,
      receiveLabel: receive.label,
      purchasedAtLabel: d.createdAt.toLocaleDateString("vi-VN"),
      expiryLabel: expiresAt
        ? expiresAt.toLocaleDateString("vi-VN")
        : cms.licensesLifetimeValue,
      activatedAtLabel: d.createdAt.toLocaleString("vi-VN"),
      orderId: d.orderItem.order.id,
      orderCode: d.orderItem.order.code,
      locked: !emailVerified,
    };
  });

  return (
    <LicensesView cms={cms} items={items} emailVerified={emailVerified} />
  );
}
