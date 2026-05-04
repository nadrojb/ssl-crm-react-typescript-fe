import { z } from "zod";

export const CreateTaskRequestSchema = z.object({
    name: z.string().min(1).max(255),
    status_id: z.number().int(),
    priority_id: z.number().int(),
    description: z.string().nullable(),
    user_id: z.number().int().nullable(),
    crm_job_id: z.number().int(),
});

export type CreateTaskRequest = z.infer<typeof CreateTaskRequestSchema>;

export const UpdateTaskRequestSchema = CreateTaskRequestSchema.partial();
export type UpdateTaskRequest = z.infer<typeof UpdateTaskRequestSchema>;