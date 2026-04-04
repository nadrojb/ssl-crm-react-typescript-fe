import { z } from "zod";
import { apiClient } from "./client";

export const InstitutionTypeSchema = z.object({
    id: z.number().int(),
    name: z.string(),
    created_at: z.string().nullable().optional(),
    updated_at: z.string().nullable().optional(),
});

export type InstitutionType = z.infer<typeof InstitutionTypeSchema>;

const InstitutionTypesListResponseSchema = z.object({
    data: z.array(InstitutionTypeSchema),
});

export type InstitutionTypesListResponse =
    z.infer<typeof InstitutionTypesListResponseSchema>;

export async function getInstitutionTypes(parameters?: {
    page?: number;
    perPage?: number;
    sort?: string;
    filterName?: string;
}): Promise<InstitutionTypesListResponse> {
    const response = await apiClient.get("/institution-types", {
        params: {
            page: parameters?.page,
            per_page: parameters?.perPage,
            sort: parameters?.sort,
            "filter[name]": parameters?.filterName,
        },
    });

    return InstitutionTypesListResponseSchema.parse(response.data);
}