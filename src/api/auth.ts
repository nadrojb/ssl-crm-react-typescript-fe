import { z } from "zod";

import { apiClient } from "./client";

export type LoginPayload = {
    email: string;
    password: string;
};

const AuthUserSchema = z.object({
    id: z.number().int(),
    name: z.string(),
    email: z.string().email(),
});

export type User = z.infer<typeof AuthUserSchema>;

const LoginResponseSchema = z.object({
    token: z.string(),
    user: AuthUserSchema,
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;

const MeResponseSchema = z.object({
    data: AuthUserSchema,
});

type MeResponse = z.infer<typeof MeResponseSchema>;

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
    const response = await apiClient.post("/login", payload);
    return LoginResponseSchema.parse(response.data);
}

export async function getMe(): Promise<User> {
    const response = await apiClient.get("/me");
    const parsed: MeResponse = MeResponseSchema.parse(response.data);
    return parsed.data;
}