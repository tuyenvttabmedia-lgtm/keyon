import { NextResponse } from "next/server";
import { getTurnstilePublicClient } from "@/server/turnstile/config";

export const dynamic = "force-dynamic";

/** Public — site key only when Turnstile is enabled + configured. */
export async function GET() {
  const data = await getTurnstilePublicClient();
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "private, max-age=60",
    },
  });
}
