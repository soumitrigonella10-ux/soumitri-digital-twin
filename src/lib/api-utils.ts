// ─────────────────────────────────────────────────────────────
// Shared API route utilities
//
// Centralises helpers that were previously copy-pasted across
// every API route file.
// ─────────────────────────────────────────────────────────────
import { NextResponse } from "next/server";
import { type ZodSchema } from "zod";
import { AUTH_ERRORS } from "@/lib/admin-auth";

/** Map each auth error to its correct HTTP status code. */
const AUTH_STATUS: Record<string, number> = {
  [AUTH_ERRORS.UNAUTHENTICATED]: 401,
  [AUTH_ERRORS.FORBIDDEN]: 403,
};

/**
 * Build a JSON error response.
 *
 * - {@link AUTH_ERRORS.UNAUTHENTICATED} → 401
 * - {@link AUTH_ERRORS.FORBIDDEN} → 403
 * - Everything else → 500 with the `fallback` message (or the real
 *   Error.message when available).
 */
export function errorResponse(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;
  const status = AUTH_STATUS[message] ?? 500;
  return NextResponse.json(
    { success: false, error: message },
    { status },
  );
}

// ── Pagination ───────────────────────────────────────────────

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

/** Parse `?limit=N&offset=N` from query params, clamped to safe bounds. */
export function parsePagination(params: URLSearchParams) {
  const rawLimit = Number(params.get("limit") ?? DEFAULT_LIMIT);
  const rawOffset = Number(params.get("offset") ?? 0);
  return {
    limit: Math.min(Math.max(1, rawLimit || DEFAULT_LIMIT), MAX_LIMIT),
    offset: Math.max(0, rawOffset || 0),
  };
}

// ── ID generation ────────────────────────────────────────────

/**
 * Generate a prefixed UUID primary key.
 *
 * @param prefix - A short domain label, e.g. `"note"`, `"tops"`, `"jewel-rings"`.
 *   Any whitespace is replaced with hyphens and the value is lower-cased.
 */
export function generateId(prefix: string): string {
  const safe = prefix.toLowerCase().replace(/\s+/g, "-");
  return `${safe}_${crypto.randomUUID()}`;
}

// ── Error handling HOF ───────────────────────────────────────

/**
 * Wraps an API route handler with centralised error handling,
 * eliminating the per-handler try/catch + errorResponse boilerplate.
 */
export function withErrorHandling<H extends (...args: never[]) => Promise<NextResponse>>(
  handler: H,
  fallbackMessage: string,
): H {
  return (async (...args: Parameters<H>) => {
    try {
      return await handler(...args);
    } catch (error) {
      return errorResponse(error, fallbackMessage);
    }
  }) as unknown as H;
}

// ── PATCH validation ─────────────────────────────────────────

type PatchResult =
  | { success: true; id: string | number; fields: Record<string, unknown> }
  | { success: false; response: NextResponse };

/**
 * Validates a PATCH body against a partial Zod schema.
 *
 * Extracts the identifier field, validates the remaining fields, and
 * appends an `updatedAt` timestamp.  Returns a discriminated union so
 * callers can bail early: `if (!result.success) return result.response;`
 */
export function validatePatchBody<T>(
  schema: ZodSchema<T>,
  body: Record<string, unknown>,
  idField: string = "id",
): PatchResult {
  const idValue = body[idField];
  if (idValue == null) {
    return {
      success: false,
      response: NextResponse.json(
        { success: false, error: `${idField} is required` },
        { status: 400 },
      ),
    };
  }

  const { [idField]: _omitted, ...updates } = body;
  const parsed = schema.safeParse(updates);

  if (!parsed.success) {
    return {
      success: false,
      response: NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      ),
    };
  }

  return {
    success: true,
    id: idValue as string | number,
    fields: { ...(parsed.data as Record<string, unknown>), updatedAt: new Date() },
  };
}

