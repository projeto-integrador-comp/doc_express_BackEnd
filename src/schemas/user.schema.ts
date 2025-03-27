import { z } from "zod";

const userSchema = z.object({
  id: z.string(),
  name: z.string().max(120).min(2),
  email: z.string().max(120).email(),
  password: z.string().max(120),
  admin: z.boolean().default(false),
});

export const userCreateSchema = userSchema.omit({ id: true });

export const userReturnSchema = userSchema.omit({ password: true });
export const userListSchema = userReturnSchema.array();

export const userAdminOmitSchema = userCreateSchema.omit({ admin: true });
export const userUpdateSchema = userAdminOmitSchema.partial();
