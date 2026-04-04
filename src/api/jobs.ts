import { z } from "zod";
import { apiClient } from "./client";
import { toAppError } from "./errorHandler";
import JobDetailsSchema, {
    JobSchema,
    type Job,
    type JobDetails,
} from "./schemas/job";
import {
    InstitutionSchema,
    type Institution,
    type InstitutionType,
    type PrimaryContact,
} from "./schemas/institution";

// Re-exports
export { InstitutionSchema, type Institution, type InstitutionType, type PrimaryContact };
export { JobSchema, type Job };
export type { JobDetails };

// Schemas
export const JobsListResponseSchema = z.object({
    data: z.array(JobSchema),
});

export const JobResponseSchema = z.object({
    data: JobDetailsSchema,
});

// Types
export type JobsListResponse = z.infer<typeof JobsListResponseSchema>;
export type JobResponse = z.infer<typeof JobResponseSchema>;

// API functions
export async function getJobs(params?: {
    page?: number;
    perPage?: number;
    sort?: string;
    filterName?: string;
    filterInstitutionId?: number;
}): Promise<JobsListResponse> {
    try {
        const response = await apiClient.get("/jobs", {
            params: {
                page: params?.page,
                per_page: params?.perPage,
                sort: params?.sort,
                "filter[name]": params?.filterName,
                "filter[institution_id]": params?.filterInstitutionId,
            },
        });

        return JobsListResponseSchema.parse(response.data);
    } catch (error) {
        throw toAppError(error);
    }
}

export async function getJob(id: number): Promise<JobDetails> {
    try {
        const response = await apiClient.get(`/jobs/${id}`);
        return JobResponseSchema.parse(response.data).data;
    } catch (error) {
        throw toAppError(error);
    }
}