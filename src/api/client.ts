import axios from "axios";

const stripNulls = (value: unknown): unknown => {
    if (value === null) {
        return undefined;
    }

    if (Array.isArray(value)) {
        return value.map(stripNulls);
    }

    if (typeof value === "object" && value !== null) {
        const result: Record<string, unknown> = {};

        for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
            if (nested !== null) {
                result[key] = stripNulls(nested);
            }
        }

        return result;
    }

    return value;
};

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use((config) => {
    if (config.data != null) {
        config.data = stripNulls(config.data);
    }
    return config;
});