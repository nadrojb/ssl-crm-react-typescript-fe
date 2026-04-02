import { z } from "zod";

const NullableDateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .nullable();

export const CreateInstitutionRequestSchema = z.object({
  name: z.string().min(1).max(255),
  primary_contact_id: z.number().int().nullable(),
  type_id: z.number().int().nullable(),
  service_due_at: NullableDateStringSchema,
  service_booked_at: NullableDateStringSchema,
  remedials_booked_at: NullableDateStringSchema,
});

export type CreateInstitutionRequest = z.infer<
  typeof CreateInstitutionRequestSchema
>;

export const UpdateInstitutionRequestSchema = CreateInstitutionRequestSchema.partial();

export type UpdateInstitutionRequest = z.infer<
  typeof UpdateInstitutionRequestSchema
>;
