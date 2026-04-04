// src/api/institutions.ts

import { apiClient } from "./client";
import { z } from "zod";
import { toAppError } from "./errorHandler";
import { InstitutionSchema } from "./schemas/institution";
import {
    type CreateInstitutionRequest,
    type UpdateInstitutionRequest,
} from "./schemas/institution-requests";

// -----------------------------
// Schemas
// -----------------------------
export const InstitutionsListResponseSchema = z.object({
    data: z.array(InstitutionSchema),
});

export const InstitutionResponseSchema = z.object({
    data: InstitutionSchema,
});

// -----------------------------
// Types
// -----------------------------
export type InstitutionsListResponse = z.infer<typeof InstitutionsListResponseSchema>;
export type InstitutionResponse = z.infer<typeof InstitutionResponseSchema>;
export type Institution = z.infer<typeof InstitutionSchema>;

// -----------------------------
// API functions
// -----------------------------
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
    } catch (error: unknown) {
        throw toAppError(error);
    }
}

export async function getInstitution(id: number): Promise<Institution> {
    try {
        const response = await apiClient.get(`/institutions/${id}`);
        return InstitutionResponseSchema.parse(response.data).data;
    } catch (error: unknown) {
        throw toAppError(error);
    }
}

export async function createInstitution(payload: CreateInstitutionRequest): Promise<Institution> {
    try {
        const response = await apiClient.post("/institutions", payload);
        return InstitutionResponseSchema.parse(response.data).data;
    } catch (error: unknown) {
        throw toAppError(error);
    }
}

export async function updateInstitution(id: number, payload: UpdateInstitutionRequest): Promise<Institution> {
    try {
        const response = await apiClient.patch(`/institutions/${id}`, payload);
        return InstitutionResponseSchema.parse(response.data).data;
    } catch (error: unknown) {
        throw toAppError(error);
    }
}