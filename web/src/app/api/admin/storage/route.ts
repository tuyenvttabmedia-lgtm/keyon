import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getStorageSettingsPublic,
  saveStorageSettings,
} from "@/server/storage/config";
import { resetStorageCache } from "@/server/storage";
import { toErrorResponse } from "@/lib/errors";
import { requireAdminSession } from "@/server/auth/require-staff";

export async function GET() {
  try {
    await requireAdminSession({ capability: "storage", method: "GET" });
    return NextResponse.json(await getStorageSettingsPublic());
  } catch (e) {
    return toErrorResponse(e);
  }
}

export async function PUT(req: Request) {
  try {
    await requireAdminSession({ capability: "storage", method: "PUT" });

    const body = await req.json();
    const parsed = z
      .object({
        driver: z.enum(["local", "wasabi"]),
        wasabi: z.object({
          endpoint: z.string(),
          region: z.string(),
          bucket: z.string(),
          accessKeyId: z.string(),
          publicBaseUrl: z.string().optional(),
          pathPrefix: z.string().optional(),
          secretAccessKey: z.string().optional(),
        }),
      })
      .parse(body);

    if (parsed.driver === "wasabi") {
      if (
        !parsed.wasabi.endpoint.trim() ||
        !parsed.wasabi.region.trim() ||
        !parsed.wasabi.bucket.trim() ||
        !parsed.wasabi.accessKeyId.trim()
      ) {
        return NextResponse.json(
          { error: "Wasabi cần endpoint, region, bucket, access key" },
          { status: 400 },
        );
      }
    }

    await saveStorageSettings(parsed);
    resetStorageCache();
    return NextResponse.json({
      ok: true,
      data: await getStorageSettingsPublic(),
    });
  } catch (e) {
    return toErrorResponse(e);
  }
}
