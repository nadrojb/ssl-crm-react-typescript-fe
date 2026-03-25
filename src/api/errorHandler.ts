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

        const isRecord = (value: unknown): value is Record<string, unknown> => {
            return typeof value === "object" && value !== null;
        };

        const getMessageFromData = (value: unknown): string | undefined => {
            if (!isRecord(value)) {
                return undefined;
            }

            const message = value.message;
            return typeof message === "string" ? message : undefined;
        };

        const getValidationErrorsFromData = (
            value: unknown
        ): Record<string, string[]> | undefined => {
            if (!isRecord(value)) {
                return undefined;
            }

            const errors = value.errors;
            if (!isRecord(errors)) {
                return undefined;
            }

            const result: Record<string, string[]> = {};
            for (const [key, raw] of Object.entries(errors)) {
                if (Array.isArray(raw) && raw.every((item) => typeof item === "string")) {
                    result[key] = raw;
                }
            }

            return Object.keys(result).length > 0 ? result : undefined;
        };

        // Laravel-style 422 validation
        const validationErrors = getValidationErrorsFromData(data);
        if (status === 422 && validationErrors) {
            return {
                type: "validation",
                errors: validationErrors,
            };
        }

        const message = getMessageFromData(data);
        return {
            type: "server",
            message: message ?? "Something went wrong. Please try again.",
            status,
        };
    }

    return {
        type: "unknown",
        message: "An unexpected error occurred.",
    };
}

export function isAppError(error: unknown): error is AppError {
    if (typeof error !== "object" || error === null) {
        return false;
    }

    const typeValue: unknown = Reflect.get(error, "type");
    if (typeof typeValue !== "string") {
        return false;
    }

    return (
        typeValue === "validation" ||
        typeValue === "server" ||
        typeValue === "network" ||
        typeValue === "unknown"
    );
}

export function getAppErrorMessage(error: AppError): string {
    if (error.type === "validation") {
        return "Validation error.";
    }

    return error.message ?? "Something went wrong. Please try again.";
}