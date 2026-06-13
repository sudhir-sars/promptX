import { ConvexError } from "convex/values";

type ErrorCode = "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "BAD_REQUEST" | "INTERNAL_ERROR";

export type AppError = {
  code: ErrorCode;
  message: string;
};

function fail(code: ErrorCode, message: string): never {
  throw new ConvexError<AppError>({
    code,
    message,
  });
}

export function unauthorized(): never {
  return fail("UNAUTHORIZED", "Authentication required.");
}

export function forbidden(): never {
  return fail("FORBIDDEN", "You do not have permission to access this resource.");
}

export function notFound(resource: string): never {
  return fail("NOT_FOUND", `${resource} not found.`);
}

export function badRequest(message: string): never {
  return fail("BAD_REQUEST", message);
}

export function internalError(message = "Internal server error."): never {
  return fail("INTERNAL_ERROR", message);
}

export function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) internalError(message);
}
