// src/utils/errors.ts

/**
 * Generic field error map used by forms
 */
export type FieldErrors<T extends string = string> = Partial<
    Record<T, string>
>;

/**
 * Converts backend validation errors:
 * { email: ["Invalid email"] }
 *
 * Into:
 * { email: "Invalid email" }
 */
export function mapValidationErrors<T extends string = string>(
    errors: Record<string, string[]>
): FieldErrors<T> {
    const result: FieldErrors<T> = {};

    for (const [key, messages] of Object.entries(errors)) {
        if (Array.isArray(messages) && messages.length > 0) {
            result[key as T] = messages[0];
        }
    }

    return result;
}

export function getErrorMessage(err: unknown): string {
    if (typeof err !== "object" || err === null) {
        return "Something went wrong";
    }

    const error = err as Record<string, unknown>;

    if (error.type === "validation") {
        return "Please fix the errors below.";
    }

    if (error.type === "server") {
        const status = typeof error.status === "number" ? error.status : 500;
        if (status >= 400 && status < 500 && typeof error.message === "string") {
            return error.message;
        }
        return "Something went wrong. Please try again.";
    }

    if (error.type === "network") {
        return "Network error. Please check your connection.";
    }

    if (err instanceof Error) {
        return err.message;
    }

    return "Something went wrong";
}