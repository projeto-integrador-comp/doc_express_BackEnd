import { z } from "zod";

export const classroomCreateSchema = z.object({
  name: z.string().min(1).max(120),
  teacherId: z.string().uuid("Teacher ID must be a valid UUID"),
  monitorIds: z.array(z.string().uuid()).optional().default([]),
});

export const classroomUpdateSchema = classroomCreateSchema.partial();

export const classroomReturnSchema = z.object({
  id: z.string(),
  name: z.string(),
  teacherId: z.string(),
  monitorIds: z.array(z.string()),
});
