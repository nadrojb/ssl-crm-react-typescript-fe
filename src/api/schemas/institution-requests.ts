import { z } from "zod";

const NullableDateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .nullable();

export const ExistingContactPayloadSchema = z.object({
  id: z.number().int(),
});

export const NewContactPayloadSchema = z.object({
  first_name: z.string().min(1).max(255),
  last_name: z.string().min(1).max(255),
  email: z.string().trim().toLowerCase().email().max(255),
  phone_number: z.string().max(255).nullable(),
});

export const ContactPayloadSchema = z.union([
  ExistingContactPayloadSchema,
  NewContactPayloadSchema,
]);

export type ExistingContactPayload = z.infer<typeof ExistingContactPayloadSchema>;
export type NewContactPayload = z.infer<typeof NewContactPayloadSchema>;
export type ContactPayload = z.infer<typeof ContactPayloadSchema>;

export const CreateInstitutionRequestSchema = z.object({
  name: z.string().min(1).max(255),
  contact: ContactPayloadSchema.nullable(),
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
