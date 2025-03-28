import {
  TUserCreate,
  TUserList,
  TUserReturn,
} from "../interfaces/user.interface";
import { userRepository } from "../repositories";
import { userListSchema, userReturnSchema } from "../schemas/user.schema";

export class UserService {
  async create(data: TUserCreate): Promise<TUserReturn> {
    const newUser = userRepository.create(data);
    await userRepository.save(newUser);

    return userReturnSchema.parse(newUser);
  }

  async read(): Promise<TUserList> {
    const users = await userRepository.find();
    return userListSchema.parse(users);
  }
}
