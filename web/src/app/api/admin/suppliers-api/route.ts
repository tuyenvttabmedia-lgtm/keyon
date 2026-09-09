import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getSupplierApiSettingsPublic,
  saveSupplierApiSettings,
} from "@/server/supplier/config";
import { resetSupplierProvisionerCache } from "@/server/supplier";
import { toErrorResponse } from "@/lib/errors";
import { requireStaffSession } from "@/server/auth/require-staff";

export async function GET() {
  try {
    await requireStaffSession({ capability: "settings", method: "GET" });
    return NextResponse.json(await getSupplierApiSettingsPublic());
  } catch (e) {
    return toErrorResponse(e);
  }
}

export async function PUT(req: Request) {
  try {
    await requireStaffSession({ capability: "settings", method: "PUT" });

    const body = await req.json();
    const parsed = z
      .object({
        pax8: z.object({
          driver: z.enum(["stub", "sandbox", "http"]),
          baseUrl: z.string(),
          clientId: z.string(),
          companyId: z.string(),
          clientSecret: z.string().optional(),
        }),
        pacisoft: z.object({
          enabled: z.boolean(),
          baseUrl: z.string(),
          notes: z.string().optional(),
          apiKey: z.string().optional(),
        }),
      })
      .parse(body);

    if (parsed.pax8.driver === "http") {
      const hasSecret =
        Boolean(parsed.pax8.clientSecret?.trim()) ||
        (await getSupplierApiSettingsPublic()).pax8.clientSecretConfigured;
      if (
        !parsed.pax8.baseUrl.trim() ||
        !parsed.pax8.clientId.trim() ||
        !hasSecret
      ) {
        return NextResponse.json(
          {
            error:
              "Pax8 HTTP cần baseUrl, clientId và clientSecret (hoặc secret đã lưu)",
          },
          { status: 400 },
        );
      }
    }

    await saveSupplierApiSettings(parsed);
    resetSupplierProvisionerCache();
    return NextResponse.json({
      ok: true,
      data: await getSupplierApiSettingsPublic(),
    });
  } catch (e) {
    return toErrorResponse(e);
  }
}
