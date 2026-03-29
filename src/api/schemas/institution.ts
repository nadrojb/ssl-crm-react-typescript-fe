import { z } from "zod";

const NullableStringSchema = z.string().nullable();

export const PrimaryContactSchema = z
  .object({
    id: z.number().int(),
    first_name: z.string(),
    last_name: z.string(),
    email: z.string(),
    phone_number: NullableStringSchema,
    created_at: z.string(),
  })
  .nullable();

export const InstitutionTypeSchema = z
  .object({
    id: z.number().int(),
    name: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
  })
  .nullable();

export const InstitutionSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  primary_contact: PrimaryContactSchema,
  type: InstitutionTypeSchema,
  service_due_at: NullableStringSchema,
  service_booked_at: NullableStringSchema,
  remedials_booked_at: NullableStringSchema,
  created_at: z.string(),
});

export type PrimaryContact = z.infer<typeof PrimaryContactSchema>;
export type InstitutionType = z.infer<typeof InstitutionTypeSchema>;
export type Institution = z.infer<typeof InstitutionSchema>;
