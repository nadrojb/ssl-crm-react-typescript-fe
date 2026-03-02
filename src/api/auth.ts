import { apiClient } from "./client";

export interface LoginPayload {
    email: string;
    password: string;
}

export async function loginUser(payload: LoginPayload) {
    const response = await apiClient.post("/login", payload);
    return response.data;
}