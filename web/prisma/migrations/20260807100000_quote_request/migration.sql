-- CreateEnum
CREATE TYPE "QuoteRequestStatus" AS ENUM ('NEW', 'IN_REVIEW', 'QUOTED', 'CLOSED', 'SPAM');

-- CreateTable
CREATE TABLE "QuoteRequest" (
    "id" TEXT NOT NULL,
    "referenceCode" TEXT NOT NULL,
    "status" "QuoteRequestStatus" NOT NULL DEFAULT 'NEW',
    "requestType" TEXT NOT NULL DEFAULT 'GENERAL',
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "jobTitle" TEXT,
    "interestedProducts" JSONB NOT NULL DEFAULT '[]',
    "estimatedUsers" TEXT NOT NULL,
    "estimatedUsersOther" INTEGER,
    "licenseType" TEXT NOT NULL DEFAULT 'UNDECIDED',
    "term" TEXT NOT NULL DEFAULT 'UNDECIDED',
    "message" TEXT,
    "privacyAcceptedAt" TIMESTAMP(3) NOT NULL,
    "sourcePath" TEXT,
    "ipHash" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuoteRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuoteRequest_referenceCode_key" ON "QuoteRequest"("referenceCode");

-- CreateIndex
CREATE INDEX "QuoteRequest_status_createdAt_idx" ON "QuoteRequest"("status", "createdAt");

-- CreateIndex
CREATE INDEX "QuoteRequest_email_createdAt_idx" ON "QuoteRequest"("email", "createdAt");

-- CreateIndex
CREATE INDEX "QuoteRequest_requestType_createdAt_idx" ON "QuoteRequest"("requestType", "createdAt");
