import { z } from "zod";

export const CreateJobRequestSchema = z.object({
    name: z.string().min(1).max(255),
    institution_id: z.number().int(),
    job_type_id: z.number().int(),
});

export type CreateJobRequest = z.infer<typeof CreateJobRequestSchema>;

export const UpdateJobRequestSchema = CreateJobRequestSchema.partial();
export type UpdateJobRequest = z.infer<typeof UpdateJobRequestSchema>;
