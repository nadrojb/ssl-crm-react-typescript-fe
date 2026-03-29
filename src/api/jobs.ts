import { z } from "zod";
import { apiClient } from "./client";
import { toAppError, type AppError } from "./errorHandler";
import { JobSchema, type Job } from "./schemas/job";
import {
    InstitutionSchema,
    type Institution,
    type InstitutionType,
    type PrimaryContact,
} from "./schemas/institution";

export { InstitutionSchema, type Institution, type InstitutionType, type PrimaryContact };
export { JobSchema, type Job };

export const JobsListResponseSchema = z.object({
    data: z.array(JobSchema),
});

export type JobsListResponse = z.infer<typeof JobsListResponseSchema>;

export async function getJobs(params?: {
    page?: number;
}): Promise<JobsListResponse> {
    try {
        const response = await apiClient.get("/jobs", {
            params: params?.page ? { page: params.page } : undefined,
        });

        return JobsListResponseSchema.parse(response.data);
    } catch (error: unknown) {
        const appError: AppError = toAppError(error);
        throw appError;
    }
}