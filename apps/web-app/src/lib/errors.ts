import { ConvexError } from "convex/values";
import { toast } from "sonner";
import { AppError } from "../../convex/lib/errors";

export function normalizeError(error: unknown): AppError {
    if (error instanceof ConvexError) {
        return error.data as AppError;
    }

    if (error instanceof Error) {
        return {
            code: "INTERNAL_ERROR",
            message: error.message,
        };
    }

    return {
        code: "INTERNAL_ERROR",
        message: "Something went wrong.",
    };
}

export function consumeError(error: unknown): string {
    const { message } = normalizeError(error);

    toast.error(message);
    return message;
}
