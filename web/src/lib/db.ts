import { PrismaClient } from "@prisma/client";

/**
 * Bump when Product/Variant schema fields change so Next.dev
 * drops a stale PrismaClient singleton (avoids Unknown field errors).
 */
const PRISMA_SCHEMA_REV = "20260801140000-brand-content-fields";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaSchemaRev?: string;
};

function createPrisma() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

if (
  process.env.NODE_ENV !== "production" &&
  globalForPrisma.prisma &&
  globalForPrisma.prismaSchemaRev !== PRISMA_SCHEMA_REV
) {
  void globalForPrisma.prisma.$disconnect().catch(() => undefined);
  globalForPrisma.prisma = undefined;
}

export const prisma = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaSchemaRev = PRISMA_SCHEMA_REV;
}
