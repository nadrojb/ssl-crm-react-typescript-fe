import { z } from "zod";
import { apiClient } from "./client";

const UserSchema = z.object({
    id: z.number().int(),
    name: z.string(),
    email: z.string().email(),
});

export type User = z.infer<typeof UserSchema>;

const LoginResponseSchema = z.object({
    token: z.string(),
    user: UserSchema,
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;

const MeResponseSchema = z.object({
    data: UserSchema,
});

export async function loginUser(payload: { email: string; password: string }) {
    const response = await apiClient.post("/login", payload);
    return LoginResponseSchema.parse(response.data);
}

export async function getMe() {
    const response = await apiClient.get("/me");
    return MeResponseSchema.parse(response.data).data;
}