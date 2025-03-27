import { z } from "zod";
import { userReturnSchema } from "./user.schema";
import { documentListSchema } from "./document.schema";

export const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const loginReturnSchema = z.object({
  token: z.string(),
  user: userReturnSchema.extend({ documents: documentListSchema }),
});
