import { TUserCreate, TUserReturn } from "../interfaces/user.interface";
import { userRepository } from "../repositories";
import { userReturnSchema } from "../schemas/user.schema";

export class UserService {
  async create(data: TUserCreate): Promise<TUserReturn> {
    const newUser = userRepository.create(data);
    await userRepository.save(newUser);

    return userReturnSchema.parse(newUser);
  }
}
