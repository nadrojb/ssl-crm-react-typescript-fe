import { z } from "zod";

import { apiClient } from "./client";
import { toAppError, type AppError } from "./errorHandler";

export const InstitutionTypeSchema = z.object({
    id: z.number().int(),
    name: z.string(),
    created_at: z.union([z.string(), z.null()]).optional(),
    updated_at: z.union([z.string(), z.null()]).optional(),
});

export type InstitutionType = z.infer<typeof InstitutionTypeSchema>;

export const InstitutionTypesListResponseSchema = z.object({
    data: z.array(InstitutionTypeSchema),
    links: z.unknown().optional(),
    meta: z.unknown().optional(),
});

export type InstitutionTypesListResponse = z.infer<
    typeof InstitutionTypesListResponseSchema
>;

export async function getInstitutionTypes(params?: {
    page?: number;
    perPage?: number;
    sort?: string;
    filterName?: string;
}): Promise<InstitutionTypesListResponse> {
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

        const response = await apiClient.get("/institution-types", {
            params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
        });

        return InstitutionTypesListResponseSchema.parse(response.data);
    } catch (error: unknown) {
        const appError: AppError = toAppError(error);
        throw appError;
    }
}
