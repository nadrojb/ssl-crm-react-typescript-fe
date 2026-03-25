import { z } from "zod";
import { apiClient } from "./client";
import { toAppError, type AppError } from "./errorHandler";

const NullableStringSchema = z.string().nullable();

export const InstitutionSchema = z.object({
    id: z.number().int(),
    name: z.string(),
    service_due_at: NullableStringSchema,
    service_booked_at: NullableStringSchema,
    remedials_booked_at: NullableStringSchema,
    created_at: z.string(),
});

export type Institution = z.infer<typeof InstitutionSchema>;

export const JobSchema = z.object({
    id: z.number().int(),
    uuid: NullableStringSchema,
    name: z.string(),
    institution: InstitutionSchema,
    completed_at: NullableStringSchema,
    created_at: z.string(),
    updated_at: z.string(),
});

export type Job = z.infer<typeof JobSchema>;

export const PaginationLinkSchema = z.object({
    url: NullableStringSchema,
    label: z.string(),
    page: z.number().int().nullable(),
    active: z.boolean(),
});

export const JobsResponseSchema = z.object({
    data: z.array(JobSchema),
    links: z.object({
        first: z.string(),
        last: z.string(),
        prev: NullableStringSchema,
        next: NullableStringSchema,
    }),
    meta: z.object({
        current_page: z.number().int(),
        from: z.number().int().nullable(),
        last_page: z.number().int(),
        links: z.array(PaginationLinkSchema),
        path: z.string(),
        per_page: z.number().int(),
        to: z.number().int().nullable(),
        total: z.number().int(),
    }),
});

export type JobsResponse = z.infer<typeof JobsResponseSchema>;

export async function getJobs(params?: {
    page?: number;
}): Promise<JobsResponse> {
    try {
        const response = await apiClient.get("/jobs", {
            params: params?.page ? { page: params.page } : undefined,
        });

        return JobsResponseSchema.parse(response.data);
    } catch (error: unknown) {
        const appError: AppError = toAppError(error);
        throw appError;
    }
}