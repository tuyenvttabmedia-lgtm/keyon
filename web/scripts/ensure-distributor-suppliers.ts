/**
 * Upsert FPT + TechData as DISTRIBUTOR / MANUAL_OPS.
 * Remap legacy "NCC Manual Demo" MANUAL variants → TechData (path B).
 * Does not change Instant KEYON Stock, Pool, or Order schema.
 *
 * npm run catalog:ensure-distributors
 */
import {
  IntegrationMode,
  SupplierType,
  type FulfillmentStrategy,
} from "@prisma/client";
import { prisma } from "../src/lib/db";

const TECHDATA = {
  name: "TechData",
  supplierType: SupplierType.DISTRIBUTOR,
  integrationMode: IntegrationMode.MANUAL_OPS,
  notes:
    "Distributor VN — cung ứng qua PO/email. Path A: đệm Instant (Stock Import). Path B: Manual Inbox theo đơn.",
  contactEmail: null as string | null,
} as const;

const FPT = {
  name: "FPT",
  supplierType: SupplierType.DISTRIBUTOR,
  integrationMode: IntegrationMode.MANUAL_OPS,
  notes:
    "Distributor VN — cung ứng qua PO/email. Ưu tiên Manual / volume / account; Instant khi có đệm kho.",
  contactEmail: null as string | null,
} as const;

async function upsertDistributor(spec: {
  name: string;
  supplierType: SupplierType;
  integrationMode: IntegrationMode;
  notes: string;
  contactEmail: string | null;
}) {
  const existing = await prisma.supplier.findUnique({
    where: { name: spec.name },
  });
  if (existing) {
    return prisma.supplier.update({
      where: { id: existing.id },
      data: {
        supplierType: spec.supplierType,
        integrationMode: spec.integrationMode,
        notes: spec.notes,
        active: true,
        ...(existing.contactEmail ? {} : { contactEmail: spec.contactEmail }),
      },
    });
  }
  return prisma.supplier.create({
    data: {
      name: spec.name,
      supplierType: spec.supplierType,
      integrationMode: spec.integrationMode,
      notes: spec.notes,
      contactEmail: spec.contactEmail,
      active: true,
    },
  });
}

async function main() {
  const techdata = await upsertDistributor(TECHDATA);
  const fpt = await upsertDistributor(FPT);

  // Keep PACISOFT row if present (historical); ensure MANUAL_OPS distributor.
  const pacisoft = await prisma.supplier.findUnique({
    where: { name: "PACISOFT" },
  });
  if (pacisoft) {
    await prisma.supplier.update({
      where: { id: pacisoft.id },
      data: {
        supplierType: SupplierType.DISTRIBUTOR,
        integrationMode: IntegrationMode.MANUAL_OPS,
        notes:
          pacisoft.notes ||
          "Distributor manual — báo giá / lấy tay (legacy). Ưu tiên FPT/TechData cho SKU mới.",
      },
    });
  }

  const demo = await prisma.supplier.findFirst({
    where: { name: "NCC Manual Demo" },
  });

  let remapped = 0;
  const remappedSkus: string[] = [];
  if (demo) {
    const manuals = await prisma.productVariant.findMany({
      where: {
        supplierId: demo.id,
        fulfillmentStrategy: "MANUAL" satisfies FulfillmentStrategy,
      },
      select: { id: true, sku: true, deliverableType: true },
    });
    for (const v of manuals) {
      // Path B default → TechData. Volume/portal-ish can stay TechData until ops assigns FPT.
      await prisma.productVariant.update({
        where: { id: v.id },
        data: { supplierId: techdata.id },
      });
      remapped += 1;
      remappedSkus.push(v.sku);
    }
    const left = await prisma.productVariant.count({
      where: { supplierId: demo.id },
    });
    if (left === 0) {
      await prisma.supplier.update({
        where: { id: demo.id },
        data: {
          active: false,
          notes: "Legacy seed — đã chuyển MANUAL sang TechData. Không dùng cho SKU mới.",
        },
      });
    }
  }

  const instantOnDistributors = await prisma.productVariant.findMany({
    where: {
      fulfillmentStrategy: "INSTANT",
      supplierId: { in: [techdata.id, fpt.id] },
      active: true,
    },
    select: { sku: true, supplierId: true },
  });

  const manualOnDistributors = await prisma.productVariant.count({
    where: {
      fulfillmentStrategy: "MANUAL",
      supplierId: { in: [techdata.id, fpt.id] },
      active: true,
    },
  });

  console.log(
    JSON.stringify(
      {
        ok: true,
        suppliers: {
          techdata: techdata.id,
          fpt: fpt.id,
          pacisoft: pacisoft?.id ?? null,
        },
        remappedFromDemo: remapped,
        remappedSkus,
        instantOnFptTechdata: instantOnDistributors.map((v) => v.sku),
        manualOnFptTechdata: manualOnDistributors,
        nextOps: [
          "Gắn contactEmail FPT/TechData trên Admin → Nhà cung cấp",
          "SKU đệm được: set INSTANT + supplier TechData/FPT + Stock Import",
          "SKU theo đơn: giữ MANUAL + Inbox PO/email",
        ],
      },
      null,
      2,
    ),
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
