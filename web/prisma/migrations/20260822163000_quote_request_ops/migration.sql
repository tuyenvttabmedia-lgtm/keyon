-- Quote request ops: internal note, assignee, linked support ticket
ALTER TABLE "QuoteRequest" ADD COLUMN "adminNote" TEXT;
ALTER TABLE "QuoteRequest" ADD COLUMN "assigneeId" TEXT;
ALTER TABLE "QuoteRequest" ADD COLUMN "supportTicketId" TEXT;

CREATE UNIQUE INDEX "QuoteRequest_supportTicketId_key" ON "QuoteRequest"("supportTicketId");
CREATE INDEX "QuoteRequest_assigneeId_status_idx" ON "QuoteRequest"("assigneeId", "status");

ALTER TABLE "QuoteRequest" ADD CONSTRAINT "QuoteRequest_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "QuoteRequest" ADD CONSTRAINT "QuoteRequest_supportTicketId_fkey" FOREIGN KEY ("supportTicketId") REFERENCES "SupportTicket"("id") ON DELETE SET NULL ON UPDATE CASCADE;
