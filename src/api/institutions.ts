// src/api/institutions.ts

import { apiClient } from "./client";
import { z } from "zod";
import { toAppError } from "./errorHandler";
import { InstitutionSchema } from "./schemas/institution";
import {
    type CreateInstitutionRequest, type DeleteInstitutionRequest,
    type UpdateInstitutionRequest,
} from "./schemas/institution-requests";

export const InstitutionsListResponseSchema = z.object({
    data: z.array(InstitutionSchema),
});

export const InstitutionResponseSchema = z.object({
    data: InstitutionSchema,
});

export type InstitutionsListResponse = z.infer<typeof InstitutionsListResponseSchema>;
export type InstitutionResponse = z.infer<typeof InstitutionResponseSchema>;
export type Institution = z.infer<typeof InstitutionSchema>;

export async function getInstitutions(params?: {
    page?: number;
    perPage?: number;
    sort?: string;
    filterName?: string;
    filterTypeId?: number;
}): Promise<InstitutionsListResponse> {
    try {
        const response = await apiClient.get("/institutions", { params });
        return InstitutionsListResponseSchema.parse(response.data);
    } catch (error) {
        throw toAppError(error);
    }
}

export async function getInstitution(id: number) {
    try {
        const response = await apiClient.get(`/institutions/${id}`);
        return InstitutionResponseSchema.parse(response.data).data;
    } catch (error) {
        throw toAppError(error);
    }
}

export async function createInstitution(payload: CreateInstitutionRequest) {
    try {
        const response = await apiClient.post("/institutions", payload);
        return InstitutionResponseSchema.parse(response.data).data;
    } catch (error) {
        throw toAppError(error);
    }
}

export async function updateInstitution(id: number, payload: UpdateInstitutionRequest) {
    try {
        const response = await apiClient.patch(`/institutions/${id}`, payload);
        return InstitutionResponseSchema.parse(response.data).data;
    } catch (error) {
        throw toAppError(error);
    }
}

export async function deleteInstitution(id: number, payload: DeleteInstitutionRequest): Promise<void> {
    try {
        await apiClient.delete(`/institutions/${id}`, {
            data: payload,
        });
    } catch (error) {
        throw toAppError(error);
    }
}