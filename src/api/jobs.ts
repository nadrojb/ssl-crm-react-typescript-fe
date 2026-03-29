import { z } from "zod";
import { apiClient } from "./client";
import { toAppError, type AppError } from "./errorHandler";
import JobDetailsSchema, {
    JobSchema,
    type Job,
    type JobDetails
} from "./schemas/job";
import {
    InstitutionSchema,
    type Institution,
    type InstitutionType,
    type PrimaryContact,
} from "./schemas/institution";

export { InstitutionSchema, type Institution, type InstitutionType, type PrimaryContact };
export { JobSchema, type Job };

export type { JobDetails };

export const JobsListResponseSchema = z.object({
    data: z.array(JobSchema),
    links: z.unknown().optional(),
    meta: z.unknown().optional(),
});

export type JobsListResponse = z.infer<typeof JobsListResponseSchema>;

export const JobResponseSchema = z.object({
    data: JobDetailsSchema,
});

export type JobResponse = z.infer<typeof JobResponseSchema>;

export async function getJobs(params?: {
    page?: number;
    perPage?: number;
    sort?: string;
    filterName?: string;
    filterInstitutionId?: number;
}): Promise<JobsListResponse> {
    try {
        const queryParams: Record<string, string | number> = {};

        if (params?.page != null) {
            queryParams.page = params.page;
        }

        if (params?.perPage != null) {
            queryParams.per_page = params.perPage;
        }

        if (params?.sort != null && params.sort.trim().length > 0) {
            queryParams.sort = params.sort;
        }

        if (params?.filterName != null && params.filterName.trim().length > 0) {
            queryParams["filter[name]"] = params.filterName;
        }

        if (params?.filterInstitutionId != null) {
            queryParams["filter[institution_id]"] = params.filterInstitutionId;
        }

        const response = await apiClient.get("/jobs", {
            params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
        });

        return JobsListResponseSchema.parse(response.data);
    } catch (error: unknown) {
        const appError: AppError = toAppError(error);
        throw appError;
    }
}

export async function getJob(id: number): Promise<JobDetails> {
    try {
        const response = await apiClient.get(`/jobs/${id}`);
        return JobResponseSchema.parse(response.data).data;
    } catch (error: unknown) {
        const appError: AppError = toAppError(error);
        throw appError;
    }
}