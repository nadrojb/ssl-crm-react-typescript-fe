import { z } from "zod";

const NullableStringSchema = z.string().nullable();

export const JobInstitutionSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  service_due_at: NullableStringSchema,
  service_booked_at: NullableStringSchema,
  remedials_booked_at: NullableStringSchema,
  created_at: z.string(),
});

export const JobSchema = z.object({
  id: z.number().int(),
  uuid: NullableStringSchema,
  name: z.string(),
  institution: JobInstitutionSchema,
  completed_at: NullableStringSchema,
  created_at: z.string(),
  updated_at: z.string(),
});

export type JobInstitution = z.infer<typeof JobInstitutionSchema>;
export type Job = z.infer<typeof JobSchema>;
