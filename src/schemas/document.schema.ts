import { z } from "zod";

export const documentSchema = z.object({
  id: z.string(),
  submissionDate: z.string(),
  documentName: z.string().max(50).min(2),
  note: z.string(),
});

export const documentCreateSchema = z.object({
  submissionDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid Format. Use 'YYYY-MM-DD'.")
    .refine(
      (data) => {
        const date = new Date(data);
        return !isNaN(date.getTime());
      },
      { message: "Invalid Date." }
    )
    .transform((data) => new Date(data)),
  documentName: z.string().max(50).min(2),
  note: z.string().default(""),
});

export const documentListSchema = documentSchema.array();

export const documentUpdateSchema = documentCreateSchema.partial();
