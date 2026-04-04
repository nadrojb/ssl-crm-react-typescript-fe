import { apiClient } from "./client";
import { toAppError, type AppError } from "./errorHandler";
import { z } from "zod";

export const JobTypeSchema = z.object({
    id: z.number().int(),
    name: z.string(),
    created_at: z.string().nullable().optional(),
    updated_at: z.string().nullable().optional(),
})

export type JobType = z.infer<typeof JobTypeSchema>;

const JobTypesListResponseSchema = z.object({
    data: z.array(JobTypeSchema),
})

export type JobTypesListResponse = z.infer<typeof JobTypesListResponseSchema>;

export async function getJobTypes(parameters?: {
    page?: number;
    perPage?: number;
    sort?: string;
    filterName?: string;
}): Promise<JobTypesListResponse> {
    try {
        const response = await apiClient.get("/job-types", {
            params: {
                page: parameters?.page,
                per_page: parameters?.perPage,
                sort: parameters?.sort,
                "filter[name]": parameters?.filterName,
            }
        })

        return JobTypesListResponseSchema.parse(response.data);
    } catch (error: unknown) {
        const appError: AppError = toAppError(error);
        throw appError;
    }
}