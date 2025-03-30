import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { Document } from "./entities/document.entity";
import { AppDataSource } from "./data-source";

const userRepository: Repository<User> = AppDataSource.getRepository(User);
const documentRepository: Repository<Document> =
  AppDataSource.getRepository(Document);

export { userRepository, documentRepository };
