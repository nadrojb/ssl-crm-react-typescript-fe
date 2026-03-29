import { apiClient } from "./client";
import { z } from "zod";
import { toAppError, type AppError } from "./errorHandler";
import { InstitutionSchema } from "./schemas/institution";

export const InstitutionsListResponseSchema = z.object({
    data: z.array(InstitutionSchema),
    links: z.unknown().optional(),
    meta: z.unknown().optional(),
});

export type InstitutionsListResponse = z.infer<
    typeof InstitutionsListResponseSchema
>;

export const InstitutionResponseSchema = z.object({
    data: InstitutionSchema,
});

export type InstitutionResponse = z.infer<typeof InstitutionResponseSchema>;

export async function getInstitutions(params?: {
    page?: number;
    perPage?: number;
    sort?: string;
    filterName?: string;
    filterTypeId?: number;
}): Promise<InstitutionsListResponse> {
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

        if (params?.filterTypeId != null) {
            queryParams["filter[type_id]"] = params.filterTypeId;
        }

        const response = await apiClient.get("/institutions", {
            params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
        });

        return InstitutionsListResponseSchema.parse(response.data);
    } catch (error: unknown) {
        const appError: AppError = toAppError(error);
        throw appError;
    }
}

export async function getInstitution(id: number) {
    try {
        const response = await apiClient.get(`/institutions/${id}`);
        return InstitutionResponseSchema.parse(response.data).data;
    } catch (error: unknown) {
        const appError: AppError = toAppError(error);
        throw appError;
    }
}