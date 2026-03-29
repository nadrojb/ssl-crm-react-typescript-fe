import { apiClient } from "./client";
import { z } from "zod";
import { toAppError, type AppError } from "./errorHandler";
import { InstitutionSchema } from "./schemas/institution";

export const InstitutionsListResponseSchema = z.object({
    data: z.array(InstitutionSchema),
});

export type InstitutionsListResponse = z.infer<
    typeof InstitutionsListResponseSchema
>;

export async function getInstitutions(params?: {
    page?: number;
}): Promise<InstitutionsListResponse> {
    try {
        const response = await apiClient.get("/institutions", {
            params: params?.page ? { page: params.page } : undefined,
        });

        return InstitutionsListResponseSchema.parse(response.data);
    } catch (error: unknown) {
        const appError: AppError = toAppError(error);
        throw appError;
    }
}