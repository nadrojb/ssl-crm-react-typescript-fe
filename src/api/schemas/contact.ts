import { z } from "zod";

const NullableStringSchema = z.string().nullable();

export const ContactSchema = z.object({
  id: z.number().int(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  phone_number: NullableStringSchema,
  created_at: z.union([z.string(), z.null()]).optional(),
  updated_at: z.union([z.string(), z.null()]).optional(),
});

export type Contact = z.infer<typeof ContactSchema>;

export const ContactsListResponseSchema = z.object({
  data: z.array(ContactSchema),
  links: z.unknown().optional(),
  meta: z.unknown().optional(),
});

export type ContactsListResponse = z.infer<typeof ContactsListResponseSchema>;

export const ContactResponseSchema = z.object({
  data: ContactSchema,
});

export type ContactResponse = z.infer<typeof ContactResponseSchema>;

export const CreateContactRequestSchema = z.object({
  first_name: z.string().min(1).max(255),
  last_name: z.string().min(1).max(255),
  email: z.string().trim().toLowerCase().email().max(255),
  phone_number: z.string().max(255).nullable(),
  crm_job_id: z.number().int().nullable(),
});

export type CreateContactRequest = z.infer<typeof CreateContactRequestSchema>;
