import { z } from "zod";
import { Role } from "../entities/user.entity";

const roleEnum = z.enum([Role.ADMIN, Role.TEACHER, Role.MONITOR]);

const userSchema = z.object({
  id: z.string(),
  name: z.string().max(120).min(2),
  email: z.string().max(120).email(),
  password: z.string().max(120),
  role: roleEnum.default(Role.MONITOR),
});

export const userCreateSchema = userSchema.omit({ id: true });

export const userReturnSchema = userSchema.omit({ password: true });
export const userListSchema = userReturnSchema.array();

//export const userRoleOmitSchema = userCreateSchema.omit({ role: true });
// Remova o omit({ role: true }) para permitir que o cargo seja editado
export const userUpdateSchema = userCreateSchema.partial();
