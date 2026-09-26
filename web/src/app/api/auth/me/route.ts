import { NextResponse } from "next/server";
import { isStaff, readSession } from "@/lib/auth";

/** Lightweight session probe for client header (keeps marketing HTML cacheable). */
export async function GET() {
  const session = await readSession();
  if (!session) {
    return NextResponse.json(
      { email: null, isStaff: false },
      {
        headers: {
          "Cache-Control": "private, no-store",
        },
      },
    );
  }
  return NextResponse.json(
    {
      email: session.email,
      isStaff: isStaff(session.role),
    },
    {
      headers: {
        "Cache-Control": "private, no-store",
      },
    },
  );
}
