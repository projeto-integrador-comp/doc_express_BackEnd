import { UserService } from "../services/user.service";
import { UserController } from "./user.controller";

const userService = new UserService();
export const userController = new UserController(userService);
