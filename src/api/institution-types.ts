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

export async function getInstitutionTypes(parameters?: {
    page?: number;
    perPage?: number;
    sort?: string;
    filterName?: string;
}): Promise<InstitutionTypesListResponse> {
    try {
        const queryParams: Record<string, string | number> = {};

        if (parameters?.page != null) {
            queryParams.page = parameters.page;
        }

        if (parameters?.perPage != null) {
            queryParams.per_page = parameters.perPage;
        }

        if (parameters?.sort != null && parameters.sort.trim().length > 0) {
            queryParams.sort = parameters.sort;
        }

        if (parameters?.filterName != null && parameters.filterName.trim().length > 0) {
            queryParams["filter[name]"] = parameters.filterName;
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
