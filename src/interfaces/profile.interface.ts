import { z } from "zod";
import { profileReturnSchema } from "../schemas/profile.schema";

export type TProfileReturn = z.infer<typeof profileReturnSchema>;
