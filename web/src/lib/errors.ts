import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { logger } from "@/lib/logger";
import { recordError } from "@/server/monitoring/errors";

export class AppError extends Error {
  constructor(
    message: string,
    public status = 400,
    public code = "APP_ERROR",
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function toErrorResponse(error: unknown, context?: string) {
  if (error instanceof AppError) {
    recordError(error.status, error.code);
    logger.warn({ err: error, context, code: error.code }, error.message);
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.status },
    );
  }
  if (error instanceof ZodError) {
    recordError(400, "VALIDATION");
    const first = error.issues[0]?.message ?? "Validation failed";
    return NextResponse.json(
      { error: first, details: error.flatten() },
      { status: 400 },
    );
  }
  recordError(500, "INTERNAL");
  logger.error({ err: error, context }, "Unhandled error");
  const message = error instanceof Error ? error.message : "Internal error";
  return NextResponse.json({ error: message, code: "INTERNAL" }, { status: 500 });
}
