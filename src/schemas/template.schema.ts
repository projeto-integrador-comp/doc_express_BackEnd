import { z } from "zod";

const allowedMimeTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX
] as const;

const templateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(5).max(50),
  description: z.string().max(255).min(1),
  fileName: z.string().min(1),
  // filePath: z.string().min(1),
  fileUrl: z.string().url().max(500).nullable(),
  fileSize: z.number().int().positive().max(10485760),
  mimeType: z.enum(allowedMimeTypes),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const templateCreateSchema = templateSchema.omit({
  id: true,
  fileUrl: true,
  createdAt: true,
  updatedAt: true,
});

export const templateReturnSchema = templateSchema;

export const templateListSchema = templateReturnSchema.array();

export const templateUpdateSchema = templateCreateSchema.partial();

export const templateUploadSchema = z.object({
  name: z.string().min(5).max(50),
  description: z.string().max(255).min(1),
});

export { allowedMimeTypes };
