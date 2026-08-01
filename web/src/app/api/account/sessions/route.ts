import { NextResponse } from "next/server";
import { z } from "zod";
import { readSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  hashSessionToken,
  revokeAllAuthSessions,
  revokeAuthSessionById,
} from "@/server/auth/sessions";

export async function GET() {
  const session = await readSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await prisma.authSession.findMany({
    where: { userId: session.id, revokedAt: null },
    orderBy: { lastSeenAt: "desc" },
    take: 20,
  });

  const currentHash = session.jti ? hashSessionToken(session.jti) : null;

  return NextResponse.json({
    sessions: rows.map((r) => ({
      id: r.id,
      deviceLabel: r.deviceLabel ?? "Thiết bị",
      ip: r.ip,
      lastSeenAt: r.lastSeenAt.toISOString(),
      createdAt: r.createdAt.toISOString(),
      current: currentHash === r.jti,
    })),
  });
}

export async function DELETE(req: Request) {
  const session = await readSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = z
    .object({
      id: z.string().optional(),
      all: z.boolean().optional(),
    })
    .parse(await req.json());

  if (body.all) {
    await revokeAllAuthSessions(session.id, session.jti);
    return NextResponse.json({ ok: true });
  }

  if (!body.id) {
    return NextResponse.json({ error: "Thiếu id" }, { status: 400 });
  }

  await revokeAuthSessionById(session.id, body.id);
  return NextResponse.json({ ok: true });
}
