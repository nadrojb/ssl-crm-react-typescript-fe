// src/api/errorHandler.ts

import axios from "axios";

/**
 * Centralised application error type.
 * All API functions should only throw this shape.
 */
export type AppError =
    | {
    type: "validation";
    errors: Record<string, string[]>;
}
    | {
    type: "server";
    message?: string;
    status?: number;
}
    | {
    type: "network";
    message?: string;
}
    | {
    type: "unknown";
    message?: string;
};

/**
 * Converts an unknown error (axios or otherwise)
 * into a predictable AppError.
 */
export function toAppError(error: unknown): AppError {
    if (axios.isAxiosError(error)) {
        // No response means network error
        if (!error.response) {
            return {
                type: "network",
                message: "Network error. Please check your connection.",
            };
        }

        const { status, data } = error.response;

        // Laravel-style 422 validation
        if (status === 422 && data?.errors) {
            return {
                type: "validation",
                errors: data.errors as Record<string, string[]>,
            };
        }

        return {
            type: "server",
            message:
                (data?.message as string) ??
                "Something went wrong. Please try again.",
            status,
        };
    }

    return {
        type: "unknown",
        message: "An unexpected error occurred.",
    };
}