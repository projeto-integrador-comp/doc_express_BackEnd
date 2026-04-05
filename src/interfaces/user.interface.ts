import { z } from "zod";
import {
  userRoleOmitSchema,
  userCreateSchema,
  userListSchema,
  userReturnSchema,
} from "../schemas/user.schema";
import { DeepPartial } from "typeorm";

export type TUserCreate = z.infer<typeof userCreateSchema>;
export type TUserReturn = z.infer<typeof userReturnSchema>;
export type TUserList = z.infer<typeof userListSchema>;
export type TUserRoleOmit = z.infer<typeof userRoleOmitSchema>;
export type TUserUpdate = DeepPartial<TUserRoleOmit>;
