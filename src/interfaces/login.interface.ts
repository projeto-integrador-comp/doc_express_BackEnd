import { z } from "zod";
import { loginReturnSchema, loginSchema } from "../schemas/login.schema";

export type TLoginRequest = z.infer<typeof loginSchema>;
export type TLoginReturn = z.infer<typeof loginReturnSchema>;
