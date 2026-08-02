import { NextResponse } from "next/server";
import { z } from "zod";
import { readSession } from "@/lib/auth";
import {
  getStorageSettingsPublic,
  saveStorageSettings,
} from "@/server/storage/config";
import { resetStorageCache } from "@/server/storage";

async function requireAdmin() {
  const session = await readSession();
  if (!session || session.role !== "ADMIN") return null;
  return session;
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await getStorageSettingsPublic());
}

export async function PUT(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
}
