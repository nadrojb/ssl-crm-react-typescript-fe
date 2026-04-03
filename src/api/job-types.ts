import { apiClient } from "./client";
import { toAppError, type AppError } from "./errorHandler";

export async function getJobTypes() {
    try {
        const response = await apiClient.get("/job-types");
        return response.data;

    } catch (error: unknown) {
        const appError: AppError = toAppError(error);
        throw appError;
    }
}