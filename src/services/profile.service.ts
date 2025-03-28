import { User } from "../entities/user.entity";
import { TProfileReturn } from "../interfaces/profile.interface";
import { profileReturnSchema } from "../schemas/profile.schema";

export class ProfileService {
  read(user: User): TProfileReturn {
    return profileReturnSchema.parse({ user: user });
  }
}
