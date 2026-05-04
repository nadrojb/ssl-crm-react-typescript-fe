import { z } from "zod";

export const TaskPrioritySchema = z.object({
  id: z.number().int(),
  name: z.string(),
});

export const TaskStatusSchema = z.object({
  id: z.number().int(),
  name: z.string(),
});

export const TaskSchema = z.object({
  id: z.number().int(),
  uuid: z.string().nullable(),
  name: z.string(),
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
  priority: TaskPrioritySchema,
  status: TaskStatusSchema,
  description: z.string().nullable(),
  completed_at: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export default TaskSchema
