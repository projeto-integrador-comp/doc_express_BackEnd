import { loginReturnSchema } from "./login.schema";

export const profileReturnSchema = loginReturnSchema.omit({ token: true });
