import { z } from "zod";

export const TaskStatusSchema = z.enum(["important", "inProgress", "upcoming", "completed"]);

export const TaskSchema = z.object({
  id: z.number(),
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().min(5, "Description must be at least 5 characters").max(500),
  status: TaskStatusSchema,
  tag: z.string().min(2, "Tag must be at least 2 characters"),
  date: z.string(),
});

export const CreateTaskSchema = TaskSchema.omit({ id: true, date: true }).extend({
  date: z.string().optional(),
});

export type Task = z.infer<typeof TaskSchema>;
export type TaskStatus = z.infer<typeof TaskStatusSchema>;
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
