import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { AppDataSource } from "./data-source";

const userRepository: Repository<User> = AppDataSource.getRepository(User);

export { userRepository };
