import { NextResponse } from "next/server";
import { resolveSupplierApi } from "@/server/supplier/config";
import {
  getSupplierProvisioner,
  resetSupplierProvisionerCache,
} from "@/server/supplier";
import { toErrorResponse } from "@/lib/errors";
import { requireStaffSession } from "@/server/auth/require-staff";

/** Validate Pax8 (and reserved NCC) config resolve — stub always OK; http checks creds. */
export async function POST() {
  try {
    await requireStaffSession({ capability: "settings" });

    resetSupplierProvisionerCache();
    const resolved = await resolveSupplierApi();
    const { pax8, pacisoft } = resolved;

    if (pax8.driver === "stub" || pax8.driver === "sandbox") {
      const provisioner = await getSupplierProvisioner();
      return NextResponse.json({
        ok: true,
        pax8Driver: pax8.driver,
        driverSource: pax8.driverSource,
        credentialsSource: pax8.credentialsSource,
        provisioner: provisioner.name,
        pacisoft: {
          enabled: pacisoft.enabled,
          source: pacisoft.source,
          configured: Boolean(pacisoft.baseUrl && pacisoft.apiKey),
        },
        message: `Pax8 ${pax8.driver} OK (provisioner=${provisioner.name})`,
      });
    }

    // http
    const missing: string[] = [];
    if (!pax8.baseUrl) missing.push("baseUrl");
    if (!pax8.clientId) missing.push("clientId");
    if (!pax8.clientSecret) missing.push("clientSecret");
    if (!pax8.companyId) missing.push("companyId (khuyến nghị)");

    if (!pax8.baseUrl || !pax8.clientId || !pax8.clientSecret) {
      return NextResponse.json(
        {
          ok: false,
          error: `Pax8 HTTP thiếu: ${missing.filter((m) => !m.includes("khuyến")).join(", ")}`,
          missing,
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      ok: true,
      pax8Driver: "http",
      driverSource: pax8.driverSource,
      credentialsSource: pax8.credentialsSource,
      baseUrl: pax8.baseUrl,
      companyId: pax8.companyId || null,
      pacisoft: {
        enabled: pacisoft.enabled,
        source: pacisoft.source,
        configured: Boolean(pacisoft.baseUrl && pacisoft.apiKey),
      },
      message:
        "Credentials Pax8 HTTP OK — live adapter chưa bật (provision vẫn dùng stub khi đổi driver)",
      httpLiveEnabled: false,
    });
  } catch (e) {
    if (e && typeof e === "object" && "status" in e) {
      return toErrorResponse(e);
    }
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Test failed" },
      { status: 400 },
    );
  }
}
