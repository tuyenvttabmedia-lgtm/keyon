import { NextResponse } from "next/server";
import { toErrorResponse } from "@/lib/errors";
import {
  getQuoteTrackStatusForSession,
  isQuotePublicTrackingEnabled,
} from "@/server/quote/tracking";

export async function GET() {
  try {
    const enabled = await isQuotePublicTrackingEnabled();
    if (!enabled) {
      return NextResponse.json(
        { error: "Tính năng tra cứu chưa được bật", enabled: false },
        { status: 403 },
      );
    }

    const quote = await getQuoteTrackStatusForSession();
    if (!quote) {
      return NextResponse.json(
        { error: "Chưa xác minh hoặc phiên hết hạn", authenticated: false },
        { status: 401 },
      );
    }

    return NextResponse.json({ ok: true, quote, authenticated: true });
  } catch (e) {
    return toErrorResponse(e);
  }
}
