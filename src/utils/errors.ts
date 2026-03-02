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