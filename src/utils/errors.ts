import { isAppError } from "../api/errorHandler";

export function mapValidationErrors(
    errors: Record<string, string[]>
): Record<string, string> {
    const result: Record<string, string> = {};

    for (const [key, messages] of Object.entries(errors)) {
        if (Array.isArray(messages) && messages.length > 0) {
            result[key] = messages[0];
        }
    }

    return result;
}

export function getErrorMessage(err: unknown): string {
    if (!isAppError(err)) {
        if (err instanceof Error) return err.message;
        return "Something went wrong";
    }

    if (err.type === "validation") {
        return "Please fix the errors below.";
    }

    if (err.type === "server") {
        const status = err.status ?? 500;
        if (status >= 400 && status < 500 && err.message) {
            return err.message;
        }
        return "Something went wrong. Please try again.";
    }

    if (err.type === "network") {
        return "Network error. Please check your connection.";
    }

    return "Something went wrong";
}