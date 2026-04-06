import { z } from "zod";
import {
  studentCreateSchema,
  studentUpdateSchema,
  studentReturnSchema,
} from "../schemas/student.schema";
import { DeepPartial } from "typeorm";

export type TStudentCreate = z.infer<typeof studentCreateSchema>;
export type TStudentUpdate = z.infer<typeof studentUpdateSchema>;
export type TStudentReturn = z.infer<typeof studentReturnSchema>;
