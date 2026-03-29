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
  crm_job_type: z
    .object({
      id: z.number().int(),
      name: z.string(),
      created_at: z.union([z.string(), z.null()]).optional(),
      updated_at: z.union([z.string(), z.null()]).optional(),
    })
    .optional(),
  users: z
    .array(
      z.object({
        id: z.number().int(),
        name: z.string(),
        last_name: z.string().nullable().optional(),
        email: z.string().optional(),
        created_at: z.string().optional(),
      })
    )
    .optional(),
  completed_at: NullableStringSchema,
  created_at: z.string(),
  updated_at: z.string(),
});

const JobDetailsSchema = z.object({
  id: z.number().int(),
  uuid: NullableStringSchema,
  name: z.string(),
  institution: JobInstitutionSchema.optional(),
  crm_job_type: z
    .object({
      id: z.number().int(),
      name: z.string(),
      created_at: z.union([z.string(), z.null()]).optional(),
      updated_at: z.union([z.string(), z.null()]).optional(),
    })
    .optional(),
  users: z
    .array(
      z.object({
        id: z.number().int(),
        name: z.string(),
        last_name: z.string().nullable().optional(),
        email: z.string().optional(),
        created_at: z.string().optional(),
      })
    )
    .optional(),
  completed_at: NullableStringSchema,
  created_at: z.string(),
  updated_at: z.string(),
});
export default JobDetailsSchema

export type JobInstitution = z.infer<typeof JobInstitutionSchema>;
export type Job = z.infer<typeof JobSchema>;
export type JobDetails = z.infer<typeof JobDetailsSchema>;
