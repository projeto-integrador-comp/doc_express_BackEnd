import { z } from "zod";
import {
  classroomCreateSchema,
  classroomUpdateSchema,
  classroomReturnSchema,
} from "../schemas/classroom.schema";
import { DeepPartial } from "typeorm";

export type TClassroomCreate = z.infer<typeof classroomCreateSchema>;
export type TClassroomUpdate = z.infer<typeof classroomUpdateSchema>;
export type TClassroomReturn = z.infer<typeof classroomReturnSchema>;
