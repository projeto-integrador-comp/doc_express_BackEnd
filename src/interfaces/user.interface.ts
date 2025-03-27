import { z } from "zod";
import { userCreateSchema, userReturnSchema } from "../schemas/user.schema";

export type TUserCreate = z.infer<typeof userCreateSchema>;
export type TUserReturn = z.infer<typeof userReturnSchema>;
