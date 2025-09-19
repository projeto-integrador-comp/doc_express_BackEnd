import { z } from "zod";
import {
  templateCreateSchema,
  templateListSchema,
  templateReturnSchema,
  templateUpdateSchema,
  templateUploadSchema,
  allowedMimeTypes,
} from "../schemas/template.schema";
import { DeepPartial } from "typeorm";

export type TTemplateCreate = z.infer<typeof templateCreateSchema>;
export type TTemplateReturn = z.infer<typeof templateReturnSchema>;
export type TTemplateList = z.infer<typeof templateListSchema>;
export type TTemplateUpdate = DeepPartial<TTemplateCreate>;
export type TTemplateUpload = z.infer<typeof templateUploadSchema>;
export type TAllowedMimeTypes = (typeof allowedMimeTypes)[number];
