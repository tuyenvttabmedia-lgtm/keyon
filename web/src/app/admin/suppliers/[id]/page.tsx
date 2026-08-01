import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  fulfillmentStrategyLabel,
  type AdminSupplierVariantRow,
} from "@/lib/admin-suppliers";
import { InventoryReadModel } from "@/server/inventory-read-model";
import { getSupplierApiSettingsPublic } from "@/server/supplier/config";
import { receiveFromDeliverable } from "@/storefront/lib/customer-labels";
import { SupplierDetail } from "../supplier-detail";

export const dynamic = "force-dynamic";

export default async function AdminSupplierDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supplier = await prisma.supplier.findUnique({
    where: { id },
    include: {
      variants: {
        include: { product: true },
        orderBy: { sku: "asc" },
      },
      _count: { select: { variants: true } },
    },
  });
  if (!supplier) notFound();

  const variantIds = supplier.variants.map((v) => v.id);

  const [waitingHumanCount, invRows, apiPublic] = await Promise.all([
    variantIds.length
      ? prisma.fulfillmentJob.count({
          where: {
            status: "WAITING_HUMAN",
            orderItem: { variantId: { in: variantIds } },
          },
        })
      : Promise.resolve(0),
    supplier.supplierType === "INTERNAL"
      ? InventoryReadModel.listInstantSkus().catch(() => [])
      : Promise.resolve([]),
    supplier.integrationMode === "API"
      ? getSupplierApiSettingsPublic().catch(() => null)
      : Promise.resolve(null),
  ]);

  const variantIdSet = new Set(variantIds);
  let inventory: { available: number; reserved: number } | null = null;
  if (supplier.supplierType === "INTERNAL") {
    const mine = invRows.filter((r) => variantIdSet.has(r.variantId));
    inventory = {
      available: mine.reduce((a, r) => a + r.available, 0),
      reserved: mine.reduce((a, r) => a + r.reserved, 0),
    };
  }

  const variants: AdminSupplierVariantRow[] = supplier.variants.map((v) => ({
    id: v.id,
    sku: v.sku,
    variantName: v.name,
    productId: v.productId,
    productName: v.product.name,
    productSlug: v.product.slug,
    deliverableLabel: receiveFromDeliverable(v.deliverableType).label,
    strategyLabel: fulfillmentStrategyLabel(v.fulfillmentStrategy),
    active: v.active && v.product.active,
  }));

  return (
    <SupplierDetail
      supplier={{
        id: supplier.id,
        name: supplier.name,
        supplierType: supplier.supplierType,
        integrationMode: supplier.integrationMode,
        active: supplier.active,
        contactName: supplier.contactName,
        contactEmail: supplier.contactEmail,
        website: supplier.website,
        notes: supplier.notes,
        skuCount: supplier._count.variants,
      }}
      variants={variants}
      waitingHumanCount={waitingHumanCount}
      inventory={inventory}
      apiPublic={apiPublic}
    />
  );
}
