import { InventoryReadModel } from "@/server/inventory-read-model";
import { collectMonitoringSnapshot } from "@/server/monitoring";

/**
 * Dashboard facade — Compose Read Models only.
 * UI phải gọi hàm này (hoặc 2 nguồn IRM + Monitoring), không Prisma Domain.
 */
export async function loadDashboardView() {
  const [inventory, monitoring] = await Promise.all([
    InventoryReadModel.dashboardSummary(),
    collectMonitoringSnapshot(),
  ]);
  return { inventory, monitoring };
}
