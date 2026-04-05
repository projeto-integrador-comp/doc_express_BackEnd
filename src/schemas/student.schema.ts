import { z } from "zod";

export const studentCreateSchema = z.object({
  name: z.string().min(1).max(120),
  classroomId: z.string().uuid("Classroom ID must be a valid UUID"),
});

export const studentUpdateSchema = studentCreateSchema.partial();

export const studentReturnSchema = z.object({
  id: z.string(),
  name: z.string(),
  classroomId: z.string(),
});
