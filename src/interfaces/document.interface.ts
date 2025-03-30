import { z } from "zod";
import {
  documentCreateSchema,
  documentListSchema,
  documentSchema,
} from "../schemas/document.schema";
import { DeepPartial } from "typeorm";

export type TDocument = z.infer<typeof documentSchema>;
export type TDocumentCreate = z.infer<typeof documentCreateSchema>;
export type TDocumentList = z.infer<typeof documentListSchema>;
export type TDocumentUpdate = DeepPartial<TDocumentCreate>;
