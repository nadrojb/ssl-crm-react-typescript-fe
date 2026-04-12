import axios from "axios";
import { ZodError } from "zod";

export type AppError =
    | { type: "validation"; errors: Record<string, string[]> }
    | { type: "server"; message?: string; status?: number }
    | { type: "network"; message?: string }
    | { type: "unknown"; message?: string };

export function toAppError(error: unknown): AppError {
    if (axios.isAxiosError(error)) {
        if (!error.response) {
            return { type: "network", message: "Network error. Check your connection." };
        }

        const { status, data } = error.response as { status: number; data: any };

        if (status === 422 && data?.errors) {
            return { type: "validation", errors: data.errors };
        }

        return { type: "server", message: data?.message ?? "Something went wrong.", status };
    }

    if (error instanceof ZodError) {
        console.error("[AppError] Response schema mismatch:", error.issues);
        return { type: "unknown", message: "Unexpected response format from the server." };
    }

    console.error("[AppError] Unexpected error:", error);
    return { type: "unknown", message: "An unexpected error occurred." };
}

export function isAppError(error: unknown): error is AppError {
    return typeof error === "object" && error !== null && "type" in error;
}

export function getAppErrorMessage(error: AppError): string {
    if (error.type === "validation") return "Validation error.";
    return error.message ?? "Something went wrong.";
}